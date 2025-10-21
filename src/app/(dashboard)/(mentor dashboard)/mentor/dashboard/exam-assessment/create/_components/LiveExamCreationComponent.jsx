"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Clock, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CommonBtn from "@/components/shared/CommonBtn";
import { useGetSubjectsQuery } from "@/redux/features/curriculum/subject.api";
import { useGetQuestionSetsBySubQuestionSubjectQuery } from "@/redux/features/questionBank/questionSet.api";
import { Button } from "@/components/ui/button";
import { useGetAllMentorsQuery } from "@/redux/features/auth/mentor.api";
import { useCreateLiveExamMutation } from "@/redux/features/liveexams/liveExam.Api";
import { toast } from "sonner";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import Loader from "@/components/shared/Loader";
const LiveExamCreationComponent = () => {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("10:00");
  const [open, setOpen] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const [examData, setExamData] = useState({
    title: "",
    type: "MCQ",
    mode: "scheduled", // Added mode field
    subject: "",
    questionSet: "",
    mentor: "",
    duration: 60,
    passMark: 50,
    instructions: "",
    isPublished: false,
    courses: [],
  });

  const { data: subjects = [], isLoading: isSubjectsLoading } =
    useGetSubjectsQuery();

  const {
    data: questionSets = [],
    isLoading: isQuestionSetsLoading,
    error,
  } = useGetQuestionSetsBySubQuestionSubjectQuery(examData.subject, {
    skip: !examData.subject,
  });

  const { data: mentordata = [] } = useGetAllMentorsQuery();
  const [createLiveExam, { isLoading }] = useCreateLiveExamMutation();
  const { data: courses = [] } = useGetCoursesQuery();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleModeChange = (value) => {
    setExamData((prev) => ({ ...prev, mode: value }));
    // Clear date/time errors when switching modes
    if (formErrors.date || formErrors.time) {
      setFormErrors((prev) => ({ ...prev, date: "", time: "" }));
    }
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourses((prev) => {
      const newSelected = prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId];

      // Update examData with the selected courses
      setExamData((prev) => ({ ...prev, courses: newSelected }));
      return newSelected;
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!examData.title) errors.title = "Exam title is required";
    if (!examData.subject) errors.subject = "Subject is required";
    if (!examData.questionSet) errors.questionSet = "Question set is required";
    if (!examData.mentor) errors.mentor = "Mentor is required";
    if (!examData.duration || examData.duration < 1)
      errors.duration = "Duration must be at least 1 minute";
    if (
      !examData.passMark ||
      examData.passMark < 0 ||
      examData.passMark > 100
    ) {
      errors.passMark = "Pass mark must be between 0 and 100";
    }

    // Mode-specific validation
    if (examData.mode === "scheduled") {
      if (!date) errors.date = "Date is required for scheduled exams";
      if (!time) errors.time = "Time is required for scheduled exams";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      const payload = {
        ...examData,
        evaluator: examData.mentor,
        durationMinutes: examData.duration,
        minPassMark: examData.passMark,
        mode: examData.mode,
        courses: selectedCourses,
      };

      // Only include scheduled fields for scheduled mode
      if (examData.mode === "scheduled") {
        payload.scheduledDate = format(date, "yyyy-MM-dd");
        payload.scheduledTime = time;
      } else {
        // For anytime mode, ensure scheduled fields are not included
        payload.scheduledDate = undefined;
        payload.scheduledTime = undefined;
      }

      await createLiveExam(payload).unwrap();
      toast.success("Live Exam created successfully");
      router.push("/admin/dashboard/live-exam");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create Live Exam");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Create New Exam</h1>
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
              <Label htmlFor="title">Exam Title *</Label>
              <Input
                id="title"
                name="title"
                value={examData.title}
                onChange={handleChange}
                placeholder="Enter exam title"
                required
                className={formErrors.title ? "border-red-500" : ""}
              />
              {formErrors.title && (
                <p className="text-sm text-red-500">{formErrors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Exam Type *</Label>
                <Select
                  value={examData.type}
                  onValueChange={(value) =>
                    setExamData((prev) => ({ ...prev, type: value }))
                  }
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
                <Label>Exam Mode *</Label>
                <Select value={examData.mode} onValueChange={handleModeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select exam mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="anytime">Anytime</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {examData.mode === "scheduled"
                    ? "Exam available at specific date/time"
                    : "Exam available anytime after creation"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select
                  value={examData.subject}
                  onValueChange={(value) =>
                    setExamData((prev) => ({
                      ...prev,
                      subject: value,
                      questionSet: "",
                    }))
                  }
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      formErrors.subject && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject._id} value={subject._id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.subject && (
                  <p className="text-sm text-red-500">{formErrors.subject}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Question Set *</Label>
                <Select
                  value={examData.questionSet}
                  onValueChange={(value) =>
                    setExamData((prev) => ({ ...prev, questionSet: value }))
                  }
                  disabled={!examData.subject || isQuestionSetsLoading}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      formErrors.questionSet && "border-red-500"
                    )}
                  >
                    <SelectValue
                      placeholder={
                        isQuestionSetsLoading
                          ? "<Loader />"
                          : examData.subject
                          ? "Select question set"
                          : "Select subject first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {questionSets.map((set) => (
                      <SelectItem key={set.id} value={set.id}>
                        {set.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.questionSet && (
                  <p className="text-sm text-red-500">
                    {formErrors.questionSet}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Evaluation Mentor *</Label>
                <Select
                  value={examData.mentor}
                  onValueChange={(value) =>
                    setExamData((prev) => ({ ...prev, mentor: value }))
                  }
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      formErrors.mentor && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select a mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentordata.map((mentor) => (
                      <SelectItem key={mentor._id} value={mentor._id}>
                        {mentor.fullName} ({mentor.teacherId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.mentor && (
                  <p className="text-sm text-red-500">{formErrors.mentor}</p>
                )}
              </div>
            </div>

            {/* Course Multi-Select */}
            <div className="space-y-2">
              <Label>Assign to Courses</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedCourses.length > 0
                      ? `${selectedCourses.length} course(s) selected`
                      : "Select courses..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search courses..." />
                    <CommandEmpty>No courses found.</CommandEmpty>
                    <CommandGroup>
                      {courses.map((course) => (
                        <CommandItem
                          key={course._id}
                          value={course._id}
                          onSelect={() => handleCourseSelect(course._id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCourses.includes(course._id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {course.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedCourses.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCourses.map((courseId) => {
                    const course = courses.find((c) => c._id === courseId);
                    return (
                      <Badge key={courseId} variant="secondary">
                        {course?.title}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Minimum Pass Mark (%) *</Label>
              <Input
                type="number"
                name="passMark"
                value={examData.passMark}
                onChange={handleChange}
                min={0}
                max={100}
                className={formErrors.passMark ? "border-red-500" : ""}
              />
              {formErrors.passMark && (
                <p className="text-sm text-red-500">{formErrors.passMark}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule - Only show for scheduled mode */}
        {examData.mode === "scheduled" && (
          <Card className="p-6 shadow2">
            <CardHeader className="pb-4">
              <h2 className="text-lg font-semibold">Schedule</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) setDate(selectedDate);
                    }}
                    className={cn(
                      "rounded-md border",
                      formErrors.date && "border-red-500"
                    )}
                  />
                  {formErrors.date && (
                    <p className="text-sm text-red-500">{formErrors.date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Time *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className={formErrors.time ? "border-red-500" : ""}
                    />
                    <Clock className="h-5 w-5 text-gray-500" />
                  </div>
                  {formErrors.time && (
                    <p className="text-sm text-red-500">{formErrors.time}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info message for anytime mode */}
        {examData.mode === "anytime" && (
          <Card className="p-6 shadow2 bg-blue-50 border-blue-200">
            <CardContent>
              <p className="text-sm text-blue-800">
                <strong>Anytime Exam:</strong> This exam will be available to
                students immediately after creation. No specific schedule is
                required.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Duration */}
        <Card className="p-6 shadow2">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold">Duration</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Duration (minutes) *</Label>
              <Input
                type="number"
                name="duration"
                value={examData.duration}
                onChange={handleChange}
                min={1}
                className={formErrors.duration ? "border-red-500" : ""}
              />
              {formErrors.duration && (
                <p className="text-sm text-red-500">{formErrors.duration}</p>
              )}
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
                  Make the exam visible to students after creation
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
            disabled={isLoading}
          >
            Cancel ggg
          </CommonBtn>
          <CommonBtn type="submit" isLoading={isLoading}>
            Create Exam
          </CommonBtn>
        </div>
      </form>
    </div>
  );
};

export default LiveExamCreationComponent;
