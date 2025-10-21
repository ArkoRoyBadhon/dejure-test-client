"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default function QuestionPreview({ examData }) {
  // Calculate total questions and marks
  const totalQuestions = examData?.questionSet?.categories?.reduce(
    (sum, category) => {
      const refCount = category.questions?.length || 0;
      const customCount = category.customQuestions?.length || 0;
      return sum + refCount + customCount;
    },
    0
  );

  const totalMarks = examData?.questionSet?.categories?.reduce(
    (sum, category) => {
      const refMarks = (category.questions || []).reduce(
        (qSum, q) => qSum + (q.mark || 0),
        0
      );
      const customMarks = (category.customQuestions || []).reduce(
        (qSum, q) => qSum + (q.mark || 0),
        0
      );
      return sum + refMarks + customMarks;
    },
    0
  );

  const renderQuestionContent = (question) => {
    if (question.type === "MCQ") {
      return (
        <div className="mt-3">
          {question.options?.map((option, optIndex) => (
            <div
              key={optIndex}
              className="p-2 rounded border border-gray-200 mb-2"
            >
              <span className="font-bold mr-2">
                {String.fromCharCode(65 + optIndex)}.
              </span>
              {option}
            </div>
          ))}
        </div>
      );
    } else if (question.subQuestions?.length > 0) {
      return (
        <div className="mt-3">
          {question.subQuestions.map((subQ, subIndex) => (
            <div key={subIndex} className="mb-3 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-50 text-blue rounded text-sm font-medium mt-1">
                {String.fromCharCode(97 + subIndex)})
              </span>
              <div className="flex-1">
                <p className="text-sm">{subQ.subQuestionText}</p>
              </div>
              <div className="w-20 flex justify-end">
                <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 text-xs inline-block">
                  1X{subQ.mark} নম্বর
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const shouldShowParentMark = (question) => {
    return !question.subQuestions || question.subQuestions.length === 0;
  };

  return (
    <div className="p-4">
      <Card className="mb-6 p-0">
        <CardHeader className="bg-gray2 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/DJA logo Transperant-01 2.png"
                alt="DJA Logo"
                width={63}
                height={40}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <h2 className="text-[20px] font-bold text-darkColor leading-[150%] mb-2">
              {examData?.title || "ডি জুির একােডিম"}
            </h2>
            <h1 className="text-[40px] leading-[150%] font-bold mb-2">
              {examData?.questionSet?.name || "Exam"}
            </h1>
            <div className="flex justify-center gap-8 font-bold text-sm text-darkColor">
              <span>পূর্ণমান- {totalMarks || "১০০"}</span>
              <span>সময়: {examData?.durationMinutes || "২ ঘন্টা"} মিনিট</span>
            </div>
          </div>

          <div className="">
            <p className="text-center text-[16px] text-[#74767C] font-bold">
              {examData?.questionSet?.categories
                ?.map((cat) => `'${cat.name}' অংশ থেকে ${cat.minQuestions} `)
                .join(" এবং ")}
              করে মোট {totalQuestions} প্রশ্নের উত্তর দিতে হবে
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-4 text-[16px] mb-4">
            <div className="flex">
              <p className="">
                <span className="text-[#74767C]">মডিউল</span>{" "}
                <span className="font-bold ml-2">
                  {examData?.courses[0]?.title || "অপরাধ সংক্রন্ত আইন"}
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
          </div>
        </CardContent>
      </Card>

      {examData?.questionSet?.categories?.map((category, catIndex) => (
        <Card
          key={catIndex}
          className="bg-white overflow-hidden p-0 rounded-[16px] mt-8"
        >
          <CardHeader className="text-center bg-gray2 p-4">
            <h1 className="text-[20px] font-bold text-darkColor">
              {category.name} অংশ: {category.condition}
            </h1>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {category.questions?.map((question, qIndex) => (
              <div key={`ref-${question._id}`} className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue rounded-full text-sm font-medium">
                      {qIndex + 1}.
                    </span>
                  </div>
                  <div className="flex-1 flex gap-3">
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">
                        {question.questionText}
                      </p>
                      {renderQuestionContent(question)}
                    </div>
                    <div
                      className={`w-20 flex justify-end ${
                        question.subQuestions.length > 0 && "hidden"
                      }`}
                    >
                      {shouldShowParentMark(question) && (
                        <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 text-xs inline-block h-fit">
                          1X{question.mark || 0} নম্বর
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {category.customQuestions?.map((question, qIndex) => (
              <div key={`custom-${qIndex}`} className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue rounded-full text-sm font-medium">
                      {(category.questions?.length || 0) + qIndex + 1}.
                    </span>
                  </div>
                  <div className="flex-1 flex gap-3">
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">
                        {question.questionText}
                      </p>
                      {renderQuestionContent(question)}
                    </div>
                    <div
                      className={`w-20 flex justify-end ${
                        question.subQuestions.length > 0 && "hidden"
                      }`}
                    >
                      {shouldShowParentMark(question) && (
                        <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 text-xs inline-block h-fit">
                          1X{question.mark || 0} নম্বর
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {(!category.questions || category.questions.length === 0) &&
              (!category.customQuestions ||
                category.customQuestions.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  এই বিভাগে কোনো প্রশ্ন নেই (No questions in this section)
                </div>
              )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
