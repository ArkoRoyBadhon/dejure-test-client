"use client";

import { useState, useEffect } from "react";
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
import { Clock } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CommonBtn from "@/components/shared/CommonBtn";
import { useGetSubjectsQuery } from "@/redux/features/curriculum/subject.api";
import { useGetQuestionSetsBySubQuestionSubjectQuery } from "@/redux/features/questionBank/questionSet.api";
import { useGetAllMentorsQuery } from "@/redux/features/auth/mentor.api";
import { useCreateLiveExamMutation } from "@/redux/features/liveexams/liveExam.Api";
import { toast } from "sonner";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import Loader from "@/components/shared/Loader";
// Utility functions for time conversion
const convert12to24 = (time12h) => {
  if (!time12h) return "10:00";

  // If already in 24-hour format (contains no AM/PM)
  if (!time12h.includes("AM") && !time12h.includes("PM")) {
    return time12h;
  }

  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = parseInt(hours, 10) + 12;
  }

  if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  // Ensure proper formatting
  hours = hours.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

const convert24to12 = (time24h) => {
  if (!time24h) return "10:00 AM";

  // If already in 12-hour format (contains AM/PM)
  if (time24h.includes("AM") || time24h.includes("PM")) {
    return time24h;
  }

  let [hours, minutes] = time24h.split(":");
  let modifier = "AM";

  if (parseInt(hours) >= 12) {
    modifier = "PM";
    if (parseInt(hours) > 12) {
      hours = (parseInt(hours) - 12).toString();
    }
  }

  if (hours === "00") {
    hours = "12";
  }

  // Ensure proper formatting
  hours = hours.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");

  return `${hours}:${minutes} ${modifier}`;
};

// Utility function to format date for API
const formatDateForAPI = (date) => {
  if (!date) return null;
  return format(date, "yyyy-MM-dd");
};

// Utility function to validate time format
const isValidTime = (time) => {
  if (!time) return false;
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export default function CreateExamModal({
  isOpen,
  onClose,
  onSuccess,
  id,
  examTitle = null,
  examDate = null,
  examTime = null,
  setLiveexamID = () => {},
}) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("10:00");
  const [formErrors, setFormErrors] = useState({});

  const [examData, setExamData] = useState({
    title: "",
    type: "MCQ",
    mode: "scheduled", // Default to scheduled mode
    subject: "",
    questionSet: "",
    mentor: "",
    duration: 60,
    passMark: 50,
    negMark: 0,
    instructions: "",
    isPublished: false,
    courses: id ? [id] : [],
  });

  // Initialize with props when they change
  useEffect(() => {
    if (examTitle) {
      setExamData((prev) => ({ ...prev, title: examTitle }));
    }
    if (examDate) {
      const parsedDate = new Date(examDate);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
      }
    }
    if (examTime) {
      const convertedTime = convert12to24(examTime);
      if (isValidTime(convertedTime)) {
        setTime(convertedTime);
      }
    }
  }, [examTitle, examDate, examTime]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setExamData({
        title: "",
        type: "MCQ",
        mode: "scheduled",
        subject: "",
        questionSet: "",
        mentor: "",
        duration: 60,
        passMark: 50,
        negMark: 0,
        instructions: "",
        isPublished: false,
        courses: id ? [id] : [],
      });
      setDate(new Date());
      setTime("10:00");
      setFormErrors({});
    }
  }, [isOpen, id]);

  // Data dependencies
  const { data: subjects = [] } = useGetSubjectsQuery();
  const { data: courses = [] } = useGetCoursesQuery();
  const { data: mentordata = [] } = useGetAllMentorsQuery();
  const [createLiveExam, { isLoading }] = useCreateLiveExamMutation();

  const { data: questionSets = [], isLoading: isQuestionSetsLoading } =
    useGetQuestionSetsBySubQuestionSubjectQuery(examData.subject, {
      skip: !examData.subject,
    });

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

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTypeChange = (value) => {
    setExamData((prev) => {
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

  const validateForm = () => {
    const errors = {};
    if (!examData.title) errors.title = "Exam title is required";
    if (!examData.subject) errors.subject = "Subject is required";
    if (!examData.questionSet) errors.questionSet = "Question set is required";
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
      if (!date || isNaN(date.getTime())) {
        errors.date = "Valid date is required for scheduled exams";
      }
      if (!time || !isValidTime(time)) {
        errors.time = "Valid time is required for scheduled exams";
      }
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
        payload.scheduledDate = formatDateForAPI(date);
        payload.scheduledTime = examTime || time; // Use 24-hour format like working component
      } else {
        // For anytime mode, ensure scheduled fields are not included
        payload.scheduledDate = undefined;
        payload.scheduledTime = undefined;
      }

      console.log("Sending payload:", payload);
      const response = await createLiveExam(payload).unwrap();

      toast.success("Live Exam created successfully");
      setLiveexamID(response?._id);

      // Call onSuccess first to handle any parent component updates
      onSuccess();

      // Then close the modal
      onClose();
    } catch (error) {
      console.error("Exam creation error:", error);
      console.error("Error details:", error?.data);
      console.error("Payload that failed:", payload);
      toast.error(
        error?.data?.message || error?.message || "Failed to create Live Exam"
      );
    }
  };

  const selectedCourse = courses.find((course) => course._id === id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[1000px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Exam</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Exam Title</Label>
              <Input
                id="title"
                name="title"
                value={examTitle || examData.title}
                onChange={handleChange}
                placeholder="Enter exam title"
                required
                className={formErrors.title ? "border-red-500" : ""}
                disabled={!!examTitle}
              />
              {formErrors.title && (
                <p className="text-sm text-red-500">{formErrors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Exam Type</Label>
                <Select
                  value={examData.type}
                  onValueChange={handleTypeChange}
                  className="w-full"
                >
                  <SelectTrigger className="w-full bg-gray1">
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
                <Select
                  value={examData.mode}
                  onValueChange={handleModeChange}
                  className="w-full"
                >
                  <SelectTrigger className="w-full bg-gray1">
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
                      "w-full bg-gray1",
                      formErrors.subject && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject._id} value={subject._id}>
                        {subject?.name}
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
                      "w-full bg-gray1",
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
                          {set?.name}
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
                      "w-full bg-gray1",
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

            <div className="space-y-2">
              <Label>Assigned Course</Label>
              <div className="p-3 border rounded-md bg-gray-50 flex items-center">
                {selectedCourse ? (
                  <Badge variant="secondary" className="text-sm font-medium">
                    {selectedCourse.title}
                  </Badge>
                ) : (
                  "Loading course..."
                )}
              </div>
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
          </div>

          {/* Schedule Section - Only show for scheduled mode */}
          {examData.mode === "scheduled" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Schedule</h3>
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
                    disabled={!!examDate}
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
                      disabled={!!examTime}
                    />
                    <Clock className="h-5 w-5 text-gray-500" />
                  </div>
                  {formErrors.time && (
                    <p className="text-sm text-red-500">{formErrors.time}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info message for anytime mode */}
          {examData.mode === "anytime" && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Anytime Exam:</strong> This exam will be available to
                students immediately after creation. No specific schedule is
                required.
              </p>
            </div>
          )}

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
            <small className="text-gray-500">
              Auto Adding +5 Min with duration
            </small>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <CommonBtn
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </CommonBtn>
            <CommonBtn type="submit" isLoading={isLoading}>
              Create Exam
            </CommonBtn>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
