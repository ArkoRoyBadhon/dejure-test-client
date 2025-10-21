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
import { useCreateQuestionMutation } from "@/redux/features/questionBank/questionBank.api";

const WrittenForm = ({ subjectId, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [questionType, setQuestionType] = useState("SINGLE"); // SINGLE or COMPOSITE
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      mark: 1,
      difficulty: "EASY",
      subQuestions: [],
    },
  ]);
  const [isAddingMultiple, setIsAddingMultiple] = useState(false);

  const [createQuestion] = useCreateQuestionMutation();

  const handleChange = (e, qIndex) => {
    const { name, value } = e.target;
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, [name]: value } : q))
    );
  };

  const handleDifficultyChange = (value, qIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, difficulty: value } : q))
    );
  };

  const handleSubQuestionChange = (qIndex, sqIndex, field, value) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      const updatedSubQuestions = [...updatedQuestions[qIndex].subQuestions];

      updatedSubQuestions[sqIndex] = {
        ...updatedSubQuestions[sqIndex],
        [field]: value,
      };

      updatedQuestions[qIndex] = {
        ...updatedQuestions[qIndex],
        subQuestions: updatedSubQuestions,
        mark: updatedSubQuestions.reduce(
          (sum, sq) => sum + Number(sq.mark || 0),
          0
        ),
      };

      return updatedQuestions;
    });
  };

  const addSubQuestion = (qIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              subQuestions: [
                ...q.subQuestions,
                {
                  subQuestionText: "",
                  mark: 1,
                },
              ],
            }
          : q
      )
    );
  };

  const removeSubQuestion = (qIndex, sqIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              subQuestions: q.subQuestions.filter((_, idx) => idx !== sqIndex),
              mark: q.subQuestions
                .filter((_, idx) => idx !== sqIndex)
                .reduce((sum, sq) => sum + Number(sq.mark || 0), 0),
            }
          : q
      )
    );
  };

  const addNewQuestionField = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: "",
        mark: 1,
        difficulty: "EASY",
        subQuestions: [],
      },
    ]);
    setIsAddingMultiple(true);
  };

  const removeQuestionField = (index) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate all questions
      for (let qIndex = 0; qIndex < questions.length; qIndex++) {
        const question = questions[qIndex];

        // if (!question.questionText.trim()) {
        //   toast.error(`Question ${qIndex + 1}: Text is required`);
        //   return;
        // }

        if (questionType === "COMPOSITE") {
          if (question.subQuestions.length === 0) {
            toast.error(
              `Question ${qIndex + 1}: At least one sub-question is required`
            );
            return;
          }

          for (let i = 0; i < question.subQuestions.length; i++) {
            const sq = question.subQuestions[i];
            if (!sq.subQuestionText.trim()) {
              toast.error(
                `Question ${qIndex + 1}: Sub-question ${i + 1} text is required`
              );
              return;
            }
            if (!sq.mark || Number(sq.mark) <= 0) {
              toast.error(
                `Question ${qIndex + 1}: Sub-question ${
                  i + 1
                } requires valid mark`
              );
              return;
            }
          }
        }
      }

      const promises = questions.map((question) => {
        const questionData = {
          questionText: question.questionText,
          mark: Number(question.mark),
          difficulty: question.difficulty,
          subject: subjectId,
          type: "WRITTEN",
          status: "APPROVED",
        };

        if (questionType === "COMPOSITE" && question.subQuestions.length > 0) {
          questionData.subQuestions = question.subQuestions.map((sq) => ({
            subQuestionText: sq.subQuestionText,
            mark: Number(sq.mark),
          }));
        }

        return createQuestion(questionData).unwrap();
      });

      await Promise.all(promises);

      toast.success(
        `Successfully added ${questions.length} question${
          questions.length > 1 ? "s" : ""
        }`
      );
      onSuccess();

      // Reset form
      if (isAddingMultiple) {
        setQuestions([
          {
            questionText: "",
            mark: 1,
            difficulty: "EASY",
            subQuestions: [],
          },
        ]);
        setIsAddingMultiple(false);
      } else {
        setQuestions([
          {
            questionText: "",
            mark: 1,
            difficulty: "EASY",
            subQuestions: [],
          },
        ]);
      }
      setQuestionType("SINGLE");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add some questions");
      console.error("Error creating questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Button
          type="button"
          variant={questionType === "SINGLE" ? "default" : "outline"}
          onClick={() => setQuestionType("SINGLE")}
        >
          Single Question
        </Button>
        <Button
          type="button"
          variant={questionType === "COMPOSITE" ? "default" : "outline"}
          onClick={() => setQuestionType("COMPOSITE")}
        >
          Composite Question
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="space-y-6 border p-4 custom-shadow border-main rounded-lg relative"
          >
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestionField(qIndex)}
                className="absolute top-0 right-2 text-red hover:text-red/90 text-2xl"
              >
                ×
              </button>
            )}

            <div className="space-y-2">
              <Label htmlFor={`questionText-${qIndex}`}>
                Question {qIndex + 1} Text
              </Label>
              <Textarea
                id={`questionText-${qIndex}`}
                name="questionText"
                value={question.questionText}
                onChange={(e) => handleChange(e, qIndex)}
                placeholder={
                  questionType === "COMPOSITE"
                    ? "Enter the main question text (optional)"
                    : "Enter your question"
                }
              />
            </div>

            {questionType === "COMPOSITE" && (
              <div className="space-y-4">
                <Label>Sub-Questions</Label>
                {question.subQuestions.map((subQ, sqIndex) => (
                  <div
                    key={sqIndex}
                    className="space-y-4 border custom-shadow border-main p-4 rounded-lg relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeSubQuestion(qIndex, sqIndex)}
                      className="absolute top-0 right-2 text-red hover:text-red/90 text-2xl"
                    >
                      ×
                    </button>
                    <div className="space-y-2">
                      <Label htmlFor={`subQuestionText-${qIndex}-${sqIndex}`}>
                        Sub-Question {sqIndex + 1}
                      </Label>
                      <Textarea
                        id={`subQuestionText-${qIndex}-${sqIndex}`}
                        value={subQ.subQuestionText}
                        onChange={(e) =>
                          handleSubQuestionChange(
                            qIndex,
                            sqIndex,
                            "subQuestionText",
                            e.target.value
                          )
                        }
                        placeholder="Enter sub-question text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`subQuestionMark-${qIndex}-${sqIndex}`}>
                        Mark
                      </Label>
                      <Input
                        id={`subQuestionMark-${qIndex}-${sqIndex}`}
                        type="number"
                        min="1"
                        value={subQ.mark}
                        onChange={(e) =>
                          handleSubQuestionChange(
                            qIndex,
                            sqIndex,
                            "mark",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => addSubQuestion(qIndex)}
                  variant="outline"
                  className="w-full"
                >
                  Add Sub-Question
                </Button>
              </div>
            )}

            {questionType === "SINGLE" && (
              <div className="grid grid-cols-2 gap-4">
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="flex flex-col space-y-4">
          <Button
            type="button"
            onClick={addNewQuestionField}
            variant="outline"
            className="w-full"
          >
            Add Another Question
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-main hover:bg-main/90 w-full py-2"
          >
            {isLoading
              ? `Adding ${
                  questions.length > 1 ? "Questions..." : "Question..."
                }`
              : `Add ${questions.length > 1 ? "Questions" : "Question"}`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WrittenForm;
