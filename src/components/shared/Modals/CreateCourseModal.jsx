"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCreateCourseMutation } from "@/redux/features/course/course.api";
import { useGetCategoriesQuery } from "@/redux/features/category/category.api";
import { useSubCategoryByCategoryIdQuery } from "@/redux/features/category/subcategory.api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

import Loader from "@/components/shared/Loader";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import LoadingState from "@/components/shared/LoadingState";
// React Quill import
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <Loader text="Loading editor..." />, // optional
});
import "react-quill/dist/quill.snow.css";

// ✅ Extract initial state so we can reset easily
const initialFormData = {
  title: "",
  subTitle: "",
  customSlug: "",
  thumbnailType: "image",
  description: "",
  category: "",
  subCategory: "",
  types: [{ mode: "online", price: "", salePrice: "" }],
  durationMonths: "",
  batchNo: "",
  seat: "",
  startFrom: "",
  payTerm: ["one-time"],
  milestones: [{ title: "", percentage: "" }], // First milestone has no dueDate
  tags: "",
  courseType: "live",
  paymentType: "paid",
  youtubeUrl: "",
  whatsIn: [],
  whatsInInput: "",
  image: null,
  totalAdmittedStudents: "",
  totalLiveClasses: "",
};

export default function CreateCourseModal({ open, onOpenChange, onClose }) {
  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoriesQuery();
  const fileInputRef = useRef(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

  // Function to reset form completely
  const resetForm = () => {
    setFormData(initialFormData);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { data: subCategories, isLoading: subLoading } =
    useSubCategoryByCategoryIdQuery(formData.category, {
      skip: !formData.category,
    });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          toast.error("❌ File size must be less than 5MB");
          e.target.value = ""; // Clear the input
          return;
        }

        // Validate file type
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
          toast.error("❌ Please upload only JPG or PNG images");
          e.target.value = ""; // Clear the input
          return;
        }

        setFormData((prev) => ({ ...prev, [name]: file }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result);
        };
        reader.onerror = () => {
          toast.error("❌ Error reading file. Please try again.");
        };
        reader.readAsDataURL(file);
      }
    } else if (name === "thumbnailType") {
      setFormData((prev) => ({
        ...prev,
        thumbnailType: value,
        image: null,
        youtubeUrl: "",
      }));
      setThumbnailPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else if (name === "payTerm") {
      setFormData((prev) => {
        const newPayTerm = [...prev.payTerm];
        if (checked) {
          if (!newPayTerm.includes(value)) {
            newPayTerm.push(value);
          }
        } else {
          const index = newPayTerm.indexOf(value);
          if (index > -1) {
            newPayTerm.splice(index, 1);
          }
        }
        return { ...prev, payTerm: newPayTerm };
      });
    } else {
      // Restrict customSlug to English characters only
      if (name === "customSlug") {
        // Only allow English letters, numbers, spaces, hyphens, and underscores
        const englishOnly = value.replace(/[^a-zA-Z0-9\s\-_]/g, "");
        setFormData((prev) => ({ ...prev, [name]: englishOnly }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleTypeChange = (index, field, value) => {
    const updatedTypes = [...formData.types];
    updatedTypes[index][field] = value;
    setFormData({ ...formData, types: updatedTypes });
  };

  const handleAddType = () => {
    if (formData.types.length >= 3) {
      return toast.error("You can add a maximum of 3 types.");
    }

    setFormData({
      ...formData,
      types: [...formData.types, { mode: "online", price: "", salePrice: "" }],
    });
  };

  const handleRemoveType = (index) => {
    const updatedTypes = [...formData.types];
    updatedTypes.splice(index, 1);
    setFormData({ ...formData, types: updatedTypes });
  };

  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones[index][field] = value;
    setFormData({ ...formData, milestones: updatedMilestones });
  };

  const handleAddMilestone = () => {
    setFormData({
      ...formData,
      milestones: [
        ...formData.milestones,
        { title: "", percentage: "", dueDate: 0 },
      ],
    });
  };

  const handleRemoveMilestone = (index) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones.splice(index, 1);
    setFormData({ ...formData, milestones: updatedMilestones });
  };

  const handleWhatsInAdd = () => {
    const value = formData.whatsInInput.trim();
    if (value) {
      setFormData((prev) => ({
        ...prev,
        whatsIn: [...prev.whatsIn, value],
        whatsInInput: "",
      }));
    }
  };

  const handleWhatsInRemove = (index) => {
    setFormData((prev) => {
      const updated = [...prev.whatsIn];
      updated.splice(index, 1);
      return { ...prev, whatsIn: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enhanced validation with detailed error messages
    const validationErrors = [];

    if (!formData.title?.trim()) {
      validationErrors.push("Course Name is required");
    }
    if (!formData.customSlug?.trim()) {
      validationErrors.push("Course Name (English) is required");
    }
    if (!formData.description?.trim()) {
      validationErrors.push("Course Description is required");
    }
    if (!formData.category) {
      validationErrors.push("Please select a Category");
    }
    if (
      formData.paymentType === "paid" &&
      formData.types.some((type) => !type.price || type.price <= 0)
    ) {
      validationErrors.push(
        "Please fill in valid pricing for all course types"
      );
    }
    if (!formData.durationMonths || formData.durationMonths <= 0) {
      validationErrors.push("Please enter a valid duration in months");
    }
    if (!formData.batchNo?.trim()) {
      validationErrors.push("Batch Number is required");
    }
    if (!formData.seat || formData.seat <= 0) {
      validationErrors.push("Please enter a valid seat count");
    }
    if (!formData.startFrom) {
      validationErrors.push("Please select a Start Date");
    }
    if (
      formData.startFrom &&
      new Date(formData.startFrom).setHours(0, 0, 0, 0) <
        new Date().setHours(0, 0, 0, 0)
    ) {
      validationErrors.push("Start date cannot be in the past");
    }
    if (
      formData.payTerm.includes("milestone") &&
      formData.milestones.some((m, i) => i > 0 && (!m.percentage || !m.dueDate))
    ) {
      validationErrors.push("Please fill in all required milestone fields");
    }
    if (
      formData.thumbnailType === "image" &&
      !formData.image &&
      !thumbnailPreview
    ) {
      validationErrors.push("Please upload a course thumbnail image");
    }
    if (formData.thumbnailType === "youtube" && !formData.youtubeUrl?.trim()) {
      validationErrors.push("Please provide a valid YouTube URL");
    }

    // Show all validation errors at once
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    const submission = new FormData();

    // Append basic fields
    submission.append("title", formData.title);
    submission.append("subTitle", formData.subTitle || "");
    submission.append("customSlug", formData.customSlug || "");
    submission.append("description", formData.description);
    submission.append("category", formData.category);
    submission.append("subCategory", formData.subCategory || "");
    submission.append("durationMonths", formData.durationMonths);
    submission.append("batchNo", formData.batchNo);
    submission.append("seat", formData.seat);
    submission.append("startFrom", formData.startFrom);
    submission.append("paymentType", formData.paymentType);
    submission.append("courseType", formData.courseType);
    submission.append("tags", formData.tags);
    submission.append("thumbnailType", formData.thumbnailType);
    submission.append(
      "totalAdmittedStudents",
      formData.totalAdmittedStudents || "0"
    );
    submission.append("totalLiveClasses", formData.totalLiveClasses || "0");

    // Append payTerm array
    formData.payTerm.forEach((term) => {
      submission.append("payTerm", term);
    });

    // Append types only if payment is paid
    if (formData.paymentType === "paid") {
      formData.types.forEach((type, index) => {
        submission.append(`types[${index}][mode]`, type.mode);
        submission.append(`types[${index}][price]`, type.price);
        if (type.salePrice) {
          submission.append(`types[${index}][salePrice]`, type.salePrice);
        }
      });
    }

    // Append milestones if milestone is selected in payTerm
    if (formData.payTerm.includes("milestone")) {
      formData.milestones.forEach((milestone, index) => {
        submission.append(`milestones[${index}][title]`, milestone.title);
        submission.append(
          `milestones[${index}][percentage]`,
          milestone.percentage
        );
        if (index > 0) {
          submission.append(`milestones[${index}][dueDate]`, milestone.dueDate);
        }
      });
    }

    // Append whatsIn
    formData.whatsIn.forEach((item) => submission.append("whatsIn", item));

    // Handle thumbnail
    if (formData.thumbnailType === "image") {
      if (formData.image) {
        submission.append("image", formData.image);
      }
      submission.append("youtubeUrl", "");
    } else if (formData.thumbnailType === "youtube") {
      if (formData.youtubeUrl) {
        submission.append("youtubeUrl", formData.youtubeUrl);
      }
    }

    try {
      await createCourse(submission).unwrap();
      toast.success("✅ Course created successfully!");

      // Reset all form data
      resetForm();

      // Close modal after a brief delay to show reset
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error("Course creation error:", err);

      // Handle different types of errors
      if (err?.data?.message) {
        // Server validation errors
        toast.error(`❌ ${err.data.message}`);
      } else if (err?.data?.errors) {
        // Multiple validation errors from server
        const errorMessages = Array.isArray(err.data.errors)
          ? err.data.errors.map((error) => error.msg || error.message || error)
          : [err.data.errors];
        errorMessages.forEach((message) => toast.error(`❌ ${message}`));
      } else if (err?.status === 413) {
        toast.error("❌ File too large. Please upload a smaller image.");
      } else if (err?.status === 415) {
        toast.error(
          "❌ Unsupported file type. Please upload JPG, PNG, or WebP images only."
        );
      } else if (err?.status === 400) {
        toast.error("❌ Invalid data provided. Please check your inputs.");
      } else if (err?.status === 401) {
        toast.error("❌ Unauthorized. Please log in again.");
      } else if (err?.status === 403) {
        toast.error("❌ You don't have permission to create courses.");
      } else if (err?.status === 409) {
        toast.error("❌ A course with this name already exists.");
      } else if (err?.status >= 500) {
        toast.error("❌ Server error. Please try again later.");
      } else if (
        err?.message?.includes("Network Error") ||
        err?.message?.includes("Failed to fetch")
      ) {
        toast.error(
          "❌ Network error. Please check your connection and try again."
        );
      } else {
        toast.error("❌ Failed to create course. Please try again.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="custom-dialog-width max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-gray-800 text-center">
            Create Course
          </DialogTitle>
        </DialogHeader>

        <ErrorBoundary>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Name and Payment Type in same row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name*
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter course name"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course URL Name (English)*
                </label>
                <input
                  type="text"
                  name="customSlug"
                  placeholder="Enter course url name in English"
                  value={formData.customSlug}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  pattern="[a-zA-Z0-9\s\-_]+"
                  title="Only English letters, numbers, spaces, hyphens, and underscores are allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter course url name in English only
                </p>
              </div>
            </div>

            {/* Payment Type in separate row */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Type*
              </label>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="paid">Paid</option>
                <option value="free">Free</option>
              </select>
            </div>

            {/* SubTitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub Title
              </label>
              <input
                type="text"
                name="subTitle"
                placeholder="Enter sub title"
                value={formData.subTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div className=" border border-white">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Description*
              </label>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "blockquote", "code-block"],
                  ],
                }}
                placeholder="Type your course description here..."
                style={{ height: "200px", marginBottom: "2rem" }}
                className=""
              />
            </div>

            {/* Thumbnail Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Thumbnail*
              </label>
              <div className="flex items-start gap-4">
                {formData.thumbnailType === "image" ? (
                  <>
                    <div className="relative w-40 h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors duration-200">
                      <input
                        type="file"
                        name="image"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        id="thumbnail-upload"
                        ref={fileInputRef}
                        required={!thumbnailPreview}
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="flex flex-col items-center justify-center text-gray-500 w-full h-full cursor-pointer"
                      >
                        <svg
                          className="w-10 h-10 text-yellow-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          ></path>
                        </svg>
                        <span className="mt-2 text-sm">Upload</span>
                      </label>
                    </div>

                    {thumbnailPreview && (
                      <div className="relative w-40 h-32 rounded-md border border-gray-300 overflow-hidden">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnailPreview(null);
                            setFormData((prev) => ({ ...prev, image: null }));
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 w-5 h-5 flex items-center justify-center"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 max-w-md">
                    <label
                      htmlFor="youtube-url"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      id="youtube-url"
                      name="youtubeUrl"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      value={formData.youtubeUrl}
                      onChange={handleChange}
                      required={formData.thumbnailType === "youtube"}
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="relative inline-block text-left mb-2">
                    <select
                      id="thumbnail-type"
                      name="thumbnailType"
                      className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.thumbnailType}
                      onChange={handleChange}
                    >
                      <option value="image">Image</option>
                      <option value="youtube">YouTube</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formData.thumbnailType === "image" ? (
                      <>
                        At least 800x800 px recommended. JPG, PNG, or WebP is
                        allowed
                      </>
                    ) : (
                      "Please provide a valid YouTube video URL."
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Category and Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                      subCategory: "",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categoryLoading ? (
                    <option disabled>Loading categories...</option>
                  ) : (
                    categoryData?.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.title}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!formData.category || subLoading}
                >
                  <option value="">Select Subcategory</option>
                  {subLoading ? (
                    <option disabled>Loading subcategories...</option>
                  ) : (
                    subCategories?.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Course Types (Online/Offline) - Only show if payment is paid */}
            {formData.paymentType === "paid" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Types and Pricing*
                </label>
                {formData.types.map((type, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-gray-200 rounded-md"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mode*
                      </label>
                      <select
                        value={type.mode}
                        onChange={(e) =>
                          handleTypeChange(index, "mode", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="online+offline">Online + Offline</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price*
                      </label>
                      <input
                        type="number"
                        value={type.price}
                        onChange={(e) =>
                          handleTypeChange(index, "price", e.target.value)
                        }
                        placeholder="Enter price"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sale Price
                      </label>
                      <input
                        type="number"
                        value={type.salePrice}
                        onChange={(e) =>
                          handleTypeChange(index, "salePrice", e.target.value)
                        }
                        placeholder="Enter sale price"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {formData.types.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveType(index)}
                        className="text-red-500 text-sm font-medium mt-2"
                      >
                        Remove Type
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddType}
                  className="text-blue-600 text-sm font-medium"
                >
                  + Add Another Type
                </button>
              </div>
            )}

            {/* Course Type and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Type*
                </label>
                <select
                  name="courseType"
                  value={formData.courseType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="live">Live</option>
                  <option value="recorded">Recorded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Months)*
                </label>
                <input
                  type="number"
                  name="durationMonths"
                  placeholder="Enter duration in months"
                  value={formData.durationMonths}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Only show Payment Term if payment is paid */}
              {formData.paymentType === "paid" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Term*
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="payTerm"
                        value="one-time"
                        checked={formData.payTerm.includes("one-time")}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">One-Time</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="payTerm"
                        value="milestone"
                        checked={formData.payTerm.includes("milestone")}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">Milestone</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Batch Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Number*
                </label>
                <input
                  type="text"
                  name="batchNo"
                  placeholder="Enter batch number"
                  value={formData.batchNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seat Count*
                </label>
                <input
                  type="number"
                  name="seat"
                  placeholder="Enter seat count"
                  value={formData.seat}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date*
                </label>
                <input
                  type="date"
                  name="startFrom"
                  value={formData.startFrom}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag
              </label>
              <input
                type="text"
                name="tags"
                placeholder="Enter Tag Name"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Statistics Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Admitted Students
                </label>
                <input
                  type="number"
                  name="totalAdmittedStudents"
                  placeholder="Enter total admitted students"
                  value={formData.totalAdmittedStudents}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Live Classes
                </label>
                <input
                  type="number"
                  name="totalLiveClasses"
                  placeholder="Enter total live classes"
                  value={formData.totalLiveClasses}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
            </div>

            {/* Milestones - Only show if payment is paid and milestone is selected */}
            {formData.paymentType === "paid" &&
              formData.payTerm.includes("milestone") && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Milestones*
                  </label>
                  {formData.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-md"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) =>
                            handleMilestoneChange(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Milestone title"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Percentage*
                        </label>
                        <input
                          type="number"
                          value={milestone.percentage}
                          onChange={(e) =>
                            handleMilestoneChange(
                              index,
                              "percentage",
                              e.target.value
                            )
                          }
                          placeholder="Percentage"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      {/* Only show dueDate for milestones after the first one */}
                      {index > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date (Days)*
                          </label>
                          <input
                            type="number"
                            value={milestone.dueDate}
                            onChange={(e) =>
                              handleMilestoneChange(
                                index,
                                "dueDate",
                                e.target.value
                              )
                            }
                            placeholder="Days from start"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      )}
                      {formData.milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(index)}
                          className="text-red-500 text-sm font-medium mt-2"
                        >
                          Remove Milestone
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="text-blue-600 text-sm font-medium"
                  >
                    + Add Another Milestone
                  </button>
                </div>
              )}

            {/* What's Included */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What's Included
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  name="whatsInInput"
                  value={formData.whatsInInput}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsInInput: e.target.value })
                  }
                  placeholder="Enter item (e.g., Certificate)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleWhatsInAdd}
                  className="bg-main cursor-pointer px-4 py-2 rounded-md "
                >
                  Add
                </button>
              </div>

              {formData.whatsIn.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.whatsIn.map((item, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleWhatsInRemove(index)}
                        className="text-red-500 font-bold hover:text-red-700"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 rounded-md transition-colors text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating Course..." : "Create Course"}
              </Button>
            </DialogFooter>
          </form>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
}
