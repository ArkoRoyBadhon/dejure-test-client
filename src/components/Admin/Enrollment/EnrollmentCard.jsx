import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  UserX,
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  useUpdateEnrollmentMutation,
  useUpdateEnrollmentStatusMutation,
  useDeleteEnrollmentMutation,
} from "@/redux/features/enroll/enroll.api";
import DeactivateEnrollmentDialog from "./DeactivateEnrollmentDialog";
import DeleteEnrollmentDialog from "./DeleteEnrollmentDialog";

export default function EnrollmentCard({
  enrollment,
  onClick,
  isSelected = false,
  onSelect = null,
  showSelection = false,
  onEdit = null,
  onRefresh = null,
}) {
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [updateEnrollment] = useUpdateEnrollmentMutation();
  const [updateEnrollmentStatus] = useUpdateEnrollmentStatusMutation();
  const [deleteEnrollment] = useDeleteEnrollmentMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleStatusChange = async (status, reason) => {
    try {
      await updateEnrollmentStatus({
        id: enrollment._id,
        status,
        reason,
      }).unwrap();

      toast.success(`Enrollment status changed to ${status} successfully!`);
      if (onRefresh) onRefresh();
      setIsDeactivateDialogOpen(false);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update enrollment status", {
        description: error.data?.message || "Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEnrollment(enrollment._id).unwrap();
      toast.success("Enrollment deleted successfully!");
      if (onRefresh) onRefresh();
      setIsDeleteDialogOpen(false);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete enrollment", {
        description: error.data?.message || "Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = () => {
    const status = enrollment.status || "pending";

    switch (status) {
      case "approved":
        return (
          <Badge
            variant="default"
            className="flex items-center gap-1 bg-green-500"
          >
            <CheckCircle className="w-3 h-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <UserX className="w-3 h-3" />
            Rejected
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <UserX className="w-3 h-3" />
            Cancelled
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="default"
            className="flex items-center gap-1 bg-blue-500"
          >
            <CheckCircle className="w-3 h-3" />
            Completed
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div
      className={`rounded-lg shadow-lg overflow-visible border bg-white hover:shadow-lg transition-shadow cursor-pointer relative ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={(e) => {
        if (!isDialogOpen && !isDeactivateDialogOpen && !isDeleteDialogOpen) {
          onClick();
        }
      }}
    >
      <div className="p-4">
        {/* Header with selection, status, and actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {showSelection && onSelect && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect(enrollment._id, checked)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {getStatusBadge()}
          </div>

          {/* Actions Menu */}
          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {/* Custom Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-8 w-48 bg-white border shadow-lg rounded-md z-50">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit && onEdit(enrollment);
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-3 text-sm"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeactivateDialogOpen(true);
                    setIsDialogOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-3 text-sm text-blue-600"
                >
                  <UserCheck className="h-4 w-4" />
                  Change Status
                </div>

                <div className="border-t border-gray-200"></div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteDialogOpen(true);
                    setIsDialogOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-600 cursor-pointer hover:bg-gray-100 p-3 text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Main content row - stacks on mobile, single row on PC */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Learner info section */}
          <div className="flex-1 flex items-start space-x-4 min-w-0">
            <div className="flex-shrink-0">
              <Image
                className="h-12 w-12 rounded-full"
                height={12}
                width={12}
                src={`${process.env.NEXT_PUBLIC_API_URL}/${enrollment.learner?.image}`}
                alt={enrollment.learner?.fullName}
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {enrollment.learner?.fullName}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {enrollment.learner?.email}
              </p>
              <div className="mt-2 lg:hidden">
                <h4 className="text-md font-medium text-gray-900">
                  {enrollment?.course?.title}
                </h4>
                <p className="text-sm text-gray-500">
                  Batch: {enrollment?.course?.batchNo}
                </p>
              </div>
            </div>
          </div>

          {/* Course info section - hidden on mobile, shown on PC */}
          <div className="hidden lg:block flex-1 min-w-0">
            <h4 className="text-md font-medium text-gray-900">
              {enrollment?.course?.title}
            </h4>
            <p className="text-sm text-gray-500">
              Batch: {enrollment?.course?.batchNo}
            </p>
          </div>

          {/* Payment info section */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-2">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  ৳{enrollment.totalPay}
                </p>
                <p className="text-xs text-gray-500">Due: ৳{enrollment.due}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full 
                ${
                  enrollment.payment.isPaid
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {enrollment.payment.isPaid ? "Paid" : "Pending"}
              </span>
            </div>
            {/* <p className="text-sm text-gray-500 whitespace-nowrap">
              {new Date(enrollment.enrollmentDate).toLocaleDateString()}
            </p> */}
          </div>
        </div>

        {/* Course info section - shown only on mobile */}
        <div className="mt-4 lg:hidden">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-900">
                ৳{enrollment.totalPay}
              </p>
              <p className="text-xs text-gray-500">Due: ৳{enrollment.due}</p>
            </div>
            <p className="text-sm text-gray-500">
              {new Date(enrollment.enrollmentDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Deactivate Dialog */}
      <DeactivateEnrollmentDialog
        open={isDeactivateDialogOpen}
        onOpenChange={(open) => {
          setIsDeactivateDialogOpen(open);
          if (!open) setIsDialogOpen(false);
        }}
        enrollment={enrollment}
        onConfirm={handleStatusChange}
      />

      {/* Delete Dialog */}
      <DeleteEnrollmentDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setIsDialogOpen(false);
        }}
        enrollment={enrollment}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
