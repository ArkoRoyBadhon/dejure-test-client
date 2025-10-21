"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Award,
  FileText,
  Edit,
  Trash2,
  Mail,
  Download,
  Printer,
  ChevronLeft,
} from "lucide-react";
import { format, parseISO, isValid, addMinutes } from "date-fns";
import { bn } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useDeleteLiveExamMutation,
  useGetLiveExamByIdQuery,
} from "@/redux/features/liveexams/liveExam.Api";
import ExamSubmissions from "./ExamSubmittions";
import ConfirmationDialog from "@/app/(dashboard)/(admin dashboard)/admin/dashboard/live-exam/_components/ConfirmationDialog";

export default function AdminExamDetailsPage({ examid }) {
  const router = useRouter();
  const id = examid;
  const {
    data: examData,
    isLoading,
    isError,
    refetch,
  } = useGetLiveExamByIdQuery(id);
  const [deleteLiveExam] = useDeleteLiveExamMutation();

  // State for modals and status
  const [currentStatus, setCurrentStatus] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

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

  // Action handlers
  const handleEditExam = () => {
    router.push(`/admin/dashboard/live-exam/${id}/edit`);
  };

  const handleDeleteExam = async () => {
    try {
      await deleteLiveExam(id).unwrap();
      toast.success("Exam deleted successfully");
      router.push("/admin/dashboard/live-exam");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete exam");
    }
  };

  const handleSendReminders = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: "Sending reminders...",
      success: "Reminders sent successfully",
      error: "Failed to send reminders",
    });
  };

  const handlePublishResults = async () => {
    try {
      await publishResults(id).unwrap();
      toast.success("Results published successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to publish results");
    }
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (isError || !examData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">
            {isError ? "Error loading exam details" : "Exam not found"}
          </p>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mt-4"
          >
            Back to Exams
          </Button>
        </div>
      </div>
    );
  }

  // Format dates
  const examDate = parseDateSafely(examData?.scheduledDate);
  const examEndDate = addMinutes(examDate, examData?.durationMinutes || 0);
  const formattedDate = format(examDate, "dd MMMM yyyy", { locale: bn });
  const formattedTime = format(examDate, "hh:mm a", { locale: bn });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Admin Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex">
          <Button variant="ghost" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-2" />
          </Button>
          <div className="">
            <h1 className="text-3xl font-bold text-gray-900">
              {examData?.title}
            </h1>
            <p className="text-gray-500">Exam ID: {id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditExam}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Exam Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Exam Overview Card */}
        <Card className="shadow2 p-0">
          <CardHeader className="bg-main/10 rounded-t-lg py-4">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span>Exam Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6 space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">
                  {formattedTime} -{" "}
                  {format(examEndDate, "hh:mm a", { locale: bn })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">
                  {examData?.durationMinutes} minutes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Participants</p>
                <p className="font-medium">
                  {examData?.submissions?.length || 0} enrolled
                  <Button
                    variant="link"
                    className="h-4 p-0 ml-2"
                    onClick={() => setShowParticipants(true)}
                  >
                    (View All)
                  </Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exam Content Card */}
        <Card className="shadow2 md:col-span-2 p-0">
          <CardHeader className="bg-main/10 rounded-t-lg py-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Exam Content</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Exam Type</p>
                <p className="font-medium">{examData?.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-medium">{examData?.subject?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Questions</p>
                <p className="font-medium">
                  {examData?.questionSet?.totalQuestions || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Points</p>
                <p className="font-medium">
                  {examData?.questionSet?.totalPoints || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pass Mark</p>
                <p className="font-medium">{examData?.minPassMark || 0}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Result Published</p>
                <p className="font-medium">
                  {examData?.resultPublished ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {/* Question Categories */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Question Categories</p>
              <div className="space-y-3">
                {examData?.questionSet?.categories?.map((category, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <p className="font-medium">{category?.name}</p>
                    <p className="text-sm text-gray-600">
                      {category.condition}
                    </p>
                    <p className="text-sm">
                      Minimum Questions: {category.minQuestions}
                    </p>

                    <div className="mt-2">
                      {category.questions?.map((question, qIndex) => (
                        <div key={qIndex} className="ml-4 mt-2">
                          <p className="text-sm font-medium">
                            Question {qIndex + 1}: {question.question}
                          </p>
                          {question.subQuestions?.map(
                            (subQuestion, sqIndex) => (
                              <div key={sqIndex} className="ml-4 mt-1">
                                <p className="text-sm">{subQuestion.text}</p>
                                <ul className="list-disc ml-5 text-sm">
                                  {subQuestion.options?.map(
                                    (option, oIndex) => (
                                      <li key={oIndex}>{option}</li>
                                    )
                                  )}
                                </ul>
                                <p className="text-xs mt-1">
                                  Points: {subQuestion.points} | Difficulty:{" "}
                                  {subQuestion.difficulty}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ExamSubmissions id={examid} />

      {/* Status Bar */}
      <div className="flex justify-between items-center mb-6">
        <Badge className={`text-lg px-4 py-2 ${getStatusBadgeColor()}`}>
          Status: {currentStatus} ({timeRemaining})
        </Badge>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Back to Exams
          </Button>
          {currentStatus === "চলমান" && (
            <Button className="bg-blue-600 hover:bg-blue-700">
              Monitor Live
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Exam"
        description="Are you sure you want to delete this exam? This action cannot be undone."
        onConfirm={handleDeleteExam}
      />

      <ConfirmationDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        title="Publish Results"
        description="Are you sure you want to publish the results? This will make them visible to all participants."
        onConfirm={handlePublishResults}
      />
    </div>
  );
}
