"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default function QuestionSetPreviewCreate({
  questions = [], // This is the array of ALL available bank questions (from subjectQuestions?.questions)
  title = "",
  timeDuration = 60,
  totalPoints = 0,
  categories = [], // Categories with references to bank questions (by ID) and custom questions (full objects)
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Convert duration minutes to hours and minutes
  const hours = Math.floor(timeDuration / 60);
  const minutes = timeDuration % 60;
  const durationText = `${hours > 0 ? `${hours} ঘন্টা` : ""} ${
    minutes > 0 ? `${minutes} মিনিট` : ""
  }`.trim();

  // Helper to find a bank question by its ID (_id)
  const getBankQuestionById = (id) => {
    return questions.find((q) => q._id === id);
  };

  // Combines and flattens all questions (bank and custom) for a given category
  const getCombinedQuestionsForCategory = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return [];

    // Map bank question IDs to their full objects
    const bankQuestions = (category.questions || [])
      .map((qId) => getBankQuestionById(qId))
      .filter(Boolean); // Filter out any undefined if ID not found in the main 'questions' array

    // Custom questions are already full objects
    const customQuestions = category.customQuestions || [];

    // Combine and return all questions for the category
    return [...bankQuestions, ...customQuestions];
  };

  // Handles selection for MCQ options (for both bank and custom questions/sub-questions)
  const handleOptionSelect = (questionUniqueId, value) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionUniqueId]: value }));
  };

  // Renders MCQ options for a given question or sub-question object
  const renderMCQOptions = (questionOrSubQuestion) => {
    // Check if it's an MCQ type and has options
    if (
      (questionOrSubQuestion.type === "MCQ" ||
        questionOrSubQuestion.type === "mcq") &&
      questionOrSubQuestion.options &&
      questionOrSubQuestion.options.length > 0
    ) {
      // Determine a unique ID for tracking selected answers for this specific question/sub-question
      // Prioritize 'id' (for custom questions) then '_id' (for bank questions)
      const uniqueIdForSelection =
        questionOrSubQuestion.id || questionOrSubQuestion._id;

      return (
        <div className="mt-2 space-y-2">
          {questionOrSubQuestion.options.map((option, i) => (
            <div
              // Use option.id for custom questions, or index for bank questions if options are just strings
              key={option.id || option.text || i}
              className={`p-2 rounded border cursor-pointer ${
                selectedAnswers[uniqueIdForSelection] ===
                (option.text || option) // Compare with option.text for custom, or raw option for bank
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              }`}
              onClick={() =>
                handleOptionSelect(uniqueIdForSelection, option.text || option)
              } // Pass option.text or raw option
            >
              <span className="font-bold mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {option.text || option}{" "}
              {/* Display option.text for custom, or raw option for bank */}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 w-full mx-auto">
      <Card className="mb-6 p-0 pb-6">
        <CardHeader className="bg-gray2 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* Ensure this path is correct for your Next.js project */}
              <Image
                src="/assets/icons/DJA logo Transperant-01 2.png"
                alt="logo"
                width={63}
                height={40}
                className="object-contain"
              />
            </div>
            <Button className="bg-green/20 border border-green text-darkColor rounded-[16px] px-4 py-1 text-sm font-bold">
              PREVIEW MODE
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Title Section */}
          <div className="text-center mb-4">
            <h2 className="text-[20px] font-bold text-darkColor leading-[150%] mb-2">
              ডি জুরির একাডেমি
            </h2>
            <h1 className="text-[40px] leading-[150%] font-bold mb-2">
              {title || "Untitled Question Set"}
            </h1>
            <div className="flex justify-center gap-8 font-bold text-sm text-darkColor">
              <span>পূর্ণমান- {totalPoints || "১০০"}</span>
              <span>সময়: {durationText || "২ ঘন্টা"}</span>
            </div>
          </div>

          {categories.length > 0 && (
            <div className="">
              <p className="text-center text-[16px] text-[#74767C] font-bold">
                {categories
                  .map((cat) => `'${cat.name}' অংশ থেকে ${cat.minQuestions} `)
                  .join(" এবং ")}
                করে মোট{" "}
                {categories.reduce((acc, cat) => acc + cat.minQuestions, 0)}{" "}
                প্রশ্নের উত্তর দিতে হবে
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions Sections */}
      {categories.map((category) => {
        // Removed catIndex as category.id is used for key
        const combinedQuestions = getCombinedQuestionsForCategory(category.id);
        if (!combinedQuestions.length) return null;

        return (
          <Card
            key={category.id} // Use category.id for key
            className="bg-white overflow-hidden p-0 rounded-[16px] mt-8"
          >
            {/* Category Header */}
            <CardHeader className="text-center bg-gray2 p-4">
              <h1 className="text-[20px] font-bold text-darkColor">
                {category.name} অংশ: {category.condition}
              </h1>
            </CardHeader>

            {/* Questions List */}
            <CardContent className="p-6 space-y-4">
              {combinedQuestions.map((question, qIndex) => (
                <div key={question.id || question._id} className="space-y-4">
                  {" "}
                  {/* Use question.id (custom) or question._id (bank) */}
                  {/* Main Question */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue rounded-full text-sm font-medium">
                        {qIndex + 1}.
                      </span>
                    </div>
                    <div className="flex-1">
                      {/* Check if it's a main question with sub-questions (WRITTEN type) */}
                      {question.type === "WRITTEN" ||
                      question.subQuestions?.length > 0 ? (
                        <>
                          {/* Display main question text if present (for composite written questions) */}
                          {question.questionText && (
                            <p className="text-gray-900 font-semibold mb-2">
                              {question.questionText}
                            </p>
                          )}
                          {/* Render sub-questions for WRITTEN type */}
                          {question.subQuestions?.map((subQ, subIndex) => (
                            <div
                              key={subQ.id || subQ._id || subIndex}
                              className="mb-4"
                            >
                              {" "}
                              {/* Use subQ.id (custom) or subQ._id (bank) */}
                              <div className="flex gap-3 items-start">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-50 text-blue rounded text-sm font-medium">
                                  {String.fromCharCode(97 + subIndex)})
                                </span>
                                <div className="flex-1">
                                  <p className="text-gray-800 text-sm leading-relaxed">
                                    {subQ.subQuestionText || subQ.questionText}{" "}
                                    {/* Handle different property names */}
                                  </p>
                                  {/* If a sub-question itself has options (e.g., MCQ sub-question) */}
                                  {renderMCQOptions(subQ)}
                                </div>
                                <div className="flex-shrink-0">
                                  <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs">
                                    {subQ.mark || subQ.points || 0} নম্বর{" "}
                                    {/* Handle different property names */}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        // If it's a standalone question (e.g., a simple MCQ or single written question)
                        <div className="mb-4">
                          <p className="text-gray-800 text-sm leading-relaxed">
                            {question.questionText || question.question}
                          </p>
                          {/* Render MCQ options if it's an MCQ question */}
                          {renderMCQOptions(question)}
                          <div className="flex-shrink-0 text-right mt-2">
                            <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs">
                              {question.mark || question.points || 0} নম্বর
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
