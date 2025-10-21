"use client";
import { useState } from "react";
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
import { useCreateRoutineMutation } from "@/redux/features/routine/routine.api";
import { toast } from "sonner";
import { useGetCurriculumsQuery } from "@/redux/features/curriculum/curriculum.api";

export default function CreateRoutineDialog({ open, onOpenChange, courseId }) {
  const [createRoutine] = useCreateRoutineMutation();
  const { data: curriculums } = useGetCurriculumsQuery();
  const [formData, setFormData] = useState({
    date: "",
    classTitle: "",
    classTime: "12:00 AM",
    examTitle: "",
    examTime: "12:00 AM",
    subjectId: "",
    subjectTypeId: "",
  });
  const [showClassFields, setShowClassFields] = useState(false);
  const [showExamFields, setShowExamFields] = useState(false);
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const amPmOptions = ["AM", "PM"];

  const resetForm = () => {
    setFormData({
      date: "",
      classTitle: "",
      classTime: "12:00 AM",
      examTitle: "",
      examTime: "12:00 AM",
      subjectId: "",
      subjectTypeId: "",
    });
    setShowClassFields(false);
    setShowExamFields(false);
    setFilteredSubjects([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, subjectTypeId: value, subjectId: "" }));
    const selectedCurriculum = curriculums?.find((c) => c._id === value);
    setFilteredSubjects(selectedCurriculum?.subjects || []);
  };

  const handleClassTimeChange = (type, value) => {
    let time = formData.classTime || "12:00 AM";
    let [timePart, ampm] = time.split(" ");
    let [hour, minute] = timePart.split(":");

    if (type === "hour") hour = value;
    if (type === "minute") minute = value.padStart(2, "0");
    if (type === "ampm") ampm = value;

    setFormData((prev) => ({
      ...prev,
      classTime: `${hour}:${minute} ${ampm}`,
    }));
  };

  const handleExamTimeChange = (type, value) => {
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
    try {
      await createRoutine({
        ...formData,
        courseId,
        subjectId: formData.subjectId || undefined,
      }).unwrap();
      resetForm();
      onOpenChange(false);
      toast.success("Routine Created Successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create routine");
    }
  };

  const toggleClassFields = () => {
    setShowClassFields(!showClassFields);
    if (!showClassFields && !showExamFields) {
      setFormData((prev) => ({ ...prev, examTitle: "", examTime: "12:00 AM" }));
    }
  };

  const toggleExamFields = () => {
    setShowExamFields(!showExamFields);
    if (!showExamFields && !showClassFields) {
      setFormData((prev) => ({
        ...prev,
        classTitle: "",
        classTime: "12:00 AM",
      }));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="max-w-[90vw] md:max-w-md lg:max-w-lg xl:max-w-xl">
        <DialogHeader>
          <DialogTitle>নতুন রুটিন তৈরি করুন</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">তারিখ</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Label>বিষয়ের ধরন</Label>
              <Select
                onValueChange={handleSubjectTypeChange}
                value={formData.subjectTypeId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="বিষয়ের ধরন নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {curriculums?.map((curriculum) => (
                    <SelectItem key={curriculum._id} value={curriculum._id}>
                      {curriculum.subjectType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.subjectTypeId && (
            <div className="space-y-2">
              <Label>বিষয়</Label>
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
                  {filteredSubjects?.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="addClass"
                checked={showClassFields}
                onChange={toggleClassFields}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="addClass">Add Class</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="addExam"
                checked={showExamFields}
                onChange={toggleExamFields}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="addExam">Add Exam</Label>
            </div>
          </div>

          {showClassFields && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="classTitle">ক্লাসের শিরোনাম</Label>
                <Input
                  id="classTitle"
                  name="classTitle"
                  value={formData.classTitle}
                  onChange={handleChange}
                  required={showClassFields}
                />
              </div>

              <div className="space-y-2">
                <Label>ক্লাসের সময়</Label>
                <div className="flex flex-wrap gap-2">
                  <Select
                    onValueChange={(value) =>
                      handleClassTimeChange("hour", value)
                    }
                    value={formData.classTime?.split(":")[0] || "12"}
                    required={showClassFields}
                  >
                    <SelectTrigger className="flex-1 min-w-[100px]">
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
                    onValueChange={(value) =>
                      handleClassTimeChange("minute", value)
                    }
                    value={
                      formData.classTime?.split(":")[1]?.split(" ")[0] || "00"
                    }
                    required={showClassFields}
                  >
                    <SelectTrigger className="flex-1 min-w-[100px]">
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
                    onValueChange={(value) =>
                      handleClassTimeChange("ampm", value)
                    }
                    value={formData.classTime?.split(" ")[1] || "AM"}
                    required={showClassFields}
                  >
                    <SelectTrigger className="flex-1 min-w-[100px]">
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
          )}

          {showExamFields && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="examTitle">পরীক্ষার শিরোনাম</Label>
                <Input
                  id="examTitle"
                  name="examTitle"
                  value={formData.examTitle}
                  onChange={handleChange}
                  required={showExamFields}
                />
              </div>

              <div className="space-y-2">
                <Label>পরীক্ষার সময়</Label>
                <div className="flex flex-wrap gap-2">
                  <Select
                    onValueChange={(value) =>
                      handleExamTimeChange("hour", value)
                    }
                    value={formData.examTime?.split(":")[0] || "12"}
                    required={showExamFields}
                  >
                    <SelectTrigger className="flex-1 min-w-[100px]">
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
                    onValueChange={(value) =>
                      handleExamTimeChange("minute", value)
                    }
                    value={
                      formData.examTime?.split(":")[1]?.split(" ")[0] || "00"
                    }
                    required={showExamFields}
                  >
                    <SelectTrigger className="flex-1 min-w-[100px]">
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
                    onValueChange={(value) =>
                      handleExamTimeChange("ampm", value)
                    }
                    value={formData.examTime?.split(" ")[1] || "AM"}
                    required={showExamFields}
                  >
                    <SelectTrigger className="flex-1 min-w-[100px]">
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
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-yellow-100 text-black border border-yellow-500 hover:bg-yellow-200"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
