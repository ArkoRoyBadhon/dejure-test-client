import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CustomQuestionForm({
  newQuestion,
  setNewQuestion,
  addCustomQuestion,
}) {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!newQuestion.question.trim()) {
      newErrors.question = "Question text is required";
    }

    if (newQuestion.type === "mcq") {
      // Validate options
      newQuestion.options.forEach((option, index) => {
        if (!option.trim()) {
          newErrors[`option-${index}`] = "Option cannot be empty";
        }
      });

      // Validate at least 2 options
      if (newQuestion.options.length < 2) {
        newErrors.options = "At least 2 options are required";
      }

      // Validate correct answer
      if (!newQuestion.correctAnswer) {
        newErrors.correctAnswer = "Please select a correct answer";
      }
    }

    // Validate points
    if (!newQuestion.points || newQuestion.points < 1) {
      newErrors.points = "Points must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;

    setNewQuestion({
      ...newQuestion,
      options: newOptions,
      // Clear correct answer if it matches the changed option
      correctAnswer:
        newQuestion.correctAnswer === newOptions[index]
          ? ""
          : newQuestion.correctAnswer,
    });
  };

  const addOption = () => {
    if (newQuestion.options.length >= 10) return;
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, ""],
    });
  };

  const removeOption = (index) => {
    if (newQuestion.options.length <= 2) return;

    const newOptions = [...newQuestion.options];
    const removedOption = newOptions[index];
    newOptions.splice(index, 1);

    setNewQuestion({
      ...newQuestion,
      options: newOptions,
      // Clear correct answer if it was the removed option
      correctAnswer:
        newQuestion.correctAnswer === removedOption
          ? ""
          : newQuestion.correctAnswer,
    });
  };

  const handleTypeChange = (value) => {
    if (value === "written") {
      setNewQuestion({
        ...newQuestion,
        type: value,
        options: [],
        correctAnswer: "",
      });
    } else {
      setNewQuestion({
        ...newQuestion,
        type: value,
        options:
          newQuestion.options.length > 0 ? newQuestion.options : ["", ""],
        correctAnswer: "",
      });
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      addCustomQuestion();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset errors when form changes
  useEffect(() => {
    setErrors({});
  }, [newQuestion]);

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="space-y-4">
        <div>
          <Label>Question Type</Label>
          <Select
            value={newQuestion.type}
            onValueChange={handleTypeChange}
            className="bg-gray1"
          >
            <SelectTrigger className="!bg-gray1">
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mcq">Multiple Choice</SelectItem>
              <SelectItem value="written">Written</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Question Text *</Label>
          <Input
            value={newQuestion.question}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, question: e.target.value })
            }
            placeholder="Enter your question..."
            className={errors.question ? "border-red-500" : ""}
          />
          {errors.question && (
            <p className="text-sm text-red-500 mt-1">{errors.question}</p>
          )}
        </div>

        {newQuestion.type === "mcq" && (
          <div>
            <Label>Options *</Label>
            {errors.options && (
              <Alert variant="destructive" className="mb-2">
                <AlertDescription>{errors.options}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2 mt-2">
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className={
                      errors[`option-${index}`] ? "border-red-500" : ""
                    }
                  />
                  {newQuestion.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeOption(index)}
                    >
                      Remove
                    </Button>
                  )}
                  {errors[`option-${index}`] && (
                    <p className="text-sm text-red-500">
                      {errors[`option-${index}`]}
                    </p>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={newQuestion.options.length >= 10}
              >
                Add Option ({newQuestion.options.length}/10)
              </Button>
            </div>

            <div className="mt-4">
              <Label>Correct Answer *</Label>
              <Select
                value={newQuestion.correctAnswer}
                onValueChange={(value) =>
                  setNewQuestion({ ...newQuestion, correctAnswer: value })
                }
              >
                <SelectTrigger
                  className={errors.correctAnswer ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                  {newQuestion.options.map((option, index) => {
                    // Generate a unique value for each option
                    const optionValue = option.trim() || `option-${index}`;
                    return (
                      <SelectItem
                        key={index}
                        value={optionValue}
                        disabled={!option.trim()}
                      >
                        {option || `Option ${index + 1}`}
                        {!option.trim() && " (empty)"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.correctAnswer && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.correctAnswer}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Points *</Label>
            <Input
              type="number"
              min="1"
              max="100"
              value={newQuestion.points}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  points: Math.min(
                    100,
                    Math.max(1, parseInt(e.target.value) || 1)
                  ),
                })
              }
              className={errors.points ? "border-red-500" : ""}
            />
            {errors.points && (
              <p className="text-sm text-red-500">{errors.points}</p>
            )}
          </div>
          <div>
            <Label>Difficulty</Label>
            <Select
              value={newQuestion.difficulty}
              onValueChange={(value) =>
                setNewQuestion({ ...newQuestion, difficulty: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Custom Question"}
        </Button>
      </div>
    </div>
  );
}
