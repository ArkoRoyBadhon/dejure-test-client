"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useGetClassByLectureIdQuery } from "@/redux/features/lecture/class.api";
import ClassDeleteDialog from "./ClassDeleteDialog";
import ClassFormModal from "./ClassFormModal";
import { useSelector } from "react-redux";

export default function ClassList({
  lectureId,
  subjectTypeId,
  shouldOpenForm,
  onFormOpened,
  onClassClick,
  courseId,
  activeClassId, // Receive the prop here
}) {
  const {
    data: classes = [],
    isLoading,
    isError,
  } = useGetClassByLectureIdQuery(lectureId);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  // Removed the local selectedClassId state
  // const [selectedClassId, setSelectedClassId] = useState(null);

  // Get user role from Redux store
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (shouldOpenForm) {
      setOpenFormModal(true);
      onFormOpened();
    }
  }, [shouldOpenForm, onFormOpened]);

  const openEdit = (cls) => {
    setSelectedClass(cls);
    setOpenFormModal(true);
  };

  const openDelete = (cls) => {
    setSelectedClass(cls);
    setOpenDeleteModal(true);
  };

  const handleClassClick = (cls, index) => {
    // The `activeClassId` will be set by the parent component now
    //setSelectedClassId(cls._id); // This is no longer needed
    // Pass the full array and the index up to the parent
    onClassClick?.(cls, index, classes.data);
  };

  return (
    <div className="">
      {isLoading ? (
        <p>Loading classes...</p>
      ) : isError ? (
        <p className="text-red-500">No classes found</p>
      ) : classes?.data?.length === 0 ? (
        <p className="text-gray-500 italic p-2">No classes found.</p>
      ) : (
        <ul className="">
          {classes?.data?.map((cls, index) => (
            <li key={cls._id} className="">
              {/* Header with gray background */}
              <div
                className={` flex justify-between items-center p-2 cursor-pointer ${
                  activeClassId === cls._id ? "bg-[#F2F2F2]" : "bg-white" // Use the prop for active state
                }`}
                onClick={() => handleClassClick(cls, index)}
              >
                <div className="flex gap-[8px]">
                  <img src="/tick-double.svg" alt="" />
                  <p className="font-medium">{cls.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{cls.length}</p>
                </div>

                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(cls);
                      }}
                      className="p-1 hover:bg-blue-100 rounded text-blue-600"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDelete(cls);
                      }}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modals */}
      <ClassFormModal
        open={openFormModal}
        setOpen={setOpenFormModal}
        editable={selectedClass}
        lectureId={lectureId}
        subjectTypeId={subjectTypeId}
        courseId={courseId}
      />

      <ClassDeleteDialog
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        cls={selectedClass}
      />
    </div>
  );
}
