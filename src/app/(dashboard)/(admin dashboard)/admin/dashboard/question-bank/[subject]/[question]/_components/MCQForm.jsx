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

const MCQForm = ({ subjectId, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingMultiple, setIsAddingMultiple] = useState(false);
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
      mark: 1,
      difficulty: "EASY",
      explanation: "",
    },
  ]);

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
          newOptions[optIndex] = { ...newOptions[optIndex], text: value };
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
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
        mark: 1,
        difficulty: "EASY",
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

    // Validate all questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        toast.error(`Question ${i + 1}: Text is required`);
        setIsLoading(false);
        return;
      }

      if (q.options.some((opt) => !opt.text.trim())) {
        toast.error(`Question ${i + 1}: All options must be filled`);
        setIsLoading(false);
        return;
      }

      const correctAnswers = q.options.filter((opt) => opt.isCorrect);
      if (correctAnswers.length !== 1) {
        toast.error(
          `Question ${i + 1}: Please select exactly one correct answer`
        );
        setIsLoading(false);
        return;
      }
    }

    try {
      const promises = questions.map((q) => {
        const correctOption = q.options.find((opt) => opt.isCorrect);
        const questionData = {
          questionText: q.questionText,
          options: q.options.map((opt) => opt.text),
          correctAnswer: correctOption.text, // Store the actual value instead of A/B/C/D
          mark: Number(q.mark),
          difficulty: q.difficulty,
          subject: subjectId,
          type: "MCQ",
          status: "APPROVED",
          explanation: q.explanation,
        };
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
      setQuestions([
        {
          questionText: "",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
          mark: 1,
          difficulty: "EASY",
        },
      ]);
      setIsAddingMultiple(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add some questions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
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
                className="absolute top-0 right-2 text-red text-3xl"
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
                placeholder="Enter your question"
              />
            </div>

            <div className="space-y-4">
              <Label>Options (Select one correct answer)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={option.isCorrect}
                        onCheckedChange={() =>
                          handleCorrectAnswerChange(qIndex, optIndex)
                        }
                        className="h-5 w-5 rounded"
                      />
                      <Input
                        id={`option-${qIndex}-${optIndex}`}
                        value={option.text}
                        onChange={(e) =>
                          handleOptionTextChange(
                            qIndex,
                            optIndex,
                            e.target.value
                          )
                        }
                        placeholder={`Option ${optIndex + 1}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor={`explanation-${qIndex}`}>Explanation</Label>
              <Textarea
                id={`explanation-${qIndex}`}
                name="explanation"
                value={question.explanation}
                onChange={(e) => handleChange(e, qIndex)}
                placeholder="Enter your explanation"
              />
            </div>
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

export default MCQForm;
