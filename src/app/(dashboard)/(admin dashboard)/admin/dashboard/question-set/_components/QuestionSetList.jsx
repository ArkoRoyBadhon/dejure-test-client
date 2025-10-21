"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  Plus,
  Eye,
  MoreVertical,
  FileSearch,
  AlertCircle,
  Edit,
  Filter,
  X,
} from "lucide-react";
import {
  useDeleteQuestionSetMutation,
  useGetAllQuestionSetsQuery,
} from "@/redux/features/questionBank/questionSet.api";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import QuestionSetPreviewMain from "@/app/(main)/_components/QuestionPreview";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const QuestionSetCard = ({ questionSet, onPreview, onDelete }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-12 gap-4 items-center p-4 border-b hover:bg-gray-50 transition-colors">
      <div className="col-span-3">
        <div className="font-medium text-gray-900">{questionSet.name}</div>
        <div className="text-xs text-gray-500">
          {questionSet.questionBankType?.curriculum?.subjectType}
        </div>
      </div>
      <div className="col-span-2">
        <div className="text-sm text-gray-500">
          {questionSet.type || "Standard"}
        </div>
      </div>
      <div className="col-span-2">
        <div className="text-sm text-gray-500">
          {questionSet.subject?.map((sub) => sub.name).join(", ")}
        </div>
      </div>
      <div className="col-span-2">
        <div className="text-sm text-gray-500">
          {questionSet.categories?.reduce(
            (total, cat) =>
              total +
              (cat.questions?.length || 0) +
              (cat.customQuestions?.length || 0),
            0
          )}
        </div>
      </div>
      <div className="col-span-2">
        <div className="text-sm text-gray-500">
          {format(new Date(questionSet.createdAt), "MMM dd, yyyy")}
        </div>
      </div>
      <div className="col-span-1 flex justify-center">
        <div className="relative flex">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(questionSet);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/admin/dashboard/question-set/edit/${questionSet.id}`
              );
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(questionSet);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const QuestionSetList = ({ searchTerm, onPermissionError }) => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState(null);
  const [questionSetToDelete, setQuestionSetToDelete] = useState(null);
  const [filteredQuestionSets, setFilteredQuestionSets] = useState([]);
  const [filters, setFilters] = useState({
    curriculumType: "all",
    subjectName: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const timeoutRef = useRef(null);

  const [deleteQuestionSet, { isLoading: isDeleting }] =
    useDeleteQuestionSetMutation();
  const {
    data: questionSets,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllQuestionSetsQuery();

  // Check for permission error
  useEffect(() => {
    if (
      error?.data?.message === "Insufficient module permissions" &&
      onPermissionError
    ) {
      onPermissionError();
    }
  }, [error, onPermissionError]);

  // Extract unique filter options
  const curriculumTypes = [
    { value: "all", label: "All curriculum types" },
    ...Array.from(
      new Set(
        questionSets
          ?.map((set) => set.questionBankType?.curriculum?.subjectType)
          .filter(Boolean)
      )
    ).map((type) => ({ value: type, label: type })),
  ];

  const subjectNames = [
    { value: "all", label: "All subjects" },
    ...Array.from(
      new Set(
        questionSets
          ?.flatMap((set) => set.subject?.map((sub) => sub.name))
          .filter(Boolean)
      )
    ).map((name) => ({ value: name, label: name })),
  ];

  useEffect(() => {
    if (questionSets) {
      let filtered = [...questionSets];

      // Apply search term filter
      if (searchTerm) {
        filtered = filtered.filter((set) =>
          set.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply curriculum type filter
      if (filters.curriculumType && filters.curriculumType !== "all") {
        filtered = filtered.filter(
          (set) =>
            set.questionBankType?.curriculum?.subjectType ===
            filters.curriculumType
        );
      }

      // Apply subject name filter
      if (filters.subjectName && filters.subjectName !== "all") {
        filtered = filtered.filter((set) =>
          set.subject?.some((sub) => sub.name === filters.subjectName)
        );
      }

      setFilteredQuestionSets(filtered);
    }
  }, [searchTerm, questionSets, filters]);

  const handlePreviewClick = (questionSet) => {
    setSelectedQuestionSet(questionSet);
    setIsPreviewModalOpen(true);
  };

  const handleDeleteClick = (questionSet) => {
    setQuestionSetToDelete(questionSet);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!questionSetToDelete) return;

    try {
      await deleteQuestionSet(questionSetToDelete.id).unwrap();
      toast.success("Question set deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete question set");
      console.error("Error deleting question set:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setQuestionSetToDelete(null);
    }
  };

  const resetFilters = () => {
    setFilters({
      curriculumType: "all",
      subjectName: "all",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium text-gray-500 uppercase tracking-wider text-xs">
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Subject</div>
          <div className="col-span-2">Questions</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b">
            <div className="col-span-3">
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-2">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-red-500 font-medium">Failed to load question sets</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          {(filters.curriculumType !== "all" ||
            filters.subjectName !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-red-500"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Curriculum Type
            </label>
            <Select
              value={filters.curriculumType}
              onValueChange={(value) =>
                setFilters({ ...filters, curriculumType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select curriculum type" />
              </SelectTrigger>
              <SelectContent>
                {curriculumTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Name
            </label>
            <Select
              value={filters.subjectName}
              onValueChange={(value) =>
                setFilters({ ...filters, subjectName: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjectNames.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium text-gray-500 uppercase tracking-wider text-xs">
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Subject</div>
          <div className="col-span-2">Questions</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Content */}
        {filteredQuestionSets?.length > 0 ? (
          filteredQuestionSets.map((set) => (
            <QuestionSetCard
              key={set._id}
              questionSet={set}
              onPreview={handlePreviewClick}
              onDelete={handleDeleteClick}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-2 p-4">
            <FileSearch className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground font-medium">
              {searchTerm ||
              filters.curriculumType !== "all" ||
              filters.subjectName !== "all"
                ? "No question sets found matching your criteria"
                : "No question sets available"}
            </p>
            {(searchTerm ||
              filters.curriculumType !== "all" ||
              filters.subjectName !== "all") && (
              <Button variant="outline" onClick={resetFilters}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="min-w-[1000px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Question Set Preview</DialogTitle>
          </DialogHeader>
          {selectedQuestionSet && (
            <QuestionSetPreviewMain
              assignedBankQuestions={
                selectedQuestionSet.categories?.flatMap(
                  (cat) => cat.questions || []
                ) || []
              }
              title={selectedQuestionSet.name}
              timeDuration={selectedQuestionSet.timeDuration}
              totalPoints={
                selectedQuestionSet.categories?.reduce(
                  (totalCategoryPoints, category) => {
                    const categoryBankQuestionsPoints = (
                      category.questions || []
                    ).reduce((sum, q) => {
                      if (
                        q.type?.toUpperCase() === "WRITTEN" &&
                        q.subQuestions &&
                        q.subQuestions.length > 0
                      ) {
                        return (
                          sum +
                          q.subQuestions.reduce(
                            (subSum, subQ) =>
                              subSum + (subQ.mark || subQ.points || 0),
                            0
                          )
                        );
                      }
                      return sum + (q.mark || q.points || 0);
                    }, 0);

                    const categoryCustomQuestionsPoints = (
                      category.customQuestions || []
                    ).reduce((sum, q) => {
                      if (
                        q.type?.toUpperCase() === "WRITTEN" &&
                        q.subQuestions &&
                        q.subQuestions.length > 0
                      ) {
                        return (
                          sum +
                          q.subQuestions.reduce(
                            (subSum, subQ) => subSum + (subQ.mark || 0),
                            0
                          )
                        );
                      }
                      return sum + (q.mark || 0);
                    }, 0);

                    return (
                      totalCategoryPoints +
                      categoryBankQuestionsPoints +
                      categoryCustomQuestionsPoints
                    );
                  },
                  0
                ) || 0
              }
              categories={selectedQuestionSet.categories || []}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Delete Question Set</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete the question set{" "}
              <span className="font-semibold">{questionSetToDelete?.name}</span>
              ? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionSetList;
