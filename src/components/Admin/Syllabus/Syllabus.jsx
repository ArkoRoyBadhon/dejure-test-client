"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useCreateSyllabusMutation,
  useUpdateSyllabusMutation,
  useDeleteSyllabusMutation,
  useGetSyllabusByCourseIdQuery,
} from "@/redux/features/syllabus/syllabus.api";
import { useGetCurriculumsQuery } from "@/redux/features/curriculum/curriculum.api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export default function Syllabus({ id: courseId }) {
  const userRole = useSelector((state) => state.auth?.user?.role);
  const isAdmin = userRole === "admin";

  const { data: syllabusData = [], isLoading } =
    useGetSyllabusByCourseIdQuery(courseId);
  const { data: curriculumData = [] } = useGetCurriculumsQuery();
  const [createSyllabus] = useCreateSyllabusMutation();
  const [updateSyllabus] = useUpdateSyllabusMutation();
  const [deleteSyllabus] = useDeleteSyllabusMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState(courseId));
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [syllabusToDeleteId, setSyllabusToDeleteId] = useState(null);
  const [selectedSubjectType, setSelectedSubjectType] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  useEffect(() => {
    if (syllabusData && syllabusData.length > 0) {
      const initialExpanded = {};

      // Expand first one if only one; first two if more
      const countToExpand = Math.min(2, syllabusData.length);

      syllabusData.slice(0, countToExpand).forEach((section) => {
        initialExpanded[section._id] = true;
      });

      setExpandedSections(initialExpanded);
    }
  }, [syllabusData]);

  useEffect(() => {
    if (selectedSubjectType) {
      const subjectType = curriculumData.find(
        (st) => st._id === selectedSubjectType
      );
      setAvailableSubjects(subjectType?.subjects || []);
    } else {
      setAvailableSubjects([]);
    }
  }, [selectedSubjectType, curriculumData]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleSubjectTypeChange = (e) => {
    const subjectTypeId = e.target.value;
    setSelectedSubjectType(subjectTypeId);

    const selectedType = curriculumData.find((st) => st._id === subjectTypeId);
    setFormData((prev) => ({
      ...prev,
      sectionName: selectedType?.subjectType || "",
    }));
  };

  const handleSubjectChange = (e, index) => {
    const subjectId = e.target.value;
    const selectedSubject = availableSubjects.find(
      (sub) => sub._id === subjectId
    );

    const newSubjects = [...formData.subjects];
    newSubjects[index] = {
      ...newSubjects[index],
      subject: selectedSubject?.name || "",
      subjectId: subjectId,
    };

    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleInputChange = (e, index, field) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index][field] = e.target.value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleSubmit = async () => {
    const payload = { ...formData };

    try {
      if (isEditMode) {
        await updateSyllabus({ id: editingId, patch: payload });
        toast.success("Syllabus updated successfully");
      } else {
        await createSyllabus(payload);
        toast.success("Syllabus created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        "A syllabus with this section name already exists for this course"
      );
    }
  };

  const resetForm = () => {
    setFormData(initialFormState(courseId));
    setIsEditMode(false);
    setEditingId(null);
    setSelectedSubjectType(null);
    setAvailableSubjects([]);
  };

  const handleEdit = (syllabus) => {
    const subjectType = curriculumData.find(
      (st) =>
        st.subjectType === syllabus.sectionName ||
        st.subjects.some((sub) =>
          syllabus.subjects.some((s) => s.subject === sub.name)
        )
    );

    setSelectedSubjectType(subjectType?._id || null);

    const clonedSubjects = syllabus.subjects.map((subject) => {
      const matchedSubject = subjectType?.subjects?.find(
        (sub) => sub.name === subject.subject
      );
      return {
        subject: subject.subject || "",
        subjectId: matchedSubject?._id || "",
        classCount: subject.classCount || 0,
        preliminaryExamCount: subject.preliminaryExamCount || 0,
        writtenExamCount: subject.writtenExamCount || 0,
      };
    });

    setFormData({
      sectionName: syllabus.sectionName,
      course: courseId,
      subjects: clonedSubjects,
    });

    setIsEditMode(true);
    setEditingId(syllabus._id);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteSyllabus(syllabusToDeleteId);
      toast.success("Syllabus deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete syllabus");
    }
  };

  return (
    <div>
      <div className="px-6 py-3 bg-[#F2F7FC] rounded-t-xl border flex justify-between items-center">
        <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <span className="text-[#141B34] font-bold text-lg">
            প্রোগ্রামের সিলেবাস
          </span>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            className="bg-main hover:bg-main/90 text-black text-sm font-medium rounded-lg shadow-sm px-4 py-2"
          >
            + Add Syllabus
          </button>
        )}
      </div>

      <div className="p-6 bg-[#FFB80033] rounded-b-xl">
        {isLoading ? (
          <p>লোড হচ্ছে...</p>
        ) : (
          <div className="">
            <div className="space-y-4 ">
              {syllabusData?.map((section) => (
                <div key={section._id} className=" rounded-lg overflow-hidden ">
                  {/* Accordion Header */}
                  <button
                    className={`rounded-xl w-full flex justify-between items-center p-3 ${
                      expandedSections[section._id]
                        ? "bg-[#FFB800]"
                        : "bg-white"
                    } `}
                    onClick={() => toggleSection(section._id)}
                  >
                    <h3 className="font-bold text-lg text-left ">
                      {section.sectionName}
                    </h3>
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-5 h-5 text-gray-500" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleEdit(section)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSyllabusToDeleteId(section._id);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          expandedSections[section._id]
                            ? "transform rotate-180"
                            : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Accordion Content - Table */}
                  {expandedSections[section._id] && (
                    <div className="">
                      <div className="overflow-x-auto">
                        <table className="min-w-full table-fixed border-separate border-spacing-x-2 border-spacing-y-2">
                          <thead>
                            <tr>
                              <th className="w-[25%] p-3 text-left font-bold bg-[#F2F7FC] rounded-xl">
                                বিষয়
                              </th>
                              <th className="w-[25%] p-3 text-left font-bold bg-[#F2F7FC] rounded-xl">
                                ক্লাস সংখ্যা
                              </th>
                              <th className="w-[25%] p-3 text-left font-bold bg-[#F2F7FC] rounded-xl">
                                প্রিলি এক্সাম
                              </th>
                              <th className="w-[25%] p-3 text-left font-bold bg-[#F2F7FC] rounded-xl">
                                লিখিত
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {section.subjects?.map((subject, idx) => (
                              <tr key={idx}>
                                <td className="w-[25%] p-3 text-md text-gray-700 bg-white rounded-xl">
                                  {subject.subject}
                                </td>
                                <td className="w-[25%] p-3 text-md text-gray-700 bg-white rounded-xl">
                                  {subject.classCount}
                                </td>
                                <td className="w-[25%] p-3 text-md text-gray-700 bg-white rounded-xl">
                                  {subject.preliminaryExamCount}
                                </td>
                                <td className="w-[25%] p-3 text-md text-gray-700 bg-white rounded-xl">
                                  {subject.writtenExamCount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dialogs for Add/Edit */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-full custom-dialog-width2">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Update Syllabus" : "Create Syllabus"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Subject Type */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Subject Type</label>
                <select
                  value={selectedSubjectType || ""}
                  onChange={handleSubjectTypeChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select a subject type</option>
                  {curriculumData.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.subjectType}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subjects */}
              {formData.subjects.map((subject, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 mb-4">
                  {/* Subject */}
                  <div className="flex flex-col col-span-1">
                    {index === 0 && (
                      <label className="text-sm font-medium mb-1">
                        Subject
                      </label>
                    )}
                    <select
                      value={subject.subjectId || ""}
                      onChange={(e) => handleSubjectChange(e, index)}
                      className="border rounded px-3 py-2"
                      disabled={!selectedSubjectType}
                    >
                      <option value="">
                        {subject.subject || "Select a subject"}
                      </option>
                      {availableSubjects.map((subj) => (
                        <option key={subj._id} value={subj._id}>
                          {subj.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Class Count */}
                  <div className="flex flex-col">
                    {index === 0 && (
                      <label className="text-sm font-medium mb-1">
                        Classes
                      </label>
                    )}
                    <input
                      type="number"
                      placeholder="Classes"
                      value={subject.classCount}
                      onChange={(e) =>
                        handleInputChange(e, index, "classCount")
                      }
                      className="border rounded px-3 py-2"
                    />
                  </div>

                  {/* Prelims */}
                  <div className="flex flex-col">
                    {index === 0 && (
                      <label className="text-sm font-medium mb-1">
                        Prelims
                      </label>
                    )}
                    <input
                      type="number"
                      placeholder="Prelims"
                      value={subject.preliminaryExamCount}
                      onChange={(e) =>
                        handleInputChange(e, index, "preliminaryExamCount")
                      }
                      className="border rounded px-3 py-2"
                    />
                  </div>

                  {/* Written */}
                  <div className="flex flex-col">
                    {index === 0 && (
                      <label className="text-sm font-medium mb-1">
                        Written
                      </label>
                    )}
                    <input
                      type="number"
                      placeholder="Written"
                      value={subject.writtenExamCount}
                      onChange={(e) =>
                        handleInputChange(e, index, "writtenExamCount")
                      }
                      className="border rounded px-3 py-2"
                    />
                  </div>
                </div>
              ))}

              {/* Add Subject */}
              <button
                onClick={() =>
                  setFormData({
                    ...formData,
                    subjects: [
                      ...formData.subjects,
                      {
                        subject: "",
                        subjectId: "",
                        classCount: 0,
                        preliminaryExamCount: 0,
                        writtenExamCount: 0,
                      },
                    ],
                  })
                }
                className="text-sm text-blue-600 underline"
              >
                + Add Subject
              </button>

              {/* Dialog Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-main rounded"
                >
                  {isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete this syllabus? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

const initialFormState = (courseId) => ({
  sectionName: "",
  course: courseId,
  subjects: [
    {
      subject: "",
      subjectId: "",
      classCount: 0,
      preliminaryExamCount: 0,
      writtenExamCount: 0,
    },
  ],
});
