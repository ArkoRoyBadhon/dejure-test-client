"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { FileText, Zap } from "lucide-react";
import { useSelector } from "react-redux";

import { useGetAllLiveExamsByCourseQuery } from "@/redux/features/liveexams/liveExam.Api";
import LiveExamCardLearner from "./LiveExamCardLearner";

const LiveExamLearner = ({ id }) => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;

  const {
    data: allExamsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAllLiveExamsByCourseQuery(id);

  const handleRetry = () => {
    refetch();
  };

  // Filter exams by mode and student-specific logic
  const filterExams = () => {
    if (!allExamsResponse?.data)
      return { upcomingExams: [], previousExams: [], anytimeExams: [] };

    const now = new Date();

    return allExamsResponse.data.reduce(
      (acc, exam) => {
        // Check if student has submitted this exam
        const hasSubmitted = exam.submissions?.some(
          (submission) => submission.student?._id === userId
        );

        // Check exam mode
        const isAnytimeMode = exam.mode === "anytime";

        if (isAnytimeMode) {
          // For anytime mode exams
          if (exam.status === "cancelled") {
            acc.previousExams.push(exam);
          } else if (hasSubmitted) {
            acc.previousExams.push(exam);
          } else {
            acc.anytimeExams.push(exam);
          }
        } else {
          // For scheduled mode exams
          const examStart = new Date(
            `${exam.scheduledDate}T${exam.scheduledTime}`
          );
          const examEnd = new Date(
            examStart.getTime() + exam.durationMinutes * 60000
          );

          if (hasSubmitted) {
            acc.previousExams.push(exam);
          } else if (now < examEnd) {
            acc.upcomingExams.push(exam);
          } else {
            acc.previousExams.push(exam);
          }
        }

        return acc;
      },
      { upcomingExams: [], previousExams: [], anytimeExams: [] }
    );
  };

  const { upcomingExams, previousExams, anytimeExams } = filterExams();

  if (isLoading) {
    return (
      <div className="space-y-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, idx) => (
            <Skeleton key={idx} className="h-[300px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-[50vh]">
        <p className="text-red-500">Failed to load exams</p>
        <Button onClick={handleRetry}>Retry</Button>
      </div>
    );
  }

  const hasUpcomingExams = upcomingExams?.length > 0;
  const hasPreviousExams = previousExams?.length > 0;
  const hasAnytimeExams = anytimeExams?.length > 0;

  return (
    <div className="space-y-6">
      {/* Anytime Exams Section - Show first since they're always available */}
      <Card className="shadow-md p-0">
        <CardHeader className="bg-purple-100 rounded-t-lg py-4">
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <span>যেকোনো সময়ের এক্সাম</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6 space-y-4">
          {hasAnytimeExams ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {anytimeExams.map((exam) => (
                <LiveExamCardLearner
                  key={exam._id}
                  examData={exam}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <Zap className="h-10 w-10 text-gray-400" />
              <p className="text-gray-500">কোনো যেকোনো সময়ের এক্সাম নেই</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Exams Section */}
      <Card className="shadow-md p-0">
        <CardHeader className="bg-blue-100 rounded-t-lg py-4">
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/live-streaming-03.png"
                alt="Live Exam Icon"
                width={20}
                height={20}
              />
              <span> আসন্ন লাইভ এক্সাম</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6 space-y-4">
          {hasUpcomingExams ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingExams.map((exam) => (
                <LiveExamCardLearner
                  key={exam._id}
                  examData={exam}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <FileText className="h-10 w-10 text-gray-400" />
              <p className="text-gray-500">কোনো আসন্ন লাইভ এক্সাম নেই</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Previous Exams Section */}
      <Card className="shadow-md p-0">
        <CardHeader className="bg-gray-100 rounded-t-lg py-4">
          <CardTitle className="flex items-center gap-2">
            <Image
              src="/play.svg"
              alt="Live Exam Icon"
              width={20}
              height={20}
            />
            <span> পূর্ববর্তী লাইভ এক্সাম</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6 space-y-4">
          {hasPreviousExams ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {previousExams.map((exam) => (
                <LiveExamCardLearner
                  key={exam._id}
                  examData={exam}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <FileText className="h-10 w-10 text-gray-400" />
              <p className="text-gray-500">কোনো পূর্ববর্তী লাইভ এক্সাম নেই</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveExamLearner;
