"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EditQuestionModal = ({ question, onClose, onSave }) => {
  const [editedQuestion, setEditedQuestion] = useState({ ...question });

  useEffect(() => {
    setEditedQuestion({ ...question });
  }, [question]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion((prev) => ({ ...prev, options: newOptions }));
  };

  const handleCorrectAnswerChange = (index) => {
    setEditedQuestion((prev) => ({
      ...prev,
      correctAnswer: prev.options[index],
    }));
  };

  const handleSubQuestionChange = (index, field, value) => {
    const newSubQuestions = [...editedQuestion.subQuestions];
    newSubQuestions[index] = {
      ...newSubQuestions[index],
      [field]: value,
    };
    setEditedQuestion((prev) => ({
      ...prev,
      subQuestions: newSubQuestions,
      mark: newSubQuestions.reduce((sum, sq) => sum + Number(sq.mark || 0), 0),
    }));
  };

  const addSubQuestion = () => {
    setEditedQuestion((prev) => ({
      ...prev,
      subQuestions: [...prev.subQuestions, { subQuestionText: "", mark: 1 }],
    }));
  };

  const removeSubQuestion = (index) => {
    const newSubQuestions = editedQuestion.subQuestions.filter(
      (_, i) => i !== index
    );
    setEditedQuestion((prev) => ({
      ...prev,
      subQuestions: newSubQuestions,
      mark: newSubQuestions.reduce((sum, sq) => sum + Number(sq.mark || 0), 0),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedQuestion);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="pb-2">Question Text</Label>
            <Textarea
              name="questionText"
              value={editedQuestion.questionText}
              onChange={handleChange}
              className={`mt-2 bg-gray1`}
              required
            />
          </div>

          {editedQuestion.type === "MCQ" && (
            <div className="space-y-2">
              <Label>Options</Label>
              {editedQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={editedQuestion.correctAnswer === option}
                    onChange={() => handleCorrectAnswerChange(index)}
                    className="h-4 w-4"
                  />
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {editedQuestion.type === "WRITTEN" && editedQuestion.subQuestions && (
            <div className="space-y-2">
              <Label>Sub Questions</Label>
              {editedQuestion.subQuestions.map((subQ, index) => (
                <div key={index} className="space-y-2 border p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Sub-Question {index + 1}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubQuestion(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                  <Textarea
                    value={subQ.subQuestionText}
                    onChange={(e) =>
                      handleSubQuestionChange(
                        index,
                        "subQuestionText",
                        e.target.value
                      )
                    }
                    required
                  />
                  <div>
                    <Label>Mark</Label>
                    <Input
                      type="number"
                      min="1"
                      value={subQ.mark}
                      onChange={(e) =>
                        handleSubQuestionChange(index, "mark", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={addSubQuestion}
                variant="outline"
                className="w-full"
              >
                Add Sub-Question
              </Button>
            </div>
          )}

          {/* explanation  */}
          <div className="space-y-2">
            <Label>Explanation</Label>
            <Textarea
              name="explanation"
              value={editedQuestion.explanation}
              onChange={handleChange}
              className={`mt-2 bg-gray1`}
              // required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Mark</Label>
              <Input
                name="mark"
                type="number"
                min="1"
                value={editedQuestion.mark}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="pb-2">Difficulty</Label>
              <Select
                value={editedQuestion.difficulty}
                onValueChange={(value) =>
                  setEditedQuestion((prev) => ({ ...prev, difficulty: value }))
                }
                className="bg-gray1"
              >
                <SelectTrigger className="bg-gray1 w-full rounded-[16px]">
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestionModal;
