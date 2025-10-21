"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format, isValid } from "date-fns";
import { bn } from "date-fns/locale";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ExamDetails from "./ExamDetails";
import { useSelector } from "react-redux";
import { Zap, Clock } from "lucide-react";

export default function LiveExamCardLearner({ key, examData }) {
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;

  const [currentStatus, setCurrentStatus] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasActiveAttempt, setHasActiveAttempt] = useState(false);
  const router = useRouter();

  // Check if exam is in anytime mode
  const isAnytimeMode = examData?.mode === "anytime";

  // Check if student has submitted this exam
  useEffect(() => {
    if (examData?.submissions && userId) {
      const submitted = examData.submissions.some(
        (submission) => submission.student?._id === userId
      );
      setHasSubmitted(submitted);
    }
  }, [examData?.submissions, userId]);

  // Check if student has active attempt for anytime exams
  useEffect(() => {
    if (isAnytimeMode && examData?.attempts && userId) {
      const activeAttempt = examData.attempts.find(
        (attempt) =>
          attempt.student === userId && attempt.status === "in-progress"
      );
      setHasActiveAttempt(!!activeAttempt);
    }
  }, [examData?.attempts, userId, isAnytimeMode]);

  // Memoize the exam dates (only for scheduled mode)
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

  // Format date and time based on mode
  const formattedDate = isAnytimeMode
    ? "Any Time"
    : format(examDate, "dd MM yyyy", { locale: bn });

  const formattedTime = isAnytimeMode
    ? "24/7 Available"
    : examData?.scheduledTime || "--:--";

  // Calculate exam status and time remaining
  const calculateStatus = () => {
    if (hasSubmitted) {
      return {
        status: "Submitted",
        timeRemaining: "You've submitted this exam",
      };
    }

    if (examData?.status === "cancelled") {
      return {
        status: "Cancelled",
        timeRemaining: "Exam cancelled",
      };
    }

    if (isAnytimeMode) {
      if (hasActiveAttempt) {
        return {
          status: "Ongoing",
          timeRemaining: "Exam in progress",
        };
      }
      return {
        status: "Available",
        timeRemaining: "Available anytime",
      };
    }

    const now = new Date();
    const timeDiff = examDate - now;
    const endDiff = examEndDate - now;

    if (endDiff <= 0) {
      return { status: "Ended", timeRemaining: "Exam ended" };
    } else if (timeDiff <= 0) {
      return {
        status: "Ongoing",
        timeRemaining: calculateRemainingTime(endDiff),
      };
    } else {
      return {
        status: "Upcoming",
        timeRemaining: calculateRemainingTime(timeDiff),
      };
    }
  };

  // Format time remaining with seconds (only for scheduled mode)
  const calculateRemainingTime = (diff) => {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let result = [];
    if (days > 0) result.push(`${days} day${days !== 1 ? "s" : ""}`);
    if (hours > 0) result.push(`${hours} hr${hours !== 1 ? "s" : ""}`);
    if (minutes > 0) result.push(`${minutes} min${minutes !== 1 ? "s" : ""}`);
    result.push(`${seconds} sec${seconds !== 1 ? "s" : ""}`);

    return result.join(" ");
  };

  // Update status (only set interval for scheduled mode)
  useEffect(() => {
    const updateStatus = () => {
      const { status, timeRemaining } = calculateStatus();
      setCurrentStatus(status);
      setTimeRemaining(timeRemaining);
    };

    // Update immediately
    updateStatus();

    // Only set interval for scheduled mode (for countdown)
    if (!isAnytimeMode) {
      const interval = setInterval(updateStatus, 1000);
      return () => clearInterval(interval);
    }
  }, [examDate, examEndDate, hasSubmitted, isAnytimeMode, hasActiveAttempt]);

  // Get badge color based on status
  const getStatusBadgeColor = () => {
    switch (currentStatus) {
      case "Ongoing":
        return "bg-green-100 text-green-800";
      case "Ended":
        return "bg-red-100 text-red-800";
      case "Submitted":
        return "bg-gray2 text-purple-800";
      case "Available":
        return "bg-purple-100 text-purple-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Get status icon based on status
  const getStatusIcon = () => {
    switch (currentStatus) {
      case "Available":
        return <Zap className="w-3 h-3 mr-1" />;
      case "Ongoing":
        return <Clock className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  // Handle exam start
  const handleStartExam = (id) => {
    if (examData?.status === "cancelled") {
      toast.info("This exam has been cancelled", { id: "info-dd" });
      return;
    }

    if (hasSubmitted) {
      setIsDialogOpen(true);
    } else if (currentStatus === "Ongoing" || currentStatus === "Available") {
      router.push(`/dashboard/live-exam/${id}`);
    } else if (currentStatus === "Upcoming") {
      toast.info("Exam has not started yet");
    } else {
      setIsDialogOpen(true);
    }
  };

  // Get button text and style based on status
  const getButtonProps = () => {
    if (hasSubmitted) {
      return {
        text: "Submitted",
        className: "",
        disabled: false,
      };
    } else if (examData?.status === "cancelled") {
      return {
        text: "Cancelled",
        className: "bg-gray-400 hover:bg-gray-500",
        disabled: true,
      };
    } else if (currentStatus === "Ongoing" || currentStatus === "Available") {
      return {
        text: currentStatus === "Ongoing" ? "Continue Exam" : "Start Exam",
        className: "",
        disabled: false,
      };
    } else if (currentStatus === "Upcoming") {
      return {
        text: "Exam Not Started Yet",
        className: "",
        disabled: true,
      };
    } else {
      return {
        text: "Exam Ended",
        className: "bg-gray-400 hover:bg-gray-500",
        disabled: false,
      };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <div className="">
      <Card className="w-full max-w-sm mx-auto bg-white shadow-md hover:shadow-lg transition-shadow">
        {/* Mode Badge */}
        {examData?.mode && (
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-1 text-xs rounded-full capitalize ${
                examData.mode === "anytime"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {examData?.mode}
            </span>
          </div>
        )}

        <CardHeader className="">
          <h2 className="text-[20px] capitalize leading-[150%] font-bold text-darkColor">
            {examData?.title || "Live Exam"}
          </h2>

          <div className="flex items-center gap-3 mt-4">
            <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden">
              <Image
                src={
                  examData?.evaluator?.image
                    ? `${process.env.NEXT_PUBLIC_API_URL}/${examData?.evaluator?.image}`
                    : "/assets/image/avatar.png"
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

          <div className="flex gap-2 mt-4">
            {timeRemaining !== "Exam ended" &&
              timeRemaining !== "You've submitted this exam" &&
              timeRemaining !== "Exam cancelled" && (
                <Badge
                  variant="secondary"
                  className="bg-blue/10 text-[14px] text-darkColor"
                >
                  {timeRemaining}
                </Badge>
              )}

            <Badge
              variant="secondary"
              className={`text-[14px] ${getStatusBadgeColor()} flex items-center`}
            >
              {getStatusIcon()}
              {currentStatus}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="bg-main/5 border border-main rounded-[16px] p-3 flex items-center gap-3">
              <div className="w-[40px] h-[40px] bg-gray-200 flex items-center justify-center overflow-hidden rounded-[8px]">
                <Image
                  src={
                    process.env.NEXT_PUBLIC_API_URL +
                      "/" +
                      examData?.courses[0]?.thumbnail ||
                    "/assets/icons/avatar.png"
                  }
                  alt="Course"
                  height={40}
                  width={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-[16px] leading-[150%] text-darkColor">
                {examData?.courses[0]?.title || "Exam"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-deepGray w-[40%]">Subject</span>
              <span className="text-darkColor font-bold text-[14px] w-[60%]">
                {examData?.subject?.name || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-deepGray w-[40%]">Date</span>
              <span className="text-darkColor font-bold text-[14px] w-[60%]">
                {formattedDate}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-deepGray w-[40%]">Time</span>
              <span className="text-darkColor font-bold text-[14px] w-[60%]">
                {formattedTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-deepGray w-[40%]">Duration</span>
              <span className="text-darkColor font-bold text-[14px] w-[60%]">
                {examData?.durationMinutes || 0} minutes
              </span>
            </div>
          </div>

          <Button
            onClick={() => handleStartExam(examData?._id)}
            className={`w-full font-bold mt-2 bg-white hover:bg-main border border-blue hover:border-main ${buttonProps.className}`}
            disabled={buttonProps.disabled}
          >
            {buttonProps.text}
          </Button>
        </CardContent>
      </Card>
      <ExamDetails
        id={examData?._id}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
