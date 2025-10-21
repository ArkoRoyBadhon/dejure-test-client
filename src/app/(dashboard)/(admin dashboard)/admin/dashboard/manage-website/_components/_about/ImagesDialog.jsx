"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import {
  useUpdateAboutImagesMutation,
  useCreateAboutMutation,
} from "@/redux/features/WebManage/About.api";

export default function ImagesDialog({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
  images,
  setImages,
  imagePreviews,
  setImagePreviews,
  aboutData,
  refetch,
}) {
  const [updateAboutImages, { isLoading: isUpdating }] =
    useUpdateAboutImagesMutation();
  const [createAbout, { isLoading: isCreating }] = useCreateAboutMutation();

  // Track removed existing images
  const [removedImages, setRemovedImages] = useState([]);

  const getPreviewSrc = useCallback((src) => {
    if (!src) return "";
    if (typeof src === "string" && src.startsWith("blob:")) return src;
    if (/^https?:\/\//i.test(src)) return src;
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
    const path = src.startsWith("/") ? src : `/${src}`;
    return `${base}${path}`;
  }, []);

  const toRelativeUploadPath = useCallback((val) => {
    if (typeof val !== "string") return val;
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    if (val.startsWith(base + "/")) return val.slice(base.length + 1);
    if (val.startsWith("/")) return val.slice(1);
    return val; // already relative "uploads/..."
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Append new files to the existing images state
    setImages((prev) => [...prev, ...files]);

    // Generate previews for the new files
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const preview = imagePreviews[index];
    const image = images[index];

    // Check if it's an existing image (not a blob)
    const isExistingImage = !(typeof preview === "string" && preview.startsWith("blob:"));

    if (isExistingImage) {
      // For existing images, add to removedImages array
      const relativePath = toRelativeUploadPath(preview);
      setRemovedImages((prev) => [...prev, relativePath]);
    } else {
      // For new images (blob), clean up the URL
      if (typeof preview === "string" && preview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(preview);
        } catch {}
      }
    }

    // Remove from both arrays
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();

      // Append caption and video
      fd.append("caption", formData.caption || "");
      fd.append("video", formData.video || "");

      // Append new images (only File objects)
      images.forEach((img) => {
        if (img instanceof File) {
          fd.append("images", img);
        }
      });

      // Send removedImages as an array of paths
      if (removedImages.length) {
        fd.append("removedImages", JSON.stringify(removedImages));
      }

      // Send the data to the backend
      if (aboutData?._id) {
        await updateAboutImages({ id: aboutData._id, data: fd }).unwrap();
        toast.success("Images section updated successfully");
      } else {
        await createAbout(fd).unwrap();
        toast.success("Images section created successfully");
      }

      // Reset states after successful submission
      setRemovedImages([]);
      refetch?.();
      setIsOpen(false);
    } catch (error) {
      toast.error(error?.data?.error || "Failed to save images section");
      console.error(error);
    }
  };

  // Reset states when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setRemovedImages([]);
    }
  }, [isOpen]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (typeof preview === "string" && preview.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(preview);
          } catch {}
        }
      });
    };
  }, [imagePreviews]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="custom-dialog-width max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {aboutData ? "Edit Images Section" : "Create Images Section"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Images</Label>
            <div className="mt-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <div className="flex flex-wrap gap-4 mt-4">
                {imagePreviews.map((preview, index) => {
                  const isExistingImage = !(typeof preview === "string" && preview.startsWith("blob:"));
                  const relativePath = isExistingImage ? toRelativeUploadPath(preview) : null;
                  const isRemoved = isExistingImage && removedImages.includes(relativePath);

                  return (
                    <div
                      key={index}
                      className="relative"
                      style={{ opacity: isRemoved ? 0.5 : 1 }}
                    >
                      <Image
                        src={getPreviewSrc(preview)}
                        alt={`Preview ${index}`}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                      {isRemoved && (
                        <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-bold">REMOVED</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-full">
              <Label htmlFor="caption">Images Caption</Label>
              <Input
                id="caption"
                name="caption"
                value={formData.caption}
                onChange={handleInputChange}
                placeholder="Enter caption"
              />
            </div>

            <div className="w-full">
              <Label htmlFor="video">Video URL</Label>
              <Input
                id="video"
                name="video"
                value={formData.video}
                onChange={handleInputChange}
                placeholder="Enter video URL"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-[#FFB800] hover:bg-[#e6a600]"
            >
              {isCreating || isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}