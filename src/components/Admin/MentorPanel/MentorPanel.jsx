"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
} from "@/redux/features/course/course.api";
import { useGetMentorsQuery } from "@/redux/features/auth/mentor.api";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import Image from "next/image";

export default function MentorPanel({ id }) {
  const { data: courseData, isLoading: isCourseLoading } =
    useGetCourseByIdQuery(id);
  const { data: mentorData, isLoading: isMentorLoading } = useGetMentorsQuery();
  const [updateCourse] = useUpdateCourseMutation();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const allMentors = mentorData || [];

  const [open, setOpen] = useState(false);
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [confirmRemove, setConfirmRemove] = useState({
    open: false,
    mentorId: null,
    mentorName: "",
  });

  const toggleMentor = (mentorId) => {
    if (selectedMentors.includes(mentorId)) {
      setSelectedMentors(selectedMentors.filter((id) => id !== mentorId));
    } else {
      setSelectedMentors([...selectedMentors, mentorId]);
    }
  };

  const handleAssign = async () => {
    try {
      const existingMentorIds =
        courseData?.mentors?.map((m) => (typeof m === "object" ? m._id : m)) ||
        [];

      const mergedMentorIds = Array.from(
        new Set([...existingMentorIds, ...selectedMentors])
      );

      await updateCourse({
        id,
        patch: {
          mentors: mergedMentorIds,
        },
      }).unwrap();

      setOpen(false);
      toast.success("Mentor assigned successfully");
    } catch (err) {
      toast.error("Mentor assignment failed");
    }
  };

  const handleRemoveMentor = async () => {
    if (!confirmRemove.mentorId) return;

    const updatedMentors = courseData?.mentors
      ?.filter((m) => m._id !== confirmRemove.mentorId)
      .map((m) => m._id); // extract only IDs

    try {
      await updateCourse({
        id,
        patch: {
          mentors: updatedMentors,
        },
      }).unwrap();
      toast.success("Mentor removed successfully");
      setConfirmRemove({ open: false, mentorId: null, mentorName: "" });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove mentor");
    }
  };

  const openRemoveConfirm = (mentorId, mentorName) => {
    setConfirmRemove({
      open: true,
      mentorId,
      mentorName,
    });
  };

  return (
    <div>
      {/* Header with Create Button */}
      <div className="px-6 py-3 bg-[#F2F7FC] rounded-t-xl border flex justify-between items-center">
        <div className="grid grid-cols-3 w-full text-sm font-medium text-gray-600 ">
          <div className="flex items-center gap-1">
            <span className="text-[#141B34] font-bold text-lg">
              মেন্টর প্যানেল
            </span>
          </div>
          <div></div>
        </div>

        {isAdmin && (
          <Button
            className="ml-4 bg-main hover:bg-main text-black text-sm font-medium"
            onClick={() => setOpen(true)}
          >
            Assign Mentor
          </Button>
        )}
      </div>

      {/* Mentor Panel Section */}
      <div className="lg:col-span-2 order-2 lg:order-1">
        <div className="bg-white  shadow-sm p-6 rounded-b-xl">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {courseData?.mentors.map((mentor) => (
              <div
                key={mentor._id}
                className="relative rounded-2xl shadow-md hover:shadow-lg flex flex-col items-center bg-white"
              >
                {/* Remove Button - Top Right */}
                {isAdmin && (
                  <button
                    onClick={() =>
                      openRemoveConfirm(mentor._id, mentor.fullName)
                    }
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 z-10"
                    title="Remove Mentor"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}

                {/* Card Body */}
                <div className="flex flex-col h-[280px] w-full">
                  {/* Image Section */}
                  <div className="text-center">
                    <Image
                      src={
                        mentor?.image
                          ? `${process.env.NEXT_PUBLIC_API_URL}/${mentor?.image}`
                          : "/assets/icons/avatar.png"
                      }
                      alt={mentor.fullName}
                      height={500}
                      width={500}
                      className="w-full h-[150px] object-cover rounded-t-2xl"
                    />
                  </div>

                  {/* Info Section */}
                  <div className="flex flex-col items-center justify-center text-center px-3">
                    <h3 className="text-sm font-bold mt-2">
                      {mentor.fullName}
                    </h3>
                    <p className="text-xs font-bold text-gray-500 mb-1 mt-1">
                      ({mentor.designation})
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-2 line-clamp-2">
                      <span className="font-medium">{mentor.description}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assign Mentor Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Assign Mentors</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {isMentorLoading ? (
              <p>Loading mentors...</p>
            ) : (
              // Filter out already assigned mentors here:
              allMentors
                .filter(
                  (mentor) =>
                    !courseData?.mentors
                      ?.map((m) => (typeof m === "object" ? m._id : m))
                      .includes(mentor._id)
                )
                .map((mentor) => (
                  <label
                    key={mentor._id}
                    className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedMentors.includes(mentor._id)}
                      onCheckedChange={() => toggleMentor(mentor._id)}
                    />
                    <span>{mentor.fullName}</span>
                  </label>
                ))
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-main text-black" onClick={handleAssign}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation Modal */}
      <Dialog
        open={confirmRemove.open}
        onOpenChange={(open) => setConfirmRemove({ ...confirmRemove, open })}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {confirmRemove.mentorName} from
              this course?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleRemoveMentor}>
              Remove Mentor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
