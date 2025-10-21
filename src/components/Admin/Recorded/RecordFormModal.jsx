"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  useCreateRecordMutation,
  useUpdateRecordMutation,
} from "@/redux/features/records/records.api";
import { useGetCurriculumsQuery } from "@/redux/features/curriculum/curriculum.api";
import { toast } from "sonner";

export default function RecordFormModal({
  open,
  setOpen,
  editable,
  courseId,
  onSuccess,
  usedCurriculumIds = [],
}) {
  const [subjectType, setSubjectType] = useState("");
  const [selectedCurriculumId, setSelectedCurriculumId] = useState("");

  const [createRecord, { isLoading: creating }] = useCreateRecordMutation();
  const [updateRecord, { isLoading: updating }] = useUpdateRecordMutation();

  const { data: curriculumData = [] } = useGetCurriculumsQuery();

  const isEditMode = Boolean(editable);

  useEffect(() => {
    if (editable) {
      setSubjectType(editable.subjectType || "");
      setSelectedCurriculumId(editable.curriculum?._id || "");
    } else {
      setSubjectType("");
      setSelectedCurriculumId("");
    }
  }, [editable]);

  const handleSubmit = async () => {
    if (!subjectType) {
      toast.error("Please select a subject type.");
      return;
    }

    const selectedCurriculum = curriculumData.find(
      (c) => c.subjectType === subjectType
    );

    if (!selectedCurriculum) {
      toast.error("Invalid subject type selected.");
      return;
    }

    try {
      let result;

      if (isEditMode) {
        result = await updateRecord({
          id: editable._id,
          patch: {
            subjectType,
            curriculum: selectedCurriculum._id,
          },
        }).unwrap();
        toast.success("Section updated successfully!");
      } else {
        result = await createRecord({
          subjectType,
          curriculum: selectedCurriculum._id,
          course: courseId,
        }).unwrap();
        toast.success("Section created successfully!");
      }

      // Pass both the record ID and curriculum ID to parent
      if (onSuccess) {
        onSuccess({
          _id: result._id, // Record ID
          curriculumId: selectedCurriculum._id, // Curriculum ID
          subjectType: selectedCurriculum.subjectType,
        });
      }

      setOpen(false);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong!");
    }
  };

  const availableCurriculums = curriculumData.filter(
    (c) =>
      !usedCurriculumIds.includes(c._id) ||
      (isEditMode && selectedCurriculumId === c._id)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isEditMode ? "Update Record Section" : "Create New Record Section"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <label className="text-sm font-medium">Select Subject Type</label>
          <select
            value={subjectType}
            onChange={(e) => {
              setSubjectType(e.target.value);
              const selected = curriculumData.find(
                (c) => c.subjectType === e.target.value
              );
              setSelectedCurriculumId(selected?._id || "");
            }}
            className="w-full border rounded px-3 py-2 bg-yellow-100"
          >
            <option value="">Select a subject type</option>
            {availableCurriculums.map((curriculum) => (
              <option key={curriculum._id} value={curriculum.subjectType}>
                {curriculum.subjectType}
              </option>
            ))}
          </select>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-main text-black hover:bg-yellow-600"
            onClick={handleSubmit}
            disabled={creating || updating}
          >
            {creating || updating
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update"
              : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
