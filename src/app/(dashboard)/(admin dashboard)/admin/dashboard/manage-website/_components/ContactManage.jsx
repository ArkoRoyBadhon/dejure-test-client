"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, Upload, X } from "lucide-react";
import {
  useCreateContactMutation,
  useGetAllContactsQuery,
  useUpdateContactMutation,
} from "@/redux/features/WebManage/Contact.api";

export default function ContactManage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState({
    title: "",
    subTitle: "",
    time: "",
    number: "",
    rate: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    data: contacts,
    isLoading,
    error,
    refetch,
  } = useGetAllContactsQuery();
  const [updateContact] = useUpdateContactMutation();
  const [createContact] = useCreateContactMutation();

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      setEditingData(contacts[0]);
      if (contacts[0].image) {
        setImagePreview(
          `${process.env.NEXT_PUBLIC_API_URL}/${contacts[0].image}`
        );
      }
    } else {
      // Set default values if no contact data exists
      setEditingData({
        title: "আমাদের পরামর্শদাতার সাথে কথা বলুন",
        subTitle: "যে কোনো প্রয়োজনে কল করো এখনই",
        time: "সকাল ৯টা - রাত ১০ টা",
        number: "996477",
        rate: "* যেকোনো নাম্বার থেকে সাধারণ কল রেট *",
        image: "/image_woman.svg",
      });
    }
  }, [contacts]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset to original data when canceling
      if (contacts && contacts.length > 0) {
        setEditingData(contacts[0]);
        setImageFile(null);
        setImagePreview(
          contacts[0].image
            ? `${process.env.NEXT_PUBLIC_API_URL}/${contacts[0].image}`
            : "/image_woman.svg"
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

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editingData.title);
      formData.append("subTitle", editingData.subTitle);
      formData.append("time", editingData.time);
      formData.append("number", editingData.number);
      formData.append("rate", editingData.rate);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (contacts && contacts.length > 0) {
        await updateContact({
          id: contacts[0]._id,
          data: formData,
        }).unwrap();
      } else {
        await createContact(formData).unwrap();
      }

      setIsEditing(false);
      setImageFile(null);
      refetch();
    } catch (error) {
      console.error("Failed to update contact:", error);
    }
  };

  if (isLoading)
    return <div className="p-8">Loading contact information...</div>;
  if (error)
    return <div className="p-8">Error loading contact information</div>;

  return (
    <div>
      <div className="bg-[#F2F7FC] rounded-xl shadow-lg px-8 pt-8 flex flex-col relative overflow-hidden border w-2/3 mx-auto my-4">
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center opacity-[.04] z-0 pointer-events-none" />

        <div className="relative">
          {isEditing ? (
            <div className="space-y-4 mb-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="text-[26px] font-semibold"
                />
              </div>
              <div>
                <Label htmlFor="subTitle">subTitle</Label>
                <Input
                  id="subTitle"
                  value={editingData.subTitle}
                  onChange={(e) =>
                    handleFieldChange("subTitle", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="time">time</Label>
                <Input
                  id="time"
                  value={editingData.time}
                  onChange={(e) => handleFieldChange("time", e.target.value)}
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-[26px] font-semibold text-gray-800 mb-2">
                {editingData.title}
              </h2>
              <p className="text-sm sm:text-base font-bold text-[#74767C] mb-1">
                {editingData.subTitle}
              </p>
              <p className="text-[12px] font-bold text-[#141B34] mb-1">
                {editingData.time}
              </p>
            </>
          )}
        </div>

        {/* Advisor Image and Button */}
        <div className="flex items-end justify-between relative">
          <div className="mb-6 relative">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="number">Phone Number</Label>
                  <Input
                    id="number"
                    value={editingData.number}
                    onChange={(e) =>
                      handleFieldChange("number", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="rate">rate</Label>
                  <Input
                    id="rate"
                    value={editingData.rate}
                    onChange={(e) => handleFieldChange("rate", e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <>
                <button className="flex items-center px-8 py-2 rounded-xl bg-[#FFB800] font-bold gap-1 hover:bg-[#e0a800] transition-colors">
                  <img src="/call.svg" alt="" className="w-5 h-5" />
                  {editingData.number}
                </button>
                <p className="text-xs mt-4">{editingData.rate}</p>
              </>
            )}
          </div>

          <div className="bottom-0 right-0 relative">
            {isEditing ? (
              <div className="flex flex-col items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Advisor Preview"
                      height={200}
                      width={150}
                      className="w-[150px] h-[200px] object-contain"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("/image_woman.svg");
                        handleFieldChange("image", "");
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto mb-2" size={24} />
                    <p>Upload advisor image</p>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full cursor-pointer"
                />
              </div>
            ) : (
              <Image
                src={
                  editingData.image &&
                  `${process.env.NEXT_PUBLIC_API_URL}/${editingData.image}`
                }
                alt="Advisor"
                height={200}
                width={150}
                className="w-full h-full"
              />
            )}
          </div>
        </div>
      </div>
      {/* Edit/Save Button */}
      <div className="flex justify-center p-4">
        {isEditing ? (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-1">
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
