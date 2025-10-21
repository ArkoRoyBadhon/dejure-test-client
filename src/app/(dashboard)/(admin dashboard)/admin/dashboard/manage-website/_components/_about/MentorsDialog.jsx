"use client";

import { useState } from "react";
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
  useUpdateAboutMutation,
  useCreateAboutMutation,
} from "@/redux/features/WebManage/About.api";

export default function MentorsDialog({
  isOpen,
  setIsOpen,
  mentors,
  setMentors,
  mentorImages,
  setMentorImages,
  removedMentors,
  setRemovedMentors,
  aboutData,
  refetch,
}) {
  const [updateAbout, { isLoading: isUpdating }] = useUpdateAboutMutation();
  const [createAbout, { isLoading: isCreating }] = useCreateAboutMutation();

  const isFile = (v) => typeof window !== "undefined" && v instanceof File;

  // Build absolute preview URL for server-stored relative paths (uploads/..)
  const getImageSrc = (img) => {
    if (!img) return "";
    if (typeof img !== "string") return URL.createObjectURL(img);
    if (/^https?:\/\//i.test(img)) return img; // already absolute
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
    const path = img.startsWith("/") ? img : `/${img}`;
    return `${base}${path}`;
  };

  // Normalize server image strings to relative paths that backend stores (uploads/...)
  const toRelativeUploadPath = (val) => {
    if (typeof val !== "string") return val;
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    if (val.startsWith(base + "/")) return val.slice(base.length + 1);
    if (val.startsWith("/")) return val.slice(1);
    return val; // already relative
  };

  // IMPORTANT: keep existing image strings, drop only File blobs from JSON
  const cloneMentorsForJson = (list) =>
    list.map((m) => {
      const out = { ...m };
      if (isFile(out.image)) {
        delete out.image; // new file will be sent separately
      } else if (typeof out.image === "string") {
        out.image = toRelativeUploadPath(out.image); // keep existing
      } else {
        delete out.image; // optional: omit empty
      }
      return out;
    });

  const prepareFormData = () => {
    const fd = new FormData();


    // mentors JSON (must keep existing image strings!)
    fd.append("mentors", JSON.stringify(cloneMentorsForJson(mentors)));

    // Existing → mentorImages[<id>]
    mentors
      .filter((m) => m._id && isFile(m.image))
      .forEach((m) => fd.append(`mentorImages[${m._id}]`, m.image));

    // New → mentorImagesNew[<cid>]
    mentors
      .filter((m) => !m._id && m._cid && isFile(m.image))
      .forEach((m) => fd.append(`mentorImagesNew[${m._cid}]`, m.image));

    // Removed mentors (normalized)
    if (removedMentors?.length) {
      const sanitized = removedMentors.map((r) => ({
        ...r,
        image: toRelativeUploadPath(r?.image),
      }));
      fd.append("removedMentors", JSON.stringify(sanitized));
    }

    // Optional clear flag (your backend already supports it)
    if ((mentors?.length ?? 0) === 0 && (removedMentors?.length ?? 0) > 0) {
      fd.append("clearAllMentors", "true");
    }

    return fd;
  };

  const handleMentorChange = (index, field, value) => {
    const updated = [...mentors];
    updated[index][field] = value;
    setMentors(updated);
  };

  const handleMentorImageChange = (index, file) => {
    const updated = [...mentors];
    updated[index].image = file;
    setMentors(updated);

    const imgs = [...mentorImages];
    imgs[index] = file;
    setMentorImages(imgs);
  };

  const addMentor = () => {
    const cid =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `cid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    setMentors([
      ...mentors,
      { _cid: cid, image: null, name: "", position: "", department: "" },
    ]);
    setMentorImages([...mentorImages, null]);
  };

  const removeMentor = (index) => {
    const mentorToRemove = mentors[index];

    if (
      mentorToRemove &&
      (mentorToRemove._id ||
        (typeof mentorToRemove.image === "string" &&
          mentorToRemove.image.includes("uploads/")))
    ) {
      const payload = {
        ...(mentorToRemove._id ? { _id: mentorToRemove._id } : {}),
        ...(mentorToRemove.image
          ? { image: toRelativeUploadPath(mentorToRemove.image) }
          : {}),
      };
      setRemovedMentors((prev) => [...prev, payload]);
    }

    setMentors(mentors.filter((_, i) => i !== index));
    setMentorImages(mentorImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = prepareFormData();

      if (aboutData?._id) {
        await updateAbout({ id: aboutData._id, data: fd }).unwrap();
        toast.success("Mentors section updated successfully");
      } else {
        await createAbout(fd).unwrap();
        toast.success("Mentors section created successfully");
      }

      refetch?.();
      setIsOpen(false);
      setRemovedMentors([]);
    } catch (error) {
      toast.error(error?.data?.error || "Failed to save mentors section");
      console.error(error);
    }
  };

  const handleOpenChange = (open) => {
    if (!open) setRemovedMentors([]);
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="custom-dialog-width max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {aboutData ? "Edit Mentors Section" : "Create Mentors Section"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Mentors</h3>
              <Button type="button" onClick={addMentor} variant="outline">
                Add Mentor
              </Button>
            </div>

            <div className="space-y-6">
              {mentors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No mentors added yet. Click "Add Mentor" to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {mentors.map((mentor, index) => (
                    <div key={mentor._id ?? mentor._cid ?? index} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Mentor {index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => removeMentor(index)}
                          variant="destructive"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mentor._id && (
                          <input type="hidden" name={`mentors[${index}][_id]`} value={mentor._id} />
                        )}
                        {!mentor._id && mentor._cid && (
                          <input type="hidden" name={`mentors[${index}][_cid]`} value={mentor._cid} />
                        )}

                        <div>
                          <Label htmlFor={`mentor-name-${index}`}>Name</Label>
                          <Input
                            id={`mentor-name-${index}`}
                            value={mentor.name}
                            onChange={(e) => handleMentorChange(index, "name", e.target.value)}
                            placeholder="Enter name"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`mentor-position-${index}`}>Position</Label>
                          <Input
                            id={`mentor-position-${index}`}
                            value={mentor.position}
                            onChange={(e) => handleMentorChange(index, "position", e.target.value)}
                            placeholder="Enter position"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor={`mentor-department-${index}`}>Department</Label>
                          <Input
                            id={`mentor-department-${index}`}
                            value={mentor.department}
                            onChange={(e) => handleMentorChange(index, "department", e.target.value)}
                            placeholder="Enter department"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label>Image</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleMentorImageChange(index, f);
                            }}
                            className="cursor-pointer"
                          />
                          {mentor.image && (
                            <div className="mt-2">
                              <Image
                                src={getImageSrc(mentor.image)}
                                alt="Mentor preview"
                                width={100}
                                height={100}
                                className="rounded-md object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
