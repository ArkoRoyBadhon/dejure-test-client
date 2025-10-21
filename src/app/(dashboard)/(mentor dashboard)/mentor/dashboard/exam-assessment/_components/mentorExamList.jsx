"use client";
import LiveExamCard from "@/app/(dashboard)/(admin dashboard)/admin/dashboard/live-exam/_components/LiveExamcard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetLiveExamsByEvaluatorPrevQuery,
  useGetLiveExamsByEvaluatorQuery,
} from "@/redux/features/liveexams/liveExam.Api";
import { FileText, Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";

const MentorExamList = () => {
  // Current exams query
  const {
    data: currentExams,
    isLoading: currentLoading,
    isError: currentError,
    error: currentErrorData,
  } = useGetLiveExamsByEvaluatorQuery();

  // Previous exams query
  const {
    data: previousExams,
    isLoading: previousLoading,
    isError: previousError,
    error: previousErrorData,
  } = useGetLiveExamsByEvaluatorPrevQuery();

  const renderExamList = (exams, isLoading, isError, error) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      );
    }
    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-10 gap-4 text-red-500">
          <FileText className="h-10 w-10" />
          <p>
            Error loading exams:{" "}
            {error?.data?.message || "Please try again later"}
          </p>
        </div>
      );
    }
    if (exams?.length > 0) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <LiveExamCard key={exam._id} examData={exam} onDelete={() => {}} />
          ))}
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-4 text-gray-500">
        <FileText className="h-10 w-10" />
        <p>No exams found</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4">
      {/* Current Exams Card */}
      <Card className="shadow-md rounded-lg overflow-hidden border-0 p-0">
        <CardHeader className="bg-gray-100 p-4 border-b">
          <CardTitle className="flex items-center gap-3">
            <div className="relative w-6 h-6">
              <Image
                src="/assets/icons/live-streaming-03.png"
                alt="Live Exam Icon"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-semibold">এসাইনকৃত পরীক্ষাসমূহ</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {renderExamList(
            currentExams,
            currentLoading,
            currentError,
            currentErrorData
          )}
        </CardContent>
      </Card>

      {/* Previous Exams Card */}
      <Card className="shadow2 p-0 rounded-lg overflow-hidden border-0">
        <CardHeader className="bg-gray-100 p-4 border-b">
          <CardTitle className="flex items-center gap-3">
            <div className="relative w-6 h-6">
              <Image
                src="/play.svg"
                alt="Live Exam Icon"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-semibold">
              মূল্যায়নকৃত পরীক্ষাসমূহ
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {renderExamList(
            previousExams,
            previousLoading,
            previousError,
            previousErrorData
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorExamList;
