"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} from "@/redux/features/category/category.api";

export default function ManageCategoryModal({ open, setOpen, categoryId }) {
  const fileInputRef = useRef(null);
  const [updateCategory] = useUpdateCategoryMutation();

  const { data: categoryData } = useGetCategoryByIdQuery(categoryId, {
    skip: !categoryId,
  });

  const [formData, setFormData] = useState({ title: "", thumbnail: null });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    if (categoryData) {
      setFormData({ title: categoryData.title, thumbnail: null });
      setThumbnailPreview(
        `${process.env.NEXT_PUBLIC_API_URL}/${categoryData.thumbnail}`
      );
    }
  }, [categoryData]);

  const handleUpdateCategory = async () => {
    const submission = new FormData();
    submission.append("title", formData.title);
    if (formData.thumbnail) submission.append("image", formData.thumbnail);

    await updateCategory({ id: categoryId, body: submission });
    setOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, thumbnail: file });
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90vw] md:w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Manage Category</DialogTitle>
        </DialogHeader>

        {/* Category Title */}
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border p-2 rounded-md mt-4"
          placeholder="Category Title"
        />

        {/* Thumbnail Preview & Upload */}
        <div className="flex items-center gap-4 mt-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
            accept="image/*"
          />
          <Button
            className="bg-main hover:bg-main text-black"
            onClick={() => fileInputRef.current.click()}
          >
            Upload New Image
          </Button>
          {thumbnailPreview && (
            <div className="relative">
              <img
                src={thumbnailPreview}
                alt="preview"
                className="w-16 h-16 object-cover rounded-md"
              />
              <button
                onClick={() => {
                  setThumbnailPreview(null);
                  setFormData({ ...formData, thumbnail: null });
                  fileInputRef.current.value = "";
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Update Button */}
        <Button
          onClick={handleUpdateCategory}
          className="bg-main hover:bg-main text-black mt-4"
        >
          Update Category
        </Button>
      </DialogContent>
    </Dialog>
  );
}
