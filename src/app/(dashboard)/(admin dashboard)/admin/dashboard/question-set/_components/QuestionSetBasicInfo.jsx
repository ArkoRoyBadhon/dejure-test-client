"use client";
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetAllQuestionBankTypesQuery } from "@/redux/features/questionBank/questionBankType.api";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

export const QuestionSetBasicInfo = ({
  formData,
  setFormData,
  onNext,
  questionBankTypes,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const router = useRouter();

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(
      !!formData.title &&
        !!formData.type &&
        !!formData.questionBankType &&
        !!formData.subjects?.length &&
        (!formData.questionCount || formData.questionCount > 0)
    );
  }, [formData]);

  const handleQuestionBankTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      questionBankType: value,
      subjects: [], // Reset subjects when question bank type changes
    }));
  };

  const handleSubjectChange = (subjectId) => {
    setFormData((prev) => {
      if (prev.subjects.includes(subjectId)) {
        return {
          ...prev,
          subjects: prev.subjects.filter((id) => id !== subjectId),
        };
      }
      return {
        ...prev,
        subjects: [...prev.subjects, subjectId],
      };
    });
  };

  const removeSubject = (subjectId) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((id) => id !== subjectId),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="w-full shadow-xl rounded-lg border border-gray-100 overflow-hidden p-0">
        <CardHeader className="bg-main py-4">
          <CardTitle className="text-xl font-bold text-darkColor">
            Create New Question Set
          </CardTitle>
          <p className="text-darkColor text-md mt-1">
            Start by providing basic information about your question set
          </p>
        </CardHeader>

        <CardContent className="px-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Title Input */}
            <div className="space-y-2">
              {/* <Label
                htmlFor="title"
                className="text-sm font-semibold text-gray-700"
              >
                Title <span className="text-red-500">*</span>
              </Label> */}
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                placeholder="e.g., Biology Midterm Exam 2023"
              />
            </div>

            {/* Two-column layout for selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Question Bank Type Select */}
              <div className="space-y-2">
                {/* <Label
                  htmlFor="questionBankType"
                  className="text-sm font-semibold text-gray-700"
                >
                  Question Bank Type <span className="text-red-500">*</span>
                </Label> */}
                <Select
                  name="questionBankType"
                  value={formData.questionBankType}
                  onValueChange={handleQuestionBankTypeChange}
                  required
                >
                  <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm bg-gray1">
                    <SelectValue placeholder="Select question bank type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md shadow-lg border border-gray-200 bg-gray1">
                    {questionBankTypes.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.id}
                        className="px-4 py-2 hover:bg-gray-50"
                      >
                        {type?.curriculum?.subjectType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Question Type Select */}
              <div className="space-y-2">
                {/* <Label
                  htmlFor="type"
                  className="text-sm font-semibold text-gray-700"
                >
                  Question Type <span className="text-red-500">*</span>
                </Label> */}
                <Select
                  name="type"
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                  required
                >
                  <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm bg-gray1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md shadow-lg border border-gray-200 bg-gray1">
                    <SelectItem
                      value="MCQ"
                      className="px-4 py-2 hover:bg-gray-50"
                    >
                      Multiple Choice
                    </SelectItem>
                    <SelectItem
                      value="WRITTEN"
                      className="px-4 py-2 hover:bg-gray-50"
                    >
                      Written
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subject Select */}
            {formData.questionBankType && (
              <div className="space-y-2">
                {/* <Label
                  htmlFor="subject"
                  className="text-sm font-semibold text-gray-700"
                >
                  Subjects <span className="text-red-500">*</span>
                </Label> */}

                {/* Selected subjects chips */}
                {formData.subjects?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.subjects.map((subjectId) => {
                      const subject = questionBankTypes
                        .find((type) => type.id === formData.questionBankType)
                        ?.subjects?.find((s) => s._id === subjectId);

                      return (
                        <Badge
                          key={subjectId}
                          variant="outline"
                          className="px-3 py-1 text-sm flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {subject?.name}
                          <button
                            type="button"
                            onClick={() => removeSubject(subjectId)}
                            className="text-blue-400 hover:text-blue-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                )}

                <Select onValueChange={handleSubjectChange} value="">
                  <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm bg-gray2">
                    <SelectValue placeholder="Select subjects" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md shadow-lg border border-gray-200 bg-gray2">
                    {(() => {
                      const availableSubjects =
                        questionBankTypes
                          .find((type) => type.id === formData.questionBankType)
                          ?.subjects?.filter(
                            (subject) =>
                              subject.isActive &&
                              !formData.subjects.includes(subject._id)
                          ) || [];

                      if (availableSubjects.length === 0) {
                        return (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            No subjects available
                          </div>
                        );
                      }

                      return availableSubjects.map((subject) => (
                        <SelectItem
                          key={subject._id}
                          value={subject._id}
                          className="px-4 py-2 hover:bg-gray-50"
                        >
                          {subject.name}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Select one or more subjects for this question set
                </p>
              </div>
            )}

            {/* Question Count Input */}
            <div className="space-y-2">
              {/* <Label
                htmlFor="questionCount"
                className="text-sm font-semibold text-gray-700"
              >
                Total Questions (Optional)
              </Label> */}
              <Input
                id="questionCount"
                name="questionCount"
                type="number"
                min="1"
                value={formData.questionCount || ""}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseInt(e.target.value)
                    : null;
                  setFormData((prev) => ({
                    ...prev,
                    questionCount: value > 0 ? value : null,
                  }));
                }}
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                placeholder="e.g., 30 (leave empty for no limit)"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will limit the total number of questions that can be
                selected
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex justify-between w-full">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-100 rounded-md shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              type="button"
              onClick={onNext}
              disabled={!isValid}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
