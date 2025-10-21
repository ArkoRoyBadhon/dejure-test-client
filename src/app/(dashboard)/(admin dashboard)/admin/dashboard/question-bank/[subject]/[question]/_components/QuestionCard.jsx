"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  MoreVertical,
  CheckCircle,
  PauseCircle,
  Edit,
  Trash2,
} from "lucide-react";

const QuestionCard = ({ index, question, onActionClick, onEditClick }) => {
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOptionsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusIcon = () => {
    switch (question.status) {
      case "ACTIVE":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "PAUSED":
        return <PauseCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <Card key={index} className="overflow-hidden rounded-[16px] mb-4 p-0">
      <CardHeader className="bg-gray2 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                question.type === "MCQ"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {question.type}
            </span>
            <span className="text-sm text-gray-500">
              {question.mark} mark{question.mark !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Custom dropdown trigger */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsOptionsExpanded((prev) => !prev);
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {isOptionsExpanded && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50"
              >
                <button
                  onClick={() => {
                    setIsOptionsExpanded(false);
                    onEditClick(question);
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setIsOptionsExpanded(false);
                    onActionClick(question._id, "delete");
                  }}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Rest of the card content remains the same */}
      <CardContent className="pb-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue rounded-full text-sm font-medium">
              {index + 1}.
            </span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-gray-900 text-[16px] font-semibold mb-2">
                {question.questionText}
              </h3>

              {/* Show marks here if no subquestions */}
              {question.type === "WRITTEN" &&
                (!question.subQuestions ||
                  question.subQuestions.length === 0) && (
                  <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs">
                    {question.mark} marks
                  </span>
                )}
            </div>

            {/* MCQ options */}
            {question.type === "MCQ" && (
              <div className="mt-4 space-y-2">
                {question.options.map((option, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded border ${
                      option === question.correctAnswer
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <span className="font-bold mr-2">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {option}
                  </div>
                ))}
              </div>
            )}

            {/* Written subquestions */}
            {question.type === "WRITTEN" &&
              question.subQuestions &&
              question.subQuestions.length > 0 && (
                <div className="mt-4 space-y-4">
                  {question.subQuestions.map((subQ, subIndex) => (
                    <div key={subIndex} className="flex gap-3 items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-50 text-blue rounded text-sm font-medium">
                        {String.fromCharCode(97 + subIndex)})
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-800 text-sm leading-relaxed text-[16px]">
                          {subQ.subQuestionText}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs">
                          {subQ.mark} marks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
