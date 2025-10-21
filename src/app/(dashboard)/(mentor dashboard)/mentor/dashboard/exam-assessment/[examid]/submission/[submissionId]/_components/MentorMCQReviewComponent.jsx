"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetResultsForStudentByExamByMentorQuery } from "@/redux/features/liveexams/liveExam.Api";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MentorMCQReviewComponent({
  examId,
  studentId,
  answers,
}) {
  const {
    data: examResultData,
    isLoading,
    isError,
    error,
  } = useGetResultsForStudentByExamByMentorQuery({
    examId,
    studentId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertDescription>
          {error?.data?.message || "Failed to load exam results"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!examResultData?.examDetails) {
    return (
      <Alert variant="default" className="my-4">
        <AlertDescription>
          No exam results data available for this student
        </AlertDescription>
      </Alert>
    );
  }

  const { examDetails } = examResultData;
  const studentSubmission = examDetails.exam?.submissions?.find(
    (sub) => sub.student?._id === studentId
  ) || { totalMarks: 0, answers: {} };

  const renderMCQQuestion = (question, index) => {
    if (!question) return null;

    const questionId = question.subQuestionId;
    const studentAnswer = answers[questionId]
      ? Object.values(answers[questionId])[0]
      : null;

    const correctAnswer = question.correctAnswer;

    const isCorrect = studentAnswer === correctAnswer;

    return (
      <div key={index} className="mb-8 p-4 border rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {index + 1}.
            </span>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">{question.question}</p>
              <div className="mt-3 space-y-2">
                {question.options?.map((option, i) => {
                  const isStudentAnswer = studentAnswer === option;
                  const isCorrectAnswer = option === correctAnswer;
                  const isWrongAnswer = isStudentAnswer && !isCorrectAnswer;

                  return (
                    <div
                      key={i}
                      className={`p-3 rounded border relative ${
                        isCorrectAnswer
                          ? "border-green-500 bg-green-50"
                          : isWrongAnswer
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200"
                      }`}
                    >
                      <span className="font-bold mr-2">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {option}

                      {isStudentAnswer && (
                        <span className="ml-2 text-blue-500">
                          ✓ Student's answer
                        </span>
                      )}

                      {isCorrectAnswer && !isStudentAnswer && (
                        <span className="ml-2 text-green-500">
                          Correct answer
                        </span>
                      )}

                      <span className="absolute right-2 top-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                        {question.mark || 0} mark
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isCorrect
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isCorrect ? "Correct" : "Incorrect"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <Card className="mb-6 p-0">
        <CardHeader className="bg-gray2 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/DJA logo Transperant-01 2.png"
                alt="logo"
                width={63}
                height={40}
              />
              <h2 className="text-xl font-bold">
                {examDetails.exam?.title || "Exam Review"} - Student Answers
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Button className="bg-green-500/20 border border-green-500 text-green-600 rounded-[16px] px-4 py-1 text-sm font-bold">
                REVIEW MODE
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <h1 className="text-[40px] leading-[150%] font-bold mb-2">
              MCQ Exam Review
            </h1>
            <div className="flex justify-center gap-8 font-bold text-sm">
              <span>
                Student: {examDetails.student?.fullName || "Unknown Student"}
              </span>
              <span>
                Total Marks: {studentSubmission.totalMarks || 0} /{" "}
                {examDetails.exam?.questionSet?.totalPoints || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white overflow-hidden p-0 rounded-[16px] mt-8">
        <CardHeader className="text-center bg-gray2 p-4">
          <h1 className="text-[20px] font-bold">Questions Review</h1>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {examDetails.questions?.length > 0 ? (
            examDetails.questions.map((question, index) =>
              renderMCQQuestion(question, index)
            )
          ) : (
            <Alert variant="default">
              <AlertDescription>
                No questions available for this exam
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
