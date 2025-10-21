"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

export default function CurriculumModal({
  open,
  onClose,
  onSave,
  isCreating,
  editMode = false,
  existingThumbnail = null,
  existingSubjectType = "",
}) {
  const fileInputRef = useRef(null);
  const [subjectType, setSubjectType] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  // Initialize form with existing data f
  useEffect(() => {
    setSubjectType(existingSubjectType);
    if (existingThumbnail) {
      setPreview(`${process.env.NEXT_PUBLIC_API_URL}/${existingThumbnail}`);
    } else {
      setPreview(null);
    }
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open, existingSubjectType, existingThumbnail]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subjectType.trim()) {
      setError("Subject type is required");
      return;
    }

    if (!editMode && !image) {
      setError("Thumbnail is required");
      return;
    }

    const formData = new FormData();
    formData.append("subjectType", subjectType);

    // For create, always include image
    if (!editMode && image) {
      formData.append("image", image);
    }
    // For update, only include image if changed
    else if (editMode && image) {
      formData.append("image", image);
    }
    // For update, if image is removed
    else if (editMode && !preview && !image) {
      formData.append("removeImage", "true");
    }

    try {
      await onSave(formData);
      toast.success(
        `✅ Subject Type ${editMode ? "updated" : "created"} successfully!`
      );
      if (!editMode) {
        // Reset form if creating new
        setSubjectType("");
        setImage(null);
        setPreview(null);
      }
      onClose();
    } catch (error) {
      toast.error(
        `❌ Failed to ${editMode ? "update" : "create"} subject type.`
      );
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit" : "Add"} Subject Type</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Subject Type"
              value={subjectType}
              onChange={(e) => {
                setSubjectType(e.target.value);
                setError("");
              }}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Thumbnail {!editMode && "(required)"}
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="w-full border rounded p-2 cursor-pointer"
              required={!editMode}
            />
            {preview && (
              <div className="mt-2 relative w-fit">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-violet-600 text-white rounded disabled:opacity-50"
            >
              {isCreating ? "Saving..." : editMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
