"use client";

import {
  ChevronRight,
  FileText,
  Users,
  BarChart3,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { format, parseISO, isValid, addMinutes } from "date-fns";
import { bn } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useGetLiveExamByIdQuery } from "@/redux/features/liveexams/liveExam.Api";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

const AdminExamDetailMainPage = ({ examid }) => {
  const router = useRouter();
  const id = examid;
  const { data: examData, isLoading, isError } = useGetLiveExamByIdQuery(id);
  const [currentStatus, setCurrentStatus] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const { user } = useSelector((state) => state.auth);
  // Calculate exam status
  useEffect(() => {
    if (!examData) return;

    const calculateStatus = () => {
      const examDate = parseDateSafely(examData?.scheduledDate);
      const examEndDate = addMinutes(examDate, examData?.durationMinutes || 0);
      const now = new Date();
      const timeDiff = examDate - now;
      const endDiff = examEndDate - now;

      if (endDiff <= 0) {
        return { status: "সমাপ্ত", timeRemaining: "পরীক্ষা শেষ হয়েছে" };
      } else if (timeDiff <= 0) {
        return {
          status: "চলমান",
          timeRemaining: `${Math.floor(endDiff / (1000 * 60))} মিনিট বাকি`,
        };
      } else {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        return {
          status: "আসন্ন",
          timeRemaining: `${days} দিন ${hours} ঘণ্টা বাকি`,
        };
      }
    };

    const updateStatus = () => {
      const { status, timeRemaining } = calculateStatus();
      setCurrentStatus(status);
      setTimeRemaining(timeRemaining);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, [examData]);

  // Helper functions
  const parseDateSafely = (dateString) => {
    try {
      if (!dateString) return new Date();
      const date = parseISO(dateString);
      return isValid(date) ? date : new Date();
    } catch {
      return new Date();
    }
  };

  const getStatusBadgeColor = () => {
    switch (currentStatus) {
      case "চলমান":
        return "bg-green-100 text-green-800";
      case "সমাপ্ত":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Format dates
  const examDate = examData
    ? parseDateSafely(examData?.scheduledDate)
    : new Date();
  const examEndDate = examData
    ? addMinutes(examDate, examData?.durationMinutes || 0)
    : new Date();
  const formattedDate = format(examDate, "dd MMMM yyyy", { locale: bn });
  const formattedTime = format(examDate, "hh:mm a", { locale: bn });
  const formattedEndTime = format(examEndDate, "hh:mm a", { locale: bn });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (isError || !examData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">
            {isError ? "Error loading exam details" : "Exam not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto space-y-4">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {/* <span>পূর্ববর্তী</span> */}
          <span>Go Back</span>
        </Button>
        <div key={examData?._id} className="grid grid-cols-2 gap-4 mb-4">
          <div className="hover:shadow-lg bg-main/5 border border-main transition-shadow flex p-3 gap-4 rounded-lg">
            {/* Image placeholder - replace with exam image if available */}
            <div className="bg-gray-100 rounded-lg flex items-center justify-center w-28 h-28">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>

            <div className="flex-1">
              <h1 className="text-lg font-medium text-gray-900">
                {examData?.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {examData?.subject?.name}
              </p>

              <div className="flex gap-2 mt-2">
                <Badge className={`${getStatusBadgeColor()} text-xs px-2 py-1`}>
                  {currentStatus}
                </Badge>
                <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs px-2 py-1">
                  {examData?.type}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-1">
                  {examData?.durationMinutes} mins
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Course Exam Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">কোর্স এক্সাম</h2>
          </div>

          {/* Exam Details Card */}
          <Card className="bg-white shadow2">
            <CardContent className="">
              <div className="space-y-4">
                {/* Exam Title and Status */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {examData?.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                        {examData?.resultPublished
                          ? "RESULT PUBLISHED"
                          : "RESULT PENDING"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${
                          currentStatus === "সমাপ্ত"
                            ? "border-red-300 text-red-600"
                            : currentStatus === "চলমান"
                            ? "border-green-300 text-green-600"
                            : "border-blue-300 text-blue-600"
                        } text-xs`}
                      >
                        {currentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Exam Details */}
                <div className="space-y-2 text-sm text-gray-700">
                  <div>পরীক্ষার ধরনঃ {examData?.type}</div>
                  <div>প্রশ্নের ধরনঃ MCQ</div>
                  <div>তারিখঃ {formattedDate}</div>
                  <div>
                    সময়ঃ {formattedTime} - {formattedEndTime}
                  </div>
                  <div>সময়ঃ {examData?.durationMinutes} মিনিট</div>
                  {/* <div>
                    মোট নম্বরঃ {examData?.questionSet?.totalPoints || "N/A"} (
                    {examData?.questionSet?.totalQuestions || "N/A"} টি প্রশ্ন)
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu Items */}
          <div className="space-y-3">
            <div
              className="flex items-center justify-between p-4 py-8 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow"
              onClick={() =>
                user.role !== "admin"
                  ? router.push(
                      `/mentor/dashboard/exam-assessment/${id}/question`
                    )
                  : router.push(`/admin/dashboard/live-exam/${id}/question`)
              }
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">
                  প্রশ্ন পত্র দেখি
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div
              className="flex items-center justify-between p-4 py-8 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow"
              onClick={() =>
                user.role !== "admin"
                  ? router.push(
                      `/mentor/dashboard/exam-assessment/${id}/submission`
                    )
                  : router.push(`/admin/dashboard/live-exam/${id}/submission`)
              }
            >
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">সাবমিশনসমূহ</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div
              className="flex items-center justify-between p-4 py-8 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow"
              onClick={() =>
                user.role !== "admin"
                  ? router.push(
                      `/mentor/dashboard/exam-assessment/${id}/leaderboard`
                    )
                  : router.push(`/admin/dashboard/live-exam/${id}/leaderboard`)
              }
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">
                  লিডারবোর্ড দেখি
                </span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminExamDetailMainPage;
