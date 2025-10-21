"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";

const AIWrittenForm = ({
  subjectId,
  initialQuestions = [],
  onSuccess,
  onCancel,
  onSave,
  isImportMode = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("single");
  const [questions, setQuestions] = useState({
    single: [],
    composite: [],
  });
  const [hasSingleQuestions, setHasSingleQuestions] = useState(false);
  const [hasCompositeQuestions, setHasCompositeQuestions] = useState(false);

  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      const sortedQuestions = {
        single: [],
        composite: [],
      };

      initialQuestions.forEach((q) => {
        if (q.subQuestions && q.subQuestions.length > 0) {
          sortedQuestions.composite.push({
            ...q,
            subQuestions: q.subQuestions || [],
            mark:
              q.mark ||
              q.subQuestions.reduce((sum, sq) => sum + (sq.mark || 0), 0),
            difficulty: q.difficulty || "MEDIUM",
            type: q.type || "WRITTEN",
          });
        } else {
          sortedQuestions.single.push({
            ...q,
            subQuestions: [],
            mark: q.mark || 1,
            difficulty: q.difficulty || "MEDIUM",
            type: q.type || "WRITTEN",
          });
        }
      });

      setQuestions(sortedQuestions);
      setHasSingleQuestions(sortedQuestions.single.length > 0);
      setHasCompositeQuestions(sortedQuestions.composite.length > 0);

      // Set initial active tab based on question types
      if (
        sortedQuestions.single.length > 0 &&
        sortedQuestions.composite.length > 0
      ) {
        setActiveTab("single");
      } else if (sortedQuestions.composite.length > 0) {
        setActiveTab("composite");
      }
    } else {
      setQuestions({
        single: [
          {
            questionText: "",
            mark: 1,
            difficulty: "EASY",
            type: "WRITTEN",
            subQuestions: [],
          },
        ],
        composite: [
          {
            questionText: "",
            mark: 0,
            difficulty: "EASY",
            type: "WRITTEN",
            subQuestions: [
              {
                subQuestionText: "",
                mark: 1,
              },
            ],
          },
        ],
      });
      setHasSingleQuestions(true);
      setHasCompositeQuestions(true);
    }
  }, [initialQuestions]);

  const handleChange = (e, qIndex, type) => {
    const { name, value } = e.target;
    setQuestions((prev) => ({
      ...prev,
      [type]: prev[type].map((q, i) =>
        i === qIndex ? { ...q, [name]: value } : q
      ),
    }));
  };

  const handleDifficultyChange = (value, qIndex, type) => {
    setQuestions((prev) => ({
      ...prev,
      [type]: prev[type].map((q, i) =>
        i === qIndex ? { ...q, difficulty: value } : q
      ),
    }));
  };

  const handleSubQuestionChange = (qIndex, sqIndex, field, value) => {
    setQuestions((prev) => {
      const updatedQuestions = { ...prev };
      const updatedSubQuestions = [
        ...updatedQuestions.composite[qIndex].subQuestions,
      ];

      updatedSubQuestions[sqIndex] = {
        ...updatedSubQuestions[sqIndex],
        [field]: value,
      };

      updatedQuestions.composite[qIndex] = {
        ...updatedQuestions.composite[qIndex],
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
    setQuestions((prev) => ({
      ...prev,
      composite: prev.composite.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              subQuestions: [
                ...q.subQuestions,
                { subQuestionText: "", mark: 1 },
              ],
            }
          : q
      ),
    }));
  };

  const removeSubQuestion = (qIndex, sqIndex) => {
    setQuestions((prev) => ({
      ...prev,
      composite: prev.composite.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              subQuestions: q.subQuestions.filter((_, idx) => idx !== sqIndex),
              mark: q.subQuestions
                .filter((_, idx) => idx !== sqIndex)
                .reduce((sum, sq) => sum + Number(sq.mark || 0), 0),
            }
          : q
      ),
    }));
  };

  const addNewQuestionField = (type) => {
    setQuestions((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        type === "single"
          ? {
              questionText: "",
              mark: 1,
              difficulty: "EASY",
              type: "WRITTEN",
              subQuestions: [],
            }
          : {
              questionText: "",
              mark: 0,
              difficulty: "EASY",
              type: "WRITTEN",
              subQuestions: [{ subQuestionText: "", mark: 1 }],
            },
      ],
    }));
  };

  const removeQuestionField = (index, type) => {
    if (questions[type].length === 1) return;
    setQuestions((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate all questions
      const allQuestions = [...questions.single, ...questions.composite];

      for (let qIndex = 0; qIndex < allQuestions.length; qIndex++) {
        const question = allQuestions[qIndex];

        if (!question.questionText.trim() && !question.subQuestions) {
          toast.error(`Question ${qIndex + 1}: Text is required`);
          return;
        }

        if (question.subQuestions && question.subQuestions.length > 0) {
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
        } else {
          if (!question.mark || Number(question.mark) <= 0) {
            toast.error(`Question ${qIndex + 1}: Requires valid mark`);
            return;
          }
        }
      }

      if (isImportMode && onSave) {
        const questionsToSave = allQuestions.map((q) => ({
          questionText: q.questionText,
          type: q.type,
          mark: Number(q.mark),
          difficulty: q.difficulty,
          subject: subjectId,
          status: "APPROVED",
          source: q.source || "EXAM",
          sectionCode: q.sectionCode || undefined,
          explanation: q.explanation || undefined,
          subQuestions:
            q.subQuestions?.map((sq) => ({
              subQuestionText: sq.subQuestionText,
              mark: Number(sq.mark),
            })) || [],
        }));
        await onSave(questionsToSave);
      } else {
        // Original save logic if needed
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add some questions");
      console.error("Error creating questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSingleQuestions = () => (
    <div className="space-y-6">
      {questions.single.map((question, qIndex) => (
        <div
          key={`single-${qIndex}`}
          className="space-y-6 border p-4 custom-shadow border-main rounded-lg relative"
        >
          {questions.single.length > 1 && (
            <button
              type="button"
              onClick={() => removeQuestionField(qIndex, "single")}
              className="absolute top-0 right-2 text-red hover:text-red/90 text-2xl"
              disabled={isLoading}
            >
              ×
            </button>
          )}

          <div className="space-y-2">
            <Label htmlFor={`single-questionText-${qIndex}`}>
              Question {qIndex + 1} Text
            </Label>
            <Textarea
              id={`single-questionText-${qIndex}`}
              name="questionText"
              value={question.questionText}
              onChange={(e) => handleChange(e, qIndex, "single")}
              placeholder="Enter your question"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`single-mark-${qIndex}`}>Marks</Label>
              <Input
                id={`single-mark-${qIndex}`}
                name="mark"
                type="number"
                value={question.mark}
                onChange={(e) => handleChange(e, qIndex, "single")}
                min="1"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={question.difficulty}
                onValueChange={(value) =>
                  handleDifficultyChange(value, qIndex, "single")
                }
                disabled={isLoading}
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
        </div>
      ))}

      <Button
        type="button"
        onClick={() => addNewQuestionField("single")}
        variant="outline"
        className="w-full"
        disabled={isLoading}
      >
        Add Another Single Question
      </Button>
    </div>
  );

  const renderCompositeQuestions = () => (
    <div className="space-y-6">
      {questions.composite.map((question, qIndex) => (
        <div
          key={`composite-${qIndex}`}
          className="space-y-6 border p-4 custom-shadow border-main rounded-lg relative"
        >
          {questions.composite.length > 1 && (
            <button
              type="button"
              onClick={() => removeQuestionField(qIndex, "composite")}
              className="absolute top-0 right-2 text-red hover:text-red/90 text-2xl"
              disabled={isLoading}
            >
              ×
            </button>
          )}

          <div className="space-y-2">
            <Label htmlFor={`composite-questionText-${qIndex}`}>
              Main Question {qIndex + 1} Text (Optional)
            </Label>
            <Textarea
              id={`composite-questionText-${qIndex}`}
              name="questionText"
              value={question.questionText}
              onChange={(e) => handleChange(e, qIndex, "composite")}
              placeholder="Enter the main question text (optional)"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <Label>Sub Questions</Label>
            {question.subQuestions.map((subQ, sqIndex) => (
              <div
                key={`subq-${qIndex}-${sqIndex}`}
                className="space-y-4 border custom-shadow p-4 rounded-lg relative"
              >
                <button
                  type="button"
                  onClick={() => removeSubQuestion(qIndex, sqIndex)}
                  className="absolute top-0 right-2 text-red hover:text-red/90 text-2xl"
                  disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => addSubQuestion(qIndex)}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              Add Sub-Question
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Total Marks: {question.mark}</Label>
          </div>

          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select
              value={question.difficulty}
              onValueChange={(value) =>
                handleDifficultyChange(value, qIndex, "composite")
              }
              disabled={isLoading}
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
      ))}

      <Button
        type="button"
        onClick={() => addNewQuestionField("composite")}
        variant="outline"
        className="w-full"
        disabled={isLoading}
      >
        Add Another Composite Question
      </Button>
    </div>
  );

  const renderSubmitButtons = () => (
    <div className="flex gap-2">
      {isImportMode && (
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className={`${
          isImportMode ? "flex-1" : "w-full"
        } bg-main hover:bg-main/90 py-2`}
      >
        {isLoading ? "Saving Questions..." : `Save All Questions`}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {isImportMode && (
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Review Imported Questions</h3>
          <Button
            variant="ghost"
            onClick={onCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      )}

      {hasSingleQuestions && hasCompositeQuestions ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Questions</TabsTrigger>
            <TabsTrigger value="composite">Composite Questions</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6">
            <TabsContent value="single">{renderSingleQuestions()}</TabsContent>
            <TabsContent value="composite">
              {renderCompositeQuestions()}
            </TabsContent>
            {renderSubmitButtons()}
          </form>
        </Tabs>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {hasSingleQuestions && renderSingleQuestions()}
          {hasCompositeQuestions && renderCompositeQuestions()}
          {renderSubmitButtons()}
        </form>
      )}
    </div>
  );
};

export default AIWrittenForm;
