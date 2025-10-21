"use client";
import QuitionsetPage from "@/app/(main)/questionset/page";
import { useGetLiveExamByIdQuery } from "@/redux/features/liveexams/liveExam.Api";
import React, { useEffect, useState } from "react";
import Countdown from "./Countdown";
import QuiestionSetComponent from "./QuestionSetComponent";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";

const ExamController = ({ examid, show = false }) => {
  const {
    data: examData,
    isLoading,
    isError,
  } = useGetLiveExamByIdQuery(examid);
  const [examStarted, setExamStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const router = useRouter();
  useEffect(() => {
    // if (examData) {
    //   checkExamTime();
    //   const interval = setInterval(checkExamTime, 1000);
    //   return () => clearInterval(interval);
    // }
  }, [examData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader text="Loading exam data..." size="sm" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error loading exam data. Please try again later.</p>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No exam data found.</p>
      </div>
    );
  }

  if (examStarted) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <h1 className="text-2xl font-bold">{examData.title}</h1>
        <p className="text-lg">
          Exam will start on {examData.scheduledDate} at{" "}
          {examData.scheduledTime}
        </p>

        {timeRemaining && (
          <>
            <p className="text-lg">Time remaining until exam starts:</p>
            <Countdown
              targetTime={
                new Date(`${examData.scheduledDate}T${examData.scheduledTime}`)
              }
            />
          </>
        )}

        <div className="mt-8 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
          <p className="text-yellow-800">
            Please wait until the exam starts. The exam page will automatically
            load when it's time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!show && (
        <Button className="ml-4 mt-5" onClick={() => router.back()}>
          <ArrowLeft />
          Go Back
        </Button>
      )}

      <QuiestionSetComponent
        examData={examData}
        timeDuration={examData.durationMinutes}
        minPassMark={examData.minPassMark}
      />
    </div>
  );
};

export default ExamController;
