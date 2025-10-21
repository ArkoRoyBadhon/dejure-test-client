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
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export const QuestionSetBasicInfoUpdate = ({
  formData,
  setFormData,
  onNext,
  isUpdateMode = false,
  questionBankTypes = [],
}) => {
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

  // Find selected question bank type object
  const selectedBankType = questionBankTypes.find(
    (type) => type.id === formData.questionBankType
  );

  // Find all subjects for the selected bank type
  const allSubjects = selectedBankType?.subjects || [];

  // Helper to get subject name by id
  const getSubjectName = (subjectId) => {
    return (
      allSubjects.find((s) => s._id === subjectId)?.name ||
      `Subject ${subjectId}`
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const typdd = questionBankTypes.find((type) => type.id === formData.type);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="w-full shadow-xl rounded-lg border border-gray-100 overflow-hidden p-0">
        <CardHeader className="bg-main py-4">
          <CardTitle className="text-xl font-bold text-darkColor">
            {isUpdateMode ? "Update Question Set" : "Create Question Set"}
          </CardTitle>
          <p className="text-darkColor text-md mt-1">
            {isUpdateMode
              ? "Review and update basic information"
              : "Start by providing basic information"}
          </p>
        </CardHeader>

        <CardContent className="px-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Question set title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Question Bank Type *</Label>
                <Select
                  value={formData.questionBankType}
                  onValueChange={() => {}}
                  required
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Select type"
                      value={formData.questionBankType}
                    >
                      {selectedBankType?.curriculum?.subjectType}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
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

              <div className="space-y-2">
                <Label>Question Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={() => {}}
                  required
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Select type"
                      value={formData.type}
                    >
                      {formData.type === "MCQ"
                        ? "Multiple Choice"
                        : formData.type === "WRITTEN"
                        ? "Written"
                        : formData.type}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MCQ">Multiple Choice</SelectItem>
                    <SelectItem value="WRITTEN">Written</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Subjects *</Label>
              {formData.subjects?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.subjects.map((subjectId) => (
                    <Badge
                      key={subjectId}
                      variant="outline"
                      className="px-3 py-1"
                    >
                      {getSubjectName(subjectId)}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Subjects cannot be changed after creation
              </p>
            </div>

            <div className="space-y-2">
              <Label>Total Questions</Label>
              <Input
                type="number"
                min="1"
                name="questionCount"
                value={formData.questionCount || ""}
                onChange={handleInputChange}
                placeholder="Leave empty for no limit"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button disabled={!isValid} onClick={onNext}>
              {isUpdateMode ? "Continue to Questions" : "Next Step"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
