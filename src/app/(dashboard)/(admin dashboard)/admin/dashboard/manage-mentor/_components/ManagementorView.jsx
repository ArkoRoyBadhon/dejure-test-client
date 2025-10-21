"use client";
import {
  useGetAllMentorsQuery,
  useAddMentorMutation,
  useUpdateMentorStatusMutation,
  useDeleteMentorMutation,
  useUpdateMentorByAdminMutation,
} from "@/redux/features/auth/mentor.api";
import {
  useGetCoursesQuery,
  useUpdateCourseMutation, // Add this import
} from "@/redux/features/course/course.api";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";
import Loader from "@/components/shared/Loader";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Import the new components we'll create
import MentorStats from "./MentorStats";
import MentorsTable from "./MentorsTable";
import ConfirmationDialog from "./ConfirmationDialog";
import CreateMentorDialog from "./CreateMentorDialog";
import EditMentorDialog from "./EditMentorDialog";
import SearchBar from "./SearchBar";
import PermissionError from "@/components/shared/PermissionError";

const ManagementorView = () => {
  const router = useRouter();
  const {
    data: mentorsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllMentorsQuery();

  const { data: allCoursesData, isLoading: isLoadingCourses } =
    useGetCoursesQuery();

  // Mutation hooks
  const [addMentor] = useAddMentorMutation();
  const [updateMentorByAdmin] = useUpdateMentorByAdminMutation();
  const [updateMentorStatus] = useUpdateMentorStatusMutation();
  const [deleteMentor] = useDeleteMentorMutation();
  const [updateCourse] = useUpdateCourseMutation();

  // State management
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: null,
    mentorId: null,
    mentorName: "",
    isActive: false,
  });
  const [newMentorData, setNewMentorData] = useState({
    fullName: "",
    email: "",
    phone: "",
    teacherId: "",
    password: "",
    designation: "",
    description: "",
    image: null,
  });
  const [editingMentor, setEditingMentor] = useState({
    _id: "",
    fullName: "",
    email: "",
    phone: "",
    teacherId: "",
    designation: "",
    description: "",
    image: null,
    existingImage: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Dropdown refs and state
  const dropdownRefs = useRef({});
  const [expandedDropdownId, setExpandedDropdownId] = useState(null);

  // Filter mentors based on search query
  const filteredMentors = useMemo(() => {
    if (!mentorsData) return [];

    return mentorsData.filter((mentor) => {
      const query = searchQuery.toLowerCase();
      return (
        mentor.fullName?.toLowerCase().includes(query) ||
        mentor.email?.toLowerCase().includes(query) ||
        mentor.phone?.toLowerCase().includes(query) ||
        mentor.teacherId?.toLowerCase().includes(query) ||
        mentor.designation?.toLowerCase().includes(query)
      );
    });
  }, [mentorsData, searchQuery]);

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

  // Clean up refs when mentors change
  useEffect(() => {
    if (mentorsData) {
      const currentMentorIds = mentorsData.map((mentor) => mentor._id);
      Object.keys(dropdownRefs.current).forEach((id) => {
        if (!currentMentorIds.includes(id)) {
          delete dropdownRefs.current[id];
        }
      });
    }
  }, [mentorsData]);

  const toggleDropdown = (mentorId, e) => {
    e.stopPropagation();
    e.preventDefault();
    setExpandedDropdownId(expandedDropdownId === mentorId ? null : mentorId);
  };

  const showConfirmationDialog = (mentor, action) => {
    setConfirmationDialog({
      isOpen: true,
      title:
        action === "delete"
          ? "Delete Mentor"
          : mentor.isActive
          ? "Deactivate Mentor"
          : "Activate Mentor",
      message:
        action === "delete"
          ? `Are you sure you want to delete ${mentor.fullName}? This action cannot be undone.`
          : `Are you sure you want to ${
              mentor.isActive ? "deactivate" : "activate"
            } ${mentor.fullName}?`,
      action,
      mentorId: mentor._id,
      mentorName: mentor.fullName,
      isActive: !mentor.isActive,
    });
    setExpandedDropdownId(null);
  };

  const handleConfirmAction = async () => {
    const { action, mentorId, mentorName, isActive } = confirmationDialog;

    try {
      if (action === "delete") {
        await deleteMentor(mentorId).unwrap();
        toast.success(`${mentorName} deleted successfully`);
      } else {
        await updateMentorStatus({ id: mentorId, isActive }).unwrap();
        toast.success(
          `${mentorName} ${isActive ? "activated" : "deactivated"} successfully`
        );
      }
      refetch();
    } catch (error) {
      toast.error(
        `Failed to ${
          action === "delete" ? "delete" : isActive ? "activate" : "deactivate"
        } mentor`
      );
    } finally {
      setConfirmationDialog({
        isOpen: false,
        title: "",
        message: "",
        action: null,
        mentorId: null,
        mentorName: "",
        isActive: false,
      });
    }
  };

  const handleEditClick = (mentor) => {
    setEditingMentor({
      _id: mentor._id,
      fullName: mentor.fullName,
      email: mentor.email,
      phone: mentor.phone || "",
      teacherId: mentor.teacherId || "",
      designation: mentor.designation || "",
      description: mentor.description || "",
      image: null,
      existingImage: mentor.image || "",
    });
    setEditImagePreview(
      mentor.image ? `${process.env.NEXT_PUBLIC_API_URL}/${mentor.image}` : null
    );
    setIsEditDialogOpen(true);
    setExpandedDropdownId(null);
  };

  const handleCreateMentor = async () => {
    if (
      !newMentorData.fullName ||
      !newMentorData.email ||
      !newMentorData.password
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", newMentorData.fullName);
      formData.append("email", newMentorData.email);
      formData.append("phone", newMentorData.phone || "");
      formData.append("teacherId", newMentorData.teacherId);
      formData.append("password", newMentorData.password);
      formData.append("designation", newMentorData.designation || "");
      formData.append("description", newMentorData.description || "");

      if (newMentorData.image) {
        formData.append("image", newMentorData.image);
      }

      const result = await addMentor(formData).unwrap();
      toast.success("Mentor created successfully");

      // Update courses with the new mentor if any courses were selected
      if (selectedCourses.length > 0) {
        await updateCoursesWithMentor(result.mentor._id, selectedCourses, []);
      }

      setIsCreateDialogOpen(false);
      setNewMentorData({
        fullName: "",
        email: "",
        phone: "",
        teacherId: "",
        password: "",
        designation: "",
        description: "",
        image: null,
      });
      setImagePreview(null);
      setSelectedCourses([]);
      refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to create mentor");
    }
  };

  const handleUpdateMentor = async () => {
    if (!editingMentor.fullName || !editingMentor.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", editingMentor._id);
      formData.append("fullName", editingMentor.fullName);
      formData.append("email", editingMentor.email);
      formData.append("phone", editingMentor.phone || "");
      formData.append("teacherId", editingMentor.teacherId);
      formData.append("designation", editingMentor.designation || "");
      formData.append("description", editingMentor.description || "");

      if (editingMentor.image instanceof File) {
        formData.append("image", editingMentor.image);
      }

      await updateMentorByAdmin(formData).unwrap();

      // Update courses with mentor assignments
      // const { data: allCourses } = useGetCoursesQuery();
      const currentlyAssignedCourses =
        allCoursesData &&
        allCoursesData
          .filter(
            (course) =>
              course.mentors && course.mentors.includes(editingMentor._id)
          )
          .map((course) => course._id);

      await updateCoursesWithMentor(
        editingMentor._id,
        selectedCourses,
        currentlyAssignedCourses
      );

      toast.success("Mentor updated successfully");
      setIsEditDialogOpen(false);
      // refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to update mentor");
    }
  };

  // Function to update courses with mentor assignments
  const updateCoursesWithMentor = async (
    mentorId,
    newSelectedCourses,
    currentlyAssignedCourses
  ) => {
    try {
      // Check if allCoursesData is available
      if (!allCoursesData || allCoursesData.length === 0) {
        toast.error("No courses data available");
        return { successful: [], failed: [] };
      }

      // Ensure currentlyAssignedCourses is an array
      const currentCourses = Array.isArray(currentlyAssignedCourses)
        ? currentlyAssignedCourses
        : [];

      // Find courses to add mentor to
      const coursesToAdd = newSelectedCourses.filter(
        (courseId) => !currentCourses.includes(courseId)
      );

      // Find courses to remove mentor from
      const coursesToRemove = currentCourses.filter(
        (courseId) => !newSelectedCourses.includes(courseId)
      );

      // Array to store successfully updated courses
      const successfulUpdates = [];
      const failedUpdates = [];

      // Process courses to add mentor to
      for (const courseId of coursesToAdd) {
        try {
          const course = allCoursesData.find(
            (course) => course._id === courseId
          );

          if (!course) {
            continue;
          }

          // Ensure mentors array exists
          const currentMentors = Array.isArray(course.mentors)
            ? course.mentors
            : [];

          if (!currentMentors.includes(mentorId)) {
            const updatedMentors = [...currentMentors, mentorId];

            const result = await updateCourse({
              id: courseId,
              patch: { mentors: updatedMentors },
            }).unwrap();

            successfulUpdates.push(result);
          } else {
          }
        } catch (error) {
          failedUpdates.push({ courseId, error: error.message });
        }
      }

      // Process courses to remove mentor from
      for (const courseId of coursesToRemove) {
        try {
          const course = allCoursesData.find(
            (course) => course._id === courseId
          );

          if (!course) {
            continue;
          }

          // Ensure mentors array exists
          const currentMentors = Array.isArray(course.mentors)
            ? course.mentors
            : [];

          if (currentMentors.includes(mentorId)) {
            const updatedMentors = currentMentors.filter(
              (id) => id !== mentorId
            );

            const result = await updateCourse({
              id: courseId,
              data: { mentors: updatedMentors },
            }).unwrap();

            successfulUpdates.push(result);
          } else {
          }
        } catch (error) {
          failedUpdates.push({ courseId, error: error.message });
        }
      }

      if (failedUpdates.length > 0) {
        toast.error(
          `Failed to update ${failedUpdates.length} course assignments`
        );
      }

      if (successfulUpdates.length > 0) {
        toast.success(`Updated ${successfulUpdates.length} course assignments`);
      }

      return {
        successful: successfulUpdates,
        failed: failedUpdates,
      };
    } catch (error) {
      toast.error("Failed to update course assignments");
      throw error;
    }
  };

  const handleNewMentorChange = (e) => {
    const { name, value } = e.target;
    setNewMentorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditMentorChange = (e) => {
    const { name, value } = e.target;
    setEditingMentor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMentorData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingMentor((prev) => ({
        ...prev,
        image: file,
        existingImage: "",
      }));
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setNewMentorData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const removeEditImage = () => {
    setEditingMentor((prev) => ({
      ...prev,
      image: null,
      existingImage: "",
    }));
    setEditImagePreview(null);
  };

  if (isLoading) return <Loader text="Loading mentors..." className="p-4" />;
  if (error?.data?.message === "Insufficient module permissions") {
    return <PermissionError error={error} />;
  }
  if (isError)
    return <div className="p-4 text-red-500">Error loading mentors</div>;

  return (
    <div className="">
      <div className="px-4 sm:px-6 py-4 bg-[#F2F7FC] rounded-t-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-1">
        <div className="flex items-center gap-1">
          <span className="text-[#141B34] font-bold text-lg">
            Mentor Management
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="border border-yellow-500 bg-yellow-50 py-2 px-4 rounded-2xl hover:bg-yellow-100 transition-colors whitespace-nowrap text-sm sm:text-base"
          >
            + Add New Mentor
          </button>
        </div>
      </div>

      <MentorStats mentors={filteredMentors} />

      <MentorsTable
        mentors={filteredMentors}
        searchQuery={searchQuery}
        dropdownRefs={dropdownRefs}
        expandedDropdownId={expandedDropdownId}
        toggleDropdown={toggleDropdown}
        handleEditClick={handleEditClick}
        showConfirmationDialog={showConfirmationDialog}
      />

      <ConfirmationDialog
        confirmationDialog={confirmationDialog}
        setConfirmationDialog={setConfirmationDialog}
        handleConfirmAction={handleConfirmAction}
      />

      <CreateMentorDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setImagePreview(null);
          setSelectedCourses([]); // Reset when closing
        }}
        newMentorData={newMentorData}
        imagePreview={imagePreview}
        handleNewMentorChange={handleNewMentorChange}
        handleImageUpload={handleImageUpload}
        removeImage={removeImage}
        handleCreateMentor={handleCreateMentor}
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses} // Pass the setter function
      />

      <EditMentorDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditImagePreview(null);
        }}
        editingMentor={editingMentor}
        editImagePreview={editImagePreview}
        handleEditMentorChange={handleEditMentorChange}
        handleEditImageUpload={handleEditImageUpload}
        removeEditImage={removeEditImage}
        handleUpdateMentor={handleUpdateMentor}
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
      />
    </div>
  );
};

export default ManagementorView;
