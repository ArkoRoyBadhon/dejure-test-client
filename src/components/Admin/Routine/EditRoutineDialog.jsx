"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateRoutineMutation } from "@/redux/features/routine/routine.api";
import { toast } from "sonner";

export default function EditRoutineDialog({
  open,
  onOpenChange,
  routine,
  subjects,
  courseId,
}) {
  const [updateRoutine] = useUpdateRoutineMutation();
  const [formData, setFormData] = useState({
    date: "",
    day: "",
    classTitle: "",
    examTitle: "",
    examTime: "",
    subjectId: "",
    courseId: courseId,
  });

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const amPmOptions = ["AM", "PM"];

  useEffect(() => {
    if (routine) {
      setFormData({
        date: routine.date || "",
        day: routine.day || "",
        classTitle: routine.classTitle || "",
        examTitle: routine.examTitle || "",
        examTime: routine.examTime || "12:00 AM",
        subjectId: routine.subjectId?._id || "",
        courseId: courseId,
      });
    }
  }, [routine, courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (type, value) => {
    let time = formData.examTime || "12:00 AM";
    let [timePart, ampm] = time.split(" ");
    let [hour, minute] = timePart.split(":");

    if (type === "hour") hour = value;
    if (type === "minute") minute = value.padStart(2, "0");
    if (type === "ampm") ampm = value;

    setFormData((prev) => ({
      ...prev,
      examTime: `${hour}:${minute} ${ampm}`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a clean data object, removing empty values
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "")
    );

    try {
      await updateRoutine({
        id: routine._id,
        data: cleanData,
      }).unwrap();
      onOpenChange(false);
      toast.success("Edited Routine Successfully");
    } catch (error) {
      toast.error(error.data?.message || "Failed to update routine");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="custom-dialog-width">
        <DialogHeader>
          <DialogTitle>Update Routine</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">তারিখ</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 mx-auto">
              <Label htmlFor="day">দিন</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, day: value }))
                }
                value={formData.day}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="দিন নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 mx-auto">
              <Label htmlFor="subjectId">বিষয়</Label>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, subjectId: value }))
                }
                value={formData.subjectId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="বিষয় নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="classTitle">ক্লাসের শিরোনাম</Label>
            <Input
              id="classTitle"
              name="classTitle"
              value={formData.classTitle}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px] space-y-2">
              <Label htmlFor="examTitle">পরীক্ষার শিরোনাম</Label>
              <Input
                id="examTitle"
                name="examTitle"
                value={formData.examTitle}
                onChange={handleChange}
              />
            </div>

            <div className="flex-1 min-w-[250px] space-y-2">
              <Label>পরীক্ষার সময়</Label>
              <div className="flex gap-2">
                <Select
                  onValueChange={(value) => handleTimeChange("hour", value)}
                  value={formData.examTime?.split(":")[0] || "12"}
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
                    formData.examTime?.split(":")[1]?.split(" ")[0] || "00"
                  }
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
                  value={formData.examTime?.split(" ")[1] || "AM"}
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
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <button
              className=" bg-yellow-100 border border-yellow-500 py-1 px-4 shadow-md rounded-md"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
