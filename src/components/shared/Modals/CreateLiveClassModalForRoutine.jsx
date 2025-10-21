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

export default function CreateLiveClassModalForRoutine({
  isEdit = false,
  initialData = null,
  id = null,
  isClassModalOpen = false,
  setIsClassModalOpen,
  classTitle,
  classDate,
  classTime,
  setLiveclassID,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: courses } = useGetCoursesQuery();
  const { data: curriculumData } = useGetCurriculumsQuery();
  const { data: mentorsData } = useGetAllMentorsQuery();
  const [createLiveClass] = useCreateLiveClassMutation();
  const [updateLiveClass] = useUpdateLiveClassMutation();

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const amPmOptions = ["AM", "PM"];

  const [formData, setFormData] = useState({
    title: classTitle || "",
    subjectId: "",
    subjectType: "",
    courseId: [],
    duration: "",
    startTime: classTime || "12:00 AM",
    startDate: classDate || "",
    status: "",
    mentor: "",
  });

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        title: initialData?.title || classTitle || "",
        subjectId: initialData?.subjectId?._id || "",
        subjectType: initialData?.subjectId?.subjectType || "",
        courseId: id ? [id] : initialData?.courseId?.map((c) => c._id) || [],
        duration: initialData?.duration?.toString() || "",
        startTime: initialData?.startTime || classTime || "12:00 PM",
        startDate: initialData?.startDate || classDate || "",
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
    let time = formData.startTime || "12:00 AM";
    let [timePart, ampm] = time.split(" ");
    let [hour, minute] = timePart.split(":");

    if (type === "hour") hour = value;
    if (type === "minute") minute = value.padStart(2, "0");
    if (type === "ampm") ampm = value;

    const newTime = `${hour}:${minute} ${ampm}`;
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

    // Always use the id if it exists, otherwise use the selected courseIds
    const courseIds = id ? [id] : formData.courseId;

    const payload = {
      title: classTitle || formData.title,
      subjectId: formData.subjectId,
      subjectType: formData.subjectType,
      courseId: courseIds,
      duration: Number(formData.duration),
      startTime: classTime || formData.startTime,
      startDate: classDate || formData.startDate,
      status: formData.status,
      mentor: formData.mentor,
    };

    try {
      if (isEdit && initialData?._id) {
        await updateLiveClass({ id: initialData._id, body: payload }).unwrap();
        toast.success("Live class updated successfully");
      } else {
        const response = await createLiveClass({
          ...payload,
          status: "active",
        }).unwrap();
        toast.success("Live class created successfully");
        setLiveclassID(response?.data?._id);
        resetForm();
      }
      setIsClassModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSubjects =
    curriculumData?.find((item) => item._id === formData.subjectType)
      ?.subjects || [];

  return (
    <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
      <DialogContent className="custom-dialog-width2 max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-lg font-semibold mb-4 text-center">
          {isEdit ? "Update Live Class" : "Add New Live Class"}
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter class title"
                value={classTitle || formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
                disabled={classTitle}
              />
            </div>

            {/* Mentor Field */}
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

            {/* Subject Type Field */}
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

            {/* Subject Field */}
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

            {/* Courses Field */}
            <div className="space-y-2">
              <Label>Courses</Label>
              {id ? (
                // Read-only display when id exists
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
                // Normal multi-select when no id exists
                <>
                  {/* Selected Course Chips */}
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

                  {/* Custom Dropdown */}
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

            {/* Status Field (Edit Mode Only) */}
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
                  {/* <option value="ongoing">Ongoing</option>
                  <option value="ended">Ended</option> */}
                </select>
              </div>
            )}

            {/* Duration Field */}
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

            {/* Start Date Field */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={classDate ? classDate : formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded ${
                  classDate && "text-deepGray"
                } `}
                required
                // disabled={classDate}
              />
            </div>

            {/* Start Time Field */}
            <div className="space-y-2">
              <Label>Start Time</Label>
              <div className="flex gap-2">
                <Select
                  onValueChange={(value) => handleTimeChange("hour", value)}
                  value={formData.startTime?.split(":")[0] || "12"}
                  disabled={classTime}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) => handleTimeChange("minute", value)}
                  value={
                    formData.startTime?.split(":")[1]?.split(" ")[0] || "00"
                  }
                  disabled={classTime}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Minute" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((minute) => (
                      <SelectItem
                        key={minute}
                        value={minute.toString().padStart(2, "0")}
                      >
                        {minute.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) => handleTimeChange("ampm", value)}
                  value={formData.startTime?.split(" ")[1] || "AM"}
                  disabled={classTime}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="AM/PM" />
                  </SelectTrigger>
                  <SelectContent>
                    {amPmOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
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
