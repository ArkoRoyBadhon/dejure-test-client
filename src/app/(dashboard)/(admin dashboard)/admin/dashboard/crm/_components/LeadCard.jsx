"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GripVertical, Loader2, User, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllRepresentativesQuery } from "@/redux/features/crm/representative.api";
import { useUpdateLeadMutation } from "@/redux/features/crm/crm.api";
import { toast } from "sonner";

export function LeadCard({
  lead,
  isDragging = false,
  handleConvertLead,
  isConverting,
  onDeleteLead,
  stages, // Add stages prop
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedRepresentative, setSelectedRepresentative] = useState(
    lead.assignedTo?._id || null
  );

  const { data: representatives, isLoading: isLoadingReps } =
    useGetAllRepresentativesQuery();
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();

  // Determine if this lead is in the final stage
  const finalStage =
    stages && stages.length > 0 ? stages[stages.length - 1] : null;
  const isFinalStage = finalStage && lead.stage === finalStage.stageId;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await onDeleteLead(lead._id);
    } catch (error) {
      console.error("Delete lead error:", error);
      toast.error(error.data?.message || "Failed to delete lead");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAssignClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAssignDialogOpen(true);
  };

  const handleAssignRepresentative = async () => {
    try {
      await updateLead({
        id: lead._id,
        assignedTo: selectedRepresentative || null,
        status: selectedRepresentative ? "contacted" : "new",
      }).unwrap();

      toast.success("Lead assigned to representative successfully");
      setIsAssignDialogOpen(false);
    } catch (error) {
      toast.error(
        error.data?.message || "Failed to assign lead to representative"
      );
    }
  };

  const initial = lead.fullName?.charAt(0)?.toUpperCase() || "?";

  const handleCardClick = () => {
    router.push(`/admin/dashboard/crm/leads/details/${lead._id}`);
  };

  const assignedRepresentative = representatives?.find(
    (rep) => rep?._id === lead.assignedTo?._id
  );

  return (
    <>
      <div
        className={`relative p-4 border rounded-lg bg-white shadow-sm cursor-pointer transition-all duration-200 group ${
          isDragging ? "shadow-lg opacity-80 scale-105" : ""
        } ${isHovered ? "border-main/50" : "border-gray-200"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Main content area */}
        <div className="flex items-start gap-3">
          {/* Profile Image / Initial */}
          <div className="flex-shrink-0 relative">
            {lead.profileImg && !imgError ? (
              <img
                src={lead.profileImg}
                alt={lead.fullName}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-main/10 text-main flex items-center justify-center font-semibold border-2 border-gray-100 text-lg">
                {initial}
              </div>
            )}
          </div>

          {/* Lead Info */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900 truncate">
                {lead.fullName}
              </h3>
              {/* Drag Handle - Only visible on hover */}
              <button
                className="text-gray-300 hover:text-gray-500 flex-shrink-0 cursor-grab active:cursor-grabbing ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Drag handle"
                onClick={(e) => e.preventDefault()}
                onPointerDown={(e) => e.preventDefault()}
              >
                <GripVertical className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm text-gray-600 truncate">{lead.email}</p>
            <p className="text-sm text-gray-600">{lead.phone}</p>

            {assignedRepresentative && (
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <User className="h-3 w-3 mr-1 text-gray-400" />
                <span className="truncate">
                  {assignedRepresentative.profileDetails?.fullName || "N/A"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 my-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 line-clamp-1 truncate">
            {lead.interestedSector || "N/A"}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 line-clamp-1 truncate">
            {lead.stage.replace(/_/g, " ")}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center gap-1 mt-2 border-t pt-2">
          <div className="">
            {/* Convert Button - Only for final stage */}
            {isFinalStage && lead.status !== "converted" && (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-main/30 text-main hover:bg-main/5 hover:text-main/90"
                onClick={(e) => {
                  e.stopPropagation();
                  handleConvertLead?.(lead._id);
                }}
                disabled={isConverting}
              >
                {isConverting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  "Convert to Student"
                )}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-blue-500 bg-blue-50"
              onClick={handleAssignClick}
              onPointerDown={(e) => e.stopPropagation()}
              title="Assign representative"
            >
              <User className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-red-500 bg-red-50"
              onClick={handleDelete}
              disabled={isDeleting}
              onPointerDown={(e) => e.stopPropagation()}
              title="Delete lead"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Assign Representative Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Representative</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Assigning <span className="font-medium">{lead.fullName}</span>{" "}
                to:
              </p>
              <Select
                value={selectedRepresentative || undefined}
                onValueChange={(value) =>
                  setSelectedRepresentative(value || null)
                }
                disabled={isLoadingReps || isUpdating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a representative" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Unassign</SelectItem>
                  {representatives?.map((rep) => (
                    <SelectItem key={rep._id} value={rep._id}>
                      {rep.profileDetails?.fullName} ({rep.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAssignDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignRepresentative}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
