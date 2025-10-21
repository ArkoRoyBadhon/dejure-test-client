"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import {
  useGetSubmissionByIdQuery,
  useUpdateSubmissionMutation,
} from "@/redux/features/submission/submission.api";
import StudentInfoCard from "./StudentInfoCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import CommonBtn from "@/components/shared/CommonBtn";
import { Badge } from "@/components/ui/badge";

const MCQEvaluationView = ({ examId, submissionId }) => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const {
    data: submission,
    isLoading,
    isError,
    error,
  } = useGetSubmissionByIdQuery(submissionId);

  const [
    updateSubmission,
    { isLoading: isUpdating, isSuccess: updateSuccess, error: updateError },
  ] = useUpdateSubmissionMutation();

  const [evaluationData, setEvaluationData] = useState({
    totalMarks: 0,
    remarks: "",
    questionWiseMarks: {},
  });

  useEffect(() => {
    if (submission) {
      // Initialize evaluation data with existing marks if available
      if (submission.isEvaluated) {
        setEvaluationData({
          totalMarks: submission.totalMarks || 0,
          remarks: submission.remarks || "",
          questionWiseMarks: submission.questionWiseMarks || {},
        });
      } else {
        // Initialize with zero marks for each question
        const initialMarks = {};
        Object.keys(submission.answers || {}).forEach((questionId) => {
          Object.keys(submission.answers[questionId] || {}).forEach(
            (subQuestionId) => {
              initialMarks[`${questionId}-${subQuestionId}`] = 0;
            }
          );
        });

        setEvaluationData({
          totalMarks: 0,
          remarks: "",
          questionWiseMarks: initialMarks,
        });
      }
    }
  }, [submission]);

  const handleMarkChange = (questionKey, value) => {
    setEvaluationData((prev) => {
      const newQuestionWiseMarks = {
        ...prev.questionWiseMarks,
        [questionKey]: Number(value),
      };

      // Calculate total marks
      const total = Object.values(newQuestionWiseMarks).reduce(
        (sum, mark) => sum + (Number(mark) || 0),
        0
      );

      return {
        ...prev,
        questionWiseMarks: newQuestionWiseMarks,
        totalMarks: total,
      };
    });
  };

  const handleSubmitEvaluation = async () => {
    try {
      const payload = {
        isEvaluated: true,
        evaluatedBy: user._id,
        totalMarks: evaluationData.totalMarks,
        remarks: evaluationData.remarks,
        questionWiseMarks: evaluationData.questionWiseMarks,
      };

      await updateSubmission({
        id: submissionId,
        data: payload,
      }).unwrap();

      toast.success("MCQ submission evaluated successfully");
      router.back();
    } catch (err) {
      console.error("Failed to update submission:", err);
      toast.error("Failed to evaluate submission");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError || !submission) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error?.data?.message || "Error loading submission"}
          </AlertDescription>
        </Alert>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => router.push(`/exams/${examId}/submissions`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Submissions
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Submissions
        </Button>
        {submission.isEvaluated && (
          <span className="text-sm text-green-600 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Already Evaluated
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-8">
        {/* MCQ Answers Section */}
        <div className="w-full lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                MCQ Answers Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {submission.exam?.questionSet?.categories?.map(
                  (category, catIndex) => (
                    <div key={catIndex} className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        {category.name} Section
                      </h3>
                      {/* <Separator /> */}

                      {category.questions?.map((question, qIndex) => (
                        <div
                          key={qIndex}
                          className="space-y-4 p-4 border rounded-lg"
                        >
                          <div className="flex items-start gap-4">
                            <Badge variant="outline" className="mt-1">
                              Q{qIndex + 1}
                            </Badge>
                            <div className="flex-1 space-y-4">
                              {question.subQuestions?.map((subQ, subIndex) => {
                                const questionKey = `${question.id}-${subQ.questionId}`;
                                const studentAnswer =
                                  submission.answers[question.id]?.[
                                    subQ.questionId
                                  ];
                                const isCorrect =
                                  studentAnswer === subQ.correctAnswer;

                                return (
                                  <div key={subIndex} className="space-y-2">
                                    <div className="flex items-start gap-2">
                                      <span className="font-medium">
                                        {String.fromCharCode(97 + subIndex)})
                                      </span>
                                      <div className="flex-1">
                                        <p className="text-sm">
                                          {subQ.text || subQ.question}
                                        </p>

                                        <div className="mt-2 space-y-2">
                                          {subQ.options?.map(
                                            (option, optIndex) => (
                                              <div
                                                key={optIndex}
                                                className={`p-2 rounded border text-sm ${
                                                  option === studentAnswer
                                                    ? isCorrect
                                                      ? "border-green-500 bg-green-50"
                                                      : "border-red-500 bg-red-50"
                                                    : option ===
                                                      subQ.correctAnswer
                                                    ? "border-green-500 bg-green-50"
                                                    : "border-gray-200"
                                                }`}
                                              >
                                                <span className="font-bold mr-2">
                                                  {String.fromCharCode(
                                                    65 + optIndex
                                                  )}
                                                  .
                                                </span>
                                                {option}
                                                {option === studentAnswer &&
                                                  !isCorrect && (
                                                    <span className="ml-2 text-red-500 text-xs">
                                                      ✗ Student's answer
                                                    </span>
                                                  )}
                                                {option ===
                                                  subQ.correctAnswer && (
                                                  <span className="ml-2 text-green-500 text-xs">
                                                    ✓ Correct answer
                                                  </span>
                                                )}
                                              </div>
                                            )
                                          )}
                                        </div>

                                        {!submission.isEvaluated && (
                                          <div className="mt-3 flex items-center gap-3">
                                            <label className="text-sm font-medium">
                                              Marks:
                                            </label>
                                            <input
                                              type="number"
                                              min="0"
                                              max={subQ.points}
                                              value={
                                                evaluationData
                                                  .questionWiseMarks[
                                                  questionKey
                                                ] || 0
                                              }
                                              onChange={(e) =>
                                                handleMarkChange(
                                                  questionKey,
                                                  e.target.value
                                                )
                                              }
                                              className="w-20 border rounded px-2 py-1 text-sm"
                                              disabled={submission.isEvaluated}
                                            />
                                            <span className="text-sm text-gray-500">
                                              / {subQ.points}
                                            </span>
                                          </div>
                                        )}

                                        {submission.isEvaluated &&
                                          submission.questionWiseMarks && (
                                            <div className="mt-2 text-sm">
                                              <span className="font-medium">
                                                Marks:{" "}
                                                {submission.questionWiseMarks[
                                                  questionKey
                                                ] || 0}
                                              </span>
                                              <span className="text-gray-500 ml-2">
                                                / {subQ.points}
                                              </span>
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Marks:</span>
                  <span className="font-bold">
                    {submission.isEvaluated
                      ? submission.totalMarks
                      : evaluationData.totalMarks}
                    /{submission.exam?.questionSet?.totalPoints}
                  </span>
                </div>

                {!submission.isEvaluated && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Remarks:
                      </label>
                      <textarea
                        value={evaluationData.remarks}
                        onChange={(e) =>
                          setEvaluationData({
                            ...evaluationData,
                            remarks: e.target.value,
                          })
                        }
                        className="w-full border rounded p-2 text-sm min-h-[100px]"
                        placeholder="Add any remarks about this evaluation..."
                      />
                    </div>

                    <CommonBtn
                      onClick={handleSubmitEvaluation}
                      disabled={isUpdating}
                      className="w-full"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Evaluation"
                      )}
                    </CommonBtn>
                  </>
                )}

                {submission.isEvaluated && submission.remarks && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Evaluator's Remarks:
                    </label>
                    <div className="border rounded p-2 text-sm bg-gray-50">
                      {submission.remarks}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <StudentInfoCard submission={submission} />
        </div>
      </div>
    </div>
  );
};

export default MCQEvaluationView;
