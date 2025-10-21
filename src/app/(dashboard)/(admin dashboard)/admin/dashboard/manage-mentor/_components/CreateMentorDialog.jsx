import Image from "next/image";
import { X, Upload } from "lucide-react";
import { useState } from "react";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import Loader from "@/components/shared/Loader";

const CreateMentorDialog = ({
  isOpen,
  onClose,
  newMentorData,
  imagePreview,
  handleNewMentorChange,
  handleImageUpload,
  removeImage,
  handleCreateMentor,
  selectedCourses, // Receive from parent
  setSelectedCourses,
}) => {
  // Fetch all courses only
  const { data: allCoursesData, isLoading: isLoadingCourses } =
    useGetCoursesQuery();

  // Extract courses from API response
  const allCourses = allCoursesData || [];

  // Handle course selection change
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const isChecked = e.target.checked;

    let updatedCourses;
    if (isChecked) {
      updatedCourses = [...selectedCourses, courseId];
    } else {
      updatedCourses = selectedCourses.filter((id) => id !== courseId);
    }

    setSelectedCourses(updatedCourses);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-[800px] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Add New Mentor</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      width={80}
                      height={80}
                      className="rounded-full h-20 w-20 object-cover"
                    />
                    <button
                      onClick={removeImage}
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
                <label className="cursor-pointer bg-main/20 text-main hover:bg-main/40 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 2MB)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                className="w-full px-3 py-2 border rounded-md bg-gray1"
                placeholder="Enter full name"
                value={newMentorData.fullName}
                onChange={handleNewMentorChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                className="w-full px-3 py-2 border rounded-md bg-gray1"
                placeholder="e.g., Senior Developer, UX Lead"
                value={newMentorData.designation}
                onChange={handleNewMentorChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border rounded-md bg-gray1"
                placeholder="Enter email"
                value={newMentorData.email}
                onChange={handleNewMentorChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full px-3 py-2 border rounded-md bg-gray1"
                placeholder="Enter phone number"
                value={newMentorData.phone}
                onChange={handleNewMentorChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-3 py-2 border rounded-md bg-gray1"
                placeholder="Enter password"
                value={newMentorData.password}
                onChange={handleNewMentorChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-3 py-2 border rounded-md bg-gray1"
              placeholder="Brief description about the mentor"
              value={newMentorData.description}
              onChange={handleNewMentorChange}
            />
          </div>

          {/* Course Selection Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Courses
            </label>
            {isLoadingCourses ? (
              <Loader text="Loading courses..." size="sm" />
            ) : allCourses.length === 0 ? (
              <div className="text-sm text-gray-500">
                No courses available to assign
              </div>
            ) : (
              <div className="max-h-40 overflow-y-auto border rounded-md p-2 bg-gray1">
                {allCourses.map((course) => (
                  <div key={course._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`course-${course._id}`}
                      value={course._id}
                      checked={selectedCourses.includes(course._id)}
                      onChange={handleCourseChange}
                      className="h-4 w-4 text-main rounded focus:ring-main"
                    />
                    <label
                      htmlFor={`course-${course._id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {course.title}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateMentor}
            className="px-4 py-2 bg-main text-white rounded-md hover:bg-main-dark transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMentorDialog;
