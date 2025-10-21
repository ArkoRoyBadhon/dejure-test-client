import { Button } from "@/components/ui/button";
import {
  useGetAllJobPortalHerosQuery,
  useUpdateJobPortalHeroMutation,
} from "@/redux/features/WebManage/JobHero.api";
import Image from "next/image";
import { useState, useEffect } from "react";

import { toast } from "sonner";

import Loader from "@/components/shared/Loader";
export default function CareerHeroManage() {
  const {
    data: jobPortalHeroData,
    isLoading,
    isError,
  } = useGetAllJobPortalHerosQuery();
  const [updateJobPortalHero] = useUpdateJobPortalHeroMutation();

  const [formData, setFormData] = useState({
    miniTitle: "",
    title: "",
    subTitle: "",

    image: "",
  });

  // Set form data when API data is available
  useEffect(() => {
    if (jobPortalHeroData && jobPortalHeroData.length > 0) {
      const data = jobPortalHeroData[0];
      setFormData({
        miniTitle: data.miniTitle || "",
        title: data.title || "",
        subTitle: data.subTitle || "",

        image: data.image || "",
      });
    }
  }, [jobPortalHeroData]);

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
      await updateJobPortalHero({
        id: jobPortalHeroData[0]._id,
        data: updatedData,
      }).unwrap();

      toast("Career hero data updated successfully!", {
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
      {/* Career Hero Section Preview */}
      <div className="relative bg-gray2 pb-8 px-2 rounded-lg">
        {/* hero bg */}
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-[.04]" />

        {/* hero content */}
        <div className="flex flex-col lg:flex-row gap-14 items-center justify-between relative z-[1] max-w-[1200px] mx-auto">
          {/* Left hero content */}
          <div className="space-y-4 mt-8 text-center md:text-start px-4 md:px-0">
            <div className="space-y-2">
              <p>💼 {formData.miniTitle || "জব পোর্টাল"}</p>
              <p className="font-black text-3xl hidden md:block">
                {formData.title || "শেখা শেষ, এবার ক্যারিয়ারের পথে"}
              </p>
              <p className="font-black text-2xl block md:hidden">
                {formData.subTitle ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formData.subTitle.replace(/\n/g, "<br />"),
                    }}
                  />
                ) : (
                  <>
                    <span className="whitespace-nowrap">
                      শেখা শেষ, এবার ক্যারিয়ারের
                    </span>{" "}
                    <br /> পথে
                  </>
                )}
              </p>
            </div>
            <div>
              <p className="text-[#74767C] text-sm md:text-md">
                {formData.subTitle ||
                  "ডিজুরি শুধু পড়ায় সীমাবদ্ধ নয়, আমরা তৈরি করি ক্যারিয়ারের সুযোগ।"}
              </p>
            </div>
          </div>

          {/* Right hero content */}
          <div className="md:mt-8 mt-0">
            {formData.image ? (
              <Image
                src={
                  formData.image instanceof File
                    ? URL.createObjectURL(formData.image)
                    : `${process.env.NEXT_PUBLIC_API_URL}/${formData.image}`
                }
                alt="Career hero"
                height={200}
                width={248}
                className="w-[248px] h-[200px]"
              />
            ) : (
              <Image
                src="/assets/image/book-stack.png"
                alt="Career Opportunities"
                height={200}
                width={248}
                className="w-[248px] h-[200px]"
              />
            )}
          </div>
        </div>
      </div>

      {/* Input Fields Section */}
      <div className="w-full container mt-2">
        <div className="w-full bg-white rounded-2xl shadow-[0px_8px_40px_rgba(0,0,0,0.1)] p-4 relative">
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
              placeholder="Enter mini title (e.g., 💼 জব পোর্টাল)"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Desktop Title */}
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
              placeholder="Enter desktop title"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="subTitle" className="block font-medium">
              Sub Title
            </label>
            <textarea
              id="subTitle"
              name="subTitle"
              value={formData.subTitle}
              onChange={handleChange}
              placeholder="Enter subTitle"
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
                    width={100}
                    height={60}
                    className="rounded-md"
                  />
                  <span className="text-sm truncate max-w-xs">
                    {formData.image.name}
                  </span>
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
