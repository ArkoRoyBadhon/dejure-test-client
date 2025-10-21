"use client";
import React, { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  useCreateStaffMutation,
  useDeleteStaffMutation,
  useGetAllStaffQuery,
  useUpdateStaffMutation,
} from "@/redux/features/auth/staff.api";
import StaffSearchHeader from "./StaffSearchHeader";
import StaffStatsCards from "./StaffStatsCards";
import StaffTable from "./StaffTable";
import StaffFormDialog from "./StaffFormDialog";
import ConfirmationDialog from "./ConfirmationDialog";
import Loader from "@/components/shared/Loader";

const ManageStaffView = () => {
  const {
    data: staffData,
    isLoading,
    isError,
    refetch,
  } = useGetAllStaffQuery();
  const [createStaff] = useCreateStaffMutation();
  const [updateStaff] = useUpdateStaffMutation();
  const [deleteStaff] = useDeleteStaffMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: null,
    staffId: null,
    staffName: "",
    isActive: false,
  });

  const [newStaffData, setNewStaffData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    roleType: "",
    image: null,
  });

  const [editingStaff, setEditingStaff] = useState({
    _id: "",
    fullName: "",
    email: "",
    phone: "",
    roleType: "",
    image: null,
    existingImage: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const filteredStaff = useMemo(() => {
    if (!staffData?.data) return [];
    // return [];
    return staffData && staffData?.data && staffData?.data.length > 0
      ? staffData?.data?.filter((staff) => {
          const query = searchQuery.toLowerCase();
          return (
            staff.name?.toLowerCase().includes(query) ||
            staff.email?.toLowerCase().includes(query) ||
            staff.phone?.toLowerCase().includes(query) ||
            staff.roleDesignation?.toLowerCase().includes(query)
          );
        })
      : [];
  }, [staffData, searchQuery]);

  const showConfirmationDialog = (staff, action) => {
    setConfirmationDialog({
      isOpen: true,
      title: action === "delete" ? "Delete Staff" : "Update Staff Status",
      message:
        action === "delete"
          ? `Are you sure you want to delete ${staff.fullName}? This action cannot be undone.`
          : `Are you sure you want to ${
              staff.isActive ? "deactivate" : "activate"
            } ${staff.fullName}?`,
      action,
      staffId: staff._id,
      staffName: staff.fullName,
      isActive: !staff.isActive,
    });
  };

  const handleConfirmAction = async () => {
    const { action, staffId, staffName, isActive } = confirmationDialog;

    try {
      if (action === "delete") {
        await deleteStaff(staffId).unwrap();
        toast.success(`${staffName} deleted successfully`);
      } else {
        const formData = new FormData();
        formData.append("isActive", isActive.toString());
        await updateStaff({ id: staffId, formData }).unwrap();
        toast.success(
          `${staffName} ${isActive ? "activated" : "deactivated"} successfully`
        );
      }
      refetch();
    } catch (error) {
      toast.error(
        `Failed to ${action === "delete" ? "delete" : "update"} staff member: ${
          error.data?.message || error.message
        }`
      );
    } finally {
      setConfirmationDialog({
        isOpen: false,
        title: "",
        message: "",
        action: null,
        staffId: null,
        staffName: "",
        isActive: false,
      });
    }
  };

  const handleEditClick = (staff) => {
    setEditingStaff({
      _id: staff._id,
      fullName: staff.name,
      email: staff.email,
      phone: staff.phone || "",
      role: staff.role,
      roleType: staff.roleType?._id || "",
      image: null,
      existingImage: staff.avatar || "",
    });
    setEditImagePreview(
      staff.avatar ? `${process.env.NEXT_PUBLIC_API_URL}${staff.avatar}` : null
    );
    setIsEditDialogOpen(true);
  };

  const handleCreateStaff = async () => {
    if (
      !newStaffData.fullName ||
      !newStaffData.email ||
      !newStaffData.password
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newStaffData.fullName);
      formData.append("email", newStaffData.email);
      formData.append("phone", newStaffData.phone || "");
      formData.append("password", newStaffData.password);
      formData.append("roleType", newStaffData.roleType);
      formData.append("role", "staff");
      formData.append("isActive", "true"); // Default to active

      if (newStaffData.image) {
        formData.append("image", newStaffData.image);
      }

      await createStaff(formData).unwrap();

      toast.success("Staff created successfully");
      setIsCreateDialogOpen(false);
      setNewStaffData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        roleType: "",
        image: null,
      });
      setImagePreview(null);
      refetch();
    } catch (error) {
      toast.error(
        error.data?.message || error.message || "Failed to create staff member"
      );
    }
  };

  const handleUpdateStaff = async () => {
    if (!editingStaff.fullName || !editingStaff.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editingStaff.fullName);
      formData.append("email", editingStaff.email);
      formData.append("phone", editingStaff.phone || "");
      formData.append("roleType", editingStaff.roleType);
      formData.append("role", "staff");

      if (editingStaff.image instanceof File) {
        formData.append("image", editingStaff.image);
      } else if (editingStaff.existingImage === "") {
        formData.append("removeAvatar", "true");
      }

      await updateStaff({
        id: editingStaff._id,
        formData,
      }).unwrap();

      toast.success("Staff updated successfully");
      setIsEditDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error(
        error.data?.message || error.message || "Failed to update staff member"
      );
    }
  };

  const handleNewStaffChange = (e) => {
    const { name, value } = e.target;
    setNewStaffData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditStaffChange = (e) => {
    const { name, value } = e.target;
    setEditingStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setNewStaffData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      setEditingStaff((prev) => ({
        ...prev,
        image: file,
        existingImage: "",
      }));
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setNewStaffData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const removeEditImage = () => {
    setEditingStaff((prev) => ({
      ...prev,
      image: null,
      existingImage: "",
    }));
    setEditImagePreview(null);
  };

  if (isLoading)
    return <Loader text="Loading staff members..." className="p-4" />;
  if (isError)
    return <div className="p-4 text-red-500">Error loading staff members</div>;

  return (
    <div className="container mx-auto">
      <div className="">
        <StaffSearchHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCreateClick={() => setIsCreateDialogOpen(true)}
        />

        <StaffStatsCards staffData={staffData} searchQuery={searchQuery} />

        <StaffTable
          staffData={filteredStaff}
          searchQuery={searchQuery}
          onEditClick={handleEditClick}
          onToggleStatus={(staff) => showConfirmationDialog(staff, "toggle")}
          onDelete={(staff) => showConfirmationDialog(staff, "delete")}
        />
      </div>

      <StaffFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setImagePreview(null);
        }}
        onSubmit={handleCreateStaff}
        title="Add New Staff"
        staffData={newStaffData}
        onChange={handleNewStaffChange}
        onImageUpload={handleImageUpload}
        onRemoveImage={removeImage}
        imagePreview={imagePreview}
      />

      <StaffFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditImagePreview(null);
        }}
        onSubmit={handleUpdateStaff}
        title="Edit Staff Member"
        staffData={editingStaff}
        onChange={handleEditStaffChange}
        onImageUpload={handleEditImageUpload}
        onRemoveImage={removeEditImage}
        imagePreview={editImagePreview}
        isEdit={true}
      />

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        title={confirmationDialog.title}
        message={confirmationDialog.message}
        onConfirm={handleConfirmAction}
        onCancel={() =>
          setConfirmationDialog({ ...confirmationDialog, isOpen: false })
        }
      />
    </div>
  );
};

export default ManageStaffView;
