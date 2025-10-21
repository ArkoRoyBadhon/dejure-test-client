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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  DollarSign,
  BookOpen,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function EnrollmentDetailsDialog({ enrollment, onClose }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return "৳0";
    }
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  const getStatusBadge = (enrollment) => {
    if (enrollment.isSuspend) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Suspended
        </Badge>
      );
    }

    if (enrollment.payment?.isPaid) {
      return (
        <Badge
          variant="default"
          className="flex items-center gap-1 bg-green-500"
        >
          <CheckCircle className="w-3 h-3" />
          Active
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Pending Payment
      </Badge>
    );
  };

  if (!enrollment) return null;

  return (
    <>
      <Dialog open={!!enrollment} onOpenChange={onClose}>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-25" />
        <DialogContent className="fixed left-[50%] top-[50%] custom-dialog-width translate-x-[-50%] translate-y-[-50%] overflow-auto max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center justify-between">
              <span>Enrollment Details</span>
              {getStatusBadge(enrollment)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Learner Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Learner Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{enrollment.learner?.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{enrollment.learner?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">
                    {enrollment.learner?.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-medium">
                    {enrollment.learner?.studentId || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Course Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Course Title</p>
                  <p className="font-medium">{enrollment.course?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Batch Number</p>
                  <p className="font-medium">{enrollment.course?.batchNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Course Type</p>
                  <p className="font-medium capitalize">
                    {enrollment.course?.courseType || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">
                    {enrollment.course?.durationMonths} months
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-medium text-lg">
                    {formatCurrency(enrollment.totalPay)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paid Amount</p>
                  <p className="font-medium text-lg text-green-600">
                    {formatCurrency(enrollment.paid)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Due Amount</p>
                  <p className="font-medium text-lg text-red-600">
                    {formatCurrency(enrollment.due)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium capitalize">
                    {enrollment.payment?.paymentMethod || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Type</p>
                  <p className="font-medium capitalize">
                    {enrollment.payment?.paymentType || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-medium">
                    {enrollment.payment?.isPaid ? "Paid" : "Pending"}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Discount Information */}
            {enrollment.adminDiscount && enrollment.adminDiscount > 0 && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-orange-800">
                  <DollarSign className="w-5 h-5" />
                  Admin Discount Applied
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Discount Percentage</p>
                    <p className="font-medium text-lg text-orange-600">
                      {enrollment.adminDiscount}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Original Amount</p>
                    <p className="font-medium text-lg line-through text-gray-500">
                      {enrollment.originalAmounts?.totalPay
                        ? formatCurrency(enrollment.originalAmounts.totalPay)
                        : enrollment.adminDiscount
                        ? formatCurrency(
                            enrollment.totalPay /
                              (1 - enrollment.adminDiscount / 100)
                          )
                        : formatCurrency(enrollment.totalPay)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount Saved</p>
                    <p className="font-medium text-lg text-green-600">
                      {enrollment.originalAmounts?.totalPay
                        ? formatCurrency(
                            enrollment.originalAmounts.totalPay -
                              enrollment.totalPay
                          )
                        : enrollment.adminDiscount
                        ? formatCurrency(
                            enrollment.totalPay /
                              (1 - enrollment.adminDiscount / 100) -
                              enrollment.totalPay
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Final Amount</p>
                    <p className="font-medium text-lg text-blue-600">
                      {formatCurrency(enrollment.totalPay)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Milestone Payments */}
            {enrollment.milestonePayments &&
              enrollment.milestonePayments.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    Milestone Payments
                    {enrollment.editableMilestonePercentages &&
                      Object.keys(enrollment.editableMilestonePercentages)
                        .length > 0 && (
                        <Badge
                          variant="outline"
                          className="text-blue-600 border-blue-300"
                        >
                          Custom Percentages
                        </Badge>
                      )}
                  </h3>
                  <div className="space-y-2">
                    {enrollment.milestonePayments.map((milestone, index) => {
                      const isCustomPercentage =
                        enrollment.editableMilestonePercentages &&
                        enrollment.editableMilestonePercentages[index] !==
                          undefined;
                      const originalAmount =
                        enrollment.originalAmounts?.milestonePayments?.[index]
                          ?.amount;

                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-white rounded border"
                        >
                          <div className="flex-1">
                            <p className="font-medium">
                              {milestone.milestoneTitle}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-gray-600">
                                {milestone.percentage || 0}%
                              </p>
                              {isCustomPercentage && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-blue-600 border-blue-300"
                                >
                                  Modified
                                </Badge>
                              )}
                            </div>
                            {originalAmount &&
                              originalAmount !== milestone.amount && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Original:{" "}
                                  {formatCurrency(originalAmount || 0)}
                                </p>
                              )}
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                milestone.isPaid ? "default" : "secondary"
                              }
                            >
                              {milestone.isPaid ? "Paid" : "Pending"}
                            </Badge>
                            {milestone.paidAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(milestone.paidAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Enrollment Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Enrollment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Enrollment Date</p>
                  <p className="font-medium">
                    {formatDate(enrollment.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium">
                    {formatDate(enrollment.updatedAt)}
                  </p>
                </div>
                {enrollment.deactivatedAt && (
                  <div>
                    <p className="text-sm text-gray-600">Deactivated At</p>
                    <p className="font-medium">
                      {formatDate(enrollment.deactivatedAt)}
                    </p>
                  </div>
                )}
                {enrollment.deactivationReason && (
                  <div>
                    <p className="text-sm text-gray-600">Deactivation Reason</p>
                    <p className="font-medium">
                      {enrollment.deactivationReason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {enrollment.note && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Notes</h3>
                <p className="text-gray-700">{enrollment.note}</p>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
