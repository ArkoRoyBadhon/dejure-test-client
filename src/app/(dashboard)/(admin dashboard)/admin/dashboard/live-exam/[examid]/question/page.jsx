"use client";
import { useGetLiveExamByIdQuery } from "@/redux/features/liveexams/liveExam.Api";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import QuestionPreview from "../../_components/QuestionPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const page = () => {
  const { examid } = useParams();
  const {
    data: examData,
    isLoading,
    isError,
  } = useGetLiveExamByIdQuery(examid);
  const router = useRouter();

  return (
    <div className="p-4">
      <Button onClick={() => router.back()} variant="ghost" className="">
        <ArrowLeft />
        Go Back
      </Button>
      <QuestionPreview examData={examData} timeDuration={examData?.duration} />
    </div>
  );
};

export default page;
