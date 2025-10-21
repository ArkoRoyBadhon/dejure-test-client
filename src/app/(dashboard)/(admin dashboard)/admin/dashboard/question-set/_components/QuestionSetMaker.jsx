"use client";
import { useState } from "react";
import { QuestionSetBasicInfo } from "./QuestionSetBasicInfo";
import { QuestionSetDetails } from "./QuestionSetDetails";
import { useCreateQuestionSetMutation } from "@/redux/features/questionBank/questionSet.api";
import { toast } from "sonner";
import { useGetAllQuestionBankTypesQuery } from "@/redux/features/questionBank/questionBankType.api";
import { useRouter } from "next/navigation";

const QuestionSetMaker = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "MCQ",
    subjects: [], // Changed from subject to subjects array
    questionBankType: "",
    questionCount: null,
  });

  const [createQuestionSet] = useCreateQuestionSetMutation();
  const { data: questionBankTypes = [] } = useGetAllQuestionBankTypesQuery();
  const router = useRouter();

  const handleSubmit = async (data) => {
    try {
      await createQuestionSet(data).unwrap();
      toast.success("Question set created successfully!");
      setFormData({
        title: "",
        description: "",
        type: "MCQ",
        subjects: [],
        questionBankType: "",
      });
      router.push("/admin/dashboard/question-set");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create question set");
    }
  };

  return (
    <div className="container mx-auto px-6 py-4">
      {step === 1 ? (
        <QuestionSetBasicInfo
          formData={formData}
          setFormData={setFormData}
          onNext={() => setStep(2)}
          questionBankTypes={questionBankTypes}
        />
      ) : (
        <QuestionSetDetails
          formData={formData}
          setFormData={setFormData}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
          questionBankTypes={questionBankTypes}
        />
      )}
    </div>
  );
};

export default QuestionSetMaker;
