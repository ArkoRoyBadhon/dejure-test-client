"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useCreateQuestionBankTypeMutation } from "@/redux/features/questionBank/questionBankType.api";
import { useGetSubjectsQuery } from "@/redux/features/curriculum/subject.api";
import { Badge } from "@/components/ui/badge";
import { useGetCurriculumsQuery } from "@/redux/features/curriculum/curriculum.api";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AddLawTypeDialog({ open, onOpenChange }) {
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createQuestionBankType] = useCreateQuestionBankTypeMutation();
  const { data: subjectData } = useGetSubjectsQuery();
  const { data: curriculumData } = useGetCurriculumsQuery();

  // Filter subjects based on selected curriculum
  const filteredSubjects = selectedCurriculum
    ? subjectData?.filter(
        (subject) => subject.curriculum === selectedCurriculum
      )
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCurriculum) {
      toast.error("Curriculum is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createQuestionBankType({
        isActive,
        curriculum: selectedCurriculum,
      }).unwrap();

      setSelectedCurriculum("");
      setIsActive(true);
      setSelectedSubjects([]);
      onOpenChange(false);
      toast.success("Question bank type created successfully");
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to create question bank type"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnselect = (subjectId) => {
    setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
  };

  const toggleSubjectSelection = (subjectId) => {
    if (selectedSubjects.includes(subjectId)) {
      handleUnselect(subjectId);
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-darkColor">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Question Bank
            </div>
          </DialogTitle>
          <DialogDescription>
            Create a new question bank to organize your questions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Curriculum Select */}
          <div className="space-y-2">
            <Label htmlFor="curriculum" className="text-darkColor">
              Curriculum *
            </Label>
            <select
              id="curriculum"
              value={selectedCurriculum}
              onChange={(e) => {
                setSelectedCurriculum(e.target.value);
                setSelectedSubjects([]);
              }}
              className="w-full !text-darkColor p-2 border rounded-md bg-gray-50"
              required
            >
              <option value="">Select a curriculum</option>
              {curriculumData?.map((curriculum) => (
                <option
                  className="!text-darkColor"
                  key={curriculum._id}
                  value={curriculum._id}
                >
                  {curriculum.subjectType}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedCurriculum("");
                setIsActive(true);
                setSelectedSubjects([]);
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedCurriculum}
            >
              {isSubmitting ? "Creating..." : "Create Bank"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
