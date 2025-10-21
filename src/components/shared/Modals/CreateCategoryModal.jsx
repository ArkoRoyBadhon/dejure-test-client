"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCreateCategoryMutation } from "@/redux/features/category/category.api";
import { useState, useRef } from "react";
import { toast } from "sonner";

export default function CreateCategoryModal({ open, setOpen }) {
  const [createCategory] = useCreateCategoryMutation();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, image: file }));

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submission = new FormData();
    submission.append("title", formData.title);
    if (formData.image) {
      submission.append("image", formData.image);
    }

    try {
      await createCategory(submission).unwrap();
      toast.success("✅ Category created successfully!");
      setOpen(false);
      setFormData({ title: "", image: null });
      setPreview(null);
    } catch (error) {
      toast.error(error.data.message || "❌ Failed to create category.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle className="text-center">Create Category</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>

          {/* Image Upload + Preview */}
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              ref={fileInputRef}
              required={!preview}
              className="cursor-pointer w-full border rounded p-2"
            />
            {preview && (
              <div className="mt-2 relative w-fit">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute cursor-pointer -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className=" bg-main text-white px-4 py-2 rounded hover:bg-main/90 w-full"
            >
              Create Category
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
