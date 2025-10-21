"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useCreateSubCategoryMutation,
  useGetSubCategoryByIdQuery,
  useUpdateSubCategoryMutation,
} from "@/redux/features/category/subcategory.api";
import { useSelector } from "react-redux";

export default function SubCategoryModal({
  open,
  setOpen,
  categoryId,
  subCategoryId,
  isEdit = false,
}) {
  const fileInputRef = useRef(null);
  const [createSubCategory] = useCreateSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const { user } = useSelector((state) => state.auth);

  const { data: existingSubCategory, isLoading } = useGetSubCategoryByIdQuery(
    subCategoryId,
    {
      skip: !isEdit || !subCategoryId,
    }
  );

  const [formData, setFormData] = useState({
    name: "",
    parentCategory: categoryId,
    isActive: true,
    image: null, // Frontend uses 'image' as field name
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);

  useEffect(() => {
    if (isEdit && existingSubCategory && !isLoading) {
      setFormData({
        name: existingSubCategory.name,
        parentCategory: existingSubCategory.parentCategory || categoryId,
        isActive: existingSubCategory.isActive,
        image: null, // Keep as null initially
      });

      // Set preview from backend's 'thumbnail' field
      if (existingSubCategory.thumbnail && !shouldRemoveImage) {
        const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${existingSubCategory.thumbnail}`;
        setImagePreview(imageUrl);
      } else {
        setImagePreview(null);
      }
    } else if (!isEdit) {
      setFormData({
        name: "",
        parentCategory: categoryId,
        isActive: true,
        image: null,
      });
      setImagePreview(null);
      setShouldRemoveImage(false);
    }
  }, [open, existingSubCategory, isEdit, categoryId, isLoading]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setShouldRemoveImage(false);

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        if (existingSubCategory?.thumbnail && !shouldRemoveImage) {
          setImagePreview(
            `${process.env.NEXT_PUBLIC_API_URL}/${existingSubCategory.thumbnail}`
          );
        } else {
          setImagePreview(null);
        }
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setShouldRemoveImage(true);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append(
      "parentCategory",
      typeof formData.parentCategory === "object"
        ? formData.parentCategory._id
        : formData.parentCategory
    );
    submissionData.append("isActive", formData.isActive.toString());

    // Handle image - always use 'image' as field name when sending to backend
    if (formData.image) {
      submissionData.append("image", formData.image); // Field name is 'image'
    } else if (shouldRemoveImage) {
      submissionData.append("removeImage", "true");
    } else if (isEdit && existingSubCategory?.thumbnail) {
      submissionData.append("keepExistingImage", "true");
    }

    try {
      if (isEdit && subCategoryId) {
        await updateSubCategory({
          id: subCategoryId,
          data: submissionData,
        }).unwrap();
        toast.success("✅ Subcategory updated successfully!");
      } else {
        await createSubCategory(submissionData).unwrap();
        toast.success("✅ Subcategory created successfully!");
      }
      setOpen(false);
    } catch (error) {
      toast.error(
        user.role === "staff"
          ? error?.data?.message
          : `❌ Failed to ${isEdit ? "update" : "create"} subcategory.`
      );
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle className="text-center">
          {isEdit ? "Update Subcategory" : "Add Subcategory"}
        </DialogTitle>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
              placeholder="Enter subcategory name"
            />
          </div>

          {/* Image Upload & Preview */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Thumbnail (optional)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleChange}
              className="w-full border rounded p-2 cursor-pointer"
            />
            {imagePreview && !shouldRemoveImage && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Remove Thumbnail
                </button>
              </div>
            )}
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-main focus:ring-main"
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              Active
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="cursor-pointer bg-main px-4 py-2 rounded hover:bg-main/90 w-full"
            >
              {isEdit ? "Update Subcategory" : "Create Subcategory"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
