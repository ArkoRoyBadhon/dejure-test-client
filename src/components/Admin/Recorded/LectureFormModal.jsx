"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  useCreateLectureMutation,
  useUpdateLectureMutation,
} from "@/redux/features/lecture/lecture.api";
import { useGetSubjectsBySubjectTypeIdQuery } from "@/redux/features/curriculum/subject.api";
import { toast } from "sonner";
import { useCreateSubjectMutation } from "@/redux/features/curriculum/subject.api"; // <-- Import this

export default function LectureFormModal({
  open,
  setOpen,
  editable,
  subjectTypeId,
  recordId, // Add this new prop
  usedSubjectNames = [],
  courseId,
}) {
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [addNew, setAddNew] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  const {
    data: subjects = [],
    isLoading: loadingSubjects,
    refetch,
  } = useGetSubjectsBySubjectTypeIdQuery(subjectTypeId, {
    skip: !subjectTypeId,
  });

  const [createSubject, { isLoading: creatingSubject }] =
    useCreateSubjectMutation();
  const [createLecture, { isLoading: creating }] = useCreateLectureMutation();
  const [updateLecture, { isLoading: updating }] = useUpdateLectureMutation();

  const isEditMode = Boolean(editable);

  useEffect(() => {
    if (editable) {
      setSelectedSubjectId(editable.subject?._id || "");
      setAddNew(false);
      setNewSubjectName("");
    } else {
      setSelectedSubjectId("");
      setAddNew(false);
      setNewSubjectName("");
    }
  }, [editable, open]);

  const handleSubmit = async () => {
    if (addNew) {
      if (!newSubjectName) {
        toast.error("Please enter a subject name");
        return;
      }
      try {
        // Create the subject first
        const newSubject = await createSubject({
          name: newSubjectName,
          subjectType: recordId,
          course: courseId,
        }).unwrap();
        refetch();
        // Now create the lecture with the new subject's name
        await createLecture({
          subjectName: newSubject.name, // <-- use name, not _id
          subjectType: recordId,
          course: courseId,
        }).unwrap();
        toast.success("Subject and lecture created successfully!");
        setOpen(false);
      } catch (error) {
        toast.error(error?.data?.message || "Failed to create subject");
      }
      return;
    }

    if (!selectedSubjectId) {
      toast.error("Please select a subject");
      return;
    }

    try {
      const selectedSubject = subjects.find((s) => s._id === selectedSubjectId);
      if (!selectedSubject) {
        toast.error("Invalid subject selected");
        return;
      }
      if (isEditMode) {
        await updateLecture({
          id: editable._id,
          patch: {
            subjectName: selectedSubject.name, // <-- use name
            subjectType: recordId,
          },
        }).unwrap();
        toast.success("Subject updated successfully!");
      } else {
        await createLecture({
          subjectName: selectedSubject.name, // <-- use name
          subjectType: recordId,
          course: courseId,
        }).unwrap();
        toast.success("Subject created successfully!");
      }
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save subject");
    }
  };

  // Only show subjects not already used (except in edit mode)
  const availableSubjects = subjects.filter(
    (s) =>
      !usedSubjectNames.includes(s.name) ||
      (isEditMode && editable?.subject?.name === s.name)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Update Subject" : "Add Subject"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-center gap-2"></div>
          {addNew ? (
            <input
              className="w-full border p-2 rounded"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Enter subject name"
            />
          ) : loadingSubjects ? (
            <p>Loading subjects...</p>
          ) : (
            <select
              className="w-full border p-2 rounded"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              disabled={loadingSubjects}
            >
              <option value="">-- Select Subject --</option>
              {availableSubjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              creating ||
              updating ||
              creatingSubject ||
              (addNew ? !newSubjectName : !selectedSubjectId)
            }
          >
            {creating || updating || creatingSubject
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update"
              : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
