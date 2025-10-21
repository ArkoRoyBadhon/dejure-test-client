"use client";
import { useState } from "react";
import { toast } from "sonner";
import EnrollmentCard from "@/components/Admin/Enrollment/EnrollmentCard";
import EnrollmentDetailsDialog from "@/components/Admin/Enrollment/EnrollmentDetailsDialog";
import EnrollmentFormDialog from "@/components/Admin/Enrollment/EnrollmentFormDialog";
import EnrollmentFilters from "@/components/Admin/Enrollment/EnrollmentFilters";
// import BulkOperations from "@/components/Admin/Enrollment/BulkOperations";
import {
  useGetAllEnrollmentsQuery,
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useUpdateEnrollmentStatusMutation,
  useDeleteEnrollmentMutation,
} from "@/redux/features/enroll/enroll.api";
import Loader from "@/components/shared/Loader";

import { useGetAllLearnersQuery } from "@/redux/features/auth/learner.api";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import PermissionError from "@/components/shared/PermissionError";

export default function EnrollmentPage() {
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  // const [selectedEnrollments, setSelectedEnrollments] = useState([]);
  // const [showSelection, setShowSelection] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    paymentStatus: "all",
    course: "all",
    paymentMethod: "all",
  });
  const { data: coursesData } = useGetCoursesQuery();

  const {
    data: enrollments = [],
    isLoading,
    error: enrollmentError,
    refetch: refetchEnrollments,
  } = useGetAllEnrollmentsQuery();

  const { data: learnersResponse = [], isLoading: isLearnersLoading } =
    useGetAllLearnersQuery();
  const { data: courses = [], isLoading: isCoursesLoading } =
    useGetCoursesQuery();
  const learners = learnersResponse.learners || [];

  // Calculate stats
  const getStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Current month start and end dates
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);
    monthEnd.setHours(23, 59, 59, 999); // Ensure end of month time

    // Last 7 days: from today to 6 days ago
    const weekEnd = new Date(now);
    weekEnd.setHours(23, 59, 59, 999);

    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    let currentMonthEnrollments = 0;
    let currentWeekEnrollments = 0;
    let totalRevenue = 0;

    enrollments.forEach((enrollment) => {
      const enrollmentDate = new Date(enrollment.createdAt);
      const amount = enrollment.totalPay || 0;

      // Count for current month
      if (enrollmentDate >= monthStart && enrollmentDate <= monthEnd) {
        currentMonthEnrollments++;
      }

      // Count for last 7 days including today
      if (enrollmentDate >= weekStart && enrollmentDate <= weekEnd) {
        currentWeekEnrollments++;
      }

      // Sum total revenue
      if (enrollment.payment?.isPaid) {
        totalRevenue += amount;
      }
    });

    return {
      currentMonthEnrollments,
      currentWeekEnrollments,
      totalRevenue: totalRevenue.toFixed(2),
    };
  };

  const stats = getStats();

  // API mutations
  const [createEnrollment, { isLoading: isCreating }] =
    useCreateEnrollmentMutation();
  const [updateEnrollment, { isLoading: isUpdating }] =
    useUpdateEnrollmentMutation();

  // Handle edit enrollment
  const handleEditEnrollment = (enrollment) => {
    setEditingEnrollment(enrollment);
    setIsEditDialogOpen(true);
  };

  const handleUpdateEnrollment = async (updateData) => {
    try {
      await updateEnrollment({
        id: editingEnrollment._id,
        ...updateData,
      }).unwrap();
      toast.success("Enrollment updated successfully!");
      refetchEnrollments();
      setIsEditDialogOpen(false);
      setEditingEnrollment(null);
    } catch (error) {
      toast.error("Failed to update enrollment", {
        description: error.data?.message || "Please try again.",
      });
    }
  };

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      filters.search === "" ||
      enrollment.learner?.fullName
        ?.toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      enrollment.course?.title
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

    const matchesPaymentStatus =
      filters.paymentStatus === "all" ||
      (filters.paymentStatus === "paid" && enrollment.payment?.isPaid) ||
      (filters.paymentStatus === "pending" && !enrollment.payment?.isPaid);

    const matchesCourse =
      filters.course === "all" || enrollment.course?._id === filters.course;

    const matchesPaymentMethod =
      filters.paymentMethod === "all" ||
      (enrollment.payment?.isPaid &&
        enrollment.payment?.paymentMethod === filters.paymentMethod);

    return (
      matchesSearch &&
      matchesPaymentStatus &&
      matchesCourse &&
      matchesPaymentMethod
    );
  });

  // Handle form submission
  const handleCreateEnrollment = async (formData) => {
    try {
      const result = await createEnrollment(formData).unwrap();

      toast.success("Enrollment created successfully!", {
        description: `Enrollment for ${result.learner.fullName} in ${result.course.title} has been created.`,
      });

      refetchEnrollments();
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error("Already Enrolled !!!", {
        description:
          error.data?.message || "Please check the form and try again.",
      });
    }
  };

  // Loading and error states
  if (isLoading)
    return <Loader text="Loading enrollments..." className="py-8" />;

  if (enrollmentError?.data?.message === "Insufficient module permissions") {
    return <PermissionError />;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Header with create button */}

      <div className="px-6 py-4 bg-[#F2F7FC] rounded-t-xl border flex justify-between items-center mb-1">
        <div className="flex items-center gap-1">
          <span className="text-[#141B34] font-bold text-lg">
            Enrollment Management
          </span>
        </div>
        <div className="flex gap-2">
          {/* Removed bulk selection button */}
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            disabled={isLearnersLoading || isCoursesLoading}
            className="border border-yellow-500 bg-yellow-50 py-1 px-2 rounded-2xl"
          >
            {isLearnersLoading || isCoursesLoading
              ? "Loading data..."
              : "+ New Enrollment"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-1">
        {/* Current Month Enrollments */}
        <div className=" p-4 rounded-lg shadow border border-main bg-main/5">
          <h3 className="text-gray-500 text-sm font-medium">This Month</h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.currentMonthEnrollments}
          </p>
          <p className="text-sm text-gray-500">Enrollments</p>
        </div>

        {/* Current Week Enrollments */}
        <div className=" border-main bg-main/5 p-4 rounded-lg shadow border">
          <h3 className="text-gray-500 text-sm font-medium">This Week</h3>
          <p className="text-2xl font-bold text-green-600">
            {stats.currentWeekEnrollments}
          </p>
          <p className="text-sm text-gray-500">Enrollments</p>
        </div>

        {/* Total Revenue */}
        <div className=" border-main bg-main/5 p-4 rounded-lg shadow border">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-purple-600">
            ৳{stats.totalRevenue}
          </p>
          <p className="text-sm text-gray-500">From all enrollments</p>
        </div>
      </div>

      {/* Filters */}
      <EnrollmentFilters
        filters={filters}
        setFilters={setFilters}
        enrollments={enrollments}
        courses={coursesData}
        // showSelection={showSelection}
        // onSelectAll={handleSelectAll}
        // selectedCount={selectedEnrollments.length}
        // totalCount={filteredEnrollments.length}
      />

      {/* Removed Bulk Operations */}

      {/* Enrollments grid */}
      <div className="grid grid-cols-1 mt-6 space-y-1">
        {filteredEnrollments.map((enrollment) => (
          <EnrollmentCard
            key={enrollment._id}
            enrollment={enrollment}
            onClick={() => setSelectedEnrollment(enrollment)}
            // isSelected={selectedEnrollments.includes(enrollment._id)}
            // onSelect={handleSelectEnrollment}
            // showSelection={showSelection}
            onEdit={handleEditEnrollment}
            onRefresh={refetchEnrollments}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredEnrollments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No enrollments found</p>
        </div>
      )}

      {/* Enrollment Details Dialog */}
      {selectedEnrollment && (
        <EnrollmentDetailsDialog
          enrollment={selectedEnrollment}
          onClose={() => setSelectedEnrollment(null)}
        />
      )}

      {/* Create Enrollment Dialog */}
      <EnrollmentFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        learners={learners}
        courses={courses}
        onSubmit={handleCreateEnrollment}
        isSubmitting={isCreating}
      />

      {/* Edit Enrollment Dialog */}
      <EnrollmentFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        enrollment={editingEnrollment}
        learners={learners}
        courses={courses}
        onSubmit={handleUpdateEnrollment}
        isEdit={true}
        isSubmitting={isUpdating}
      />
    </div>
  );
}
