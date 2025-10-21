"use client";
import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { PlusCircle, Pencil, Trash2, BookPlus } from "lucide-react";
import { useGetRecordByCourseIdQuery } from "@/redux/features/records/records.api";
import { useGetCurriculumsQuery } from "@/redux/features/curriculum/curriculum.api";
import RecordFormModal from "./RecordFormModal";
import RecordDeleteDialog from "./RecordDeleteDialog";
import LectureFormModal from "./LectureFormModal";
import SubjectsList from "./SubjectsList";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useGetClasssLengthByCourseQuery } from "@/redux/features/lecture/class.api";

export default function RecordsPage({ id }) {
  const { data, isLoading, isError } = useGetRecordByCourseIdQuery(id);
  const { data: classesCount } = useGetClasssLengthByCourseQuery(id);
  const { data: curriculumData = [] } = useGetCurriculumsQuery();
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [openSubjectModal, setOpenSubjectModal] = useState(false);
  const [selectedSubjectTypeId, setSelectedSubjectTypeId] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const [selectedLecture, setSelectedLecture] = useState(null);

  // New state to hold the full list of classes for the current section
  const [currentSectionClasses, setCurrentSectionClasses] = useState([]);

  // Get user role from Redux store or your authentication context
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const toggleSection = (id, subjectTypeId) => {
    setExpandedSection((prev) => (prev === id ? null : id));
    setSelectedSectionId(id);
    setSelectedSubjectTypeId(subjectTypeId);
    // Reset states when a new section is toggled
    setCurrentSectionClasses([]);
    setSelectedClass(null);
    setCurrentLectureIndex(0);
  };
  const openCreate = () => {
    setSelectedRecord(null);
    setOpenFormModal(true);
  };

  const openEdit = (record) => {
    setSelectedRecord(record);
    setOpenFormModal(true);
    setSelectedSectionId(record._id);
  };

  const openDelete = (record) => {
    setSelectedRecord(record);
    setOpenDeleteModal(true);
  };

  const openAddSubject = (section) => {
    setSelectedSubjectTypeId(section.subjectTypeId);
    setSelectedSectionId(section._id);
    setOpenSubjectModal(true);
    setSelectedLecture(null);
  };

  const handleRecordSubmit = (record) => {
    setSelectedSubjectTypeId(record.curriculumId);
  };

  const courseSections =
    data?.map((item) => {
      const curriculum = curriculumData.find(
        (c) => c.subjectType === item.subjectType
      );
      return {
        title: item.subjectType,
        _id: item._id,
        subjectTypeId: curriculum?._id || "",
      };
    }) || [];

  // Find the expanded/selected section
  const currentSection = data?.find((item) => {
    const curriculum = curriculumData.find(
      (c) => c.subjectType === item.subjectType
    );
    return curriculum?._id === selectedSubjectTypeId;
  });
  const usedSubjectNames =
    currentSection?.lectures?.map((lec) => lec.subjectName) || [];

  // This `lectures` array is no longer used for navigation, as `currentSectionClasses` is the source of truth.
  const lectures = currentSection?.lectures || [];

  // Handler for selecting a class (video)
  // This function now receives and stores the full list of classes
  const handleClassClick = (lecture, idx, allClasses) => {
    setSelectedClass(lecture);
    setCurrentLectureIndex(idx);
    setCurrentSectionClasses(allClasses); // Store the full list
  };

  // Handlers for navigation
  const handlePrev = () => {
    if (currentLectureIndex > 0) {
      setCurrentLectureIndex((prev) => prev - 1);
      setSelectedClass(currentSectionClasses[currentLectureIndex - 1]); // Use new state
    }
  };

  const handleNext = () => {
    if (currentLectureIndex < currentSectionClasses.length - 1) {
      // Use new state
      setCurrentLectureIndex((prev) => prev + 1);
      setSelectedClass(currentSectionClasses[currentLectureIndex + 1]); // Use new state
    }
  };

  useEffect(() => {
    // When a new section is selected, find its lectures and set the first one
    if (currentSection?.lectures?.length > 0) {
      // Assuming lectures are stored on the 'lectures' property of the record
      const allLecturesForSection = currentSection.lectures;
      setCurrentSectionClasses(allLecturesForSection);
      setSelectedClass(allLecturesForSection[0]);
      setCurrentLectureIndex(0);
    } else {
      setCurrentSectionClasses([]);
      setSelectedClass(null);
      setCurrentLectureIndex(0);
    }
  }, [currentSection]);

  useEffect(() => {}, [selectedClass]);

  return (
    <div className="border rounded-xl">
      <div className="flex justify-between items-center  ">
        <div className="flex items-center justify-between bg-[#F2F7FC] p-4 rounded-t-xl w-full">
          <div className="flex gap-2 rounded-t-xl ">
            <img src="/play.svg" alt="" />
            <h2 className="text-md font-semibold">রেকর্ডেড ক্লাস</h2>
          </div>
        </div>

        {isAdmin && (
          <Button
            onClick={openCreate}
            className="flex gap-2 bg-main hover:bg-main text-black mr-4"
          >
            <PlusCircle size={18} />
            Subject Type
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-center text-blue-600 font-medium">
          Loading course sections...
        </p>
      ) : isError ? (
        <p className="text-center text-red-500">
          Failed to load course sections
        </p>
      ) : (
        <main className="main-content flex bg-white rounded-xl">
          {/* Left: Video Player - 4/6 width */}
          <div className="flex-[8] border shadow rounded-xl m-2 ">
            <VideoPlayer
              video={selectedClass}
              onPrev={handlePrev}
              onNext={handleNext}
              hasPrev={currentLectureIndex > 0}
              hasNext={currentLectureIndex < currentSectionClasses.length - 1} // Use new state
              courseId={id}
            />
          </div>

          {/* Right: Sidebar - 2/6 width */}
          <div className="flex-[4] border rounded-xl m-2 flex flex-col">
            <div className="flex items-center justify-between bg-[#F2F7FC] p-4 rounded-t-xl w-full">
              <div className="flex items-center justify-between gap-2 w-full">
                <div>
                  <h2 className="text-md font-semibold">10 % Complete</h2>
                </div>
                <div>
                  <h2 className="text-[#74767C] font-bold">
                    1 of {classesCount?.length || 0} Classes
                  </h2>
                </div>
              </div>
            </div>

            {/* Scrollable Section */}
            <div
              className="space-y-2 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 200px)" }}
            >
              {courseSections.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">
                  No sections yet.
                </p>
              ) : (
                courseSections.map((section) => (
                  <div
                    key={section._id}
                    className="shadow-sm bg-white relative"
                  >
                    <div
                      className={`flex justify-between items-center p-3 ${
                        selectedSectionId === section._id ? "bg-[#FFB800]" : ""
                      }`}
                    >
                      <h4
                        onClick={() =>
                          toggleSection(section._id, section.subjectTypeId)
                        }
                        className="text-base font-semibold cursor-pointer flex items-center justify-between w-full select-none"
                      >
                        <span className="flex items-center gap-1">
                          {section.title}
                        </span>

                        <div className="flex gap-1">
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => openAddSubject(section)}
                                className="p-1 hover:bg-yellow-100 rounded text-yellow-700"
                                title="Add Subject"
                              >
                                <BookPlus size={16} />
                              </button>
                              <button
                                onClick={() => openEdit(section)}
                                className="p-1 hover:bg-blue-100 rounded"
                                title="Update"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => openDelete(section)}
                                className="p-1 hover:bg-red-100 rounded text-red-600"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>

                        <img
                          src="/Vector.svg"
                          alt="toggle"
                          className="w-4 h-4 transition-transform duration-300"
                        />
                      </h4>
                    </div>

                    {/* Subjects */}
                    {expandedSection === section._id && (
                      <SubjectsList
                        subjectTypeId={section.subjectTypeId}
                        onClassClick={(clickedClass, index, allClasses) =>
                          handleClassClick(clickedClass, index, allClasses)
                        }
                        lectures={lectures}
                        courseId={id}
                        recordId={selectedSectionId}
                        activeClassId={selectedClass?._id} // Pass the active video's ID here
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Modals */}
          <RecordFormModal
            open={openFormModal}
            setOpen={setOpenFormModal}
            editable={selectedRecord}
            courseId={id}
            onSuccess={handleRecordSubmit}
            usedCurriculumIds={courseSections.map((s) => s.subjectTypeId)}
          />
          <RecordDeleteDialog
            open={openDeleteModal}
            setOpen={setOpenDeleteModal}
            record={selectedRecord}
          />
          <LectureFormModal
            open={openSubjectModal}
            setOpen={setOpenSubjectModal}
            editable={selectedLecture}
            subjectTypeId={selectedSubjectTypeId}
            recordId={selectedSectionId}
            usedSubjectNames={usedSubjectNames}
            courseId={id}
          />
        </main>
      )}
    </div>
  );
}
