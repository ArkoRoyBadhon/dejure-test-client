"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import { useCreateQuestionMutation } from "@/redux/features/questionBank/questionBank.api";
import AIWrittenForm from "./AIWrittenForm";
import AIMCQForm from "./AIMCQForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddWithAIModal = ({ subjectId, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedQuestions, setExtractedQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [createQuestion] = useCreateQuestionMutation();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleFileReset = (e) => {
    setFile();
  };

  // Function to convert Bengali numerals to English
  const convertBengaliNumberToEnglish = (bengaliNumber) => {
    const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return bengaliNumber.replace(/[০-৯]/g, (match) => {
      return bengaliNumerals.indexOf(match);
    });
  };

  // Function to convert Bengali option letters to English equivalents
  const convertBengaliOptionToEnglish = (bengaliOption) => {
    const bengaliOptions = ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ"];
    const englishOptions = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    const index = bengaliOptions.indexOf(bengaliOption);
    return index >= 0 ? englishOptions[index] : bengaliOption;
  };

  const uploadFile = async () => {
    if (!file) {
      toast.error("Please select a PDF file first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("scanType", "questions");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ocr/extract-text`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to extract text");
      }

      const responseData = await response.json();

      // Extract the result array from the response
      const rawQuestions = responseData.result || [];

      if (rawQuestions.length === 0) {
        throw new Error("No questions found in the PDF");
      }

      const formattedQuestions = rawQuestions
        .map((q, index) => {
          // Skip invalid questions
          if (
            !q.questionText &&
            (!q.subQuestions || q.subQuestions.length === 0) &&
            q.type !== "MCQ"
          ) {
            return null;
          }

          const baseQuestion = {
            questionText: q.questionText,
            type: q.type || "WRITTEN",
            difficulty: q.difficulty || "MEDIUM",
            source: q.source || "EXAM",
            sectionCode: q.sectionCode || undefined,
            explanation: q.explanation || undefined,
            subject: subjectId,
            status: "APPROVED",
            questionNumber: q.questionNumber
              ? convertBengaliNumberToEnglish(q.questionNumber)
              : `${index + 1}`,
          };

          // Handle MCQ questions
          if (q.type === "MCQ" && q.options) {
            return {
              ...baseQuestion,
              mark: q.totalMark || 1,
              options: q.options.map((opt, idx) => ({
                text: opt.optionText,
                isCorrect: opt.isCorrect,
                optionLetter: opt.optionLetter
                  ? convertBengaliOptionToEnglish(opt.optionLetter)
                  : String.fromCharCode(65 + idx), // A, B, C, D
              })),
              subQuestions: [],
              correctAnswer: q.options.find((opt) => opt.isCorrect).optionText,
            };
          }

          // Handle composite questions - only if it's explicitly marked as composite AND has subQuestions
          const isComposite =
            q.isComposite && q.subQuestions && q.subQuestions.length > 0;
          const hasValidSubQuestions =
            isComposite &&
            q.subQuestions.some(
              (sq) => sq.subQuestionText && sq.subQuestionText.trim() !== ""
            );

          if (isComposite && hasValidSubQuestions) {
            return {
              ...baseQuestion,
              mark:
                q.totalMark ||
                q.subQuestions.reduce((sum, sq) => sum + (sq.mark || 1), 0),
              subQuestions: q.subQuestions
                .filter(
                  (sq) => sq.subQuestionText && sq.subQuestionText.trim() !== ""
                )
                .map((sq, idx) => ({
                  subQuestionText: sq.subQuestionText,
                  mark: sq.mark || 1,
                  subQuestionNumber: sq.subQuestionNumber
                    ? convertBengaliOptionToEnglish(sq.subQuestionNumber)
                    : String.fromCharCode(65 + idx), // A, B, C, D
                })),
            };
          }

          // For non-composite written questions (most common case)
          return {
            ...baseQuestion,
            mark: q.totalMark || q.mark || 1,
            subQuestions: [], // Empty array for non-composite questions
          };
        })
        .filter((q) => q !== null);

      if (formattedQuestions.length === 0) {
        throw new Error("No valid questions found in the PDF");
      }

      // Auto-detect question type if all are same
      const detectedTypes = new Set(formattedQuestions.map((q) => q.type));
      if (detectedTypes.size === 1) {
        setQuestionType(detectedTypes.values().next().value);
      }

      setExtractedQuestions(formattedQuestions);
      toast.success(
        `Successfully extracted ${formattedQuestions.length} questions!`
      );
    } catch (error) {
      console.error("OCR Error:", error);
      toast.error(
        error.message ||
          "Failed to extract questions from PDF. Please check the file format."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuestions = async (editedQuestions) => {
    try {
      setIsLoading(true);
      const promises = editedQuestions.map((question) => {
        const questionData = {
          questionText: question.questionText || "", // Fixed: was always empty string
          type: question.type || questionType,
          mark: Number(question.mark),
          difficulty: question.difficulty || "MEDIUM",
          subject: subjectId,
          status: "APPROVED",
          source: question.source || "EXAM",
          sectionCode: question.sectionCode || undefined,
          explanation: question.explanation || undefined,
        };

        // Handle subQuestions - check if they exist regardless of isComposite flag
        if (question.subQuestions && question.subQuestions.length > 0) {
          questionData.subQuestions = question.subQuestions.map((sq) => ({
            subQuestionText: sq.subQuestionText,
            mark: Number(sq.mark),
            subQuestionNumber: sq.subQuestionNumber || "A", // Include subQuestionNumber
          }));
        }

        // Handle MCQ questions
        if (
          (question.type === "MCQ" || questionType === "MCQ") &&
          question.options
        ) {
          // Filter out null/undefined options and extract text
          questionData.options = question.options
            .filter((opt) => opt !== null && opt !== undefined)
            .map((opt) => {
              // Handle both object format {text: "option text"} and string format
              if (typeof opt === "object" && opt !== null) {
                return opt.text || "";
              }
              return opt || "";
            })
            .filter((optText) => optText.trim() !== ""); // Remove empty options

          // Find correct answer - handle both object and string formats
          let correctAnswer = "";
          if (question.correctAnswer) {
            correctAnswer = question.correctAnswer;
          } else if (question.options) {
            const correctOption = question.options.find((opt) => {
              if (typeof opt === "object" && opt !== null) {
                return opt.isCorrect;
              }
              return false;
            });
            correctAnswer = correctOption?.text || "";
          }

          questionData.correctAnswer = correctAnswer;
        }

        return createQuestion(questionData).unwrap();
      });

      await Promise.all(promises);
      toast.success(`Successfully added ${editedQuestions.length} questions!`);
      setOpen(false);
      setExtractedQuestions([]);
      setQuestionType("");
      onSuccess();
      setFile(null); // Use setFile instead of handleFileReset
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error?.data?.message || "Failed to save some questions");
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestionPreview = (q, i) => {
    // Use original question number if available, otherwise use index
    const questionNumber = q.questionNumber || `${i + 1}`;

    return (
      <div
        key={i}
        className="p-4 border-b last:border-b-0 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex items-start gap-3">
          <span className="font-medium text-gray-800">{questionNumber}.</span>
          <div className="flex-1">
            <p className="font-medium text-gray-800">{q.questionText}</p>

            {q.type === "MCQ" && q.options ? (
              <div className="mt-3 space-y-2">
                {q.options.map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className={`flex items-start gap-3 p-2 rounded ${
                      opt.isCorrect ? "bg-green-50" : "bg-gray-50"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full text-xs font-medium ${
                        opt.isCorrect
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {opt.optionLetter}
                    </span>
                    <span
                      className={`${
                        opt.isCorrect
                          ? "text-green-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {opt.text}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              q.subQuestions?.map((sq, j) => (
                <div key={j} className="mt-2 ml-4">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-gray-700">
                      {sq.subQuestionNumber}.
                    </span>
                    <div>
                      <p className="text-gray-700">{sq.subQuestionText}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Marks: {sq.mark}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Type: {q.type === "MCQ" ? "MCQ" : "Written"}
              </span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                Marks: {q.mark}
              </span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                Difficulty:{" "}
                {q.difficulty === "EASY"
                  ? "Easy"
                  : q.difficulty === "MEDIUM"
                  ? "Medium"
                  : "Hard"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setExtractedQuestions([]);
          setShowForm(false);
          setQuestionType("");
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <UploadCloud className="h-4 w-4" />
          Add With AI
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[95%] lg:min-w-[1000px] max-h-[90vh] overflow-y-auto">
        {!showForm ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Add Questions from PDF
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Upload a PDF file to extract questions using AI
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="space-y-3">
                <Label
                  htmlFor="pdf-upload"
                  className="text-gray-700 font-medium"
                >
                  Upload PDF File
                </Label>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="pdf-upload"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      isLoading
                        ? "border-gray-300 bg-gray-100"
                        : "border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                      <UploadCloud
                        className={`w-8 h-8 mb-3 ${
                          isLoading ? "text-gray-400" : "text-blue-500"
                        }`}
                      />
                      <p
                        className={`mb-2 text-sm ${
                          isLoading ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        {file ? (
                          <span className="font-medium">{file.name}</span>
                        ) : (
                          <>
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF only (MAX. 10MB)
                      </p>
                    </div>
                    <Input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      disabled={isLoading}
                      className="hidden"
                    />
                  </label>

                  <Button
                    onClick={uploadFile}
                    disabled={isLoading || !file}
                    className={`h-32 w-24 flex flex-col items-center justify-center gap-2 ${
                      isLoading || !file
                        ? "bg-gray-200 text-gray-500"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
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
                        Processing...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-5 w-5" />
                        Extract
                      </>
                    )}
                  </Button>
                </div>

                {file && (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span className="text-sm font-medium text-green-800">
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {extractedQuestions.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-lg text-blue-800 mb-2">
                      Extracted Questions ({extractedQuestions.length})
                    </h3>
                    <div className="max-h-60 overflow-y-auto border rounded-lg p-2 bg-white">
                      {extractedQuestions.map(renderQuestionPreview)}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="font-medium text-lg mb-3">
                      Select Question Type
                    </h3>
                    <div className="flex items-center gap-4">
                      <Select
                        value={questionType}
                        onValueChange={setQuestionType}
                        disabled
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WRITTEN">Written</SelectItem>
                          <SelectItem value="MCQ">MCQ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              {extractedQuestions.length === 0 ? null : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setExtractedQuestions([]);
                      setFile(null);
                    }}
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={() => setShowForm(true)}
                    disabled={isLoading || !questionType}
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : "Continue to Import"}
                  </Button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                {questionType === "MCQ" ? "MCQ Questions" : "Written Questions"}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Review and edit the extracted questions before importing
              </DialogDescription>
            </DialogHeader>

            {questionType === "MCQ" ? (
              <AIMCQForm
                subjectId={subjectId}
                initialQuestions={extractedQuestions}
                onCancel={() => setShowForm(false)}
                onSave={handleSaveQuestions}
                isImportMode={true}
              />
            ) : (
              <AIWrittenForm
                subjectId={subjectId}
                initialQuestions={extractedQuestions}
                onCancel={() => {
                  setShowForm(false);
                  handleFileReset();
                }}
                onSave={handleSaveQuestions}
                isImportMode={true}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddWithAIModal;
