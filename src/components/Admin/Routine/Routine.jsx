"use client";
import { useEffect, useState } from "react";
import CreateRoutineDialog from "./CreateRoutineDialog";
import EditRoutineDialog from "./EditRoutineDialog";
import DeleteRoutineDialog from "./DeleteRoutineDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  PlusIcon,
  Upload,
  FileUp,
} from "lucide-react";
import {
  useGetRoutinesByCourseQuery,
  useUpdateRoutineMutation,
} from "@/redux/features/routine/routine.api";
import { useGetSubjectsQuery } from "@/redux/features/curriculum/subject.api";
import { useSelector } from "react-redux";
import CreateExamModal from "@/app/(dashboard)/(admin dashboard)/admin/dashboard/course/_components/LiveClassCreationModal";
import CreateLiveClassModal from "@/components/shared/Modals/CreateLiveClassModal";
import CreateLiveClassModalForRoutine from "@/components/shared/Modals/CreateLiveClassModalForRoutine";
import { useUpdateCourseMutation } from "@/redux/features/course/course.api";
import { toast } from "sonner";

export default function Routine({ id: courseId, course }) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [selectedRoutineData, setselectedRoutineData] = useState(null);
  const [liveclassID, setLiveclassID] = useState("");
  const [liveexamID, setLiveexamID] = useState("");
  const [routineImageFile, setRoutineImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    data: routines,
    isLoading,
    isError,
  } = useGetRoutinesByCourseQuery(courseId);
  const { data: subjects } = useGetSubjectsQuery();
  const [updateRoutine] = useUpdateRoutineMutation();
  const [updateCourse] = useUpdateCourseMutation();

  // Get routine image URL from course data
  const routineImageUrl = course?.routineImage
    ? `${process.env.NEXT_PUBLIC_API_URL}/${course.routineImage}`
    : null;

  const handleEditClick = (routine) => {
    setSelectedRoutine(routine);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (routine) => {
    setSelectedRoutine(routine);
    setDeleteDialogOpen(true);
  };

  const handleRoutineImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/jpg" ||
        selectedFile.type === "image/png")
    ) {
      setRoutineImageFile(selectedFile);
    } else {
      toast.error("Please select a valid image file (JPEG, JPG, PNG)");
    }
  };

  const handleRoutineImageUpload = async () => {
    if (!routineImageFile) {
      toast.error("Please select an image file first");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("routineImage", routineImageFile);
      formData.append("routineImage", "true");

      await updateCourse({
        id: courseId,
        patch: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).unwrap();

      toast.success("Routine image uploaded successfully");
      setRoutineImageFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.data?.message || "Failed to upload routine image");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (liveclassID) {
      updateRoutine({
        id: selectedRoutineData?._id,
        data: { liveClass: liveclassID },
      });
    }
    if (liveexamID) {
      updateRoutine({
        id: selectedRoutineData?._id,
        data: { liveExam: liveexamID },
      });
    }
  }, [liveclassID, liveexamID]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading routines</div>;
  }

  return (
    <div className="">
      <div className="px-6 py-4 bg-[#F2F7FC] rounded-t-xl border flex justify-between items-center">
        <div className="grid grid-cols-3 w-full text-sm font-medium text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-[#141B34] font-bold text-lg">রুটিন</span>
          </div>
          <div></div>
        </div>

        <div className="flex gap-2">
          {isAdmin && (
            <button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-yellow-100 hover:bg-yellow-200 border border-yellow-500 text-black text-sm font-medium px-2 py-1 rounded-md shadow-sm flex items-center"
            >
              <Plus className="mr-1 h-4 w-4" />
              Routine
            </button>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-semibold mb-4">Upload Routine Image</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full max-w-md">
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleRoutineImageChange}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                id="routine-image-upload"
              />
              <label
                htmlFor="routine-image-upload"
                className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
              >
                <FileUp className="h-4 w-4 mr-2" />
                {routineImageFile ? routineImageFile.name : "Choose Image file"}
              </label>
            </div>
            <Button
              onClick={handleRoutineImageUpload}
              disabled={!routineImageFile || isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {routineImageUrl && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-semibold mb-4">Routine Image</h3>
          <div className="w-full max-w-2xl mx-auto">
            <img
              src={routineImageUrl}
              alt="Routine Image"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      )}

      <div className="bg-white border rounded-t-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F2F7FC]">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">তারিখ</th>
              <th className="px-4 py-3 font-medium">বিষয়</th>
              <th className="px-4 py-3 font-medium">ক্লাস</th>
              <th className="px-4 py-3 font-medium">পরীক্ষা</th>
              {isAdmin && <th className="px-4 py-3 font-medium">অ্যাকশন</th>}
            </tr>
          </thead>
          <tbody className="divide-y">
            {routines?.map((routine) => (
              <tr key={routine._id}>
                <td className="px-4 py-3">{routine.date}</td>
                <td className="px-4 py-3">{routine.subjectId?.name}</td>
                <td className="px-4 py-3">
                  {routine.classTitle && (
                    <>
                      <div className="font-medium">{routine.classTitle}</div>
                      {routine.classTime && (
                        <>
                          <div className="text-xs text-gray-500">
                            {routine.classTime}
                          </div>
                          {!routine.liveClass && user.role === "admin" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-gray-500 border mt-2"
                              onClick={() => {
                                setIsClassModalOpen(true);

                                setselectedRoutineData(routine);
                              }}
                            >
                              <PlusIcon /> create class
                            </Button>
                          )}
                        </>
                      )}

                      {routine.classSubject && (
                        <div className="text-xs text-gray-500">
                          {routine.classSubject}
                        </div>
                      )}
                    </>
                  )}
                </td>
                <td className="px-4 py-3">
                  {routine.examTitle && (
                    <>
                      <div className="font-medium">{routine.examTitle}</div>
                      {routine.examTime && (
                        <>
                          <div className="text-xs text-gray-500">
                            {routine.examTime}
                          </div>
                          {!routine.liveExam && user?.role === "admin" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-gray-500 border mt-2"
                              onClick={() => {
                                setIsModalOpen(true);
                                setselectedRoutineData(routine);
                              }}
                            >
                              <PlusIcon /> create exam
                            </Button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(routine)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(routine)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateRoutineDialog
        open={createDialogOpen}
        onOpenChange={(isOpen) => {
          setCreateDialogOpen(isOpen);
          if (!isOpen) {
            setResetTrigger((prev) => !prev);
          }
        }}
        courseId={courseId}
        subjects={subjects}
      />

      {selectedRoutine && (
        <>
          <EditRoutineDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            routine={selectedRoutine}
            subjects={subjects}
            courseId={courseId}
          />
          <DeleteRoutineDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            routineId={selectedRoutine._id}
          />
        </>
      )}

      <CreateExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
        }}
        id={courseId}
        examTitle={selectedRoutineData?.examTitle}
        examDate={selectedRoutineData?.date}
        examTime={selectedRoutineData?.examTime}
        setLiveexamID={setLiveexamID}
      />

      <CreateLiveClassModalForRoutine
        id={courseId}
        isClassModalOpen={isClassModalOpen}
        setIsClassModalOpen={setIsClassModalOpen}
        classTitle={selectedRoutineData?.classTitle}
        classDate={selectedRoutineData?.date}
        classTime={selectedRoutineData?.classTime}
        setLiveclassID={setLiveclassID}
      />
    </div>
  );
}
