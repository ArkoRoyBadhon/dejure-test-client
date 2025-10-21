"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import {
  MoreHorizontal,
  UserX,
  UserCheck,
  Trash2,
  Download,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  useDeactivateEnrollmentMutation,
  useDeleteEnrollmentMutation,
} from "@/redux/features/enroll/enroll.api";

export default function BulkOperations({
  selectedEnrollments,
  onClearSelection,
  onRefresh,
}) {
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkAction, setBulkAction] = useState(null);

  const [deactivateEnrollment] = useDeactivateEnrollmentMutation();
  const [deleteEnrollment] = useDeleteEnrollmentMutation();

  const selectedCount = selectedEnrollments.length;
  const activeCount = selectedEnrollments.filter((e) => !e.isSuspend).length;
  const suspendedCount = selectedEnrollments.filter((e) => e.isSuspend).length;

  const handleBulkAction = async (action, isSuspend = null) => {
    if (selectedCount === 0) {
      toast.error("No enrollments selected");
      return;
    }

    setIsProcessing(true);
    try {
      const promises = selectedEnrollments.map((enrollment) => {
        switch (action) {
          case "deactivate":
            return deactivateEnrollment({
              id: enrollment._id,
              isSuspend: true,
              reason: "Bulk deactivation",
            }).unwrap();
          case "reactivate":
            return deactivateEnrollment({
              id: enrollment._id,
              isSuspend: false,
              reason: "Bulk reactivation",
            }).unwrap();
          case "delete":
            return deleteEnrollment(enrollment._id).unwrap();
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);

      const actionText = {
        deactivate: "deactivated",
        reactivate: "reactivated",
        delete: "deleted",
      }[action];

      toast.success(
        `${selectedCount} enrollment(s) ${actionText} successfully!`
      );
      onClearSelection();
      onRefresh();
    } catch (error) {
      toast.error(`Failed to ${action} enrollments`, {
        description: "Some operations may have failed. Please try again.",
      });
    } finally {
      setIsProcessing(false);
      setIsDeactivateDialogOpen(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleExport = () => {
    // Create CSV data
    const csvData = selectedEnrollments.map((enrollment) => ({
      "Learner Name": enrollment.learner?.fullName || "",
      "Learner Email": enrollment.learner?.email || "",
      "Course Title": enrollment.course?.title || "",
      "Batch Number": enrollment.course?.batchNo || "",
      "Total Amount": enrollment.totalPay || 0,
      "Paid Amount": enrollment.paid || 0,
      "Due Amount": enrollment.due || 0,
      "Payment Status": enrollment.payment?.isPaid ? "Paid" : "Pending",
      "Payment Method": enrollment.payment?.paymentMethod || "",
      "Enrollment Date": new Date(enrollment.createdAt).toLocaleDateString(),
      Status: enrollment.isSuspend ? "Suspended" : "Active",
    }));

    // Convert to CSV
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers.map((header) => `"${row[header]}"`).join(",")
      ),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `enrollments_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast.success("Enrollments exported successfully!");
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {selectedCount} selected
        </Badge>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isProcessing}>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {activeCount > 0 && (
                <DropdownMenuItem
                  onClick={() => {
                    setBulkAction("deactivate");
                    setIsDeactivateDialogOpen(true);
                  }}
                  className="text-orange-600"
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Deactivate ({activeCount})
                </DropdownMenuItem>
              )}

              {suspendedCount > 0 && (
                <DropdownMenuItem
                  onClick={() => {
                    setBulkAction("reactivate");
                    setIsDeactivateDialogOpen(true);
                  }}
                  className="text-green-600"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Reactivate ({suspendedCount})
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" onClick={onClearSelection}>
            Clear
          </Button>
        </div>
      </div>

      {/* Deactivate/Reactivate Confirmation Dialog */}
      <AlertDialog
        open={isDeactivateDialogOpen}
        onOpenChange={setIsDeactivateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Confirm Bulk{" "}
              {bulkAction === "deactivate" ? "Deactivation" : "Reactivation"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {bulkAction} {selectedCount}{" "}
              enrollment(s)? This action will affect{" "}
              {bulkAction === "deactivate" ? activeCount : suspendedCount}{" "}
              enrollment(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleBulkAction(bulkAction)}
              disabled={isProcessing}
              className={
                bulkAction === "deactivate"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : ""
              }
            >
              {isProcessing ? "Processing..." : `Confirm ${bulkAction}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Confirm Bulk Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCount} enrollment(s)?
              This action cannot be undone and will permanently remove all
              selected enrollments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleBulkAction("delete")}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? "Deleting..." : "Delete All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
