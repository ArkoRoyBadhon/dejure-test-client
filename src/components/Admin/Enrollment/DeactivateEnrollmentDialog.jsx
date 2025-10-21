"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserX, UserCheck, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function DeactivateEnrollmentDialog({
  open,
  onOpenChange,
  enrollment,
  onConfirm,
}) {
  const [status, setStatus] = useState(enrollment?.status || "pending");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onConfirm(status, reason || null);
    setReason("");
  };

  const handleClose = () => {
    onOpenChange(false);
    setReason("");
  };

  if (!enrollment) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-25" />
      <DialogContent className="fixed left-[50%] top-[50%] max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            Change Enrollment Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Enrollment Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Learner</p>
            <p className="font-medium">{enrollment.learner?.fullName}</p>
            <p className="text-sm text-gray-600">Course</p>
            <p className="font-medium">{enrollment.course?.title}</p>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <Label>Select Status</Label>
            <RadioGroup value={status} onValueChange={setStatus}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="pending" />
                <label
                  htmlFor="pending"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span>Pending</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="approved" id="approved" />
                <label
                  htmlFor="approved"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <span>Approved</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rejected" id="rejected" />
                <label
                  htmlFor="rejected"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <UserX className="w-4 h-4 text-red-600" />
                  <span>Rejected</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cancelled" id="cancelled" />
                <label
                  htmlFor="cancelled"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <UserX className="w-4 h-4 text-red-600" />
                  <span>Cancelled</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="completed" />
                <label
                  htmlFor="completed"
                  className="cursor-pointer flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Completed</span>
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for status change (optional)..."
              rows={3}
            />
          </div>

          {/* Warning Message */}
          {(status === "rejected" || status === "cancelled") && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Warning</p>
                <p>
                  Changing status to {status} will affect the learner's access
                  to the course. This action will be logged and notifications
                  will be sent.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant={
              status === "rejected" || status === "cancelled"
                ? "destructive"
                : "default"
            }
            className="flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
