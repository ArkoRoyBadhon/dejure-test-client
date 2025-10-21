"use client";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, Upload } from "lucide-react";
import Loader from "@/components/shared/Loader";
import {
  useCreateSocialMutation,
  useGetAllSocialsQuery,
  useUpdateSocialMutation,
} from "@/redux/features/WebManage/Social.api";

export default function SocialResourcesManage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState({
    ytTitle: "ফ্রি ভিডিও লাইব্রেরি",
    ytBtnTitle: "ভিডিও দেখো",
    ytBtnLink: "",
    ytImage: null,
    fbTitle: "ফেসবুক গ্রুপ",
    fbBtnTitle: "গ্রুপে যুক্ত হও",
    fbBtnLink: "",
    fbImage: null,
  });
  const [imageFiles, setImageFiles] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});

  const { data: socials, isLoading, error, refetch } = useGetAllSocialsQuery();

  const [updateSocial] = useUpdateSocialMutation();
  const [createSocial] = useCreateSocialMutation();

  useEffect(() => {
    if (socials && socials.length > 0) {
      setEditingData(socials[0]);
      if (socials[0].ytImage) {
        setImagePreviews((prev) => ({
          ...prev,
          ytImage: `${socials[0].ytImage}`,
        }));
      }
      if (socials[0].fbImage) {
        setImagePreviews((prev) => ({
          ...prev,
          fbImage: `${socials[0].fbImage}`,
        }));
      }
    }
  }, [socials]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset to original data when canceling
      if (socials && socials.length > 0) {
        setEditingData(socials[0]);
        setImageFiles({});
        setImagePreviews({
          ytImage: socials[0].ytImage ? `${socials[0].ytImage}` : null,
          fbImage: socials[0].fbImage ? `${socials[0].fbImage}` : null,
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleFieldChange = (field, value) => {
    setEditingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFiles((prev) => ({ ...prev, [field]: file }));
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => ({ ...prev, [field]: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("ytTitle", editingData.ytTitle);
      formData.append("ytBtnTitle", editingData.ytBtnTitle);
      formData.append("ytBtnLink", editingData.ytBtnLink);
      formData.append("fbTitle", editingData.fbTitle);
      formData.append("fbBtnTitle", editingData.fbBtnTitle);
      formData.append("fbBtnLink", editingData.fbBtnLink);

      // Append images with the field name "images" as expected by the backend middleware
      // Also send field identifiers to help backend distinguish which image is which
      if (imageFiles.ytImage) {
        formData.append("images", imageFiles.ytImage);
        formData.append("ytImageIdentifier", "ytImage"); // Help backend identify this image
      }
      if (imageFiles.fbImage) {
        formData.append("images", imageFiles.fbImage);
        formData.append("fbImageIdentifier", "fbImage"); // Help backend identify this image
      }

      if (socials && socials.length > 0) {
        await updateSocial({
          id: socials[0]._id,
          data: formData,
        }).unwrap();
      } else {
        await createSocial(formData).unwrap();
      }

      setIsEditing(false);
      setImageFiles({});
      refetch();
    } catch (error) {
      console.error("Failed to update social:", error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading social data</div>;

  return (
    <div>
      <div className="flex flex-col gap-6 h-full w-2/3 mx-auto">
        {/* YouTube Section */}
        <div className="rounded-xl shadow-lg flex items-center p-6 justify-between overflow-hidden relative bg-[#F2F7FC] border">
          <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center opacity-[.04] z-0 pointer-events-none" />

          <div className="flex-grow relative gap-4  w-full">
            {isEditing ? (
              <div className="space-y-4 p-4">
                <div>
                  <Label>YouTube Title</Label>
                  <Input
                    value={editingData.ytTitle}
                    onChange={(e) =>
                      handleFieldChange("ytTitle", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Button Title</Label>
                  <Input
                    value={editingData.ytBtnTitle}
                    onChange={(e) =>
                      handleFieldChange("ytBtnTitle", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Button Link</Label>
                  <Input
                    value={editingData.ytBtnLink}
                    onChange={(e) =>
                      handleFieldChange("ytBtnLink", e.target.value)
                    }
                    placeholder="https://youtube.com/channel"
                  />
                </div>
                <div>
                  <Label>YouTube Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("ytImage", e)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 whitespace-nowrap">
                  {editingData.ytTitle}
                </h2>
                {editingData.ytBtnLink && (
                  <a
                    href={editingData.ytBtnLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-[#FF0000] text-white font-bold py-3 px-1 md:px-6 rounded-xl shadow-md hover:bg-red-700 gap-1 transition-colors w-[164px] text-sm justify-center"
                  >
                    <img src="/computer-video.svg" alt="" />
                    {editingData.ytBtnTitle}
                  </a>
                )}
              </>
            )}
          </div>

          <div className="relative">
            {isEditing ? (
              <div className="p-4">
                {imagePreviews.ytImage ? (
                  <img
                    // src={`${process.env.NEXT_PUBLIC_API_URL}/${imagePreviews.ytImage}`}
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${imagePreviews.ytImage}`}
                    alt="YouTube preview"
                    className="w-32 h-32 object-contain"
                  />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto mb-2" />
                    <p className="text-sm">Upload YouTube image</p>
                  </div>
                )}
              </div>
            ) : (
              <img
                //  src={`${process.env.NEXT_PUBLIC_API_URL}/${imagePreviews.ytImage}`}
                src={`${process.env.NEXT_PUBLIC_API_URL}/${imagePreviews.ytImage}`}
                alt="Video Library Thumbnail"
              />
            )}
          </div>
        </div>

        {/* Facebook Section */}
        <div className="rounded-xl shadow-lg flex items-center bg-[#F2F7FC] p-6 overflow-hidden relative border gap-4">
          <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center opacity-[.04] z-0 pointer-events-none" />

          <div className="flex-grow relative gap-2 md:gap-0">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label>Facebook Title</Label>
                  <Input
                    value={editingData.fbTitle}
                    onChange={(e) =>
                      handleFieldChange("fbTitle", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Button Title</Label>
                  <Input
                    value={editingData.fbBtnTitle}
                    onChange={(e) =>
                      handleFieldChange("fbBtnTitle", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Button Link</Label>
                  <Input
                    value={editingData.fbBtnLink}
                    onChange={(e) =>
                      handleFieldChange("fbBtnLink", e.target.value)
                    }
                    placeholder="https://facebook.com/group"
                  />
                </div>
                <div>
                  <Label>Facebook Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("fbImage", e)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  {editingData.fbTitle}
                </h3>
                {editingData.fbBtnLink && (
                  <a
                    href={editingData.fbBtnLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-gradient-to-b from-[#26B7FF] to-[#0064E1] text-white font-bold px-1 py-3 md:px-6 rounded-xl shadow-md hover:opacity-90 gap-1 transition-opacity text-sm justify-center w-[164px]"
                  >
                    <img src="/user-group.svg" alt="" />
                    {editingData.fbBtnTitle}
                  </a>
                )}
              </>
            )}
          </div>

          <div className="relative">
            {isEditing ? (
              <div className="p-4">
                {imagePreviews.fbImage ? (
                  <img
                    // src={imagePreviews.fbImage}
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${imagePreviews.fbImage}`}
                    alt="Facebook preview"
                    className="w-32 h-32 object-contain"
                  />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto mb-2" />
                    <p className="text-sm">Upload Facebook image</p>
                  </div>
                )}
              </div>
            ) : (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/${imagePreviews.fbImage}`}
                alt="fb logo"
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className="flex justify-center mt-4">
        {isEditing ? (
          <div className="flex gap-2">
            <Button onClick={handleUpdate} className="flex items-center gap-1">
              <Save size={16} />
              Save
            </Button>
            <Button onClick={handleEditToggle} variant="outline">
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleEditToggle}
            className="flex items-center gap-1"
          >
            <Edit size={16} />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}
