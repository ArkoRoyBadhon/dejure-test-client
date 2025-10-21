"use client";

import { useState } from "react";
import LiveExamCard from "@/app/(dashboard)/(admin dashboard)/admin/dashboard/live-exam/_components/LiveExamcard";
import CommonBtn from "@/components/shared/CommonBtn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllLiveExamsByCourseQuery } from "@/redux/features/liveexams/liveExam.Api";
import { FileText, Plus } from "lucide-react";
import Image from "next/image";
import CreateExamModal from "@/app/(dashboard)/(admin dashboard)/admin/dashboard/course/_components/LiveClassCreationModal";

export default function LiveExams({ id }) {
  const {
    data: allExamsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAllLiveExamsByCourseQuery(id);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteSuccess = () => {
    refetch();
  };

  // Filter upcoming and previous exams
  const filterExams = () => {
    if (!allExamsResponse?.data)
      return { upcomingExams: [], previousExams: [] };

    const now = new Date();

    return allExamsResponse.data.reduce(
      (acc, exam) => {
        const examStart = new Date(
          `${exam.scheduledDate}T${exam.scheduledTime}`
        );
        const examEnd = new Date(
          examStart.getTime() + exam.durationMinutes * 60000
        );

        if (now < examEnd) {
          acc.upcomingExams.push(exam);
        } else {
          acc.previousExams.push(exam);
        }

        return acc;
      },
      { upcomingExams: [], previousExams: [] }
    );
  };

  const { upcomingExams, previousExams } = filterExams();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, idx) => (
          <Skeleton key={idx} className="h-[300px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-[50vh]">
        <p className="text-red-500">Failed to load exams</p>
        <Button onClick={refetch}>Retry</Button>
      </div>
    );
  }

  const hasUpcomingExams = upcomingExams.length > 0;
  const hasPreviousExams = previousExams.length > 0;

  return (
    <>
      <div className="space-y-6">
        {/* Upcoming Exams Section */}
        <Card className="shadow2 p-0">
          <CardHeader className="bg-gray2 rounded-t-lg py-4">
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/icons/live-streaming-03.png"
                  alt="Live Exam Icon"
                  width={20}
                  height={20}
                />
                <span>আসন্ন লাইভ এক্সাম</span>
              </div>
              <CommonBtn variant="default" onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4" />
                Create New Exam
              </CommonBtn>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6 space-y-4">
            {hasUpcomingExams ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingExams.map((exam) => (
                  <LiveExamCard
                    key={exam._id}
                    examData={exam}
                    onDelete={handleDeleteSuccess}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <FileText className="h-10 w-10 text-gray-400" />
                <p className="text-gray-500">No upcoming exams found</p>
                <Button onClick={() => setIsModalOpen(true)}>
                  Create New Exam
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Previous Exams Section */}
        <Card className="shadow2 p-0 mt-6">
          <CardHeader className="bg-gray2 rounded-t-lg py-4">
            <CardTitle className="flex items-center gap-2">
              <Image
                src="/play.svg"
                alt="Previous Exam Icon"
                width={20}
                height={20}
              />
              <span>পূর্ববর্তী লাইভ এক্সাম</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6 space-y-4">
            {hasPreviousExams ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {previousExams.map((exam) => (
                  <LiveExamCard
                    key={exam._id}
                    examData={exam}
                    onDelete={handleDeleteSuccess}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <FileText className="h-10 w-10 text-gray-400" />
                <p className="text-gray-500">No previous exams found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CreateExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetch();
        }}
        id={id}
        setLiveexamID={() => {}}
      />
    </>
  );
}
