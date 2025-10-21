"use client";

import {
  MoreVertical,
  Edit,
  Power,
  Trash2,
  Search,
  Upload,
  X,
  Plus,
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "@/components/shared/Loader";
import Image from "next/image";
import {
  useDeleteLearnerMutation,
  useGetAllLearnersQuery,
  useUpdateLearnerByAdminMutation,
  useUpdateStatusByAdminMutation,
} from "@/redux/features/auth/learner.api";
import { Button } from "@/components/ui/button";
import ExcelSheetExtracter from "./ExcelSheetExtracter";
import PermissionError from "@/components/shared/PermissionError";

const ManageStudentView = () => {
  const router = useRouter();
  const {
    data: learnersData,
    isLoading,
    isError,
    error: learnersError,
    refetch,
  } = useGetAllLearnersQuery();

  // Mutation hooks
  const [updateLearnerByAdmin] = useUpdateLearnerByAdminMutation();
  const [updateStatusByAdmin] = useUpdateStatusByAdminMutation();
  const [deleteLearner] = useDeleteLearnerMutation();

  // State management
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: null,
    learnerId: null,
    learnerName: "",
    isActive: false,
  });
  const [editingLearner, setEditingLearner] = useState({
    _id: "",
    fullName: "",
    email: "",
    phone: "",
    image: null,
    existingImage: "",
  });
  const [viewingLearner, setViewingLearner] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);

  // Dropdown refs and state
  const dropdownRefs = useRef({});
  const [expandedDropdownId, setExpandedDropdownId] = useState(null);

  // Filter learners based on search query
  const filteredLearners = useMemo(() => {
    if (!learnersData?.learners) return [];

    return learnersData?.learners.filter((learner) => {
      const query = searchQuery.toLowerCase();
      return (
        learner.fullName?.toLowerCase().includes(query) ||
        learner.email?.toLowerCase().includes(query) ||
        learner.phone?.toLowerCase().includes(query) ||
        learner.studentId?.toLowerCase().includes(query)
      );
    });
  }, [learnersData, searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideAllDropdowns = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target)
      );

      if (isOutsideAllDropdowns) {
        setExpandedDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clean up refs when learners change
  useEffect(() => {
    if (learnersData?.learners) {
      const currentLearnerIds = learnersData?.learners.map(
        (learner) => learner._id
      );
      Object.keys(dropdownRefs.current).forEach((id) => {
        if (!currentLearnerIds.includes(id)) {
          delete dropdownRefs.current[id];
        }
      });
    }
  }, [learnersData]);

  const toggleDropdown = (learnerId, e) => {
    e.stopPropagation();
    e.preventDefault();
    setExpandedDropdownId(expandedDropdownId === learnerId ? null : learnerId);
  };

  const showConfirmationDialog = (learner, action) => {
    setConfirmationDialog({
      isOpen: true,
      title:
        action === "delete"
          ? "Delete Student"
          : learner.isActive
          ? "Deactivate Student"
          : "Activate Student",
      message:
        action === "delete"
          ? `Are you sure you want to delete ${learner.fullName}? This action cannot be undone.`
          : `Are you sure you want to ${
              learner.isActive ? "deactivate" : "activate"
            } ${learner.fullName}?`,
      action,
      learnerId: learner._id,
      learnerName: learner.fullName,
      isActive: !learner.isActive,
    });
    setExpandedDropdownId(null);
  };

  const handleViewClick = (learner) => {
    setViewingLearner(learner);
    setIsViewDialogOpen(true);
    setExpandedDropdownId(null);
  };

  const handleConfirmAction = async () => {
    const { action, learnerId, learnerName, isActive } = confirmationDialog;

    try {
      if (action === "delete") {
        await deleteLearner(learnerId).unwrap();
        toast.success(`${learnerName} deleted successfully`);
      } else {
        await updateStatusByAdmin({
          id: learnerId,
          data: { isActive },
        }).unwrap();
        toast.success(
          `${learnerName} ${
            isActive ? "activated" : "deactivated"
          } successfully`
        );
      }
      refetch();
    } catch (error) {
      toast.error(
        `Failed to ${
          action === "delete" ? "delete" : isActive ? "activate" : "deactivate"
        } student`
      );
    } finally {
      setConfirmationDialog({
        isOpen: false,
        title: "",
        message: "",
        action: null,
        learnerId: null,
        learnerName: "",
        isActive: false,
      });
    }
  };

  const handleEditClick = (learner) => {
    setEditingLearner({
      _id: learner._id,
      fullName: learner.fullName,
      email: learner.email,
      phone: learner.phone || "",
      image: null,
      existingImage: learner.image || "",
    });
    setEditImagePreview(
      learner.image
        ? `${process.env.NEXT_PUBLIC_API_URL}/${learner.image}`
        : null
    );
    setIsEditDialogOpen(true);
    setExpandedDropdownId(null);
  };

  const handleUpdateLearner = async () => {
    if (!editingLearner.fullName || !editingLearner.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", editingLearner.fullName);
      formData.append("email", editingLearner.email);
      formData.append("phone", editingLearner.phone || "");

      if (editingLearner.image instanceof File) {
        formData.append("image", editingLearner.image);
      }

      await updateLearnerByAdmin({
        id: editingLearner._id,
        ...Object.fromEntries(formData),
      }).unwrap();
      toast.success("Student updated successfully");
      setIsEditDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to update student");
      console.error("Update error:", error);
    }
  };

  const handleEditLearnerChange = (e) => {
    const { name, value } = e.target;
    setEditingLearner((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingLearner((prev) => ({
        ...prev,
        image: file,
        existingImage: "",
      }));
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const removeEditImage = () => {
    setEditingLearner((prev) => ({
      ...prev,
      image: null,
      existingImage: "",
    }));
    setEditImagePreview(null);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to check if session is active
  const isSessionActive = (session) => {
    if (!session?.expiresAt) return false;
    return new Date(session.expiresAt) > new Date();
  };

  if (isLoading) return <Loader text="Loading students..." className="p-4" />;
  if (
    isError ||
    learnersError?.data?.message === "Insufficient module permissions"
  )
    return <PermissionError />;

  return (
    <div className="">
      <div className="px-4 sm:px-6 py-4 bg-[#F2F7FC] rounded-t-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-1">
        <div className="flex items-center gap-1">
          <span className="text-[#141B34] font-bold text-lg">
            Student Management
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-64 md:w-80 lg:w-96">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border bg-white rounded-[16px]"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <Button
            className="flex justify-center items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            onClick={() => setIsExcelDialogOpen(true)}
          >
            <Plus className="w-6 h-6 text-gray-400 hover:text-gray-600" />
            Excel Import
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 mt-6">
        <div className="p-4 rounded-lg shadow border border-main bg-main/5">
          <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
          <p className="text-2xl font-bold text-main">
            {filteredLearners?.length || 0}
          </p>
        </div>

        <div className="border-main bg-main/5 p-4 rounded-lg shadow border">
          <h3 className="text-gray-500 text-sm font-medium">Active Students</h3>
          <p className="text-2xl font-bold text-green-600">
            {filteredLearners?.filter((learner) => learner.isActive).length ||
              0}
          </p>
        </div>

        <div className="border-main bg-main/5 p-4 rounded-lg shadow border">
          <h3 className="text-gray-500 text-sm font-medium">
            Inactive Students
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            {filteredLearners?.filter((learner) => !learner.isActive).length ||
              0}
          </p>
        </div>
      </div>

      {/* Students Table */}
      <table className="min-w-full  divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
            >
              Enrolled
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
            >
              Phone
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredLearners?.length > 0 ? (
            filteredLearners.map((learner) => (
              <tr key={learner._id} className="hover:bg-gray-50">
                <td className="px-4 py-4 md:whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 md:h-10 md:w-10">
                      <Image
                        className="h-6 w-6 md:h-10 md:w-10 rounded-full"
                        src={
                          learner.image
                            ? `${process.env.NEXT_PUBLIC_API_URL}/${learner.image}`
                            : "/assets/icons/avatar.png"
                        }
                        height={40}
                        width={40}
                        alt={learner.fullName}
                      />
                    </div>

                    <div className="ml-4 w-[100px] md:w-fit">
                      <div className="text-[12px] md:text-sm font-medium text-gray-900 line-clamp-1">
                        {learner.fullName}
                      </div>
                      <div className="text-xs text-gray-500 hidden sm:block line-clamp-1">
                        {learner.studentId || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 sm:hidden line-clamp-1">
                        {learner.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                  {learner?.enrollments?.total || 0}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                  {learner.email}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                  {learner.phone || "N/A"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap w-[40px] md:w-fit">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      learner.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {learner.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium relative">
                  <div
                    ref={(el) => {
                      if (el) {
                        dropdownRefs.current[learner._id] = el;
                      }
                    }}
                  >
                    <button
                      type="button"
                      className="inline-flex justify-center items-center w-8 h-8 rounded-full hover:bg-gray-100"
                      onClick={(e) => toggleDropdown(learner._id, e)}
                      aria-expanded={expandedDropdownId === learner._id}
                      aria-haspopup="true"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-600" />
                    </button>

                    {expandedDropdownId === learner._id && (
                      <div className="absolute right-8 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg border">
                        <div className="py-1" role="none">
                          <button
                            onClick={() => handleViewClick(learner)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            role="menuitem"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => handleEditClick(learner)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            role="menuitem"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              showConfirmationDialog(learner, "toggle")
                            }
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            role="menuitem"
                          >
                            <Power className="mr-2 h-4 w-4" />
                            {learner.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() =>
                              showConfirmationDialog(learner, "delete")
                            }
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                            role="menuitem"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                {searchQuery
                  ? "No students match your search"
                  : "No students found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Confirmation Dialog */}
      {confirmationDialog.isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">
              {confirmationDialog.title}
            </h2>
            <p className="mb-6">{confirmationDialog.message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() =>
                  setConfirmationDialog({
                    isOpen: false,
                    title: "",
                    message: "",
                    action: null,
                    learnerId: null,
                    learnerName: "",
                    isActive: false,
                  })
                }
                className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  confirmationDialog.action === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-main hover:bg-main"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Student Details Dialog */}
      {isViewDialogOpen && viewingLearner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Student Details
              </h2>
              <button
                onClick={() => setIsViewDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Profile Section */}
              <div className="lg:col-span-1 flex flex-col items-center space-y-4">
                <div className="relative">
                  <Image
                    src={
                      viewingLearner.image
                        ? `${process.env.NEXT_PUBLIC_API_URL}/${viewingLearner.image}`
                        : "/assets/icons/avatar.png"
                    }
                    alt={viewingLearner.fullName}
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-main"
                  />
                  <div
                    className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
                      viewingLearner.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold mb-1">
                    {viewingLearner.fullName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {viewingLearner.studentId || "No Student ID"}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      viewingLearner.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {viewingLearner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Main Information */}
              <div className="lg:col-span-3 space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <label className="text-sm font-medium text-gray-600">
                        Personal Information
                      </label>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Gender:</span>
                        <span className="font-medium capitalize">
                          {viewingLearner.gender || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phone:</span>
                        <span className="font-medium">
                          {viewingLearner.phone || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium break-all">
                          {viewingLearner.email || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <label className="text-sm font-medium text-gray-600">
                        Shipping Address
                      </label>
                    </div>
                    <p className="text-sm text-gray-700">
                      {viewingLearner.shippingAddress || "No address provided"}
                    </p>
                  </div>
                </div>

                {/* Account Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-gray-600" />
                      <label className="text-sm font-medium text-gray-600">
                        Account Status
                      </label>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">OTP Verified:</span>
                        <span className="font-medium">
                          {viewingLearner.isOTPVerified ? (
                            <CheckCircle className="w-4 h-4 text-green-600 inline" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 inline" />
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lead Converted:</span>
                        <span className="font-medium">
                          {viewingLearner.isLeadConverted ? (
                            <CheckCircle className="w-4 h-4 text-green-600 inline" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 inline" />
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Password Setup:</span>
                        <span className="font-medium">
                          {viewingLearner.requiresPasswordSetup ? (
                            <span className="text-yellow-600">Required</span>
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-600 inline" />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <label className="text-sm font-medium text-gray-600">
                        Account Dates
                      </label>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Created:</span>
                        <span className="font-medium">
                          {formatDate(viewingLearner.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Updated:</span>
                        <span className="font-medium">
                          {formatDate(viewingLearner.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrollment Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-gray-600" />
                    <label className="text-sm font-medium text-gray-600">
                      Enrollment Information
                    </label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-main">
                        {viewingLearner.enrollments?.total || 0}
                      </div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {viewingLearner.enrollments?.approved || 0}
                      </div>
                      <div className="text-xs text-gray-500">Approved</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {viewingLearner.enrollments?.completed || 0}
                      </div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {viewingLearner.maxSessions || 1}
                      </div>
                      <div className="text-xs text-gray-500">Max Sessions</div>
                    </div>
                  </div>
                </div>

                {/* Active Sessions */}
                {viewingLearner.activeSessions &&
                  viewingLearner.activeSessions.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <label className="text-sm font-medium text-gray-600">
                          Active Sessions (
                          {
                            viewingLearner.activeSessions.filter((session) =>
                              isSessionActive(session)
                            ).length
                          }
                          )
                        </label>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {viewingLearner.activeSessions.map((session, index) => (
                          <div
                            key={session._id || index}
                            className={`flex justify-between items-center p-2 rounded text-sm ${
                              isSessionActive(session)
                                ? "bg-green-50 border border-green-200"
                                : "bg-gray-100 border border-gray-200"
                            }`}
                          >
                            <div>
                              <span className="font-medium">
                                Session {index + 1}
                              </span>
                              {session.deviceInfo && (
                                <div className="text-xs text-gray-500 truncate max-w-xs">
                                  {session.deviceInfo}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-xs ${
                                  isSessionActive(session)
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {isSessionActive(session)
                                  ? "Active"
                                  : "Expired"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(session.expiresAt)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsViewDialogOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {/* <button
                onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEditClick(viewingLearner);
                }}
                className="px-6 py-2 bg-main text-darkColor rounded-md hover:bg-main/90 transition-colors"
              >
                Edit Student
              </button> */}
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Dialog */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setIsEditDialogOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {editImagePreview ? (
                      <>
                        <Image
                          src={editImagePreview}
                          alt="Profile preview"
                          width={80}
                          height={80}
                          className="rounded-full h-20 w-20 object-cover"
                        />
                        <button
                          onClick={removeEditImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer bg-main/50 text-darkColor px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleEditImageUpload}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG (Max 2MB)
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  className="w-full px-3 py-2 border rounded-md bg-gray1"
                  placeholder="Enter full name"
                  value={editingLearner.fullName}
                  onChange={handleEditLearnerChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded-md bg-gray1"
                  placeholder="Enter email"
                  value={editingLearner.email}
                  onChange={handleEditLearnerChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full px-3 py-2 border rounded-md bg-gray1"
                  placeholder="Enter phone number"
                  value={editingLearner.phone}
                  onChange={handleEditLearnerChange}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditImagePreview(null);
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateLearner}
                className="px-4 py-2 bg-main text-darkColor rounded-md hover:bg-main/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isExcelDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <ExcelSheetExtracter onClose={() => setIsExcelDialogOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default ManageStudentView;
