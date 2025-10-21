"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Clock,
  CheckCircle,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { useGetSubmissionsByExamQuery } from "@/redux/features/submission/submission.api";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { usePublishLiveExamMutation } from "@/redux/features/liveexams/liveExam.Api";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const ExamSubmissions = ({ id }) => {
  const {
    data: submissions,
    isLoading,
    isError,
  } = useGetSubmissionsByExamQuery(id);

  const [publishLiveExam] = usePublishLiveExamMutation();
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center text-red-500">
        <p>Failed to load submissions. Please try again later.</p>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <p className="text-gray-500">No submissions found for this exam.</p>
      </div>
    );
  }

  const handleEvaluate = (submissionId) => {
    if (user.role === "admin") {
      router.push(
        `/admin/dashboard/live-exam/${id}/submission/${submissionId}`
      );
    }

    if (user.role === "mentor") {
      router.push(
        `/mentor/dashboard/exam-assessment/${id}/submission/${submissionId}`
      );
    }
  };

  const handleResultPublish = async () => {
    try {
      await publishLiveExam({ id, data: { resultPublished: true } }).unwrap();
      toast.success("Results published successfully");
    } catch (error) {
      toast.error(error?.data?.error || "Failed to publish results");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className=" mx-auto">
        <Card className="bg-white shadow-sm">
          <CardContent className="">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => router.back()}
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <FileText className="h-5 w-5 text-gray-600" />
                <h1 className="text-lg font-semibold text-gray-900">
                  সকল সাবমিশন
                </h1>
              </div>
              {/* <Button onClick={() => router.back()} variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                back
              </Button> */}
            </div>

            {/* Filter Badges */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 px-3 py-2 text-sm">
                  মোট সাবমিশন {submissions.length}
                </Badge>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-2 text-sm">
                  মূল্যায়ন সম্পন্ন{" "}
                  {submissions.filter((s) => s.isEvaluated).length}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-2 text-sm">
                  বাকি রয়েছে {submissions.filter((s) => !s.isEvaluated).length}
                </Badge>
              </div>
              <Button
                onClick={() => handleResultPublish()}
                className="bg-blue hover:bg-blue/90 text-white"
                disabled={submissions[0].exam.resultPublished}
              >
                {submissions[0].exam.resultPublished
                  ? "পাবলিশ রেজাল্ট সম্পন্ন"
                  : "পাবলিশ রেজাল্ট"}
              </Button>
            </div>

            {/* Submission List */}
            <div className="space-y-3">
              {/* Evaluated Submissions */}
              {submissions
                .filter((s) => s.isEvaluated)
                .map((submission) => (
                  <div
                    key={submission._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {submission.student?.image ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${submission.student?.image}`}
                            alt={submission.student?.fullName}
                            width={32}
                            height={32}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          />
                        ) : (
                          <span className="text-xs text-deepGray">
                            {submission.student?.fullName?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {submission.student?.fullName || "Unknown Student"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(submission.createdAt), "PPP", {
                            locale: bn,
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-deepGray">
                        প্রাপ্ত নম্বর{" "}
                        <span className="font-semibold text-blue-600">
                          {submission.totalMarks || "0"}/
                          {submission?.exam?.questionSet?.totalPoints}
                        </span>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleEvaluate(submission._id)}
                        className="bg-green hover:bg-green text-black hover:text-white rounded-[8px]"
                      >
                        রেজাল্ট দেখুন
                      </Button>
                    </div>
                  </div>
                ))}

              {/* Pending Submissions */}
              {submissions
                .filter((s) => !s.isEvaluated)
                .map((submission) => (
                  <div
                    key={submission._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        {submission.student?.image ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${submission.student?.image}`}
                            alt={submission.student?.fullName}
                            width={32}
                            height={32}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                          />
                        ) : (
                          <span className="text-xs text-deepGray">
                            {submission.student?.fullName?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {submission.student?.fullName || "Unknown Student"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(submission.createdAt), "PPP", {
                            locale: bn,
                          })}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleEvaluate(submission._id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      মূল্যায়ন করুন
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamSubmissions;
