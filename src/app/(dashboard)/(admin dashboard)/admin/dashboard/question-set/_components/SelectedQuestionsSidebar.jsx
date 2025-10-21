"use client";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { useState } from "react";

export default function SelectedQuestionsSidebar({
  selectedQuestions,
  removeQuestionFromSet,
  removeSubQuestion,
  addSubQuestion,
  updateSubQuestion,
  totalPoints,
  category,
  categories,
  moveQuestionToCategory,
  onAddSubQuestionFromBank,
}) {
  const [moveQuestionId, setMoveQuestionId] = useState(null);
  const [moveSubQuestionId, setMoveSubQuestionId] = useState(null);

  return (
    <div className="w-80 border-l border-gray-200 bg-white p-4 overflow-y-auto">
      <div className="mb-4">
        <h3 className="font-bold text-lg">Section {category?.name}</h3>
        <p className="text-sm text-gray-600">{category?.condition}</p>
        <div className="mt-2">
          <Badge variant="secondary">
            {selectedQuestions.reduce(
              (sum, q) => sum + q.subQuestions.length,
              0
            )}{" "}
            Questions
          </Badge>
          <Badge variant="secondary" className="ml-2">
            {totalPoints} Points
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {selectedQuestions.map((question) => (
          <div
            key={question.id}
            className="border rounded-lg p-3 bg-gray-50 relative"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-sm">{question.question}</h4>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={() => removeQuestionFromSet(question.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {categories.length > 1 && (
              <div className="absolute top-1 right-1">
                <Popover
                  open={moveQuestionId === question.id}
                  onOpenChange={(open) =>
                    setMoveQuestionId(open ? question.id : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[150px] p-0">
                    <Command>
                      <CommandGroup>
                        {categories
                          .filter((c) => c.id !== category.id)
                          .map((cat) => (
                            <CommandItem
                              key={cat.id}
                              onSelect={() => {
                                moveQuestionToCategory(
                                  question.id,
                                  category.id,
                                  cat.id
                                );
                                setMoveQuestionId(null);
                              }}
                            >
                              Move to {cat.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="space-y-3 mt-2">
              {question.subQuestions.map((subQuestion) => (
                <div
                  key={subQuestion.id}
                  className="bg-white p-2 rounded border relative"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {subQuestion.type}
                      </Badge>
                      <Badge variant="outline">{subQuestion.points} pts</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() =>
                        removeSubQuestion(question.id, subQuestion.id)
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="mt-1">
                    <p className="text-sm">{subQuestion.text}</p>
                    {subQuestion.options?.length > 0 && (
                      <ul className="mt-1 space-y-1">
                        {subQuestion.options.map((option, i) => (
                          <li
                            key={i}
                            className={`text-xs pl-2 border-l ${
                              option === subQuestion.correctAnswer
                                ? "border-green-500 text-green-700"
                                : "border-gray-200"
                            }`}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <Label
                        htmlFor={`points-${subQuestion.id}`}
                        className="text-xs"
                      >
                        Points
                      </Label>
                      <Input
                        id={`points-${subQuestion.id}`}
                        type="number"
                        min="1"
                        value={subQuestion.points}
                        onChange={(e) =>
                          updateSubQuestion(question.id, subQuestion.id, {
                            points: parseInt(e.target.value) || 1,
                          })
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor={`type-${subQuestion.id}`}
                        className="text-xs"
                      >
                        Type
                      </Label>
                      <Select
                        value={subQuestion.type}
                        onValueChange={(value) =>
                          updateSubQuestion(question.id, subQuestion.id, {
                            type: value,
                          })
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">MCQ</SelectItem>
                          <SelectItem value="written">Written</SelectItem>
                          <SelectItem value="truefalse">True/False</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {categories.length > 1 && (
                    <div className="absolute top-1 right-1">
                      <Popover
                        open={moveSubQuestionId === subQuestion.id}
                        onOpenChange={(open) =>
                          setMoveSubQuestionId(open ? subQuestion.id : null)
                        }
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[150px] p-0">
                          <Command>
                            <CommandGroup>
                              {categories
                                .filter((c) => c.id !== category.id)
                                .map((cat) => (
                                  <CommandItem
                                    key={cat.id}
                                    onSelect={() => {
                                      // Create a new question in the target category with this subQuestion
                                      const newQuestion = {
                                        id: `moved-${Date.now()}`,
                                        question: question.question,
                                        subQuestions: [subQuestion],
                                      };
                                      moveQuestionToCategory(
                                        question.id,
                                        category.id,
                                        cat.id,
                                        newQuestion
                                      );
                                      setMoveSubQuestionId(null);
                                    }}
                                  >
                                    Move to {cat.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => addSubQuestion(question.id)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Sub-question
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => onAddSubQuestionFromBank(question.id)}
              >
                <Plus className="w-3 h-3 mr-1" />
                From Bank
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
