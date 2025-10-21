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
import CommonBtn from "@/components/shared/CommonBtn";
import { ScrollArea } from "@/components/ui/scroll-area";
import MentorMCQReviewComponent from "./MentorMCQReviewComponent";

const EvaluateView = ({ examId, submissionId, isStudent = false }) => {
  const router = useRouter();
  const [imageElements, setImageElements] = useState([]);
  const [hasDrawings, setHasDrawings] = useState([]);
  const [drawingsData, setDrawingsData] = useState([]);
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

  // Load all images
  useEffect(() => {
    if (submission?.answerImages?.length > 0) {
      const loadAllImages = async () => {
        const elements = [];

        // Initialize refs array
        canvasRefs.current = submission.answerImages.map(() =>
          React.createRef()
        );
        setHasDrawings(submission.answerImages.map(() => false));

        for (const image of submission.evaluatedImages.length > 0
          ? submission.evaluatedImages
          : submission.answerImages) {
          const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${image}`;
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.src = imageUrl;

          await new Promise((resolve, reject) => {
            img.onload = () => {
              elements.push(img);
              resolve();
            };
            img.onerror = reject;
          });
        }

        setImageElements(elements);
      };

      loadAllImages();
    }
  }, [submission]);

  const handleDrawingChange = (index, hasDrawing) => {
    setHasDrawings((prev) => {
      const newHasDrawings = [...prev];
      newHasDrawings[index] = hasDrawing;
      return newHasDrawings;
    });
  };

  const handleSaveAllDrawings = async () => {
    const newDrawingsData = [];

    for (let i = 0; i < canvasRefs.current.length; i++) {
      const ref = canvasRefs.current[i];
      if (ref?.current) {
        const dataURL = ref.current.getDataURL();
        if (dataURL) {
          newDrawingsData.push({
            index: i,
            imageUrl: dataURL,
            hasDrawing: hasDrawings[i] || false,
          });
        }
      }
    }
    setDrawingsData(newDrawingsData);

    toast.success("All images saved successfully");
  };

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
      toast.error("Failed to update submission");
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
      {!isStudent && (
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
      )}

      <div
        className={`grid grid-cols-1 ${
          isStudent ? "lg:grid-cols-2" : "lg:grid-cols-3"
        } w-full gap-8`}
      >
        {/* Answer Images Section */}

        <div className="w-full lg:col-span-2 space-y-6">
          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Submitted Answer Sheets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submission.exam.type === "WRITTEN" ? (
                <ScrollArea
                  className={` ${
                    isStudent ? "h-full" : "h-[calc(100vh-160px)]"
                  }  w-full`}
                >
                  {imageElements.length > 0 ? (
                    <div className="space-y-8">
                      {imageElements.map((img, i) => (
                        <div
                          key={i}
                          className="space-y-2 border p-2 rounded-md"
                        >
                          <KonvaCanvas
                            imageElement={img}
                            isEvaluated={submission.isEvaluated}
                            onDrawingChange={(hasDrawing) =>
                              handleDrawingChange(i, hasDrawing)
                            }
                            ref={canvasRefs.current[i]}
                            isStudent={isStudent ? true : undefined}
                          />
                        </div>
                      ))}

                      {!submission.isEvaluated && !isStudent && (
                        <div className="text-center pt-2">
                          <CommonBtn
                            onClick={handleSaveAllDrawings}
                            disabled={
                              !hasDrawings.some((hasDrawing) => hasDrawing)
                            }
                            className="bg-white border border-main"
                          >
                            {isUpdating ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Markings"
                            )}
                          </CommonBtn>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No answer files submitted.</p>
                  )}
                </ScrollArea>
              ) : (
                <div className="">
                  <MentorMCQReviewComponent
                    examId={submission.exam._id}
                    studentId={submission.student._id}
                    answers={submission.answers}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Sidebar */}
        <div className="space-y-6">
          {!isStudent && (
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Form</CardTitle>
              </CardHeader>
              <CardContent>
                <EvaluationForm
                  submission={submission}
                  isUpdating={isUpdating}
                  updateError={updateError}
                  updateSuccess={updateSuccess}
                  onSubmitEvaluation={handleSubmitEvaluation}
                />
              </CardContent>
            </Card>
          )}

          <StudentInfoCard submission={submission} />
        </div>
      </div>
    </div>
  );
};

export default EvaluateView;
