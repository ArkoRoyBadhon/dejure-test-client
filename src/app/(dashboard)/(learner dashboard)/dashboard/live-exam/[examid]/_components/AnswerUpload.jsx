"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCreateSubmissionMutation } from "@/redux/features/submission/submission.api";
import { Upload, Trash2, CloudUpload, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function AnswerUploadComponent({ examData }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [examStatus, setExamStatus] = useState("upcoming");
  const [createSubmission, { isLoading }] = useCreateSubmissionMutation();
  const [autoSubmitting, setAutoSubmitting] = useState(false);

  // 5 minutes grace period in milliseconds
  const GRACE_PERIOD = 5 * 60 * 1000;

  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const warningShownRef = useRef(false);
  const gracePeriodWarningShownRef = useRef(false);
  const autoSubmitAttemptedRef = useRef(false);
  const timerRef = useRef(null);

  // Helper function to create proper Date object from exam data
  const formatExamDateTime = (dateStr, timeStr) => {
    const [year, month, day] = dateStr?.split("-");
    const [hours, minutes] = timeStr?.split(":");
    return new Date(year, month - 1, day, hours, minutes);
  };

  // Timer effect
  useEffect(() => {
    if (
      !examData?.scheduledDate ||
      !examData?.scheduledTime ||
      !examData?.durationMinutes
    ) {
      return;
    }

    const calculateTime = () => {
      const scheduledDateTime = formatExamDateTime(
        examData.scheduledDate,
        examData.scheduledTime
      );
      const examEndTime = new Date(
        scheduledDateTime.getTime() + examData.durationMinutes * 60000
      );
      const gracePeriodEndTime = new Date(examEndTime.getTime() + GRACE_PERIOD);
      const now = new Date();

      if (now < scheduledDateTime) {
        // Exam hasn't started yet
        const diff = scheduledDateTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining({ hours, minutes, seconds });
        setExamStatus("upcoming");
        warningShownRef.current = false;
        gracePeriodWarningShownRef.current = false;
        autoSubmitAttemptedRef.current = false;
        return;
      }

      if (now < examEndTime) {
        // Exam is ongoing
        const diff = examEndTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining({ hours, minutes, seconds });
        setExamStatus("ongoing");

        // Show warning when 1 minute left
        if (diff <= 60000 && !warningShownRef.current) {
          toast.warning("1 minute remaining! Answers will auto-submit soon.");
          warningShownRef.current = true;
        }
        return;
      }

      if (now < gracePeriodEndTime) {
        // Grace period is active
        const diff = gracePeriodEndTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining({ hours, minutes, seconds });
        setExamStatus("grace-period");

        // Show grace period warning once
        if (!gracePeriodWarningShownRef.current) {
          toast.warning(
            "Exam time ended! You have 5 minutes grace period to submit your answers."
          );
          gracePeriodWarningShownRef.current = true;
        }
        return;
      }

      // Grace period has ended
      setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
      setExamStatus("ended");
      warningShownRef.current = false;
      gracePeriodWarningShownRef.current = false;
    };

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    calculateTime();
    timerRef.current = setInterval(calculateTime, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [examData]);

  // Auto-submit when grace period ends
  useEffect(() => {
    if (
      examStatus === "ended" &&
      uploadedFiles.length > 0 &&
      !autoSubmitAttemptedRef.current
    ) {
      autoSubmitAttemptedRef.current = true;
      handleAutoSubmit();
    }
  }, [examStatus, uploadedFiles.length]);

  const handleFileUpload = (event) => {
    if (examStatus !== "ongoing" && examStatus !== "grace-period") return;

    const files = event.target?.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      name: file?.name || "Untitled",
      file: file,
      preview: file?.type?.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
      type: file?.type || "application/octet-stream",
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles].slice(0, 10));
  };

  const removeFile = (id) => {
    const fileToRemove = uploadedFiles.find((file) => file.id === id);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleAutoSubmit = async () => {
    if (uploadedFiles.length === 0 || examStatus !== "ended") return;

    setAutoSubmitting(true);
    toast.info("Auto-submitting your answers...");

    try {
      const formData = new FormData();
      formData.append("exam", examData._id);
      formData.append("student", user?._id);
      formData.append("type", "WRITTEN");
      formData.append("isEvaluated", "false");

      uploadedFiles.forEach((file) => {
        formData.append("images", file.file);
      });

      await createSubmission(formData).unwrap();
      setUploadedFiles([]);
      toast.success("Answers auto-submitted successfully!");
      router.refresh();
    } catch (err) {
      console.error("Auto-submission failed:", err);
      toast.error("Auto-submission failed! Please contact support.");
    } finally {
      setAutoSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (
      uploadedFiles.length === 0 ||
      (examStatus !== "ongoing" && examStatus !== "grace-period")
    )
      return;

    try {
      const formData = new FormData();
      formData.append("exam", examData._id);
      formData.append("student", user?._id);
      formData.append("type", "WRITTEN");
      formData.append("isEvaluated", "false");

      uploadedFiles.forEach((file) => {
        formData.append("images", file.file);
      });

      await createSubmission(formData).unwrap();
      setUploadedFiles([]);
      toast.success("Submission successful!");
      router.refresh();
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Submission failed! Please try again.");
    }
  };

  // Formatting functions
  const formatTime = (time) => time.toString().padStart(2, "0");
  const formatDisplayDate = (date) => {
    return date.toLocaleString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isTimeRunningOut =
    (examStatus === "ongoing" || examStatus === "grace-period") &&
    timeRemaining.hours === 0 &&
    timeRemaining.minutes < 5;

  const isDisabled =
    examStatus === "upcoming" || examStatus === "ended" || autoSubmitting;

  return (
    <div className="">
      <Card className="rounded-[16px] overflow-hidden mt-8 bg-white p-0">
        <CardHeader className="text-center bg-gray-200 p-4">
          <div className="flex items-center justify-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              উত্তর পত্র আপলোড করুন
            </h1>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Exam status message */}
          {examStatus === "upcoming" && (
            <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
              পরীক্ষা এখনো শুরু হয়নি। পরীক্ষা শুরু হবে:{" "}
              {formatDisplayDate(
                formatExamDateTime(
                  examData?.scheduledDate,
                  examData?.scheduledTime
                )
              )}
            </div>
          )}
          {examStatus === "grace-period" && (
            <div className="mb-4 p-4 bg-orange-100 text-orange-800 rounded-lg">
              পরীক্ষার সময় শেষ হয়েছে। জমা দেওয়ার জন্য আপনার ৫ মিনিট অতিরিক্ত
              সময় আছে।
            </div>
          )}
          {examStatus === "ended" && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
              {uploadedFiles.length > 0
                ? "সময় শেষ! আপনার উত্তরপত্র স্বয়ংক্রিয়ভাবে জমা দেওয়া হচ্ছে..."
                : "সময় শেষ হয়ে গেছে। উত্তর জমা দেওয়া বন্ধ করা হয়েছে।"}
            </div>
          )}

          <div className="mb-8">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                isDisabled
                  ? "border-gray-300 bg-gray-100"
                  : "border-blue-300 bg-white hover:bg-blue-50"
              }`}
            >
              <label
                htmlFor="file-upload"
                className={`cursor-pointer flex flex-col items-center justify-center gap-4 ${
                  isDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <CloudUpload className="w-16 h-16 text-blue-400" />
                <div className="space-y-2">
                  <p className="text-[16px] text-gray-800">
                    উত্তর পত্র আপলোড করুন
                  </p>
                  <p className="text-sm text-gray-500">
                    ছবি বা PDF ফাইল আপলোড করুন (সর্বোচ্চ ১০টি ফাইল আপলোড করতে
                    পারবেন)
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg transition-colors duration-200 ${
                    isDisabled
                      ? "bg-gray-400 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  ফাইল সিলেক্ট করুন
                </span>
              </label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={isDisabled || uploadedFiles.length >= 10}
                key={uploadedFiles.length}
              />
            </div>
          </div>

          {/* File Preview Grid */}
          {uploadedFiles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-700 mb-4">
                আপলোড করা ফাইল ({uploadedFiles.length}/10)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="w-full aspect-[3/4] relative group"
                  >
                    <div className="relative h-full border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                      {file.type.startsWith("image/") ? (
                        <>
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-full h-full object-cover"
                            onLoad={() => URL.revokeObjectURL(file.preview)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-2">
                          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-2">
                            <FileText className="w-6 h-6 text-red-500" />
                          </div>
                          <p className="text-xs text-gray-600 text-center px-1 line-clamp-2">
                            {file.name.replace(/\.[^/.]+$/, "")}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-1">
                            PDF
                          </span>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded flex items-center transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        disabled={isDisabled}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div
        className={`p-4 mt-8 rounded-[16px] ${
          isTimeRunningOut
            ? "bg-red-100"
            : examStatus === "ended"
            ? "bg-gray-200"
            : examStatus === "grace-period"
            ? "bg-orange-100"
            : "bg-blue-100"
        }`}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div
            className={`font-medium ${
              isTimeRunningOut
                ? "text-red-700"
                : examStatus === "ended"
                ? "text-gray-700"
                : examStatus === "grace-period"
                ? "text-orange-700"
                : "text-blue-800"
            }`}
          >
            {examStatus === "upcoming"
              ? "পরীক্ষা শুরু হতে বাকি: "
              : examStatus === "ended"
              ? "পরীক্ষা শেষ হয়েছে: "
              : examStatus === "grace-period"
              ? "অতিরিক্ত সময় বাকি: "
              : isTimeRunningOut
              ? "সময় শেষ হচ্ছে: "
              : "সময় বাকি: "}
            {formatTime(timeRemaining.hours)} ঘন্টা{" "}
            {formatTime(timeRemaining.minutes)} মিনিট{" "}
            {formatTime(timeRemaining.seconds)} সেকেন্ড
          </div>
          <Button
            className={`${
              isTimeRunningOut
                ? "bg-red-500 hover:bg-red-600 text-white"
                : examStatus === "ended"
                ? "bg-gray-500 text-white"
                : examStatus === "grace-period"
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } font-semibold px-8 py-2 w-full md:w-auto lg:w-[336px]`}
            disabled={
              isDisabled ||
              uploadedFiles.length === 0 ||
              isLoading ||
              autoSubmitting
            }
            onClick={handleSubmit}
          >
            {autoSubmitting
              ? "স্বয়ংক্রিয়ভাবে জমা হচ্ছে..."
              : isLoading
              ? "জমা হচ্ছে..."
              : examStatus === "ended"
              ? "সময় শেষ"
              : examStatus === "grace-period"
              ? "জমা দিন (অতিরিক্ত সময়)"
              : "জমা দিন"}
          </Button>
        </div>
      </div>
    </div>
  );
}
