"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Plus, Scale, Search } from "lucide-react";
import { useState, useEffect } from "react";
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
import QuestionTypecard from "./QuestionTypecard";
import { Skeleton } from "@/components/ui/skeleton";
import AddLawTypeDialog from "./AddLawType";
import {
  useDeleteQuestionBankTypeMutation,
  useGetAllQuestionBankTypesQuery,
  useUpdateQuestionBankTypeMutation,
} from "@/redux/features/questionBank/questionBankType.api";
import PermissionError from "@/components/shared/PermissionError";

const QuestionBankView = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [enableDialogOpen, setEnableDialogOpen] = useState(false);
  const [selectedLawType, setSelectedLawType] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // RTK Query with filters
  const { data, isLoading, isError, error, refetch } = useGetAllQuestionBankTypesQuery(
    {
      search: debouncedSearchTerm,
      status: activeTab === "all" ? undefined : activeTab,
      sort:
        activeTab === "mostUsed"
          ? "-questions"
          : activeTab === "recent"
          ? "-createdAt"
          : undefined,
    }
  );

  const [updateQuestionBankType] = useUpdateQuestionBankTypeMutation();
  const [deleteQuestionBankType] = useDeleteQuestionBankTypeMutation();

  // Debounce effect
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

  const handleActionClick = async (lawTypeId, action) => {
    setSelectedLawType(lawTypeId);
    setActionType(action);

    if (action === "delete") {
      setDeleteDialogOpen(true);
    } else if (action === "disable") {
      setDisableDialogOpen(true);
    } else if (action === "enable") {
      setEnableDialogOpen(true);
    }
  };

  const confirmAction = async () => {
    if (deleteDialogOpen) {
      await deleteQuestionBankType(selectedLawType);
    }
    if (disableDialogOpen) {
      await updateQuestionBankType({ id: selectedLawType, isActive: false });
    }
    if (enableDialogOpen) {
      await updateQuestionBankType({ id: selectedLawType, isActive: true });
    }
    setDeleteDialogOpen(false);
    setDisableDialogOpen(false);
    setEnableDialogOpen(false);
    setSelectedLawType(null);
    setActionType(null);
  };

  const getSelectedLawTypeName = () => {
    if (!selectedLawType) return "";
    const lawType = data?.find((lt) => lt._id === selectedLawType);
    return lawType ? lawType.name : "";
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="p-6 bg-white rounded-xl shadow-sm border">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );

  if (error?.data?.message === "Insufficient module permissions") {
    return <PermissionError />;
  }

  return (
    <div className="p-4">
      {/* Confirmation Dialogs */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the "
              {getSelectedLawTypeName()}" law type and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Disable "{getSelectedLawTypeName()}"?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Disabling will make this law type unavailable for new questions
              but won't delete existing data. You can enable it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Disable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={enableDialogOpen} onOpenChange={setEnableDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Enable "{getSelectedLawTypeName()}"?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will make the law type available for new questions and
              modules.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Enable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-white rounded-xl shadow-sm border mb-6">
        <div>
          <h1 className="text-2xl font-bold text-darkColor">Question Bank</h1>
          <p className="text-gray-500">
            Manage and organize your law questions
          </p>
        </div>
        <div className="flex flex-col justify-center items-center sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            <Input
              placeholder="Search question bank..."
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 border-0 focus-visible:ring-2"
              aria-label="Search Question Bank.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            className="flex items-center gap-2 text-darkColor bg-main hover:bg-main cursor-pointer"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-4 w-4" />
            Add Question Bank
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="flex flex-wrap h-auto p-1 bg-gray-100 gap-1 rounded-[16px]">
            <TabsTrigger
              value="all"
              className="flex-1 py-2 px-6 text-sm sm:text-base font-medium transition-colors text-darkColor rounded-[16px] data-[state=active]:bg-main data-[state=active]:font-bold data-[state=active]:shadow-sm cursor-pointer"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="flex-1 py-2 px-6 text-sm sm:text-base font-medium transition-colors text-darkColor rounded-[16px] data-[state=active]:bg-main data-[state=active]:font-bold data-[state=active]:shadow-sm cursor-pointer"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="disabled"
              className="flex-1 py-2 px-6 text-sm sm:text-base font-medium transition-colors text-darkColor rounded-[16px] data-[state=active]:bg-main data-[state=active]:font-bold data-[state=active]:shadow-sm cursor-pointer"
            >
              Disabled
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {isLoading ? (
        <SkeletonLoader />
      ) : isError ? (
        <div className="text-center py-10">
          <p className="text-red-500">Failed to load law types</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.length > 0 ? (
            data.map((questionBankType) => (
              <QuestionTypecard
                key={questionBankType._id}
                questionBankType={questionBankType}
                onActionClick={handleActionClick}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No Question Bank found</p>
            </div>
          )}
        </div>
      )}

      <AddLawTypeDialog open={isCreating} onOpenChange={setIsCreating} />
    </div>
  );
};

export default QuestionBankView;
