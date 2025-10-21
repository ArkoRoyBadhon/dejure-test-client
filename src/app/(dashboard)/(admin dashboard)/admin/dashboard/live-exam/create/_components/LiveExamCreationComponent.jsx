"use client";

import { useState, useRef, useEffect } from "react";
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
import { CalendarIcon, Clock, ChevronLeft, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import Loader from "@/components/shared/Loader";
const LiveExamCreationComponent = () => {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("10:00");
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const dropdownRef = useRef(null);

  const [examData, setExamData] = useState({
    title: "",
    type: "MCQ",
    mode: "scheduled", // Added mode field
    subject: "",
    questionSet: "",
    mentor: "",
    duration: 60,
    passMark: 50,
    negMark: 0,
    instructions: "",
    isPublished: false,
    courses: [],
  });

  // Data dependencies
  const { data: subjects = [] } = useGetSubjectsQuery();
  const { data: courses = [] } = useGetCoursesQuery();
  const { data: mentordata = [] } = useGetAllMentorsQuery();
  const [createLiveExam, { isLoading }] = useCreateLiveExamMutation();

  const { data: questionSets = [], isLoading: isQuestionSetsLoading } =
    useGetQuestionSetsBySubQuestionSubjectQuery(examData.subject, {
      skip: !examData.subject,
    });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCourseDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTypeChange = (value) => {
    setExamData((prev) => {
      // If changing type, check if current question set matches the new type
      const currentSet = questionSets.find(
        (set) => set.id === prev.questionSet
      );
      if (currentSet && currentSet.type !== value) {
        return { ...prev, type: value, questionSet: "" };
      }
      return { ...prev, type: value };
    });
  };

  const handleModeChange = (value) => {
    setExamData((prev) => ({ ...prev, mode: value }));
    // Clear date/time errors when switching modes
    if (formErrors.date || formErrors.time) {
      setFormErrors((prev) => ({ ...prev, date: "", time: "" }));
    }
  };

  const toggleCourseSelection = (courseId) => {
    setExamData((prev) => {
      const currentCourses = prev.courses || [];
      if (currentCourses.includes(courseId)) {
        return {
          ...prev,
          courses: currentCourses.filter((id) => id !== courseId),
        };
      } else {
        return {
          ...prev,
          courses: [...currentCourses, courseId],
        };
      }
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!examData.title) errors.title = "Exam title is required";
    if (!examData.subject) errors.subject = "Subject is required";
    if (!examData.questionSet) errors.questionSet = "Question set is required";

    // Validate question set matches exam type
    if (examData.questionSet) {
      const selectedSet = questionSets.find(
        (set) => set.id === examData.questionSet
      );
      if (selectedSet && selectedSet.type !== examData.type) {
        errors.questionSet = "Selected question set doesn't match exam type";
      }
    }

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

    // Validate negative mark for MCQ exams
    if (
      examData.type === "MCQ" &&
      examData.negMark !== undefined &&
      examData.negMark !== ""
    ) {
      const negMarkValue = parseFloat(examData.negMark);
      if (isNaN(negMarkValue)) {
        errors.negMark = "Negative mark must be a valid number";
      } else if (negMarkValue < -100 || negMarkValue > 0) {
        errors.negMark = "Negative mark must be between -100 and 0";
      }
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
        negMark: examData.negMark,
        mode: examData.mode,
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

  // Filter courses based on search term
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <Select value={examData.type} onValueChange={handleTypeChange}>
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
                    {questionSets
                      .filter((set) => set.type === examData.type)
                      .map((set) => (
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

            {/* Custom Multi-Course Selector */}
            <div className="space-y-2">
              <Label>Assign to Courses</Label>
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center justify-between w-full p-2 border rounded-md cursor-pointer bg-background"
                  onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
                >
                  <span className="truncate">
                    {examData.courses.length > 0
                      ? `${examData.courses.length} course(s) selected`
                      : "Select courses..."}
                  </span>
                  <ChevronLeft
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isCourseDropdownOpen ? "-rotate-90" : "rotate-90"
                    )}
                  />
                </div>

                {isCourseDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2 border-b">
                      <Input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="divide-y">
                      {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                          <div
                            key={course._id}
                            className={cn(
                              "flex items-center p-2 hover:bg-accent cursor-pointer",
                              examData.courses.includes(course._id) &&
                                "bg-accent"
                            )}
                            onClick={() => toggleCourseSelection(course._id)}
                          >
                            <input
                              type="checkbox"
                              checked={examData.courses.includes(course._id)}
                              readOnly
                              className="mr-2 h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                            />
                            <span className="truncate">{course.title}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground">
                          No courses found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {examData.courses.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {examData.courses.map((courseId) => {
                    const course = courses.find((c) => c._id === courseId);
                    return (
                      <Badge
                        key={courseId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {course?.title}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCourseSelection(courseId);
                          }}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-6">
              <div className="space-y-2 flex-1">
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
              {examData.type === "MCQ" && (
                <div className="space-y-2 flex-1 ">
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
                    className={formErrors.negMark ? "border-red-500" : ""}
                  />
                  {formErrors.negMark && (
                    <p className="text-sm text-red-500">{formErrors.negMark}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Enter penalty marks (will be automatically negative): 0.25 =
                    -0.25, -0.5 = -0.5
                  </p>
                </div>
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
              <small className="text-deepGray">
                Auto Adding +5 Min with duration
              </small>
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
            Cancel
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
