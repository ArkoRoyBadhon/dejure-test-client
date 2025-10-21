"use client";
import React, { useState } from "react";
import { Pencil, Trash2, BookPlus } from "lucide-react";
import LectureFormModal from "./LectureFormModal";
import LectureDeleteDialog from "./LectureDeleteDialog";
import { useGetLectureBySubjectQuery } from "@/redux/features/lecture/lecture.api";
import ClassList from "./ClassList";
import { useSelector } from "react-redux";

export default function SubjectsList({
  subjectTypeId,
  onClassClick,
  lecture,
  courseId,
  recordId,
  activeClassId,
}) {
  const {
    data: lectures = [],
    isLoading,
    isError,
  } = useGetLectureBySubjectQuery(recordId);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());
  const [lectureToAddClass, setLectureToAddClass] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const toggleSubjectExpansion = (subjectId) => {
    setExpandedSubjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subjectId)) {
        newSet.delete(subjectId);
      } else {
        newSet.add(subjectId);
      }
      return newSet;
    });
    setSelectedSubjectId(subjectId);
  };

  const isSubjectExpanded = (subjectId) => {
    return expandedSubjects.has(subjectId);
  };

  return (
    <div className="bg-white">
      {isLoading ? (
        <p className="p-2 text-sm">Loading subjects...</p>
      ) : isError ? (
        <p className="text-red-500 text-sm p-2">No subjects for this section</p>
      ) : lectures.length === 0 ? (
        <p className="text-gray-500 text-sm italic p-2">No subjects found.</p>
      ) : (
        <ul className="space-y-1">
          {lectures.data.map((lecture) => (
            <li key={lecture._id} className="space-y-1">
              <div
                className={`p-2 sm:p-3 rounded-t-md ${
                  selectedSubjectId === lecture._id ? "bg-white" : "bg-white"
                }`}
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSubjectExpansion(lecture._id)}
                >
                  <span className="font-medium text-sm sm:text-base">
                    {lecture.subjectName}
                  </span>

                  <div className="flex items-center gap-1">
                    {isAdmin && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLectureToAddClass(lecture._id);
                            if (!isSubjectExpanded(lecture._id)) {
                              toggleSubjectExpansion(lecture._id);
                            }
                            setSelectedSubjectId(lecture._id);
                          }}
                          className="p-1 hover:bg-green-100 text-green-600 rounded border"
                          title="Add Class"
                        >
                          <BookPlus size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLecture(lecture);
                            setOpenFormModal(true);
                            setSelectedSubjectId(lecture._id);
                          }}
                          className="p-1 hover:bg-blue-100 text-blue-600 rounded"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLecture(lecture);
                            setOpenDeleteModal(true);
                          }}
                          className="p-1 hover:bg-red-100 text-red-600 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                    <img
                      src="/Vector.svg"
                      alt="toggle"
                      className={`w-3 h-3 sm:w-4 sm:h-4 cursor-pointer transition-transform ${
                        isSubjectExpanded(lecture._id) ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {isSubjectExpanded(lecture._id) && (
                <div className="ml-2 sm:ml-4">
                  <ClassList
                    lectureId={lecture._id}
                    subjectTypeId={subjectTypeId}
                    shouldOpenForm={lectureToAddClass === lecture._id}
                    onFormOpened={() => setLectureToAddClass(null)}
                    onClassClick={(clickedClass, index, allClasses) =>
                      onClassClick(clickedClass, index, allClasses)
                    }
                    courseId={courseId}
                    activeClassId={activeClassId}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <LectureFormModal
        open={openFormModal}
        setOpen={setOpenFormModal}
        editable={selectedLecture}
        subjectTypeId={subjectTypeId}
      />
      <LectureDeleteDialog
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        lecture={selectedLecture}
      />
    </div>
  );
}
