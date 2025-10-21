"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/shared/Loader";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Clock, ChevronLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CommonBtn from "@/components/shared/CommonBtn";
import { useGetSubjectsQuery } from "@/redux/features/curriculum/subject.api";
import { useGetQuestionSetsBySubQuestionSubjectQuery } from "@/redux/features/questionBank/questionSet.api";
import { Button } from "@/components/ui/button";
import { useGetAllMentorsQuery } from "@/redux/features/auth/mentor.api";
import {
  useGetLiveExamByIdQuery,
  useUpdateLiveExamMutation,
} from "@/redux/features/liveexams/liveExam.Api";
import { toast } from "sonner";
const LiveExamEditComponent = ({ examid }) => {
  const router = useRouter();
  const id = examid;
  const {
    data: existingExam,
    isLoading,
    isError,
  } = useGetLiveExamByIdQuery(id);
  const [updateLiveExam, { isLoading: isUpdating }] =
    useUpdateLiveExamMutation();

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("10:00");

  const [examData, setExamData] = useState({
    title: "",
    type: "MCQ",
    subject: "",
    questionSet: "",
    mentor: "",
    duration: 60,
    passMark: 50,
    negMark: 0,
    instructions: "",
    isPublished: false,
  });

  // Data dependencies
  const { data: subjects = [], isLoading: isSubjectsLoading } =
    useGetSubjectsQuery();
  const {
    data: questionSets = [],
    isLoading: isQuestionSetsLoading,
    refetch: refetchQuestionSets,
  } = useGetQuestionSetsBySubQuestionSubjectQuery(examData.subject, {
    skip: !examData.subject,
  });
  const { data: mentordata = [] } = useGetAllMentorsQuery();

  useEffect(() => {
    if (existingExam) {
      const payload = {
        title: existingExam.title,
        type: existingExam.type,
        subject: existingExam.subject?._id || "",
        questionSet:
          existingExam.questionSet?.id || existingExam.questionSet?._id || "",
        mentor: existingExam.evaluator?._id || "",
        duration: existingExam.durationMinutes || 60,
        passMark: existingExam.minPassMark || 50,
        negMark: existingExam.negMark || 0,
        instructions: existingExam.instructions || "",
        isPublished: existingExam.isPublished || false,
      };

      setExamData(payload);

      if (existingExam.scheduledDate) {
        setDate(parseISO(existingExam.scheduledDate));
      }

      if (existingExam.scheduledTime) {
        setTime(existingExam.scheduledTime);
      }
    }
  }, [existingExam, subjects, mentordata]);

  // Refetch question sets when subject changes
  useEffect(() => {
    if (examData.subject) {
      refetchQuestionSets();
    }
  }, [examData.subject, refetchQuestionSets]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle negative mark as float value - always make it negative
    if (name === "negMark") {
      if (value === "") {
        setExamData((prev) => ({ ...prev, [name]: "" }));
      } else {
        const floatValue = parseFloat(value);
        // Always make it negative, even if user doesn't enter minus sign
        const negativeValue =
          floatValue < 0 ? floatValue : -Math.abs(floatValue);
        setExamData((prev) => ({ ...prev, [name]: negativeValue }));
      }
    } else {
      setExamData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLiveExam({
        id,
        data: {
          ...examData,
          evaluator: examData.mentor,
          durationMinutes: examData.duration,
          minPassMark: examData.passMark,
          negMark: examData.negMark,
          scheduledDate: format(date, "yyyy-MM-dd"),
          scheduledTime: time,
        },
      }).unwrap();
      toast.success("Exam updated successfully");
      router.push("/admin/dashboard/live-exam");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update exam");
      console.error(error);
    }
  };

  if (isLoading || isSubjectsLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <Loader text="Loading exam data..." size="sm" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <p className="text-gray-500">Error loading exam data</p>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            Edit Exam: {existingExam?.title}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="p-6 shadow2">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Exam Title</Label>
              <Input
                id="title"
                name="title"
                value={examData.title}
                onChange={handleChange}
                placeholder="Enter exam title"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Exam Type</Label>
                <Select
                  value={examData.type}
                  //   onValueChange={(value) =>
                  //     setExamData((prev) => ({ ...prev, type: value }))
                  //   }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MCQ">MCQ</SelectItem>
                    <SelectItem value="WRITTEN">Written</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                {/* Subject Select */}
                <Select
                  value={examData.subject}
                  onValueChange={(value) =>
                    setExamData((prev) => ({
                      ...prev,
                      subject: value || examData.subject,
                      questionSet: "",
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subject">
                      {subjects.find((s) => s._id === examData.subject)?.name ||
                        "Select subject"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject._id} value={subject._id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Question Set</Label>
                <Select
                  value={examData.questionSet}
                  onValueChange={(value) => {
                    setExamData((prev) => ({
                      ...prev,
                      questionSet: value || examData.questionSet,
                    }));
                  }}
                  disabled={!examData.subject || isQuestionSetsLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isQuestionSetsLoading
                          ? "<Loader />"
                          : examData.subject
                          ? "Select question set"
                          : "Select subject first"
                      }
                    >
                      {questionSets.find((qs) => qs.id === examData.questionSet)
                        ?.name || "Select question set"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {questionSets.map((set) => (
                      <SelectItem key={set.id} value={set.id}>
                        {set.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Evaluation Mentor</Label>
                <Select
                  value={examData.evaluator}
                  onValueChange={(value) =>
                    setExamData((prev) => ({
                      ...prev,
                      evaluator: value || examData.evaluator,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        mentordata.find((m) => m._id === examData.evaluator)
                          ?.fullName || "Select mentor"
                      }
                    >
                      {mentordata.find((m) => m._id === examData.evaluator)
                        ?.fullName || "Select mentor"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {mentordata.map((mentor) => (
                      <SelectItem key={mentor._id} value={mentor._id}>
                        {mentor.fullName} ({mentor.teacherId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="space-y-2 flex-1">
                <Label>Minimum Pass Mark (%)</Label>
                <Input
                  type="number"
                  name="passMark"
                  value={examData.passMark}
                  onChange={handleChange}
                  min={0}
                  max={100}
                />
              </div>
              {examData.type === "MCQ" && (
                <div className="space-y-2 flex-1">
                  <Label>Negative Mark</Label>
                  <Input
                    type="number"
                    name="negMark"
                    value={examData.negMark}
                    onChange={handleChange}
                    step="0.01"
                    min="-100"
                    max="0"
                    placeholder="Enter negative mark (e.g., 0.25 or -0.25)"
                  />
                  <p className="text-xs text-gray-500">
                    Enter penalty marks (will be automatically negative): 0.25 =
                    -0.25, -0.5 = -0.5
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="p-6 shadow2">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold">Schedule</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    if (selectedDate) setDate(selectedDate);
                  }}
                  className="rounded-md border"
                />
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                  <Clock className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                name="duration"
                value={examData.duration}
                onChange={handleChange}
                min={1}
              />
            </div>
          </CardContent>
        </Card>

        {/* Instructions & Publish */}
        <Card className="p-6 shadow2">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold">Additional Settings</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                name="instructions"
                value={examData.instructions}
                onChange={handleChange}
                placeholder="Enter exam instructions"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="publish">Publish Immediately</Label>
                <p className="text-sm text-gray-500">
                  Make the exam visible to students after update
                </p>
              </div>
              <Switch
                id="publish"
                checked={examData.isPublished}
                onCheckedChange={(checked) =>
                  setExamData((prev) => ({ ...prev, isPublished: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <CommonBtn
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </CommonBtn>
          <CommonBtn type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Exam"}
          </CommonBtn>
        </div>
      </form>
    </div>
  );
};

export default LiveExamEditComponent;
