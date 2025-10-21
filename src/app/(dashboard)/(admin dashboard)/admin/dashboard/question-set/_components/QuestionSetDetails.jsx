"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, X, ChevronLeft } from "lucide-react";
import CommonBtn from "@/components/shared/CommonBtn";
import QuestionSetPreviewCreate from "./QuestionSetPreview";
import { useGetQuestionsByMultipleSubjectsQuery } from "@/redux/features/questionBank/questionBank.api";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const QuestionSetDetails = ({
  formData,
  setFormData,
  onBack,
  onSubmit,
  questionBankTypes,
}) => {
  const [categories, setCategories] = useState(
    formData.categories || [
      {
        id: "1",
        name: "Part A",
        condition: "Answer all questions",
        minQuestions: 3,
        questions: [],
        customQuestions: [],
      },
    ]
  );
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isCustomQuestionDialogOpen, setIsCustomQuestionDialogOpen] =
    useState(false);
  const [currentCustomQuestion, setCurrentCustomQuestion] = useState({
    id: "",
    questionText: "",
    type: formData.type,
    options: [],
    subQuestions: [],
    mark: 1,
    correctAnswer: "",
  });
  const [editingCustomQuestionIndex, setEditingCustomQuestionIndex] =
    useState(-1);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  // RTK Query hook
  const {
    data: questionsData,
    isLoading,
    error: fetchError,
    isError,
  } = useGetQuestionsByMultipleSubjectsQuery({
    subjectIds: formData.subjects,
    type: formData.type,
    search: searchTerm,
  });

  // Filter questions based on selected filters
  const getFilteredQuestions = () => {
    if (!questionsData?.questions) return [];

    let filtered = [...questionsData.questions];

    // Filter by difficulty if any selected
    if (formData.difficulty?.length > 0) {
      filtered = filtered.filter((q) =>
        formData.difficulty.includes(q.difficulty)
      );
    }

    // Filter by subject if any selected and multiple subjects exist
    if (
      formData.filterSubjects?.length > 0 &&
      questionsData.subjectIds?.length > 1
    ) {
      filtered = filtered.filter((q) =>
        formData.filterSubjects.includes(q.subject._id)
      );
    }

    return filtered;
  };

  const filteredQuestions = getFilteredQuestions();

  const toggleQuestionSelection = (questionId) => {
    if (!activeCategory) return;

    const currentQuestions =
      categories.find((cat) => cat.id === activeCategory)?.questions || [];
    const isAdding = !currentQuestions.includes(questionId);
    const totalSelected = categories.reduce(
      (sum, cat) => sum + cat.questions.length + cat.customQuestions.length,
      0
    );

    if (
      isAdding &&
      formData.questionCount &&
      totalSelected >= formData.questionCount
    ) {
      toast.error(`Maximum ${formData.questionCount} questions reached`);
      return;
    }

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === activeCategory) {
          return currentQuestions.includes(questionId)
            ? {
                ...cat,
                questions: cat.questions.filter((id) => id !== questionId),
              }
            : {
                ...cat,
                questions: [...cat.questions, questionId],
              };
        }
        return cat;
      })
    );
  };

  const openAddCategoryDialog = () => {
    setCurrentCategory({
      id: Date.now().toString(),
      name: "",
      condition: "",
      minQuestions: 1,
      questions: [],
      customQuestions: [],
    });
    setEditingIndex(-1);
    setIsDialogOpen(true);
  };

  const openEditCategoryDialog = (category, index) => {
    setCurrentCategory({ ...category });
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!currentCategory?.name) return;

    setCategories((prev) =>
      editingIndex >= 0
        ? prev.map((cat, i) => (i === editingIndex ? currentCategory : cat))
        : [...prev, currentCategory]
    );

    if (editingIndex === -1) {
      setActiveCategory(currentCategory.id);
    }
    setIsDialogOpen(false);
  };

  const removeCategory = (index) => {
    const updatedCategories = [...categories];
    const [removed] = updatedCategories.splice(index, 1);
    setCategories(updatedCategories);

    if (activeCategory === removed.id) {
      setActiveCategory(updatedCategories[0]?.id || "");
    }
  };

  const handleAddCustomQuestion = () => {
    if (!activeCategory) return;

    const totalSelected = categories.reduce(
      (sum, cat) => sum + cat.questions.length + cat.customQuestions.length,
      0
    );

    if (formData.questionCount && totalSelected >= formData.questionCount) {
      toast.error(`Maximum ${formData.questionCount} questions reached`);
      return;
    }

    setIsCustomQuestionDialogOpen(true);
    setCurrentCustomQuestion({
      id: Date.now().toString(),
      questionText: "",
      type: formData.type,
      options: [],
      subQuestions: [],
      mark: 1,
    });
    setEditingCustomQuestionIndex(-1);
  };

  const handleSaveCustomQuestion = () => {
    if (!currentCustomQuestion.questionText) {
      toast.error("Question text is required");
      return;
    }

    if (
      currentCustomQuestion.type === "MCQ" &&
      currentCustomQuestion.options.length < 2
    ) {
      toast.error("MCQ questions require at least 2 options");
      return;
    }

    if (
      currentCustomQuestion.type === "MCQ" &&
      !currentCustomQuestion.correctAnswer
    ) {
      toast.error("Please select the correct answer");
      return;
    }

    // For written questions, if there are no sub-questions, use the main question text
    if (
      currentCustomQuestion.type === "WRITTEN" &&
      currentCustomQuestion.subQuestions.length === 0
    ) {
      setCurrentCustomQuestion((prev) => ({
        ...prev,
        subQuestions: [
          {
            id: Date.now().toString(),
            subQuestionText: prev.questionText,
            mark: prev.mark,
          },
        ],
      }));
    }

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === activeCategory) {
          const updatedCustomQuestions = [...cat.customQuestions];
          if (editingCustomQuestionIndex >= 0) {
            updatedCustomQuestions[editingCustomQuestionIndex] =
              currentCustomQuestion;
          } else {
            updatedCustomQuestions.push(currentCustomQuestion);
          }
          return { ...cat, customQuestions: updatedCustomQuestions };
        }
        return cat;
      })
    );
    setIsCustomQuestionDialogOpen(false);
  };

  const handleAddOption = () => {
    setCurrentCustomQuestion((prev) => ({
      ...prev,
      options: [...prev.options, ""], // Add empty string
    }));
  };

  const handleOptionChange = (index, value) => {
    setCurrentCustomQuestion((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? value : opt)),
    }));
  };

  const handleRemoveOption = (index) => {
    setCurrentCustomQuestion((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
      // If removing the correct answer, clear correctAnswer
      correctAnswer:
        prev.correctAnswer === prev.options[index] ? "" : prev.correctAnswer,
    }));
  };

  const handleCorrectAnswerChange = (optionText) => {
    setCurrentCustomQuestion((prev) => ({
      ...prev,
      correctAnswer: optionText,
    }));
  };

  const handleAddSubQuestion = () => {
    setCurrentCustomQuestion((prev) => ({
      ...prev,
      subQuestions: [
        ...prev.subQuestions,
        { id: Date.now().toString(), subQuestionText: "", mark: 1 },
      ],
    }));
  };

  const handleSubQuestionChange = (id, field, value) => {
    setCurrentCustomQuestion((prev) => ({
      ...prev,
      subQuestions: prev.subQuestions.map((sq) =>
        sq.id === id ? { ...sq, [field]: value } : sq
      ),
    }));
  };

  const handleRemoveSubQuestion = (id) => {
    setCurrentCustomQuestion((prev) => ({
      ...prev,
      subQuestions: prev.subQuestions.filter((sq) => sq.id !== id),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validCategories = categories.filter((cat) => {
      const totalQuestions = cat.questions.length + cat.customQuestions.length;
      return cat.name && totalQuestions >= (cat.minQuestions || 1);
    });

    if (validCategories.length === 0) {
      toast.error("Please add at least one valid category with questions");
      return;
    }

    onSubmit({
      ...formData,
      categories: validCategories,
    });
  };

  const isQuestionAssignedToAnyCategory = (questionId) => {
    return categories.some((cat) => cat.questions.includes(questionId));
  };

  const getTotalSelectedQuestions = () => {
    return categories.reduce(
      (sum, cat) => sum + cat.questions.length + cat.customQuestions.length,
      0
    );
  };

  return (
    <Card className="p-0 py-4">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Button type="button" onClick={() => onBack()} variant="ghost">
                <ChevronLeft />
                Back
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">
                {formData.subjects?.length || 0} Subjects | {formData.type}{" "}
                Questions
              </div>
              <CommonBtn
                type="button"
                onClick={() => setIsPreviewDialogOpen(true)}
              >
                Preview
              </CommonBtn>
            </div>
          </div>

          <div className="mt-2 shadow2 p-4 border rounded-[16px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Question Parts</h3>
              <div className="text-sm text-muted-foreground">
                Questions: {getTotalSelectedQuestions()}
                {formData.questionCount && ` / ${formData.questionCount}`}
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex overflow-x-auto pb-2">
                {categories.map((category, index) => (
                  <div key={category.id} className="flex items-center mr-2">
                    <CommonBtn
                      type="button"
                      variant={
                        activeCategory === category.id ? "default" : "outline"
                      }
                      onClick={() => setActiveCategory(category.id)}
                      className="min-w-[100px]"
                    >
                      {category.name}
                      <Badge variant="secondary" className="ml-2">
                        {category.questions.length +
                          category.customQuestions.length}
                      </Badge>
                    </CommonBtn>
                    <div className="flex">
                      <CommonBtn
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => openEditCategoryDialog(category, index)}
                      >
                        <Pencil className="w-4 h-4" />
                      </CommonBtn>
                      {categories.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-1 text-red-500 hover:text-red-700"
                          onClick={() => removeCategory(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openAddCategoryDialog}
                >
                  <Plus className="w-4 h-4" /> Add Part
                </Button>
              </div>
              <div className="">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomQuestion}
                  disabled={
                    formData.questionCount &&
                    getTotalSelectedQuestions() >= formData.questionCount
                  }
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Custom Question
                </Button>
              </div>
            </div>
          </div>

          {formData.subjects?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">
                    Available {formData.type} Questions (
                    {filteredQuestions.length})
                  </h3>
                  <div className="w-64">
                    <Input
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="p-4 border rounded-lg animate-pulse"
                      >
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : isError ? (
                  <div className="p-4 border rounded-lg bg-red-50 text-red-600">
                    {fetchError?.message || "No questions availkable right now"}
                  </div>
                ) : filteredQuestions.length === 0 ? (
                  <div className="p-4 border rounded-lg text-muted-foreground text-center">
                    No {formData.type} questions found{" "}
                    {searchTerm ? `for "${searchTerm}"` : ""}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {filteredQuestions.map((question, idx) => {
                      const isAssigned = isQuestionAssignedToAnyCategory(
                        question._id
                      );
                      const isInCurrentCategory = activeCategory
                        ? categories
                            .find((cat) => cat.id === activeCategory)
                            ?.questions.includes(question._id)
                        : false;

                      return (
                        <div
                          key={question._id}
                          className={`p-4 rounded-lg cursor-pointer transition-all ${
                            isInCurrentCategory
                              ? "border-2 border-blue-500 shadow-md bg-blue-50"
                              : "border-b"
                          } ${
                            isAssigned && !isInCurrentCategory
                              ? "bg-gray-100"
                              : ""
                          }`}
                          onClick={() => toggleQuestionSelection(question._id)}
                        >
                          <div className="flex-1">
                            <Label
                              htmlFor={`question-${question._id}`}
                              className={`font-bold capitalize ${
                                isAssigned && !isInCurrentCategory
                                  ? "text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {idx + 1}. {question.questionText}
                            </Label>

                            {question.type === "MCQ" &&
                              question.options?.length > 0 && (
                                <div className="ml-4 mt-2 space-y-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
                                  {question.options.map((option, index) => (
                                    <div
                                      key={index}
                                      className={
                                        option === question.correctAnswer
                                          ? "border border-green bg-green/10  px-4 py-1 rounded-[8px]"
                                          : "border px-4 py-1 rounded-[8px] bg-gray2 w-full"
                                      }
                                    >
                                      <span className="mr-2 text-sm">
                                        {String.fromCharCode(97 + index)}.{" "}
                                      </span>
                                      <span className="text-sm">
                                        {option}
                                        {option === question.correctAnswer &&
                                          " (Correct)"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                            {question.type === "WRITTEN" &&
                              question.subQuestions?.length > 0 && (
                                <div className="ml-4 mt-1 space-y-1">
                                  {question.subQuestions.map((subQ, index) => (
                                    <div key={index} className="text-sm">
                                      <span>
                                        {String.fromCharCode(97 + index)}.{" "}
                                        {subQ.subQuestionText}
                                      </span>
                                      <span className="text-muted-foreground ml-2">
                                        ({subQ.mark} marks)
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                          {isAssigned && !isInCurrentCategory && (
                            <span className="text-xs text-muted-foreground">
                              (Assigned to another part)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="md:col-span-1">
                <div className="bg-white p-4 rounded-lg border shadow-sm sticky top-4">
                  <h3 className="text-lg font-medium mb-4">Filter Questions</h3>

                  {/* Difficulty Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3 text-gray-700">
                      Difficulty Level
                    </h4>
                    <div className="space-y-2">
                      {["EASY", "MEDIUM", "HARD"].map((level) => (
                        <div
                          key={level}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`difficulty-${level.toLowerCase()}`}
                            checked={
                              formData.difficulty?.includes(level) || false
                            }
                            onCheckedChange={(checked) => {
                              setFormData((prev) => {
                                const difficulties = prev.difficulty || [];
                                return {
                                  ...prev,
                                  difficulty: checked
                                    ? [...difficulties, level]
                                    : difficulties.filter((d) => d !== level),
                                };
                              });
                            }}
                          />
                          <Label
                            htmlFor={`difficulty-${level.toLowerCase()}`}
                            className="text-sm capitalize"
                          >
                            {level.toLowerCase()}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subject Filter */}
                  {questionsData?.subjectIds?.length > 1 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-3 text-gray-700">
                        By Subject
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {questionsData.subjectIds.map((subjectId) => {
                          const subject =
                            questionsData.questionsBySubject[subjectId]?.[0]
                              ?.subject;
                          if (!subject) return null;

                          return (
                            <div
                              key={subjectId}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`subject-${subjectId}`}
                                checked={
                                  formData.filterSubjects?.includes(
                                    subjectId
                                  ) || false
                                }
                                onCheckedChange={(checked) => {
                                  setFormData((prev) => {
                                    const filterSubjects =
                                      prev.filterSubjects || [];
                                    return {
                                      ...prev,
                                      filterSubjects: checked
                                        ? [...filterSubjects, subjectId]
                                        : filterSubjects.filter(
                                            (id) => id !== subjectId
                                          ),
                                    };
                                  });
                                }}
                              />
                              <Label
                                htmlFor={`subject-${subjectId}`}
                                className="text-sm"
                              >
                                {subject.name}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Clear Filters Button */}
                  {(formData.difficulty?.length > 0 ||
                    formData.filterSubjects?.length > 0) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          difficulty: undefined,
                          filterSubjects: undefined,
                        }));
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between mt-4">
          <CommonBtn type="submit" disabled={!formData.subjects?.length}>
            Create Question Set
          </CommonBtn>
        </CardFooter>
      </form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingIndex >= 0 ? "Edit Part" : "Add New Part"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Part Name *</Label>
              <Input
                value={currentCategory?.name || ""}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Part A"
                required
              />
            </div>
            <div>
              <Label>Instructions</Label>
              <Input
                value={currentCategory?.condition || ""}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    condition: e.target.value,
                  })
                }
                placeholder="e.g. Answer all questions"
              />
            </div>
            <div>
              <Label>Minimum Questions *</Label>
              <Input
                type="number"
                min="1"
                value={currentCategory?.minQuestions || 1}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    minQuestions: parseInt(e.target.value) || 1,
                  })
                }
                required
              />
            </div>
            {editingIndex >= 0 && (
              <div className="text-sm text-muted-foreground">
                Currently has {currentCategory?.questions?.length || 0}{" "}
                questions and {currentCategory?.customQuestions?.length || 0}{" "}
                custom questions
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveCategory}>
              {editingIndex >= 0 ? "Save Changes" : "Add Part"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCustomQuestionDialogOpen}
        onOpenChange={setIsCustomQuestionDialogOpen}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingCustomQuestionIndex >= 0
                ? "Edit Custom Question"
                : "Add Custom Question"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="">
              <Label>Question Text *</Label>
              <Textarea
                value={currentCustomQuestion.questionText}
                onChange={(e) =>
                  setCurrentCustomQuestion((prev) => ({
                    ...prev,
                    questionText: e.target.value,
                  }))
                }
                placeholder="Enter question text"
                required
              />
            </div>
            <div>
              <Label>Question Type: {formData.type}</Label>
            </div>

            {currentCustomQuestion.type === "MCQ" && (
              <div className="space-y-2">
                <Label>Options * (At least 2 required)</Label>
                {currentCustomQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      checked={currentCustomQuestion.correctAnswer === option}
                      onCheckedChange={() => handleCorrectAnswerChange(option)}
                      className="ml-1"
                    />
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Option
                </Button>

                {currentCustomQuestion.correctAnswer && (
                  <div className="text-sm text-green-600 mt-2">
                    ✓ Correct answer selected: "
                    {currentCustomQuestion.correctAnswer}"
                  </div>
                )}
              </div>
            )}

            {currentCustomQuestion.type === "WRITTEN" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Sub-Questions (Optional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSubQuestion}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Sub-Question
                  </Button>
                </div>
                {currentCustomQuestion.subQuestions.length > 0 && (
                  <div className="space-y-2">
                    {currentCustomQuestion.subQuestions.map((subQuestion) => (
                      <div
                        key={subQuestion.id}
                        className="flex items-center space-x-2"
                      >
                        <Input
                          value={subQuestion.subQuestionText}
                          onChange={(e) =>
                            handleSubQuestionChange(
                              subQuestion.id,
                              "subQuestionText",
                              e.target.value
                            )
                          }
                          placeholder="Sub-question text"
                          className="flex-grow"
                        />
                        <Input
                          type="number"
                          min="1"
                          value={subQuestion.mark}
                          onChange={(e) =>
                            handleSubQuestionChange(
                              subQuestion.id,
                              "mark",
                              parseInt(e.target.value) || 1
                            )
                          }
                          placeholder="Marks"
                          className="w-20"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveSubQuestion(subQuestion.id)
                          }
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {currentCustomQuestion.subQuestions.length === 0
                    ? "If no sub-questions are added, the main question text will be used as a single question."
                    : "The total marks will be the sum of all sub-question marks."}
                </div>
              </div>
            )}

            <div>
              <Label>Total Marks *</Label>
              <Input
                type="number"
                min="1"
                value={currentCustomQuestion.mark}
                onChange={(e) =>
                  setCurrentCustomQuestion((prev) => ({
                    ...prev,
                    mark: parseInt(e.target.value) || 1,
                  }))
                }
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCustomQuestionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveCustomQuestion}
              disabled={
                !currentCustomQuestion.questionText ||
                (currentCustomQuestion.type === "MCQ" &&
                  (currentCustomQuestion.options.length < 2 ||
                    !currentCustomQuestion.correctAnswer))
              }
            >
              Save Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="min-w-[1000px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Question Set Preview</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <QuestionSetPreviewCreate
              questions={filteredQuestions}
              categories={categories}
              title={formData.title}
              type={formData.type}
            />
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsPreviewDialogOpen(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
