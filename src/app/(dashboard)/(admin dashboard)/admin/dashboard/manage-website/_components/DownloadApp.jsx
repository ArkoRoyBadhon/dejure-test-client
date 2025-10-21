"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, Upload } from "lucide-react";
import Loader from "@/components/shared/Loader";
import {
  useCreateAppDownloadMutation,
  useGetAllAppDownloadsQuery,
  useUpdateAppDownloadMutation,
} from "@/redux/features/WebManage/appDownload.api";

export default function ManageDownloadApp() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState({
    title: "",
    subTitle: "",
    playStoreLink: "",
    appStoreLink: "",
    image: null,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    data: appDownloads,
    isLoading,
    error,
    refetch,
  } = useGetAllAppDownloadsQuery();
  const [updateAppDownload] = useUpdateAppDownloadMutation();
  const [createAppDownload] = useCreateAppDownloadMutation();

  useEffect(() => {
    if (appDownloads && appDownloads.length > 0) {
      setEditingData(appDownloads[0]);
      if (appDownloads[0].image) {
        setImagePreview(`/${appDownloads[0].image}`);
      }
    }
  }, [appDownloads]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset to original data when canceling
      if (appDownloads && appDownloads.length > 0) {
        setEditingData(appDownloads[0]);
        setImageFile(null);
        setImagePreview(
          appDownloads[0].image ? `/${appDownloads[0].image}` : null
        );
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editingData.title);
      formData.append("subTitle", editingData.subTitle);
      formData.append("playStoreLink", editingData.playStoreLink);
      formData.append("appStoreLink", editingData.appStoreLink);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (appDownloads && appDownloads.length > 0) {
        await updateAppDownload({
          id: appDownloads[0]._id,
          data: formData,
        }).unwrap();
      } else {
        await createAppDownload(formData).unwrap();
      }

      setIsEditing(false);
      setImageFile(null);
      refetch();
    } catch (error) {
      console.error("Failed to update app download:", error);
    }
  };

  if (isLoading)
    return (
      <Loader />
    );
  if (error)
    return (
      <div className="py-16 md:pb-28 md:pt-20 p-4 md:px-0">
        Error loading app download data
      </div>
    );

  return (
    <div className="py-16 md:pb-28 md:pt-20 p-4 md:px-0">
      <div className="max-w-[1200px] mx-auto relative bg-[#FFB800] rounded-3xl">
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-[.04]" />

        <div className="flex flex-col md:flex-row items-center relative z-[1] pt-12 md:pt-0">
          {/* left part */}
          <div className="flex flex-col space-y-6 flex-[2] pl-0 md:pl-16 text-center md:text-start p-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingData.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className="text-2xl font-bold"
                  />
                </div>
                <div>
                  <Label htmlFor="subTitle">Subtitle</Label>
                  <Input
                    id="subTitle"
                    value={editingData.subTitle}
                    onChange={(e) =>
                      handleFieldChange("subTitle", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="playStoreLink">Play Store Link</Label>
                  <Input
                    id="playStoreLink"
                    value={editingData.playStoreLink}
                    onChange={(e) =>
                      handleFieldChange("playStoreLink", e.target.value)
                    }
                    placeholder="https://play.google.com/store/apps/details?id=..."
                  />
                </div>
                <div>
                  <Label htmlFor="appStoreLink">App Store Link</Label>
                  <Input
                    id="appStoreLink"
                    value={editingData.appStoreLink}
                    onChange={(e) =>
                      handleFieldChange("appStoreLink", e.target.value)
                    }
                    placeholder="https://apps.apple.com/app/id..."
                  />
                </div>
                <div>
                  <Label htmlFor="image">App Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-bold text-3xl text-[#141B34]">
                  {editingData.title || "ডাউনলোড করুন ডিজুরি App"}
                </h1>
                <h2 className="text-md hidden md:block">
                  {editingData.subTitle ||
                    "লাইভ ক্লাসের বেস্ট এক্সপেরিয়েন্স পেতে, এখনই ডাউনলোড করুন ডিজুরি অ্যাপ"}
                </h2>
                <h2 className="text-md block md:hidden">
                  {editingData.subTitle ? (
                    editingData.subTitle
                  ) : (
                    <>
                      লাইভ ক্লাসের বেস্ট এক্সপেরিয়েন্স পেতে,
                      <br /> এখনই ডাউনলোড করুন ডিজুরি অ্যাপ
                    </>
                  )}
                </h2>
              </>
            )}

            <div className="flex gap-2 justify-center md:justify-start p-2 md:p-0">
              {editingData.playStoreLink && (
                <a
                  href={editingData.playStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/g2.svg" alt="Google Play Store" />
                </a>
              )}
              {editingData.appStoreLink && (
                <a
                  href={editingData.appStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/g1.svg" alt="Apple App Store" />
                </a>
              )}
            </div>
          </div>

          {/* Right Part */}
          <div className="flex justify-end items-center">
            {isEditing ? (
              <div className="flex flex-col items-center gap-4 p-4">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="App Preview"
                      height={350}
                      width={268}
                      className="w-[268px] h-[350px] object-contain"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        handleFieldChange("image", null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="mx-auto mb-2" />
                    <p>Upload app image</p>
                    <p className="text-sm text-gray-500">
                      Recommended: 268×350px
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${
                  editingData.image || "/mobile.png"
                }`}
                alt="App Preview"
                height={350}
                width={268}
                className="w-[353px] h-[350px] md:-mt-14 mt-8"
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className="max-w-[1200px] mx-auto  flex justify-center mt-6">
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
