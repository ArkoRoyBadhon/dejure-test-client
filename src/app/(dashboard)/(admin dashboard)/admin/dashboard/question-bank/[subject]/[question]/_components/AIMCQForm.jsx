"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateQuestionMutation } from "@/redux/features/questionBank/questionBank.api";
import { ChevronLeft } from "lucide-react";

const AIMCQForm = ({
  subjectId,
  initialQuestions = [],
  onCancel,
  onSave,
  isImportMode = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState(
    initialQuestions.length > 0
      ? initialQuestions.map((q) => ({
          questionText: q.questionText || "",
          options:
            q.options?.length > 0
              ? q.options.map((opt, idx) => ({
                  text: typeof opt === "string" ? opt : opt.text || "",
                  isCorrect: q.correctAnswer
                    ? typeof opt === "string"
                      ? opt === q.correctAnswer
                      : opt.text === q.correctAnswer
                    : idx === 0, // Default to first option if no correct answer specified
                  optionLetter: String.fromCharCode(65 + idx), // A, B, C, D
                }))
              : [
                  { text: "", isCorrect: true, optionLetter: "A" },
                  { text: "", isCorrect: false, optionLetter: "B" },
                  { text: "", isCorrect: false, optionLetter: "C" },
                  { text: "", isCorrect: false, optionLetter: "D" },
                ],
          mark: q.mark || 1,
          difficulty: q.difficulty || "EASY",
          explanation: q.explanation || "",
        }))
      : [
          {
            questionText: "",
            options: [
              { text: "", isCorrect: true, optionLetter: "A" },
              { text: "", isCorrect: false, optionLetter: "B" },
              { text: "", isCorrect: false, optionLetter: "C" },
              { text: "", isCorrect: false, optionLetter: "D" },
            ],
            mark: 1,
            difficulty: "EASY",
            explanation: "",
          },
        ]
  );

  const [createQuestion] = useCreateQuestionMutation();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [name]: value } : q))
    );
  };

  const handleOptionTextChange = (qIndex, optIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i === qIndex) {
          const newOptions = [...q.options];
          newOptions[optIndex] = {
            ...newOptions[optIndex],
            text: value,
          };
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const handleCorrectAnswerChange = (qIndex, correctIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i === qIndex) {
          const newOptions = q.options.map((opt, idx) => ({
            ...opt,
            isCorrect: idx === correctIndex,
          }));
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const handleDifficultyChange = (value, index) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, difficulty: value } : q))
    );
  };

  const addNewQuestionField = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: "",
        options: [
          { text: "", isCorrect: true, optionLetter: "A" },
          { text: "", isCorrect: false, optionLetter: "B" },
          { text: "", isCorrect: false, optionLetter: "C" },
          { text: "", isCorrect: false, optionLetter: "D" },
        ],
        mark: 1,
        difficulty: "EASY",
        explanation: "",
      },
    ]);
  };

  const removeQuestionField = (index) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        toast.error(`Question ${i + 1}: Text is required`);
        return false;
      }

      if (q.options.some((opt) => !opt.text.trim())) {
        toast.error(`Question ${i + 1}: All options must be filled`);
        return false;
      }

      const correctAnswers = q.options.filter((opt) => opt.isCorrect);
      if (correctAnswers.length !== 1) {
        toast.error(
          `Question ${i + 1}: Please select exactly one correct answer`
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateQuestions()) return;

    setIsLoading(true);

    try {
      const formattedQuestions = questions.map((q) => {
        const correctOption = q.options.find((opt) => opt.isCorrect);
        return {
          questionText: q.questionText,
          options: q.options.map((opt) => opt.text),
          correctAnswer: correctOption.text,
          mark: Number(q.mark),
          difficulty: q.difficulty,
          subject: subjectId,
          type: "MCQ",
          status: "APPROVED",
          explanation: q.explanation,
        };
      });

      if (isImportMode) {
        onSave(formattedQuestions);
      } else {
        await Promise.all(
          formattedQuestions.map((q) => createQuestion(q).unwrap())
        );
        toast.success(
          `Successfully added ${questions.length} question${
            questions.length > 1 ? "s" : ""
          }`
        );
        // Reset form
        setQuestions([
          {
            questionText: "",
            options: [
              { text: "", isCorrect: true, optionLetter: "A" },
              { text: "", isCorrect: false, optionLetter: "B" },
              { text: "", isCorrect: false, optionLetter: "C" },
              { text: "", isCorrect: false, optionLetter: "D" },
            ],
            mark: 1,
            difficulty: "EASY",
            explanation: "",
          },
        ]);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add questions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {isImportMode
            ? "Review and Edit MCQ Questions"
            : "Create MCQ Questions with AI"}
        </h2>
        <Button
          variant="ghost"
          onClick={onCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="space-y-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200 relative"
          >
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestionField(qIndex)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            <div className="space-y-2">
              <Label htmlFor={`questionText-${qIndex}`}>
                Question {qIndex + 1}
              </Label>
              <Textarea
                id={`questionText-${qIndex}`}
                name="questionText"
                value={question.questionText}
                onChange={(e) => handleChange(e, qIndex)}
                placeholder="Enter your question"
                className="min-h-[100px] bg-gray1"
              />
            </div>

            <div className="space-y-3">
              <Label>Options</Label>
              <p className="text-sm text-gray-500">Select the correct answer</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      option.isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={option.isCorrect}
                        onCheckedChange={() =>
                          handleCorrectAnswerChange(qIndex, optIndex)
                        }
                        className={`h-5 w-5 rounded ${
                          option.isCorrect
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          option.isCorrect ? "text-green-700" : "text-gray-700"
                        }`}
                      >
                        {option.optionLetter}.
                      </span>
                    </div>
                    <Input
                      value={option.text}
                      onChange={(e) =>
                        handleOptionTextChange(qIndex, optIndex, e.target.value)
                      }
                      placeholder={`Option ${option.optionLetter}`}
                      className={`flex-1 bg-white ${
                        option.isCorrect ? "text-green-700" : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`mark-${qIndex}`}>Marks</Label>
                <Input
                  id={`mark-${qIndex}`}
                  name="mark"
                  type="number"
                  value={question.mark}
                  onChange={(e) => handleChange(e, qIndex)}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select
                  value={question.difficulty}
                  onValueChange={(value) =>
                    handleDifficultyChange(value, qIndex)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`explanation-${qIndex}`}>Explanation</Label>
                <Input
                  id={`explanation-${qIndex}`}
                  name="explanation"
                  value={question.explanation}
                  onChange={(e) => handleChange(e, qIndex)}
                  placeholder="Optional explanation"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="button"
            onClick={addNewQuestionField}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Add Another Question
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isImportMode ? "Importing..." : "Saving..."}
              </span>
            ) : isImportMode ? (
              `Import ${questions.length > 1 ? "Questions" : "Question"}`
            ) : (
              `Save ${questions.length > 1 ? "Questions" : "Question"}`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AIMCQForm;
