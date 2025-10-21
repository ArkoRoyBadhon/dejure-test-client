"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit, Trash2, Calendar, Zap, Clock } from "lucide-react";
import Image from "next/image";
import { format, parseISO, isValid, addMinutes } from "date-fns";
import { bn } from "date-fns/locale";
import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  useDeleteLiveExamMutation,
  useUpdateLiveExamMutation,
} from "@/redux/features/liveexams/liveExam.Api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function LiveExamCard({ examData, onDelete }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteLiveExam, { isLoading: isDeleting }] =
    useDeleteLiveExamMutation();
  const [updateLiveExam, { isLoading: isUpdating }] =
    useUpdateLiveExamMutation();
  const [currentStatus, setCurrentStatus] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if exam is in anytime mode
  const isAnytimeMode = examData?.mode === "anytime";

  // Combine date and time to create proper datetime (only for scheduled mode)
  const { examDate, examEndDate } = useMemo(() => {
    if (isAnytimeMode) {
      return { examDate: new Date(), examEndDate: new Date() };
    }

    try {
      if (!examData?.scheduledDate || !examData?.scheduledTime) {
        return { examDate: new Date(), examEndDate: new Date() };
      }

      // Parse date and time
      const datePart = examData.scheduledDate.split("T")[0];
      const [hours, minutes] = examData.scheduledTime.split(":");

      // Create date object
      const examDate = new Date(datePart);
      examDate.setHours(parseInt(hours, 10));
      examDate.setMinutes(parseInt(minutes, 10));
      examDate.setSeconds(0);

      // Calculate end date by adding duration
      const examEndDate = new Date(examDate);
      examEndDate.setMinutes(
        examEndDate.getMinutes() + (examData?.durationMinutes || 0)
      );

      return {
        examDate: isValid(examDate) ? examDate : new Date(),
        examEndDate: isValid(examEndDate) ? examEndDate : new Date(),
      };
    } catch {
      return { examDate: new Date(), examEndDate: new Date() };
    }
  }, [
    examData?.scheduledDate,
    examData?.scheduledTime,
    examData?.durationMinutes,
    isAnytimeMode,
  ]);

  const enToBnDigits = (str) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return str.replace(/\d/g, (digit) => bnDigits[Number(digit)]);
  };

  const formatTimeString = (timeStr) => {
    if (!timeStr) return "--:-- --";

    try {
      // Ensure time is in HH:MM format
      const [hours, minutes] = timeStr.split(":");
      const hoursNum = parseInt(hours, 10) || 0;
      const minsNum = parseInt(minutes, 10) || 0;

      // Create a valid date object
      const date = new Date();
      date.setHours(hoursNum, minsNum, 0, 0);

      return format(date, "hh:mm a");
    } catch {
      return "--:-- --";
    }
  };

  // Format date and time for scheduled mode
  const formattedDate = isAnytimeMode
    ? "যেকোনো সময়"
    : enToBnDigits(format(examDate, "dd MM yyyy", { locale: bn }));

  const formattedTimeRaw = isAnytimeMode
    ? "24/7"
    : formatTimeString(examData?.scheduledTime);
  const formattedTime = isAnytimeMode
    ? "সর্বদা উপলব্ধ"
    : enToBnDigits(formattedTimeRaw).toLowerCase();

  // Calculate exam status and time remaining
  const calculateStatus = () => {
    if (isAnytimeMode) {
      if (examData?.status === "cancelled") {
        return { status: "Cancelled", timeRemaining: "বাতিল করা হয়েছে" };
      }
      return { status: "উপলব্ধ", timeRemaining: "সর্বদা উপলব্ধ" };
    }

    const now = new Date();
    const timeDiff = examDate - now;
    const endDiff = examEndDate - now;

    if (endDiff <= 0) {
      return { status: "Ended", timeRemaining: "পরীক্ষা শেষ" };
    } else if (timeDiff <= 0) {
      return {
        status: "চলছে",
        timeRemaining: calculateRemainingTime(endDiff),
      };
    } else {
      return {
        status: "আসছে",
        timeRemaining: calculateRemainingTime(timeDiff),
      };
    }
  };

  // Format time remaining with seconds
  const calculateRemainingTime = (diff) => {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let result = [];
    if (days > 0) result.push(`${days} দিন`);
    if (hours > 0) result.push(`${hours} ঘণ্টা`);
    if (minutes > 0) result.push(`${minutes} মিনিট`);
    if (result.length === 0 || seconds > 0) {
      result.push(`${seconds} সেকেন্ড`);
    }

    return result.join(" ");
  };

  const handleCancelExam = async () => {
    try {
      await updateLiveExam({
        id: examData?._id,
        data: {
          status: examData?.status === "cancelled" ? "active" : "cancelled",
        },
      }).unwrap();
      toast.success("Exam Updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update exam");
      console.error(error);
    } finally {
      setCancelDialogOpen(false);
    }
  };

  // Update status every second for smooth countdown (only for scheduled mode)
  useEffect(() => {
    const updateStatus = () => {
      const { status, timeRemaining } = calculateStatus();
      setCurrentStatus(status);
      setTimeRemaining(timeRemaining);
    };

    // Update immediately
    updateStatus();

    // Only set interval for scheduled mode
    if (!isAnytimeMode) {
      const interval = setInterval(updateStatus, 1000);
      return () => clearInterval(interval);
    }
  }, [examDate, examEndDate, isAnytimeMode]);

  // Get badge color based on status
  const getStatusBadgeColor = () => {
    if (examData?.status === "cancelled") {
      return "bg-red-100 text-red-800";
    }

    switch (currentStatus) {
      case "চলছে":
        return "bg-green-100 text-green-800";
      case "Ended":
      case "পরীক্ষা শেষ":
        return "bg-red-100 text-red-800";
      case "উপলব্ধ":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Handle exam deletion
  const handleDeleteExam = async () => {
    try {
      await deleteLiveExam(examData._id).unwrap();
      toast.success("Exam deleted successfully");
      if (onDelete) onDelete(examData._id); // Notify parent component
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete exam");
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto bg-white shadow2 relative">
      {/* Mode Badge */}
      {/* {examData?.mode && (
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs rounded-full capitalize ${
            examData.mode === "anytime" 
              ? "bg-purple-100 text-purple-800" 
              : "bg-orange-100 text-orange-800"
          }`}>
            {examData.mode}
          </span>
        </div>
      )} */}

      {/* Custom dropdown menu for actions */}
      <div
        className={`absolute top-5 right-3 ${
          user.role !== "admin" && "hidden"
        }`}
        ref={dropdownRef}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  router.push(
                    `/admin/dashboard/live-exam/${examData?._id}/edit`
                  );
                  setDropdownOpen(false);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setCancelDialogOpen(true);
                  setDropdownOpen(false);
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {examData?.status === "cancelled"
                  ? "Start Exam"
                  : "Cancel Exam"}
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => {
                  setDeleteDialogOpen(true);
                  setDropdownOpen(false);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <CardHeader className="">
        <div className="flex">
          {examData?.status === "cancelled" ? (
            <Badge
              variant="secondary"
              className="bg-red-100 text-[14px] text-red-800"
            >
              Cancelled
            </Badge>
          ) : (
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className={`text-[14px] ${getStatusBadgeColor()}`}
              >
                {currentStatus}
              </Badge>
              {timeRemaining !== "পরীক্ষা শেষ" &&
                timeRemaining !== "সর্বদা উপলব্ধ" && (
                  <Badge
                    variant="secondary"
                    className="bg-blue/10 text-[14px] text-darkColor"
                  >
                    {timeRemaining}
                  </Badge>
                )}
            </div>
          )}
        </div>
        <h2 className="text-[20px] capitalize leading-[150%] font-bold text-darkColor">
          {examData?.title || "Live Exam"}
        </h2>

        <div className="flex items-center gap-3 mt-2">
          <div className="w-12 h-12 rounded-full bg-red-400 flex items-center justify-center overflow-hidden">
            <Image
              src={
                examData?.evaluator?.image
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${examData?.evaluator?.image}`
                  : "/assets/icons/avatar.png"
              }
              alt="Instructor"
              height={48}
              width={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-[16px] capitalize font-bold text-darkColor">
              {examData?.evaluator?.fullName || "Instructor Name"}
            </h3>
            <p className="text-[14px] text-darkColor">
              {examData?.evaluator?.designation || "Designation"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          <div
            className={`space-y-1 h-[80px] ${
              examData?.courses?.length > 1 && " overflow-y-auto no-scrollbar"
            }`}
          >
            {examData?.courses.map((course) => (
              <div className="bg-main/5 border border-main rounded-[16px] p-3 flex items-center gap-3">
                <div className="w-[40px] h-[40px] bg-gray-200 flex items-center justify-center overflow-hidden rounded-[8px]">
                  <Image
                    src={
                      course?.thumbnail
                        ? `${process.env.NEXT_PUBLIC_API_URL}/${course?.thumbnail}`
                        : "/assets/icons/avatar.png"
                    }
                    alt="Course"
                    height={40}
                    width={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-bold text-[16px] leading-[150%] text-darkColor line-clamp-1">
                  {course?.title || "Exam"}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <span className="text-deepGray w-[40%]">সাবজেক্ট</span>
            <span className="text-darkColor font-bold text-[14px] w-[60%] line-clamp-1">
              {examData?.subject?.name || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-deepGray w-[40%]">তারিখ</span>
            <span className="text-darkColor font-bold text-[14px] w-[60%]">
              {formattedDate}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-deepGray w-[40%]">সময়</span>
            <span className="text-darkColor font-bold text-[14px] w-[60%]">
              {isAnytimeMode ? "সর্বদা উপলব্ধ" : `${formattedTime}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-deepGray w-[40%]">সময়সীমা</span>
            <span className="text-darkColor font-bold text-[14px] w-[60%]">
              {examData?.durationMinutes || 0} মিনিট
            </span>
          </div>
        </div>

        <Button
          onClick={() =>
            user.role !== "admin"
              ? examData?.status === "cancelled"
                ? toast.error("This exam is cancelled")
                : router.push(
                    `/mentor/dashboard/exam-assessment/${examData?._id}`
                  )
              : router.push(`/admin/dashboard/live-exam/${examData?._id}`)
          }
          className={`w-full font-bold mt-2 bg-white hover:bg-main border border-blue hover:border-main text-darkColor`}
        >
          {user.role !== "admin" && examData?.status === "cancelled"
            ? "Cancelled"
            : "View Details"}
        </Button>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              exam and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExam}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will {examData?.status === "cancelled" ? "resume" : "cancel"}{" "}
              the exam.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelExam}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting
                ? "Processing..."
                : examData?.status === "cancelled"
                ? "Resume Exam"
                : "Cancel Exam"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
