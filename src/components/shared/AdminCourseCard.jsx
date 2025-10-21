"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useDeleteCourseMutation,
  useGetCourseByIdQuery,
} from "@/redux/features/course/course.api";
import { toast } from "sonner";
import { useState } from "react";
import { MoreVertical, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import UpdateCourseDialog from "./Modals/UpdateCourseDialog";

export default function AdminCourseCard({ course }) {
  const [deleteCourse, { isLoading }] = useDeleteCourseMutation();
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  // Fetch course details when update dialog is opened
  const { data: courseDetails, refetch } = useGetCourseByIdQuery(course._id, {
    skip: !showUpdateDialog,
  });

  const handleDelete = async () => {
    try {
      await deleteCourse(course._id).unwrap();
      toast.success("Course Deleted SuccessFully");
      setConfirmDelete(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to Deleted");
    }
  };

  // Get the first type (online/offline) for display
  const firstType = course.types?.[0] || {};
  const hasMultipleTypes = course.types?.length > 1;

  // Determine if course is newly added (within last 7 days)
  const isNewCourse =
    new Date(course.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="border rounded-xl shadow hover:shadow-lg transition-all flex flex-col bg-white h-[530px] relative">
      {/* Newly Added Tag - Top left corner */}
      {course?.tags && (
        <div className="absolute top-3 left-3 z-10">
          <div className="flex items-center bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                clipRule="evenodd"
              />
            </svg>
            {course?.tags}
          </div>
        </div>
      )}

      {/* 3-dot dropdown - Top right corner */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-black hover:text-red bg-yellow-100 border border-yellow-500 rounded-lg"
        >
          <MoreVertical className="w-6 h-8" />
        </button>

        {showMenu && (
          <div className="absolute right-0 w-24 bg-white border rounded hover:shadow z-20">
            <button
              className="block w-full text-left px-4 py-1 text-sm hover:bg-gray-100 shadow-md"
              onClick={() => {
                setShowMenu(false);
                setShowUpdateDialog(true);
              }}
            >
              Update
            </button>
            <button
              className="block w-full text-left px-4 py-1 text-sm hover:bg-gray-100 text-red-600 hover:shadow-md"
              onClick={() => {
                setShowMenu(false);
                setConfirmDelete(true);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Image part - Fixed height container */}
      <div className="w-full h-[250px] rounded-t-xl overflow-hidden relative">
        {course.thumbnailType === "youtube" && course.youtubeUrl ? (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">YouTube Thumbnail</span>
          </div>
        ) : (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>

      {/* Content area */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-lg font-semibold leading-5 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-gray-700 my-2 line-clamp-2">
            {course.subTitle}
          </p>

          {/* ✅ Price or Free */}
          <div className="text-md my-2">
            {course.paymentType?.toLowerCase() === "free" ? (
              <span className="text-green-700 font-bold text-xl">
                সম্পূর্ণ ফ্রি!
              </span>
            ) : firstType.salePrice ? (
              <>
                <span>
                  মাত্র{" "}
                  <span className="text-red-500 line-through mr-2">
                    ৳ {firstType.price}
                  </span>
                </span>
                <span className="text-black font-bold text-xl">
                  ৳ {firstType.salePrice}
                </span>
              </>
            ) : (
              <span className="text-black font-bold text-xl">
                ৳ {firstType.price}
              </span>
            )}
            {hasMultipleTypes && (
              <span className="text-xs text-gray-500 ml-2">
                (+{course.types.length - 1} more options)
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mb-3 text-xs">
            <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
              {course.courseType === "live" ? "লাইভ" : "রেকর্ডেড"}
            </span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              ব্যাচ {course.batchNo}
            </span>
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
              {course.durationMonths} মাস
            </span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              {course.paymentType === "paid" ? "পেইড" : "ফ্রি"}
            </span>
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
              {course.seat} সিট বাকি
            </span>
          </div>
        </div>

        {/* Fixed bottom button */}
        <div className="mt-4 pt-2 border-t">
          <Link href={`/admin/dashboard/course/manage/${course._id}`}>
            <div className="flex justify-center">
              <button className="bg-yellow-100 border border-yellow-500 text-black py-2 rounded-md hover:bg-yellow-200 text-sm w-1/2 flex items-center justify-center gap-1">
                <Settings size={16} />
                manage
              </button>
            </div>
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-sm text-center space-y-2">
          <DialogTitle>Are you Delete this Course?</DialogTitle>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setConfirmDelete(false)}
              variant="outline"
              className="w-24 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white w-24 cursor-pointer"
              disabled={isLoading}
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Course Dialog */}
      {showUpdateDialog && courseDetails && (
        <UpdateCourseDialog
          course={courseDetails}
          open={showUpdateDialog}
          onOpenChange={setShowUpdateDialog}
        />
      )}
    </div>
  );
}
