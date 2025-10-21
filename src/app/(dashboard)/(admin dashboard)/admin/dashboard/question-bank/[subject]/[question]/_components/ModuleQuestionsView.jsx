"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionCard from "./QuestionCard";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useDeleteQuestionByIdMutation,
  useGetQuestionBySubjectQuery,
  useUpdateQuestionMutation,
} from "@/redux/features/questionBank/questionBank.api";
import { Skeleton } from "@/components/ui/skeleton";
import AddQuestionModal from "./AddQuestionModal";
import EditQuestionModal from "./EditQuestionmodal";
import AddWithAIModal from "./AddWithAIModal";

const ModuleQuestionsView = ({ subjectId }) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("mcq");

  // RTK Query hooks
  const { data, isLoading, isError, refetch } = useGetQuestionBySubjectQuery({
    subjectId: subjectId,
    search: debouncedSearchTerm,
    type: activeTab,
  });

  const [deleteQuestionById] = useDeleteQuestionByIdMutation();
  const [updateQuestion] = useUpdateQuestionMutation();

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [activeTab, debouncedSearchTerm, refetch]);

  const handleActionClick = (questionId, action) => {
    setSelectedQuestion(questionId);
    if (action === "delete") {
      setDeleteDialogOpen(true);
    }
  };

  const handleEditClick = (question) => {
    setSelectedQuestion(question);
    setEditModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteQuestionById(selectedQuestion).unwrap();
      toast.success("Question deleted successfully!");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete question");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleUpdateQuestion = async (updatedQuestion) => {
    try {
      await updateQuestion({
        id: selectedQuestion._id,
        data: updatedQuestion,
      }).unwrap();
      toast.success("Question updated successfully!");
      refetch();
      setEditModalOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update question");
    }
  };

  const getSelectedQuestionText = () => {
    if (!selectedQuestion || !data?.questions) return "";
    const question = data.questions.find((q) => q._id === selectedQuestion);
    return question ? question.questionText : "";
  };

  // Skeleton Loader Component
  const QuestionSkeleton = () => (
    <div className="p-6 bg-white rounded-xl shadow-sm border space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-16" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              question: "{getSelectedQuestionText()}"
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Question Modal */}
      {editModalOpen && selectedQuestion && (
        <EditQuestionModal
          question={selectedQuestion}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdateQuestion}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-white rounded-xl shadow-sm border mb-6">
        <div>
          <div className="flex items-center gap-2">
            <ArrowLeft
              onClick={() => router.back()}
              className="h-5 w-5 cursor-pointer"
            />
            <h1 className="text-2xl font-bold text-darkColor">
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                data?.subject?.name
              )}
            </h1>
          </div>
          <p className="text-gray-500">
            {isLoading ? (
              <Skeleton className="h-4 w-64 mt-2" />
            ) : (
              data?.module?.description
            )}
          </p>
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            {isLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <span>{data?.questions.length || 0} Questions</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            <Input
              placeholder="Search questions..."
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 border-0 focus-visible:ring-2"
              aria-label="Search questions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <AddWithAIModal subjectId={subjectId} onSuccess={refetch} />
          <AddQuestionModal subjectId={subjectId} onQuestionAdded={refetch} />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Tabs
          defaultValue="mcq"
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="flex flex-wrap h-auto p-1 bg-gray-100 gap-1 rounded-[16px]">
            <TabsTrigger
              value="mcq"
              className="flex-1 py-2 px-6 text-sm sm:text-base font-medium transition-colors text-darkColor rounded-[16px] data-[state=active]:bg-main data-[state=active]:font-bold data-[state=active]:shadow-sm cursor-pointer"
              disabled={isLoading}
            >
              MCQ
            </TabsTrigger>
            <TabsTrigger
              value="written"
              className="flex-1 py-2 px-6 text-sm sm:text-base font-medium transition-colors text-darkColor rounded-[16px] data-[state=active]:bg-main data-[state=active]:font-bold data-[state=active]:shadow-sm cursor-pointer"
              disabled={isLoading}
            >
              Written
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => <QuestionSkeleton key={i} />)
        ) : isError ? (
          <div className="text-center py-10">
            <p className="text-deepGray">No questions availkable right now</p>
          </div>
        ) : data?.questions?.length > 0 ? (
          data.questions.map((question, index) => (
            <QuestionCard
              index={index}
              question={question}
              onActionClick={handleActionClick}
              onEditClick={handleEditClick}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No {activeTab === "mcq" ? "MCQ" : "Written"} questions found{" "}
            {searchTerm && `matching "${searchTerm}"`}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleQuestionsView;
