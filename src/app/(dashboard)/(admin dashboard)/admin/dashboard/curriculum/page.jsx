"use client";

import React, { useState, useEffect } from "react";
import CurriculumModal from "@/components/Admin/curriculum/CurriculumModal";
import SubjectModal from "@/components/Admin/curriculum/SubjectModal";
import {
  useCreateCurriculumMutation,
  useDeleteCurriculumMutation,
  useUpdateCurriculumMutation,
  useGetCurriculumsQuery,
  useGetCurriculumByIdQuery,
} from "@/redux/features/curriculum/curriculum.api";
import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} from "@/redux/features/curriculum/subject.api";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "@/components/shared/Loader";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import PermissionError from "@/components/shared/PermissionError";

export default function CurriculumPage() {
  const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);
  const [subjectTypeInput, setSubjectTypeInput] = useState("");
  const [subjectNameInput, setSubjectNameInput] = useState("");

  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editModeCurriculum, setEditModeCurriculum] = useState(null);
  const [editModeSubject, setEditModeSubject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSubjectDialogOpen, setDeleteSubjectDialogOpen] = useState(false);
  const [curriculumToDeleteId, setCurriculumToDeleteId] = useState(null);
  const [subjectToDeleteId, setSubjectToDeleteId] = useState(null);

  const [subjectSearch, setSubjectSearch] = useState("");
  const [subjectFilterStatus, setSubjectFilterStatus] = useState("ALL");
  const [curriculumSearch, setCurriculumSearch] = useState("");
  const [curriculumFilterStatus, setCurriculumFilterStatus] = useState("ALL");

  const {
    data: curriculums = [],
    isLoading: isLoadingCurriculums,
    error: errorCurriculums,
  } = useGetCurriculumsQuery({});
  const {
    data: selectedCurriculum,
    isLoading: isLoadingSelectedCurriculum,
    refetch: refetchSelectedCurriculum,
  } = useGetCurriculumByIdQuery(selectedCurriculumId, {
    skip: !selectedCurriculumId,
  });

  const [createCurriculum, { isLoading: isCreating }] =
    useCreateCurriculumMutation();
  const [updateCurriculum, { isLoading: isUpdating }] =
    useUpdateCurriculumMutation();
  const [deleteCurriculum] = useDeleteCurriculumMutation();
  const [createSubject, { isLoading: isCreatingSubject }] =
    useCreateSubjectMutation();
  const [updateSubject, { isLoading: isUpdatingSubject }] =
    useUpdateSubjectMutation();
  const [deleteSubject] = useDeleteSubjectMutation();

  useEffect(() => {
    if (curriculums.length && !selectedCurriculumId) {
      setSelectedCurriculumId(curriculums[0]._id);
    }
  }, [curriculums]);

  const handleSaveCurriculum = async (formData) => {
    try {
      // Create a new FormData instance to ensure clean data
      const submissionFormData = new FormData();

      // For updates, we need to handle partial updates
      if (editModeCurriculum) {
        // Append all fields from the original formData that have values
        const fieldsToUpdate = [
          "subjectType",
          "name",
          "description",
          // add other fields as needed
        ];

        fieldsToUpdate.forEach((field) => {
          const value = formData.get(field);
          if (value !== null && value !== undefined && value !== "") {
            submissionFormData.append(field, value);
          }
        });

        // Special handling for image
        if (formData.has("image")) {
          const imageFile = formData.get("image");
          if (imageFile instanceof File && imageFile.size > 0) {
            submissionFormData.append("image", imageFile);
          }
        } else if (formData.get("removeImage") === "true") {
          submissionFormData.append("removeImage", "true");
        }

        await updateCurriculum({
          id: editModeCurriculum._id,
          patch: submissionFormData, // Send as FormData
        }).unwrap();
        toast.success("Updated successfully");
      } else {
        // For creation, append all fields from the original formData
        for (const [key, value] of formData.entries()) {
          // Skip removeImage field for new creations
          if (key !== "removeImage") {
            submissionFormData.append(key, value);
          }
        }

        await createCurriculum(submissionFormData).unwrap();
        toast.success("Created successfully");
      }

      setEditModeCurriculum(null);
      setIsCurriculumModalOpen(false);
    } catch (err) {
      toast.error(err.data?.message || "Operation failed");
      console.error("Error:", err);
    }
  };

  const handleAddSubject = async (formData) => {
    try {
      if (!selectedCurriculumId) {
        toast.error("Please select a curriculum first");
        return;
      }

      // Append the subjectType to the formData
      formData.append("subjectType", selectedCurriculumId);

      if (editModeSubject) {
        await updateSubject({
          id: editModeSubject._id,
          patch: formData, // Send the FormData directly
        }).unwrap();
        toast.success("Subject updated successfully");
      } else {
        await createSubject(formData).unwrap();
        toast.success("Subject created successfully");
      }

      setSubjectNameInput("");
      setEditModeSubject(null);
      setIsSubjectModalOpen(false);
      refetchSelectedCurriculum();
    } catch (error) {
      toast.error(
        error.data?.message ||
          (editModeSubject
            ? "Failed to update subject"
            : "Failed to create subject")
      );
      console.error("Error:", error);
    }
  };

  const handleDeleteCurriculum = async () => {
    try {
      await deleteCurriculum(curriculumToDeleteId);
      toast.success("Deleted successfully");
      setDeleteDialogOpen(false);
      if (selectedCurriculumId === curriculumToDeleteId) {
        setSelectedCurriculumId(null);
      }
    } catch {
      toast.error(error?.data?.message || "Failed to delete");
    }
  };

  const handleDeleteSubject = async () => {
    try {
      await deleteSubject(subjectToDeleteId);
      toast.success("Subject deleted successfully");
      setDeleteSubjectDialogOpen(false);
      refetchSelectedCurriculum();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete subject");
    }
  };

  const openEditSubjectModal = (subject) => {
    setEditModeSubject(subject);
    setSubjectNameInput(subject.name);
    setIsSubjectModalOpen(true);
  };

  if (errorCurriculums?.data?.message === "Insufficient module permissions")
    return <PermissionError />;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Left Side - Curriculum */}
        <div className="w-full md:w-1/3 border rounded-xl shadow bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">SUBJECT TYPE</h2>

            <button
              onClick={() => {
                setEditModeCurriculum(null);
                setSubjectTypeInput("");
                setIsCurriculumModalOpen(true);
              }}
              className="text-xs px-4 py-1 rounded-md bg-yellow-100 hover:bg-yellow-100 text-yellow-700 border border-yellow-400"
            >
              + ADD
            </button>
          </div>

          <input
            type="text"
            placeholder="Search subject type"
            value={curriculumSearch}
            onChange={(e) => setCurriculumSearch(e.target.value)}
            className="px-3 py-1 border rounded w-full mb-3"
          />
          <div className="flex gap-2 mb-3">
            {["ALL", "ACTIVE", "INACTIVE"].map((status) => (
              <button
                key={status}
                onClick={() => setCurriculumFilterStatus(status)}
                className={`px-3 py-1 rounded text-sm border ${
                  curriculumFilterStatus === status
                    ? "bg-yellow-600 text-white"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {curriculums
            .filter((c) =>
              c.subjectType
                .toLowerCase()
                .includes(curriculumSearch.toLowerCase())
            )
            .filter((c) => {
              if (curriculumFilterStatus === "ALL") return true;
              if (curriculumFilterStatus === "ACTIVE") return c.isActive;
              if (curriculumFilterStatus === "INACTIVE") return !c.isActive;
              return true;
            })
            .map((curriculum) => (
              <div
                key={curriculum._id}
                onClick={() => setSelectedCurriculumId(curriculum._id)}
                className={`p-3 rounded-lg border flex justify-between items-center mb-2 cursor-pointer ${
                  selectedCurriculumId === curriculum._id
                    ? "border-yellow-600 bg-yellow-50"
                    : "border-main-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div>
                    <Image
                      src={
                        curriculum?.thumbnail
                          ? `${process.env.NEXT_PUBLIC_API_URL}/${curriculum.thumbnail}`
                          : "/assets/fallImg.jpg"
                      }
                      alt={curriculum?.subjectType || "Curriculum Thumbnail"}
                      width={400}
                      height={400}
                      className="h-10 w-10 object-cover rounded"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{curriculum.subjectType}</p>
                    <p className="text-xs text-gray-500">
                      Listed Subjects:{" "}
                      <span className="bg-yellow-100 text-yellow-900 border border-yellow-400 px-1 rounded-full ">
                        {curriculum.subjects?.length || 0}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditModeCurriculum(curriculum);
                          setSubjectTypeInput(curriculum.subjectType);
                          setIsCurriculumModalOpen(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setCurriculumToDeleteId(curriculum._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {curriculum.isActive && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-md">
                      ACTIVE
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Right Side - Subjects */}
        <div className="w-full md:w-2/3 border rounded-xl shadow bg-white p-4">
          <p className="text-sm  mb-3">
            &gt; {selectedCurriculum?.subjectType || "Select a curriculum"}
          </p>

          {/* Card */}
          <div
            className={`p-2 rounded-lg border flex justify-between items-center hover:shadow-sm transition cursor-pointer bg-yellow-50 border-yellow-500 mb-4
              }`}
          >
            <div className="flex items-center gap-3">
              {selectedCurriculum?.thumbnail && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${selectedCurriculum.thumbnail}`}
                  alt={selectedCurriculum.subjectType}
                  height={400}
                  width={400}
                  className="h-10 w-10 object-cover rounded"
                />
              )}
              <div>
                <div>
                  <p className="font-medium">
                    {selectedCurriculum?.subjectType}
                  </p>
                  <p className="text-xs text-gray-500">
                    Listed Subjects:{" "}
                    <span className="bg-yellow-100 text-yellow-900 border border-yellow-400 px-1 rounded-full ">
                      {selectedCurriculum?.subjects?.length || 0}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">SUBJECTS</h2>
            <button
              onClick={() => {
                setEditModeSubject(null);
                setSubjectNameInput("");
                setIsSubjectModalOpen(true);
              }}
              disabled={!selectedCurriculumId}
              className="text-xs px-4 py-1 rounded-md bg-yellow-100 hover:bg-yellow-100 text-yellow-700 border border-yellow-400"
            >
              + ADD
            </button>
          </div>

          <input
            type="text"
            placeholder="Search subject name"
            value={subjectSearch}
            onChange={(e) => setSubjectSearch(e.target.value)}
            className="px-3 py-1 border rounded w-full mb-3"
          />
          <div className="flex gap-2 mb-3">
            {["ALL", "ACTIVE", "INACTIVE"].map((status) => (
              <button
                key={status}
                onClick={() => setSubjectFilterStatus(status)}
                className={`px-3 py-1 rounded text-sm border ${
                  subjectFilterStatus === status
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {isLoadingSelectedCurriculum ? (
            <Loader text="Loading subjects..." size="sm" />
          ) : selectedCurriculum?.subjects?.length ? (
            selectedCurriculum.subjects
              .filter((s) =>
                s.name.toLowerCase().includes(subjectSearch.toLowerCase())
              )
              .filter((s) => {
                if (subjectFilterStatus === "ALL") return true;
                if (subjectFilterStatus === "ACTIVE") return s.isActive;
                if (subjectFilterStatus === "INACTIVE") return !s.isActive;
                return true;
              })
              .map((subject) => (
                <div
                  key={subject._id}
                  className="p-3 rounded-lg border flex justify-between items-center mb-2"
                >
                  <div className="flex items-center gap-2">
                    <div>
                      {subject.thumbnail && (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${subject.thumbnail}`}
                          alt={subject.subjectType}
                          height={400}
                          width={400}
                          className="h-10 w-10 object-cover rounded"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-xs text-gray-500">
                        Teachers: {subject.teachers?.length || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreHorizontal className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => openEditSubjectModal(subject)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSubjectToDeleteId(subject._id);
                            setDeleteSubjectDialogOpen(true);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <span
                      className={`text-xs border px-2 py-0.5 rounded-full ${
                        subject.isActive
                          ? "text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-md"
                          : "text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-md"
                      }`}
                    >
                      {subject.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <p>No subjects found.</p>
          )}
        </div>
      </div>

      {/* Curriculum Modal */}
      {isCurriculumModalOpen && (
        // In your CurriculumPage component, replace the modal rendering with:
        <CurriculumModal
          open={isCurriculumModalOpen}
          onClose={() => setIsCurriculumModalOpen(false)}
          onSave={handleSaveCurriculum}
          isCreating={isCreating || isUpdating}
          editMode={!!editModeCurriculum}
          existingSubjectType={editModeCurriculum?.subjectType || ""}
          existingThumbnail={editModeCurriculum?.thumbnail || null}
        />
      )}

      {/* Subject Modal */}
      {isSubjectModalOpen && (
        <SubjectModal
          subjectNameInput={subjectNameInput}
          setSubjectNameInput={setSubjectNameInput}
          onClose={() => setIsSubjectModalOpen(false)}
          onSave={handleAddSubject}
          isCreating={isCreatingSubject || isUpdatingSubject}
          editMode={!!editModeSubject}
          existingThumbnail={editModeSubject?.thumbnail || null}
        />
      )}

      {/* Delete Curriculum Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this curriculum?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCurriculum}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Subject Dialog */}
      <Dialog
        open={deleteSubjectDialogOpen}
        onOpenChange={setDeleteSubjectDialogOpen}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Subject Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this subject?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setDeleteSubjectDialogOpen(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteSubject}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
