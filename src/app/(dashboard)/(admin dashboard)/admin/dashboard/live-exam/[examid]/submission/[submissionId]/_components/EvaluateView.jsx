"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import {
  useGetSubmissionByIdQuery,
  useUpdateSubmissionMutation,
} from "@/redux/features/submission/submission.api";
import KonvaCanvas from "./KonvaCanvas";
import EvaluationForm from "./EvaluationForm";
import StudentInfoCard from "./StudentInfoCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

const EvaluateView = ({ examId, submissionId }) => {
  const router = useRouter();
  const [imageElements, setImageElements] = useState([]);
  const [hasDrawings, setHasDrawings] = useState([]);
  const canvasRefs = useRef([]);
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

  // Load all answer images (for written exams)
  useEffect(() => {
    if (
      submission?.type === "WRITTEN" &&
      submission?.answerImages?.length > 0
    ) {
      const loadImages = async () => {
        const elements = [];
        canvasRefs.current = submission.answerImages.map(() =>
          React.createRef()
        );

        const imagesToLoad =
          submission.evaluatedImages?.length > 0
            ? submission.evaluatedImages
            : submission.answerImages;

        for (const image of imagesToLoad) {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.src = `${process.env.NEXT_PUBLIC_API_URL}/${image}`;

          await new Promise((resolve) => {
            img.onload = () => {
              elements.push(img);
              resolve();
            };
            img.onerror = resolve;
          });
        }

        setImageElements(elements);
      };

      loadImages();
    }
  }, [submission]);

  const handleSubmitEvaluation = async (evaluationData) => {
    try {
      const formData = new FormData();

      // Append other evaluation data
      formData.append("isEvaluated", "true");
      formData.append("evaluatedBy", user._id);

      // Append additional fields if present in evaluationData
      Object.entries(evaluationData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Get all canvas data (including unmodified ones)
      const allDrawingsData = [];
      for (let i = 0; i < canvasRefs.current.length; i++) {
        const ref = canvasRefs.current[i];
        if (ref?.current) {
          const dataURL = ref.current.getDataURL();
          allDrawingsData.push({
            index: i,
            imageUrl: dataURL,
            hasDrawing: hasDrawings[i] || false,
          });
        }
      }

      // Convert all images to blobs and append
      allDrawingsData.forEach((drawing, index) => {
        if (drawing.imageUrl) {
          const base64Data = drawing.imageUrl.split(",")[1];
          const mimeType = drawing.imageUrl.match(/data:(.*);base64/)[1];

          const byteCharacters = atob(base64Data);
          const byteArrays = new Uint8Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays[i] = byteCharacters.charCodeAt(i);
          }

          const blob = new Blob([byteArrays], { type: mimeType });
          formData.append("images", blob, `image-${index}.png`);
        }
      });

      await updateSubmission({
        id: submissionId,
        data: formData,
      }).unwrap();

      toast.success("Submission evaluated successfully");
      router.back();
    } catch (err) {
      console.error("Failed to update submission:", err);
      toast.error(err?.data?.message || "Failed to update submission");
    }
  };

  const renderMCQEvaluation = () => {
    if (submission?.type !== "MCQ" || !submission.exam?.questionSet)
      return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            MCQ Evaluation Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {submission.exam.questionSet.categories?.map(
              (category, catIndex) => (
                <div key={catIndex} className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    {category.name} Section
                  </h3>

                  {/* Process referenced questions */}
                  {category.questions?.map((question, qIndex) => {
                    const studentAnswer = submission.answers?.[question._id];
                    const isCorrect = studentAnswer === question.correctAnswer;
                    const markObtained = isCorrect ? question.mark : 0;

                    return (
                      <div key={question._id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">
                            {qIndex + 1}. {question.questionText}
                          </p>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            {markObtained}/{question.mark} marks
                          </span>
                        </div>

                        <div className="mt-3 space-y-2">
                          {question.options?.map((option, optIndex) => {
                            let optionClass = "p-3 rounded border";
                            const isSelected = option === studentAnswer;
                            const isRightAnswer =
                              option === question.correctAnswer;

                            if (isRightAnswer) {
                              optionClass += " border-green-500 bg-green-50";
                            } else if (isSelected) {
                              optionClass += " border-red-500 bg-red-50";
                            } else {
                              optionClass += " border-gray-200";
                            }

                            return (
                              <div key={optIndex} className={optionClass}>
                                <div className="flex items-center">
                                  <span className="font-bold mr-3">
                                    {String.fromCharCode(65 + optIndex)}.
                                  </span>
                                  <span>{option}</span>
                                  {isRightAnswer && (
                                    <span className="ml-auto text-green-600">
                                      ✓ Correct Answer
                                    </span>
                                  )}
                                  {isSelected && !isRightAnswer && (
                                    <span className="ml-auto text-red-600">
                                      ✗ Student's Answer
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          <div className="mt-2 text-green">
                            <strong>Explanation:</strong> {question.explanation}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Process custom questions */}
                  {category.customQuestions?.map((question, qIndex) => {
                    const questionKey =
                      question._id?.toString() || question.questionText;
                    const studentAnswer = submission.answers?.[questionKey];
                    const isCorrect = studentAnswer === question.correctAnswer;
                    const markObtained = isCorrect ? question.mark : 0;

                    return (
                      <div key={questionKey} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">
                            {qIndex + 1 + (category.questions?.length || 0)}.{" "}
                            {question.questionText}
                          </p>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            {markObtained}/{question.mark} marks
                          </span>
                        </div>

                        <div className="mt-3 space-y-2">
                          {question.options?.map((option, optIndex) => {
                            let optionClass = "p-3 rounded border";
                            const isSelected = option === studentAnswer;
                            const isRightAnswer =
                              option === question.correctAnswer;

                            if (isRightAnswer) {
                              optionClass += " border-green-500 bg-green-50";
                            } else if (isSelected) {
                              optionClass += " border-red-500 bg-red-50";
                            } else {
                              optionClass += " border-gray-200";
                            }

                            return (
                              <div key={optIndex} className={optionClass}>
                                <div className="flex items-center">
                                  <span className="font-bold mr-3">
                                    {String.fromCharCode(65 + optIndex)}.
                                  </span>
                                  <span>{option}</span>
                                  {isRightAnswer && (
                                    <span className="ml-auto text-green-600">
                                      ✓ Correct Answer
                                    </span>
                                  )}
                                  {isSelected && !isRightAnswer && (
                                    <span className="ml-auto text-red-600">
                                      ✗ Student's Answer
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-lg">Total Score</h4>
                <div className="text-2xl font-bold">
                  {submission.totalMarks} /{" "}
                  {submission.exam.questionSet.categories.reduce(
                    (total, category) => {
                      const refQuestionsMarks = (
                        category.questions || []
                      ).reduce((sum, q) => sum + q.mark, 0);
                      const customQuestionsMarks = (
                        category.customQuestions || []
                      ).reduce((sum, q) => sum + q.mark, 0);
                      return total + refQuestionsMarks + customQuestionsMarks;
                    },
                    0
                  )}
                </div>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Grade:</span>
                <span className="font-medium">
                  {submission.grade || "Not graded"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderWrittenEvaluation = () => {
    if (submission?.type !== "WRITTEN") return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {submission.isEvaluated ? "Evaluated Answers" : "Student Answers"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-220px)]">
            {imageElements.length > 0 ? (
              <div className="space-y-6">
                {imageElements.map((img, i) => (
                  <div key={i} className="border rounded-lg p-2">
                    <KonvaCanvas
                      imageElement={img}
                      isEvaluated={submission.isEvaluated}
                      ref={canvasRefs.current[i]}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Page {i + 1} of {imageElements.length}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No answer sheets submitted
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    );
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
            {error?.data?.message || "Failed to load submission"}
          </AlertDescription>
        </Alert>
        <Button variant="ghost" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {submission.isEvaluated && (
          <span className="text-sm text-green-600 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            {submission.type === "MCQ" ? "Auto-evaluated" : "Evaluated"}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {submission.type === "MCQ"
            ? renderMCQEvaluation()
            : renderWrittenEvaluation()}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <StudentInfoCard submission={submission} />

          {submission.type === "WRITTEN" && !submission.isEvaluated && (
            <EvaluationForm
              submission={submission}
              isUpdating={isUpdating}
              updateError={updateError}
              updateSuccess={updateSuccess}
              onSubmitEvaluation={handleSubmitEvaluation}
            />
          )}

          {submission.isEvaluated && (
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Marks:</span>
                  <span className="font-medium">{submission.totalMarks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Grade:</span>
                  <span className="font-medium">{submission.grade}</span>
                </div>
                {submission.feedback && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Feedback:</p>
                    <p className="text-sm text-gray-600">
                      {submission.feedback}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluateView;
