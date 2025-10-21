"use client";
import { useState, useEffect } from "react";
import {
  useGetQuestionSetByIdQuery,
  useUpdateQuestionSetMutation,
} from "@/redux/features/questionBank/questionSet.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { QuestionSetBasicInfoUpdate } from "./QuestionSetBasicInfoUpdate";
import { QuestionSetDetailsUpdate } from "./QuestionSetDetailsUpdate";
import { useGetAllQuestionBankTypesQuery } from "@/redux/features/questionBank/questionBankType.api";

import Loader from "@/components/shared/Loader";
const QuestionSetUpdate = ({ questionsetId }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "WRITTEN",
    subjects: [],
    questionBankType: "",
    questionCount: null,
    categories: [],
    status: "DRAFT",
  });

  // Fetch existing question set data
  const {
    data: existingQuestionSet,
    isLoading,
    isError,
  } = useGetQuestionSetByIdQuery(questionsetId);

  const [updateQuestionSet] = useUpdateQuestionSetMutation();
  const { data: questionBankTypes = [] } = useGetAllQuestionBankTypesQuery();
  const router = useRouter();

  // Populate form when data loads
  useEffect(() => {
    if (existingQuestionSet?.data) {
      setFormData({
        title: existingQuestionSet.data.name,
        description: existingQuestionSet.data.description || "",
        type: existingQuestionSet.data.type,
        subjects: existingQuestionSet.data.subject?.map((sub) => sub._id) || [],
        questionBankType: existingQuestionSet.data.questionBankType,
        questionCount: existingQuestionSet.data.totalQuestions,
        categories: existingQuestionSet.data.categories || [],
        status: existingQuestionSet.data.status || "DRAFT",
      });
    }
  }, [existingQuestionSet]);

  const handleBasicInfoSubmit = (updatedData) => {
    setFormData((prev) => ({ ...prev, ...updatedData }));
    setStep(2);
  };

  const handleFinalSubmit = async (finalData) => {
    try {
      const updatePayload = {
        id: questionsetId,
        name: finalData.title,
        description: finalData.description,
        type: finalData.type,
        subject: finalData.subjects,
        questionBankType: finalData.questionBankType,
        categories: finalData.categories,
        status: finalData.status,
        totalQuestions: finalData.questionCount,
      };

      await updateQuestionSet(updatePayload).unwrap();
      toast.success("Question set updated successfully!");
      router.push("/admin/dashboard/question-set");
    } catch (error) {
      console.error("Failed to update question set:", error);
      toast.error(error.data?.message || "Failed to update question set");
    }
  };

  if (isLoading)
    return <Loader />;
  if (isError)
    return (
      <div className="container mx-auto py-8">Error loading question set</div>
    );

  return (
    <div className="container mx-auto py-8">
      {step === 1 ? (
        <QuestionSetBasicInfoUpdate
          formData={formData}
          setFormData={setFormData}
          // onNext={handleBasicInfoSubmit}
          onNext={() => setStep(2)}
          isUpdateMode={true}
          questionBankTypes={questionBankTypes}
        />
      ) : (
        <QuestionSetDetailsUpdate
          formData={formData}
          setFormData={setFormData}
          onBack={() => setStep(1)}
          onSubmit={handleFinalSubmit}
          isUpdateMode={true}
        />
      )}
    </div>
  );
};

export default QuestionSetUpdate;
