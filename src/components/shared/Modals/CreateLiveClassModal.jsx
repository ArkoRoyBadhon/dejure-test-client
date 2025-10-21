"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import {
  useCreateLiveClassMutation,
  useUpdateLiveClassMutation,
} from "@/redux/features/liveClass/liveClass.api";
import { toast } from "sonner";
import { useGetCurriculumsQuery } from "@/redux/features/curriculum/curriculum.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useGetAllMentorsQuery } from "@/redux/features/auth/mentor.api";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CreateLiveClassModal({
  isEdit = false,
  initialData = null,
  trigger = null,
  id = null,
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: courses } = useGetCoursesQuery();
  const { data: curriculumData } = useGetCurriculumsQuery();
  const { data: mentorsData } = useGetAllMentorsQuery();
  const [createLiveClass] = useCreateLiveClassMutation();
  const [updateLiveClass] = useUpdateLiveClassMutation();

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const amPmOptions = ["AM", "PM"];

  const [formData, setFormData] = useState({
    title: "",
    subjectId: "",
    subjectType: "",
    courseId: [],
    duration: "",
    startTime: "12:00 AM",
    startDate: "",
    status: "",
    mentor: "",
  });

  useEffect(() => {
    if (isEdit && initialData) {
      // Parse the time from the format "03:00 PM"
      const timeString = initialData?.startTime || "12:00 PM";
      let [timePart, period] = timeString.split(" ");

      // If period is missing, try to determine it from the time
      if (!period && timePart) {
        const [hourStr] = timePart.split(":");
        const hour = parseInt(hourStr, 10);
        period = hour >= 12 ? "PM" : "AM";
      }

      // Ensure we have a valid time format
      if (!timePart) {
        timePart = "12:00";
        period = "PM";
      }

      let [hour, minute] = timePart.split(":");

      // Convert hour to 12-hour format if needed
      if (hour && parseInt(hour, 10) > 12) {
        hour = (parseInt(hour, 10) % 12).toString().padStart(2, "0");
      } else if (hour) {
        hour = hour.padStart(2, "0");
      } else {
        hour = "12";
      }

      minute = minute || "00";

      const formattedTime = `${hour}:${minute} ${period || "PM"}`;

      setFormData({
        title: initialData?.title || "",
        subjectId: initialData?.subjectId?._id || "",
        subjectType: initialData?.subjectType?.[0]?._id || "",
        courseId: id ? [id] : initialData?.courseId?.map((c) => c._id) || [],
        duration: initialData?.duration?.toString() || "",
        startTime: formattedTime,
        startDate: initialData?.startDate || "",
        status: initialData?.status || "active",
        mentor: initialData?.mentor?._id || "",
      });
    }
  }, [isEdit, initialData, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (type, value) => {
    if (value === "" || value === undefined || value === null) return;

    const currentTime = formData.startTime || "12:00 AM";
    let [timePart, period] = currentTime.split(" ");
    let [currentHour, currentMinute] = timePart.split(":");

    let newHour = currentHour;
    let newMinute = currentMinute;
    let newPeriod = period || "AM";

    if (type === "hour") {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) return;
      newHour = Math.max(1, Math.min(12, numValue)).toString().padStart(2, "0");
    } else if (type === "minute") {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) return;
      newMinute = Math.max(0, Math.min(59, numValue))
        .toString()
        .padStart(2, "0");
    } else if (type === "ampm") {
      if (value !== "AM" && value !== "PM") return;
      newPeriod = value;
    }

    const newTime = `${newHour}:${newMinute} ${newPeriod}`;
    setFormData((prev) => ({
      ...prev,
      startTime: newTime,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subjectId: "",
      subjectType: "",
      courseId: [],
      duration: "",
      startTime: "12:00 AM",
      startDate: "",
      status: "",
      mentor: "",
    });
  };

  const toggleCourseSelection = (courseId) => {
    if (id) return;

    setFormData((prev) => {
      const isSelected = prev.courseId.includes(courseId);
      return {
        ...prev,
        courseId: isSelected
          ? prev.courseId.filter((id) => id !== courseId)
          : [...prev.courseId, courseId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.startTime || !formData.startTime.includes(" ")) {
      toast.error("Please select a valid time");
      setIsSubmitting(false);
      return;
    }

    // Convert 12-hour time back to 24-hour format for API
    const [timePart, period] = formData.startTime.split(" ");
    let [hours, minutes] = timePart.split(":");

    if (!hours || !minutes || !period) {
      toast.error("Invalid time format");
      setIsSubmitting(false);
      return;
    }

    let hours24 = parseInt(hours, 10);
    if (period === "PM" && hours24 !== 12) {
      hours24 += 12;
    } else if (period === "AM" && hours24 === 12) {
      hours24 = 0;
    }

    minutes = minutes.padStart(2, "0");
    const formattedHours = hours24.toString().padStart(2, "0");
    const apiTimeFormat = `${formattedHours}:${minutes}`;

    const courseIds = id ? [id] : formData.courseId;

    const payload = {
      title: formData.title,
      subjectId: formData.subjectId,
      subjectType: formData.subjectType,
      courseId: courseIds,
      duration: Number(formData.duration),
      startTime: apiTimeFormat, // Use 24-hour format for API
      startDate: formData.startDate,
      status: formData.status,
      mentor: formData.mentor,
    };

    try {
      if (isEdit && initialData?._id) {
        await updateLiveClass({ id: initialData._id, body: payload }).unwrap();
        toast.success("Live class updated successfully");
      } else {
        await createLiveClass({ ...payload, status: "active" }).unwrap();
        toast.success("Live class created successfully");
        resetForm();
      }
      setOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSubjects =
    curriculumData?.find((item) => item._id === formData.subjectType)
      ?.subjects || [];

  // Parse current time for select values
  const currentTime = formData.startTime || "12:00 AM";
  const [timePart, currentPeriod] = currentTime.split(" ");
  const [currentHour, currentMinute] = timePart.split(":");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-main text-black hover:bg-main">
            {isEdit ? "Update Live Class" : "Create Live Class"}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="custom-dialog-width2 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-lg font-semibold mb-4 text-center">
          {isEdit ? "Update Live Class ff" : "Add New Live Class"}
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter class title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mentor">Mentor</Label>
              <select
                id="mentor"
                name="mentor"
                value={formData.mentor}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              >
                <option value="">Select mentor</option>
                {mentorsData?.map((mentor) => (
                  <option key={mentor._id} value={mentor._id}>
                    {mentor.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjectType">Subject Type</Label>
              <select
                id="subjectType"
                name="subjectType"
                value={formData.subjectType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              >
                <option value="">Select subject type</option>
                {curriculumData?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.subjectType}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjectId">Subject</Label>
              <select
                id="subjectId"
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                disabled={!formData.subjectType}
                className="w-full px-4 py-2 border rounded"
                required
              >
                <option value="">Select subject</option>
                {filteredSubjects?.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Courses</Label>
              {id ? (
                <div className="flex flex-wrap gap-2">
                  {courses
                    ?.filter((course) => course._id === id)
                    .map((course) => (
                      <Badge
                        key={course._id}
                        className="flex items-center gap-1"
                      >
                        {course.title}
                      </Badge>
                    ))}
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.courseId.map((courseId) => {
                      const course = courses?.find((c) => c._id === courseId);
                      if (!course) return null;
                      return (
                        <Badge
                          key={courseId}
                          className="flex items-center gap-1"
                        >
                          {course.title}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCourseSelection(courseId);
                            }}
                            className="ml-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <span>
                        Select courses ({formData.courseId.length} selected)
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`h-4 w-4 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
                        <ScrollArea className="h-[200px] w-full rounded-md">
                          <div className="p-1">
                            {courses?.map((course) => (
                              <div
                                key={course._id}
                                className="relative flex items-center rounded-sm py-1.5 pl-8 pr-2 text-sm hover:bg-accent hover:text-accent-foreground"
                              >
                                <Checkbox
                                  id={course._id}
                                  checked={formData.courseId.includes(
                                    course._id
                                  )}
                                  onCheckedChange={() =>
                                    toggleCourseSelection(course._id)
                                  }
                                  className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4"
                                />
                                <label
                                  htmlFor={course._id}
                                  className="w-full cursor-pointer"
                                >
                                  {course.title}
                                </label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {isEdit && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">Select status</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="active">Active</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <input
                id="duration"
                name="duration"
                type="number"
                min="1"
                placeholder="Enter duration in minutes"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Start Time</Label>
              <div className="flex gap-2">
                <Select
                  onValueChange={(value) => handleTimeChange("hour", value)}
                  value={currentHour}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem
                        key={hour}
                        value={hour.toString()}
                        className="text-center"
                      >
                        {hour.toString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) => handleTimeChange("minute", value)}
                  value={currentMinute}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Minute" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((minute) => (
                      <SelectItem
                        key={minute}
                        value={minute.toString()}
                        className="text-center"
                      >
                        {minute.toString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) => handleTimeChange("ampm", value)}
                  value={currentPeriod}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    {amPmOptions.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="text-center"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-500">
                Current time: {formData.startTime}
              </div>
            </div>

            <Button
              type="submit"
              className="bg-main hover:bg-yellow-300 text-black w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update"
                : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
