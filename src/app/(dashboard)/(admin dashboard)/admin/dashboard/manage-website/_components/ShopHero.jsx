"use client";
import { Button } from "@/components/ui/button";
import {
  useGetAllShopHerosQuery,
  useUpdateShopHeroMutation,
} from "@/redux/features/WebManage/ShopHero.api";

import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import Loader from "@/components/shared/Loader";
export default function ShopHeroManage() {
  const { data: shopHeroData, isLoading, isError } = useGetAllShopHerosQuery();
  const [updateShopHero] = useUpdateShopHeroMutation();

  const [formData, setFormData] = useState({
    miniTitle: "",
    subTitle: "",
    title: "",
    image: "",
  });

  // Set form data when API data is available
  useEffect(() => {
    if (shopHeroData && shopHeroData.length > 0) {
      const data = shopHeroData[0];
      setFormData({
        miniTitle: data.miniTitle || "",
        subTitle: data.subTitle || "",
        title: data.title || "",
        image: data.image || "",
      });
    }
  }, [shopHeroData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSave = async () => {
    const updatedData = new FormData();

    for (const key in formData) {
      updatedData.append(key, formData[key]);
    }

    try {
      await updateShopHero({
        id: shopHeroData[0]._id,
        data: updatedData,
      }).unwrap();

      toast("Shop hero data updated successfully!", {
        description: "Your changes are now live.",
      });
    } catch (error) {
      toast("Update failed!", {
        description: error?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading data!</div>;

  return (
    <div>
      {/* Shop Hero Section Preview */}
      <div className="relative bg-gray2 pb-8 px-2 rounded-lg">
        {/* hero bg */}
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-[.04]" />

        {/* hero content */}
        <div className="flex flex-col rounded-lg lg:flex-row gap-2  items-center justify-between relative z-[1] max-w-[1200px] mx-auto">
          {/* Left hero content */}
          <div className="space-y-4 mt-8 text-center md:text-start px-4 md:px-0 ">
            <div className="space-y-2">
              <p className="text-lg">🛍️ {formData.miniTitle || "ডি জুরি শপ"}</p>
              <p className="font-black text-3xl">
                {formData.title || "শেখার জন্য দরকারি সবকিছু এক জায়গায়"}
              </p>
            </div>
            <div className="text-lg">
              <p className="text-[#74767C]">
                {formData.subTitle ||
                  "শুধু ক্লাস নয়, প্রয়োজনীয় বই, নোটস, ম্যাটেরিয়াল ও স্টাডি টুলস — সবকিছু এখন পাবেন এক ক্লিকে।"}
              </p>
            </div>
          </div>

          {/* Right hero content */}
          <div className="mt-8 h-[300px] w-[300px] flex items-center justify-center">
            {formData.image ? (
              <Image
                src={
                  formData.image instanceof File
                    ? URL.createObjectURL(formData.image)
                    : `${process.env.NEXT_PUBLIC_API_URL}/${formData.image}`
                }
                alt="Shop hero"
                width={300}
                height={300}
                className="rounded-lg "
              />
            ) : (
              <img src="/palla.svg" alt="Default shop image" />
            )}
          </div>
        </div>
      </div>

      {/* Input Fields Section */}
      <div className="w-full container mt-2">
        <div className="w-full bg-white rounded-2xl shadow-[0px_8px_40px_rgba(0,0,0,0.1)] p-4  relative">
          {/* Mini Title */}
          <div className="mb-4">
            <label htmlFor="miniTitle" className="block font-medium">
              Mini Title
            </label>
            <input
              type="text"
              id="miniTitle"
              name="miniTitle"
              value={formData.miniTitle}
              onChange={handleChange}
              placeholder="Enter mini title (e.g., 🛍️ ডি জুরি শপ)"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Sub Title */}
          <div className="mb-4">
            <label htmlFor="subTitle" className="block font-medium">
              Sub Title
            </label>
            <textarea
              id="subTitle"
              name="subTitle"
              value={formData.subTitle}
              onChange={handleChange}
              placeholder="Enter sub title"
              rows={1}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Image */}
          <div className="mb-4">
            <label htmlFor="image" className="block font-medium">
              Hero Image
            </label>
            {formData.image && typeof formData.image === "string" && (
              <div className="mb-2">
                <p className="text-sm text-gray-500">Current Image:</p>
                <div className="flex items-center gap-2">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image}`}
                    alt="Current Hero Image"
                    width={100}
                    height={60}
                    className="rounded-md"
                  />
                  <span className="text-sm truncate max-w-xs">
                    {formData.image}
                  </span>
                </div>
              </div>
            )}
            {formData.image instanceof File && (
              <div className="mb-2">
                <p className="text-sm text-gray-500">New Image Selected:</p>
                <div className="flex items-center gap-2">
                  <Image
                    src={URL.createObjectURL(formData.image)}
                    alt="New Hero Image"
                    width={300}
                    height={300}
                    className="rounded-md"
                  />
                </div>
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-md cursor-pointer"
            />
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} className="mt-4">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
