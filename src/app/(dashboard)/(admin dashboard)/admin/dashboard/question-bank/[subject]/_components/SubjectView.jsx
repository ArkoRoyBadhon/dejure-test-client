"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubjectCard from "./SubjectBankCard";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useGetQuestionBankTypeByIdQuery,
  useUpdateQuestionBankTypeMutation,
} from "@/redux/features/questionBank/questionBankType.api";
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
import AddSubjectDialog from "./AddSubjectDialog";
import { Skeleton } from "@/components/ui/skeleton";

const QuestionSubjectView = ({ typeId }) => {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // API Hooks
  const { data, isLoading, isError, refetch } = useGetQuestionBankTypeByIdQuery(
    {
      id: typeId,
      search: debouncedSearchTerm,
      status: activeTab === "all" ? undefined : activeTab,
    }
  );

  const [updateQuestionBankType] = useUpdateQuestionBankTypeMutation();

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const handleActionClick = (subjectId, action) => {
    setSelectedSubject(subjectId);
    setActionType(action);
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedSubject || !data) return;

    setIsProcessing(true);
    try {
      if (actionType === "delete") {
        // Remove the subject from the question bank type's subjects array
        const updatedSubjects = data.subjects
          .filter((subject) => subject._id !== selectedSubject)
          .map((subject) => subject._id);

        await updateQuestionBankType({
          id: typeId,
          subjects: updatedSubjects,
        }).unwrap();

        toast.success("Subject removed from question bank type");
      } else if (actionType === "disable" || actionType === "enable") {
        // Update subject status in the question bank type
        const updatedSubjects = data.subjects.map((subject) => {
          if (subject._id === selectedSubject) {
            return {
              ...subject,
              isActive: actionType === "enable",
            };
          }
          return subject;
        });

        await updateQuestionBankType({
          id: typeId,
          subjects: updatedSubjects.map((s) => s._id),
          // Include any additional status fields if needed
        }).unwrap();

        toast.success(`Subject ${actionType}d successfully`);
      }

      refetch();
    } catch (error) {
      toast.error(
        `Failed to ${actionType} subject: ${
          error.data?.message || error.message
        }`
      );
    } finally {
      setIsProcessing(false);
      setDialogOpen(false);
      setSelectedSubject(null);
      setActionType(null);
    }
  };

  const getDialogConfig = () => {
    const subject = data?.subjects?.find((s) => s._id === selectedSubject);
    const subjectName = subject?.name || "this subject";

    switch (actionType) {
      case "delete":
        return {
          title: "Remove Subject?",
          description: `This will remove "${subjectName}" from this question bank type.`,
          actionText: "Remove",
          actionVariant: "destructive",
        };
      case "disable":
        return {
          title: `Disable "${subjectName}"?`,
          description:
            "This will mark the subject as inactive in this question bank type.",
          actionText: "Disable",
          actionVariant: "default",
        };
      case "enable":
        return {
          title: `Enable "${subjectName}"?`,
          description:
            "This will mark the subject as active in this question bank type.",
          actionText: "Enable",
          actionVariant: "default",
        };
      default:
        return {
          title: "Confirm Action",
          description: "Are you sure you want to perform this action?",
          actionText: "Confirm",
          actionVariant: "default",
        };
    }
  };

  // Skeleton loader for subjects
  const SubjectSkeleton = () => (
    <div className="p-6 bg-white rounded-xl shadow-sm border space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );

  return (
    <div className="p-4">
      {/* Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getDialogConfig().title}</AlertDialogTitle>
            <AlertDialogDescription>
              {getDialogConfig().description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              disabled={isProcessing}
              className={
                getDialogConfig().actionVariant === "destructive"
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
              }
            >
              {isProcessing ? "Processing..." : getDialogConfig().actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-white rounded-xl shadow-sm border mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-darkColor">
              {isLoading ? <Skeleton className="h-8 w-48" /> : data?.name}
            </h1>
          </div>
          <p className="text-gray-500">
            {isLoading ? (
              <Skeleton className="h-4 w-64 mt-2" />
            ) : (
              data?.description
            )}
          </p>
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </>
            ) : (
              <>
                <span>{data?.subjects?.length || 0} Subjects</span>
                <span>{data?.totalQuestions || 0} Questions</span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search subjects..."
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 border-0 focus-visible:ring-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <AddSubjectDialog
            questionBankType={data}
            onSubjectAdded={refetch}
            trigger={
              <Button className="py-2 px-4 font-medium rounded-[16px] text-darkColor bg-main hover:bg-main/90">
                Add Subject
              </Button>
            }
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap h-auto p-1 bg-gray-100 gap-1 rounded-[16px]">
            <TabsTrigger
              value="all"
              className="flex-1 py-2 px-6 rounded-[16px]"
            >
              All Subjects
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="flex-1 py-2 px-6 rounded-[16px]"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="disabled"
              className="flex-1 py-2 px-6 rounded-[16px]"
            >
              Disabled
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => <SubjectSkeleton key={i} />)
        ) : isError ? (
          <div className="col-span-3 text-center py-10">
            <p className="text-red-500">Failed to load subjects</p>
            <Button variant="outline" className="mt-4" onClick={refetch}>
              Retry
            </Button>
          </div>
        ) : data?.subjects?.length > 0 ? (
          data.subjects.map((subject) => (
            <SubjectCard
              key={subject._id}
              subject={subject}
              onActionClick={handleActionClick}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-10 text-gray-500">
            No subjects found{searchTerm ? ` matching "${searchTerm}"` : ""}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionSubjectView;
