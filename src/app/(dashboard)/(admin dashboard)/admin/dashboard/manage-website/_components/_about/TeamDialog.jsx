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

/**
 * @typedef {Object} TeamMember
 * @property {string} [_id]      - existing member id (from DB)
 * @property {string} [_cid]     - client-only id for NEW members
 * @property {File|string|null} image
 * @property {string} name
 * @property {string} position
 * @property {string} department
 */

export default function TeamDialog({
  isOpen,
  setIsOpen,
  team,
  setTeam,
  teamImages,
  setTeamImages,
  removedTeamMembers,
  setRemovedTeamMembers,
  aboutData,
  refetch,
}) {
  const [updateAbout, { isLoading: isUpdating }] = useUpdateAboutMutation();
  const [createAbout, { isLoading: isCreating }] = useCreateAboutMutation();

  const isFile = (v) => typeof window !== "undefined" && v instanceof File;

  // Convert server-stored relative paths like "uploads/xx.jpg" to absolute preview URLs
  const getImageSrc = (img) => {
    if (!img) return "";
    if (typeof img !== "string") return URL.createObjectURL(img);
    if (/^https?:\/\//i.test(img)) return img; // already absolute
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
    const path = img.startsWith("/") ? img : `/${img}`;
    return `${base}${path}`;
  };

  // Normalize server image strings to relative paths the backend stores (uploads/...)
  const toRelativeUploadPath = (val) => {
    if (typeof val !== "string") return val;
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    if (val.startsWith(base + "/")) return val.slice(base.length + 1);
    if (val.startsWith("/")) return val.slice(1);
    return val; // already relative
  };

  // IMPORTANT: Keep existing image strings in JSON, drop only File blobs
  const cloneTeamForJson = (list) =>
    list.map((m) => {
      const out = { ...m };
      if (isFile(out.image)) {
        // a new file will come via FormData, so remove the File from JSON
        delete out.image;
      } else if (typeof out.image === "string") {
        // keep existing path so backend preserves it when no new file uploaded
        out.image = toRelativeUploadPath(out.image);
      } else {
        // null/undefined stays as is (means no image)
        delete out.image; // optional: omit empty to avoid overwriting with undefined
      }
      return out;
    });

  const prepareFormData = () => {
    const fd = new FormData();

    // TEAM JSON (must keep existing image strings!)
    fd.append("team", JSON.stringify(cloneTeamForJson(team)));

    // Existing members → teamImages[<id>]
    team
      .filter((m) => m._id && isFile(m.image))
      .forEach((m) => fd.append(`teamImages[${m._id}]`, m.image));

    // New members → teamImagesNew[<cid>]
    team
      .filter((m) => !m._id && m._cid && isFile(m.image))
      .forEach((m) => fd.append(`teamImagesNew[${m._cid}]`, m.image));

    // Optional: removed list (your backend parses it already)
    if (removedTeamMembers?.length) {
      // normalize image strings to relative before sending
      const sanitized = removedTeamMembers.map((r) => ({
        ...r,
        image: toRelativeUploadPath(r?.image),
      }));
      fd.append("removedTeamMembers", JSON.stringify(sanitized));
    }

    return fd;
  };

  const handleTeamChange = (index, field, value) => {
    const updated = [...team];
    updated[index][field] = value;
    setTeam(updated);
  };

  const handleTeamImageChange = (index, file) => {
    const updated = [...team];
    updated[index].image = file;
    setTeam(updated);

    const imgs = [...teamImages];
    imgs[index] = file;
    setTeamImages(imgs);
  };

  const addTeamMember = () => {
    const cid =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `cid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    setTeam([
      ...team,
      { _cid: cid, image: null, name: "", position: "", department: "" },
    ]);
    setTeamImages([...teamImages, null]);
  };

  const removeTeamMember = (index) => {
    const memberToRemove = team[index];

    // Track only persisted ones (optional)
    if (
      memberToRemove &&
      (memberToRemove._id ||
        (typeof memberToRemove.image === "string" &&
          memberToRemove.image.includes("uploads/")))
    ) {
      // store relative image path if present
      const payload = {
        ...(memberToRemove._id ? { _id: memberToRemove._id } : {}),
        ...(memberToRemove.image
          ? { image: toRelativeUploadPath(memberToRemove.image) }
          : {}),
      };
      setRemovedTeamMembers((prev) => [...prev, payload]);
    }

    setTeam(team.filter((_, i) => i !== index));
    setTeamImages(teamImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = prepareFormData();

      if (aboutData?._id) {
        await updateAbout({ id: aboutData._id, data: fd }).unwrap();
        toast.success("Team section updated successfully");
      } else {
        await createAbout(fd).unwrap();
        toast.success("Team section created successfully");
      }

      refetch?.();
      setIsOpen(false);
      setRemovedTeamMembers([]);
    } catch (error) {
      toast.error(error?.data?.error || "Failed to save team section");
      console.error(error);
    }
  };

  const handleOpenChange = (open) => {
    if (!open) setRemovedTeamMembers([]);
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="custom-dialog-width max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {aboutData ? "Edit Team Section" : "Create Team Section"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Team</h3>
              <Button type="button" onClick={addTeamMember} variant="outline">
                Add Team Member
              </Button>
            </div>

            <div className="space-y-6">
              {team.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No team members added yet. Click "Add Team Member" to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {team.map((member, index) => (
                    <div key={member._id ?? member._cid ?? index} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Team Member {index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          variant="destructive"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {member._id && (
                          <input type="hidden" name={`team[${index}][_id]`} value={member._id} />
                        )}
                        {!member._id && member._cid && (
                          <input type="hidden" name={`team[${index}][_cid]`} value={member._cid} />
                        )}

                        <div>
                          <Label htmlFor={`team-name-${index}`}>Name</Label>
                          <Input
                            id={`team-name-${index}`}
                            value={member.name}
                            onChange={(e) => handleTeamChange(index, "name", e.target.value)}
                            placeholder="Enter name"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`team-position-${index}`}>Position</Label>
                          <Input
                            id={`team-position-${index}`}
                            value={member.position}
                            onChange={(e) => handleTeamChange(index, "position", e.target.value)}
                            placeholder="Enter position"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor={`team-department-${index}`}>Department</Label>
                          <Input
                            id={`team-department-${index}`}
                            value={member.department}
                            onChange={(e) => handleTeamChange(index, "department", e.target.value)}
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
                              if (f) handleTeamImageChange(index, f);
                            }}
                            className="cursor-pointer"
                          />
                          {member.image && (
                            <div className="mt-2">
                              <Image
                                src={getImageSrc(member.image)}
                                alt="Team member preview"
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
