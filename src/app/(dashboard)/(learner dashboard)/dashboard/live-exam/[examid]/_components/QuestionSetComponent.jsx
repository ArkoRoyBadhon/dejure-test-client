"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import {
  useCheckExamForStudentQuery,
  useGetExamResultsForStudentQuery,
} from "@/redux/features/liveexams/liveExam.Api";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useCreateSubmissionMutation } from "@/redux/features/submission/submission.api";
import AnswerUploadComponent from "./AnswerUpload";
import { Zap } from "lucide-react";

// Import the new hook for starting anytime exams
import { useStartAnytimeExamMutation } from "@/redux/features/liveexams/liveExam.Api";

export default function QuiestionSetComponent({ examData }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(null);
  const [isExamEnded, setIsExamEnded] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [examStartTime, setExamStartTime] = useState(null);
  const [examAttemptId, setExamAttemptId] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);

  const { data: submissionData, refetch } = useCheckExamForStudentQuery(
    examData?._id,
    { skip: !examData?._id }
  );
  const user = useSelector((state) => state.auth.user);
  const [createSubmission, { isLoading: isSubmitting }] =
    useCreateSubmissionMutation();
  const warningShownRef = useRef(false);
  const examTimerRef = useRef(null);

  // Add the mutation hook for starting anytime exams
  const [startAnytimeExamMutation, { isLoading: isStartingExam }] =
    useStartAnytimeExamMutation();

  const { data: examResultData } = useGetExamResultsForStudentQuery(
    { examId: examData?._id },
    { skip: !examData?._id }
  );

  // Check if exam is in anytime mode
  const isAnytimeMode = examData?.mode === "anytime";

  // Calculate total duration text
  const totalExamDurationMinutes = examData?.durationMinutes || 0;
  const hours = Math.floor(totalExamDurationMinutes / 60);
  const minutes = totalExamDurationMinutes % 60;
  const durationText = `${hours > 0 ? `${hours} ঘন্টা` : ""} ${
    minutes > 0 ? `${minutes} মিনিট` : ""
  }`.trim();

  // Initialize selected answers if already submitted
  useEffect(() => {
    if (submissionData?.isSubmitted && examData?.submissions && user?._id) {
      const studentSubmission = examData.submissions.find(
        (sub) => sub.student === user._id
      );
      if (studentSubmission?.answers) {
        setSelectedAnswers(studentSubmission.answers);
      }
    }
  }, [submissionData, examData, user]);

  // Check if there's an existing active attempt for anytime mode
  useEffect(() => {
    const checkExistingAttempt = async () => {
      if (
        isAnytimeMode &&
        examData?._id &&
        user?._id &&
        !submissionData?.isSubmitted
      ) {
        try {
          // Check if there's an active attempt in the exam data
          if (examData.attempts && examData.attempts.length > 0) {
            const activeAttempt = examData.attempts.find(
              (attempt) =>
                attempt.student.toString() === user._id &&
                attempt.status === "in-progress"
            );

            if (activeAttempt) {
              setIsExamStarted(true);
              setExamAttemptId(activeAttempt._id);
              setExamStartTime(new Date(activeAttempt.startTime));

              // Start the timer for the existing attempt
              startExamTimer(new Date(activeAttempt.startTime));
            }
          }
        } catch (error) {
          console.error("Error checking existing attempt:", error);
        }
      }
    };

    checkExistingAttempt();
  }, [examData, isAnytimeMode, user, submissionData, totalExamDurationMinutes]);

  // Auto-submit logic for MCQ exams
  useEffect(() => {
    if (
      isExamEnded &&
      !submissionData?.isSubmitted &&
      examData?.type === "MCQ" &&
      Object.keys(selectedAnswers).length > 0
    ) {
      handleSubmit();
    }
  }, [
    isExamEnded,
    submissionData?.isSubmitted,
    examData?.type,
    selectedAnswers,
  ]);

  // Function to start the exam timer
  const startExamTimer = (startTime) => {
    if (examTimerRef.current) {
      clearInterval(examTimerRef.current);
    }

    const startCountdown = () => {
      const now = new Date();
      const examEndTime = new Date(
        startTime.getTime() + totalExamDurationMinutes * 60000
      );

      const diff = examEndTime - now;

      if (diff <= 0) {
        setIsExamEnded(true);
        return { hours: 0, minutes: 0, seconds: 0, type: "ended" };
      }

      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

      if (diff <= 60000 && !warningShownRef.current) {
        toast.warning("1 minute remaining! Answers will auto-submit soon.");
        warningShownRef.current = true;
      }

      return {
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: secondsLeft,
        type: "remaining",
      };
    };

    const initialTime = startCountdown();
    setRemainingTime(initialTime);

    examTimerRef.current = setInterval(() => {
      const newTime = startCountdown();
      setRemainingTime(newTime);

      if (newTime.type === "ended") {
        clearInterval(examTimerRef.current);
        setIsExamEnded(true);
      }
    }, 1000);
  };

  // Start exam function for anytime mode
  const startAnytimeExam = async () => {
    if (isAnytimeMode && !isExamStarted && !submissionData?.isSubmitted) {
      try {
        // Call the API to start the exam
        const result = await startAnytimeExamMutation(examData._id).unwrap();

        setIsExamStarted(true);
        const startTime = new Date();
        setExamStartTime(startTime);
        setExamAttemptId(result.attemptId);
        setSubmissionId(result.submissionId);

        toast.info(
          "Exam timer started! You have " +
            durationText +
            " to complete the exam."
        );

        // Start the timer
        startExamTimer(startTime);
      } catch (error) {
        setIsExamStarted(false);
        toast.error(error.data?.message || "Failed to start exam");
        console.error("Error starting exam:", error);
      }
    }
  };

  // Timer logic for scheduled mode
  useEffect(() => {
    if (submissionData?.isSubmitted) {
      setIsExamEnded(true);
      setIsExamStarted(false);
      if (examTimerRef.current) {
        clearInterval(examTimerRef.current);
      }
      return;
    }

    // Don't run scheduled mode logic for anytime exams
    if (isAnytimeMode) {
      return;
    }

    // For scheduled mode - original timer logic
    if (
      !examData?.scheduledDate ||
      !examData?.scheduledTime ||
      !examData?.durationMinutes
    ) {
      setIsExamEnded(true);
      setIsExamStarted(false);
      return;
    }

    const calculateTimeStates = () => {
      const examScheduledDateTime = new Date(
        `${examData.scheduledDate}T${examData.scheduledTime}:00`
      );
      const examEndTime = new Date(
        examScheduledDateTime.getTime() + examData.durationMinutes * 60000
      );
      const now = new Date();

      if (now < examScheduledDateTime) {
        setIsExamStarted(false);
        setIsExamEnded(false);
        warningShownRef.current = false;
        const diffUntilStart = examScheduledDateTime - now;
        return {
          hours: Math.floor(
            (diffUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor(
            (diffUntilStart % (1000 * 60 * 60)) / (1000 * 60)
          ),
          seconds: Math.floor((diffUntilStart % (1000 * 60)) / 1000),
          type: "until_start",
        };
      }

      setIsExamStarted(true);

      if (now >= examEndTime) {
        setIsExamEnded(true);
        warningShownRef.current = false;
        return { hours: 0, minutes: 0, seconds: 0, type: "ended" };
      }

      const diff = examEndTime - now;
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

      if (diff <= 60000 && !warningShownRef.current) {
        toast.warning("1 minute remaining! Answers will auto-submit soon.");
        warningShownRef.current = true;
      }

      return {
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: secondsLeft,
        type: "remaining",
      };
    };

    const initialTime = calculateTimeStates();
    setRemainingTime(initialTime);

    const timer = setInterval(() => {
      const newTime = calculateTimeStates();
      setRemainingTime(newTime);

      if (
        newTime.type === "ended" ||
        (newTime.type === "until_start" &&
          newTime.hours === 0 &&
          newTime.minutes === 0 &&
          newTime.seconds === 0)
      ) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [
    examData,
    submissionData?.isSubmitted,
    isAnytimeMode,
    totalExamDurationMinutes,
    isExamStarted,
  ]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (examTimerRef.current) {
        clearInterval(examTimerRef.current);
      }
    };
  }, []);

  const handleOptionSelect = (questionId, option) => {
    if (submissionData?.isSubmitted || isExamEnded) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    if (!isExamStarted) {
      toast.error("The exam is not available for submission.");
      return;
    }
    if (submissionData?.isSubmitted) {
      toast.info("You have already submitted your answers.");
      return;
    }
    if (examData?.type !== "MCQ") {
      toast.error(
        "This is a WRITTEN exam. Answers cannot be submitted this way."
      );
      return;
    }

    const payload = {
      exam: examData._id,
      student: user._id,
      answers: selectedAnswers,
      type: "MCQ",
      isEvaluated: true,
      evaluatedBy: "system",
    };

    try {
      await createSubmission(payload).unwrap();
      toast.success("Answers submitted successfully!");
      refetch();
      setIsExamEnded(true);

      // Clear the timer
      if (examTimerRef.current) {
        clearInterval(examTimerRef.current);
      }
    } catch (err) {
      toast.error("Failed to submit answers!");
      console.error("Submission error:", err);
    }
  };

  const renderMCQOptions = (question) => {
    if (question.type !== "MCQ" || !question.options) return null;

    const isSubmitted = submissionData?.isSubmitted;
    const studentSelectedAnswer = selectedAnswers[question._id];
    const questionResult = examResultData?.examDetails?.questions?.find(
      (q) => q.questionId === question._id
    );
    const correctAnswer = questionResult?.correctAnswer;
    const mark = questionResult?.mark;

    return (
      <div className="mt-2 space-y-2">
        {question.options?.map((option, i) => {
          const isSelectedByStudent = studentSelectedAnswer === option;
          const isCorrectAnswer = option === correctAnswer;

          let optionClass = "p-2 rounded border ";
          if (!isSubmitted) {
            optionClass += isSelectedByStudent
              ? "border-blue-500 bg-blue-50 cursor-pointer"
              : "border-gray-200 hover:border-blue-300 cursor-pointer";
          } else {
            if (isCorrectAnswer) {
              optionClass += "border-green-500 bg-green-50";
            } else if (isSelectedByStudent && !isCorrectAnswer) {
              optionClass += "border-red-500 bg-red-50";
            } else {
              optionClass += "border-gray-200";
            }
            optionClass += " cursor-default";
          }

          return (
            <div
              key={i}
              className={`${optionClass} relative`}
              onClick={() =>
                !isSubmitted &&
                !isExamEnded &&
                handleOptionSelect(question._id, option)
              }
            >
              <span className="font-bold mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {option}
              {isSubmitted && (
                <>
                  {isSelectedByStudent && !isCorrectAnswer && (
                    <span className="ml-2 text-red-500">✗ Your answer</span>
                  )}
                  {isCorrectAnswer && (
                    <span className="ml-2 text-green-500">
                      ✓ Correct answer
                    </span>
                  )}
                </>
              )}
              {isSubmitted && isCorrectAnswer && mark != null && (
                <span className="absolute right-2 top-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                  {mark} mark
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderQuestionContent = (question) => {
    if (examData?.type === "MCQ") {
      return (
        <>
          {renderMCQOptions(question)}
          {submissionData && submissionData?.isSubmitted && (
            <div className="mt-2 border rounded-[16px] p-4 bg-blue/10">
              explantion{question?.explanation}
            </div>
          )}
        </>
      );
    } else if (examData?.type === "WRITTEN") {
      return (
        <div className="">
          {question.subQuestions?.map((subQ, subIndex) => (
            <div key={subIndex} className="mb-4 flex justify-between ">
              <p className="font-medium w-[calc(100%-100px)]">
                {String.fromCharCode(97 + subIndex)}) {subQ.subQuestionText}
              </p>
              <div className="mt-2 ">
                <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs w-[200px]">
                  {subQ.mark} নম্বর
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render different content based on exam mode and status
  if (!isExamStarted && remainingTime?.type === "until_start") {
    return (
      <div className="p-4">
        <Card className="mb-6 p-0">
          <CardHeader className="bg-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/icons/DJA logo Transperant-01 2.png"
                  alt="DJA Logo"
                  width={63}
                  height={40}
                />
              </div>
              <Button className="bg-gray-500/20 border border-gray-500 text-gray-800 rounded-[16px] px-4 py-1 text-sm font-bold">
                NOT STARTED
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <h1 className="text-[32px] font-bold text-gray-800 mb-4">
                Exam Not Started Yet
              </h1>
              <p className="text-lg mb-6">
                The exam will begin on {examData.scheduledDate} at{" "}
                {examData.scheduledTime}
              </p>
              <div className="bg-blue-100 p-4 rounded-lg inline-block">
                <h3 className="text-lg font-semibold mb-2">
                  Time until exam starts:
                </h3>
                <div className="flex justify-center gap-4 text-2xl font-bold">
                  <span>{String(remainingTime.hours).padStart(2, "0")}h</span>
                  <span>{String(remainingTime.minutes).padStart(2, "0")}m</span>
                  <span>{String(remainingTime.seconds).padStart(2, "0")}s</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (examData?.status === "cancelled") {
    return (
      <div className="p-4">
        <Card className="mb-6 p-0">
          <CardHeader className="bg-red-200 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/icons/DJA logo Transperant-01 2.png"
                  alt="DJA Logo"
                  width={63}
                  height={40}
                />
              </div>
              <Button className="bg-red-500/20 border border-red-500 text-red-800 rounded-[16px] px-4 py-1 text-sm font-bold">
                CANCELLED
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <h1 className="text-[32px] font-bold text-red-800 mb-4">
                Exam Cancelled
              </h1>
              <p className="text-lg mb-6">
                This exam has been cancelled by the administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render start button for anytime mode before exam starts
  if (isAnytimeMode && !isExamStarted && !submissionData?.isSubmitted) {
    return (
      <div className="p-4">
        <Card className="mb-6 p-0">
          <CardHeader className="bg-purple-200 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/icons/DJA logo Transperant-01 2.png"
                  alt="DJA Logo"
                  width={63}
                  height={40}
                />
                <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Anytime Exam</span>
                </div>
              </div>
              <Button className="bg-purple-500/20 border border-purple-500 text-purple-800 rounded-[16px] px-4 py-1 text-sm font-bold">
                READY TO START
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <h1 className="text-[32px] font-bold text-purple-800 mb-4">
                Anytime Exam Available
              </h1>
              <p className="text-lg mb-6">
                This exam is available anytime. You have {durationText} to
                complete it once you start.
              </p>
              <div className="bg-purple-100 p-6 rounded-lg inline-block">
                <h3 className="text-lg font-semibold mb-4">
                  Exam Duration: {durationText}
                </h3>
                <Button
                  onClick={startAnytimeExam}
                  disabled={isStartingExam}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg font-bold disabled:bg-purple-400"
                >
                  {isStartingExam ? "Starting..." : "Start Exam Now"}
                </Button>
                <p className="text-sm text-purple-700 mt-4">
                  Timer will start immediately when you click "Start Exam Now"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="mb-6 p-0">
        <CardHeader className="bg-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/DJA logo Transperant-01 2.png"
                alt="DJA Logo"
                width={63}
                height={40}
              />
              {isAnytimeMode && (
                <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Anytime Exam</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              {!submissionData?.isSubmitted &&
                remainingTime?.type === "remaining" && (
                  <div className="bg-red-500/20 border border-red-500 text-red-600 rounded-[16px] px-4 py-1 text-sm font-bold flex items-center gap-2">
                    <span>সময় বাকি:</span>
                    <span>
                      {String(remainingTime.hours).padStart(2, "0")}:
                      {String(remainingTime.minutes).padStart(2, "0")}:
                      {String(remainingTime.seconds).padStart(2, "0")}
                    </span>
                  </div>
                )}
              <Button
                className={`rounded-[16px] px-4 py-1 text-sm font-bold ${
                  submissionData?.isSubmitted
                    ? "bg-gray-500/20 border border-gray-500 text-gray-600"
                    : "bg-green-500/20 border border-green-500 text-green-700"
                }`}
              >
                {submissionData?.isSubmitted ? "SUBMITTED" : "LIVE NOW"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <h2 className="text-[20px] font-bold text-gray-800 leading-[150%] mb-2">
              {examData?.title || "ডি জুির একােডিম"}
            </h2>
            <h1 className="text-[40px] leading-[150%] font-bold mb-2">
              {examData?.questionSet?.name || "Exam"}
            </h1>
            <div className="flex justify-center gap-8 font-bold text-sm text-gray-800">
              <span>
                পূর্ণমান- {examData?.questionSet?.totalPoints || "১০০"}
              </span>
              <span>সময়: {durationText || "২ ঘন্টা"}</span>
            </div>
          </div>
          <div className="">
            <p className="text-center text-[16px] text-[#74767C] font-bold">
              {examData?.questionSet?.categories
                ?.map((cat) => `'${cat.name}' অংশ থেকে ${cat.minQuestions} `)
                .join(" এবং ")}
              করে মোট {examData?.questionSet?.totalQuestions} প্রশ্নের উত্তর
              দিতে হবে
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-4 text-[16px] mb-4">
            <div className="flex">
              <p className="">
                <span className="text-[#74767C]">মডিউল</span>{" "}
                <span className="font-bold ml-2">
                  {examData?.courses?.[0]?.title || "অপরাধ সংক্রন্ত আইন"}
                </span>
              </p>
            </div>
            <div className="flex">
              <p className="">
                <span className="text-[#74767C]">সাবজেক্ট</span>{" "}
                <span className="font-bold ml-2">
                  {examData?.questionSet?.subject[0]?.name || "পেনাল কোড"}
                </span>
              </p>
            </div>
            <div className="flex">
              <p className="">
                <span className="text-[#74767C]">টাইপ</span>{" "}
                <span className="font-bold ml-2">
                  {examData?.type || "WRITTEN"}
                </span>
              </p>
            </div>
            <div className="flex">
              <p className="">
                <span className="text-[#74767C]">মোড</span>{" "}
                <span className="font-bold ml-2">
                  {isAnytimeMode ? "Anytime" : "Scheduled"}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {(isExamStarted || submissionData?.isSubmitted) && (
        <>
          {examData?.questionSet?.categories?.map((category, catIndex) => (
            <Card
              key={catIndex}
              className="bg-white overflow-hidden p-0 rounded-[16px] mt-8"
            >
              <CardHeader className="text-center bg-gray-200 p-4">
                <h1 className="text-[20px] font-bold text-gray-800">
                  {category.name} অংশ: {category.condition}
                </h1>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {category.questions?.map((question, qIndex) => (
                  <div key={question._id} className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          {qIndex + 1}.
                        </span>
                      </div>
                      <div className="flex-1">
                        <div
                          className={`flex justify-between ${
                            question.questionText ? "mb-" : "hidden"
                          }`}
                        >
                          <p className="text-gray-800 font-medium mb-2">
                            {question.questionText}
                          </p>
                          {question.subQuestions?.length <= 0 && (
                            <p className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs h-fit">
                              {question.mark} নম্বর
                            </p>
                          )}
                        </div>
                        {renderQuestionContent(question)}
                      </div>
                    </div>
                  </div>
                ))}

                {category.customQuestions?.map((question, qIndex) => (
                  <div key={`custom-${qIndex}`} className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          {qIndex + 1 + (category.questions?.length || 0)}.
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-gray-800 font-medium mb-2">
                            {question.questionText}
                          </p>
                          {question.subQuestions?.length <= 0 && (
                            <p className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs h-fit">
                              {question.mark} নম্বর
                            </p>
                          )}
                        </div>
                        {renderQuestionContent(question)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {submissionData?.isSubmitted && (
        <Card className="bg-white overflow-hidden p-0 rounded-[16px] mt-8">
          <CardHeader className="text-center bg-gray-200 p-4">
            <h1 className="text-[20px] font-bold text-gray-800">
              আপনার উত্তর সফলভাবে জমা দেওয়া হয়েছে
            </h1>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <p className="text-lg mb-4">
                আপনি ইতিমধ্যে এই পরীক্ষার জন্য আপনার উত্তর জমা দিয়েছেন।
              </p>
              {submissionData?.submission?.totalMarks != null && (
                <div className="bg-blue-100 p-4 rounded-lg inline-block">
                  <p className="text-blue-800 font-semibold text-lg">
                    प्राप्त नম্বর: {submissionData.submission.totalMarks} /{" "}
                    {examData?.questionSet?.totalPoints || "N/A"}
                  </p>
                </div>
              )}
            </div>

            {examData?.type === "WRITTEN" &&
              submissionData?.submission?.answerImages?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    জমা দেওয়া উত্তরপত্র:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {submissionData.submission.answerImages?.map(
                      (image, index) => (
                        <div
                          key={index}
                          className="border rounded-lg overflow-hidden flex flex-col"
                        >
                          <div className="relative h-64 w-full">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_URL}/${image}`}
                              alt={`Submitted answer ${index + 1}`}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          <div className="p-2 bg-gray-100 text-center">
                            <p className="text-sm">পৃষ্ঠা {index + 1}</p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            <div className="mt-6 text-center">
              <p className="text-lg font-medium">
                মূল্যায়ন অবস্থা:{" "}
                {examData?.submissions.find((sub) => sub.student === user._id)
                  ?.isEvaluated
                  ? "সম্পন্ন"
                  : "মুল্যায়ন চলছে"}
              </p>
              <p className="">
                প্রাপ্ত নম্বর:
                {examData?.submissions.find((sub) => sub.student === user._id)
                  ?.totalMarks || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isExamStarted &&
        !isExamEnded &&
        !submissionData?.isSubmitted &&
        examData?.type === "MCQ" && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 rounded-[16px] text-[14px] h-[40px] text-white px-8 py-4 font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Answers"}
            </Button>
          </div>
        )}

      {/* Only show AnswerUploadComponent for WRITTEN exams */}
      {isExamStarted &&
        !isExamEnded &&
        !submissionData?.isSubmitted &&
        examData?.type === "WRITTEN" && (
          <AnswerUploadComponent
            examData={examData}
            submissionId={submissionId}
            attemptId={examAttemptId}
          />
        )}

      {isExamEnded && !submissionData?.isSubmitted && !isAnytimeMode && (
        <Card className="bg-white overflow-hidden p-0 rounded-[16px] mt-8">
          <CardHeader className="text-center bg-gray-200 p-4">
            <h1 className="text-[20px] font-bold text-gray-800">
              পরীক্ষার সময় শেষ হয়েছে
            </h1>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="text-lg">
              দুঃখিত, পরীক্ষার সময় শেষ হয়ে গেছে। আপনি আর উত্তর জমা দিতে পারবেন
              না।
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
