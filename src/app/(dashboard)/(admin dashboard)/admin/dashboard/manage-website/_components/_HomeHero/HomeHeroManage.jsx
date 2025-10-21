"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  useGetAllHomeManagesQuery,
  useUpdateHomeManageMutation,
} from "@/redux/features/WebManage/HomeManage.api";
import { toast } from "sonner";

import Loader from "@/components/shared/Loader";
export default function HomeHeroManage({ setHasPermissionError }) {
  const {
    data: homeManageData,
    isLoading,
    isError,
    error,
  } = useGetAllHomeManagesQuery();
  const [updateHomeManage] = useUpdateHomeManageMutation();
  const [active, setActive] = useState(0);
  const swiperRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    sliderImage1: "",
    sliderImage2: "",
    sliderImage3: "",
    studentCount: "",
    mentorCount: "",
    materialCount: "",
    bcsCount: "",
    barCount: "",
    liveClassCount: "",
    liveExamCount: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);

  // Set form data when API data is available
  useEffect(() => {
    if (homeManageData && homeManageData.length > 0) {
      const data = homeManageData[0];
      setFormData({
        title: data.title || "",
        subTitle: data.subTitle || "",
        sliderImage1: data.sliderImage1 || "",
        sliderImage2: data.sliderImage2 || "",
        sliderImage3: data.sliderImage3 || "",
        studentCount: data.studentCount || "",
        mentorCount: data.mentorCount || "",
        materialCount: data.materialCount || "",
        bcsCount: data.bcsCount || "",
        barCount: data.barCount || "",
        liveClassCount: data.liveClassCount || "",
        liveExamCount: data.liveExamCount || "",
      });
    }
  }, [homeManageData]);

  useEffect(() => {
    if (error?.data?.message === "Insufficient module permissions") {
      setHasPermissionError(true);
    }
  }, [error]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultipleImagesChange = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      // Convert FileList to array and limit to max 3 images
      const selectedFiles = Array.from(files).slice(0, 3);
      setSelectedImages(selectedFiles);
    }
  };

  const handleSave = async () => {
    const updatedData = new FormData();

    // Append all text fields
    for (const key in formData) {
      updatedData.append(key, formData[key]);
    }

    // Append images if any are selected
    if (selectedImages.length > 0) {
      selectedImages.forEach((image) => {
        updatedData.append("images", image);
      });
    }

    try {
      await updateHomeManage({
        id: homeManageData[0]._id,
        data: updatedData,
      }).unwrap();

      toast("Home data updated successfully!", {
        description: "Your changes are now live.",
      });

      // Clear selected images after successful upload
      setSelectedImages([]);
    } catch (error) {
      toast("Update failed!", {
        description: error?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      {/* Hero Section Preview */}
      <div className="relative [background-image:linear-gradient(90deg,rgba(255,184,0,0)_-5.25%,rgba(255,184,0,0.1)_41.47%)] border-b ">
        {/* Hero bg */}
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-[.04]" />

        {/* Hero content */}
        <div className="min-h-[300px] py-[20px] flex flex-col lg:flex-row gap-14 items-center justify-between relative z-[1] max-w-[1200px] mx-auto">
          {/* Left hero content */}
          <div className="flex-1 flex-col space-y-4 hidden -mt-16 md:block">
            <h1 className="font-bold text-start text-2xl text-[#141B34]">
              {formData.title || "Loading Title..."}
            </h1>
            <p className="text-deepGray text-lg font-bold text-start">
              {formData.subTitle || "Loading Subtitle..."}
            </p>

            <label
              htmlFor="join"
              className=" flex items-center border border-main p-1 pl-4 rounded-2xl h-14 bg-white outline-none"
            >
              <input
                type="text"
                id="join"
                placeholder="ফোন নাম্বার বা ইমেইল দিন"
                className="flex-1 h-full placeholder:text-deepGray border-none focus:outline-none"
              />
              <Button className="h-full font-bold rounded-2xl bg-blue px-6 hover:bg-blue-700 text-white">
                ফ্রি জয়েন করুন
              </Button>
            </label>
            <p className="text-darkColor text-start">
              আমরা যাচাইয়ের জন্য একটি ওটিপি পাঠাবো।
            </p>
          </div>

          {/* Slider */}
          <div className="flex flex-col px-2">
            <Swiper
              onSlideChange={(swiper) => setActive(swiper.activeIndex)}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              slidesPerView={1}
              loop
              className="rounded-3xl max-w-[350px] h-auto items-end space-x-2"
            >
              {formData.sliderImage1 && (
                <SwiperSlide>
                  <Image
                    alt="Slider Image 1"
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.sliderImage1}`}
                    height={540}
                    width={400}
                    className="rounded-3xl w-full h-auto"
                  />
                </SwiperSlide>
              )}
              {formData.sliderImage2 && (
                <SwiperSlide>
                  <Image
                    alt="Slider Image 2"
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.sliderImage2}`}
                    height={540}
                    width={400}
                    className="rounded-3xl w-full h-auto"
                  />
                </SwiperSlide>
              )}
              {formData.sliderImage3 && (
                <SwiperSlide>
                  <Image
                    alt="Slider Image 3"
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.sliderImage3}`}
                    height={540}
                    width={400}
                    className="rounded-3xl w-full h-auto"
                  />
                </SwiperSlide>
              )}
            </Swiper>

            <div className="flex items-center justify-center gap-2 my-4 mx-auto">
              {formData.sliderImage1 ||
              formData.sliderImage2 ||
              formData.sliderImage3 ? (
                [
                  formData.sliderImage1,
                  formData.sliderImage2,
                  formData.sliderImage3,
                ]
                  .filter(Boolean)
                  .map((_, i) => (
                    <button
                      key={i}
                      onClick={() => swiperRef.current?.slideTo(i)}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        i === active
                          ? "w-12 bg-main"
                          : "w-5 bg-darkColor opacity-50"
                      }`}
                    ></button>
                  ))
              ) : (
                <span>No slider images available</span>
              )}
            </div>
          </div>
        </div>

        {/* state indicator */}
        <div className="mx-auto max-w-[1200px] px-4 md:px-0 ">
          <div className="w-full bg-white rounded-2xl shadow-[0px_8px_40px_rgba(0,0,0,0.1)] p-10  relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-y-8 text-center">
              {[
                {
                  count: formData.studentCount,
                  label: "Students",
                  color: "#FF5733",
                },
                {
                  count: formData.mentorCount,
                  label: "Mentors",
                  color: "#2ECC71",
                },
                {
                  count: formData.materialCount,
                  label: "Materials",
                  color: "#3498DB",
                },
                { count: formData.bcsCount, label: "BJS", color: "#9B59B6" },
                { count: formData.barCount, label: "BAR", color: "#9B59B6" },
                {
                  count: formData.liveClassCount,
                  label: "Live Classes",
                  color: "#E67E22",
                },
                {
                  count: formData.liveExamCount,
                  label: "Live Exams",
                  color: "#E67E22",
                },
              ].map((stat, index, arr) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center relative px-4 ${
                    index === 2 ? "col-span-2 md:col-auto" : ""
                  }`}
                >
                  <p
                    className="text-2xl sm:text-3xl font-extrabold"
                    style={{ color: stat.color }}
                  >
                    {stat.count || 0}
                    <span className="text-black">+</span>
                  </p>
                  <p className="text-sm sm:text-base text-darkColor mt-4">
                    {stat.label}
                  </p>

                  {/* Divider except last item */}
                  {index !== arr.length - 1 && (
                    <div
                      className={`absolute right-0 top-1/2 -translate-y-1/2 h-full w-px bg-gray3 ${
                        index === 2 ? "hidden md:block" : ""
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Fields Section */}
      <div className="w-full2container mt-8">
        <div className="w-full bg-white rounded-2xl shadow-[0px_8px_40px_rgba(0,0,0,0.1)] p-4 relative">
          <h3 className="text-xl font-bold mb-4">Edit Home Manage Content</h3>

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
              placeholder="Enter Title"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* SubTitle */}
          <div className="mb-4">
            <label htmlFor="subTitle" className="block font-medium">
              Subtitle
            </label>
            <input
              type="text"
              id="subTitle"
              name="subTitle"
              value={formData.subTitle}
              onChange={handleChange}
              placeholder="Enter Subtitle"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Multiple Images Input */}
          <div className="mb-4">
            <label htmlFor="images" className="block font-medium mb-2">
              Upload up to 3 images (Recommended size: 400×540 px).{" "}
              <a
                href="https://imageresizer.com/"
                className="underline text-blue-600"
              >
                Resizer
              </a>
            </label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleMultipleImagesChange}
              multiple
              accept="image/*"
              className="w-full p-2 border rounded-md cursor-pointer"
            />
            <p className="text-sm text-gray-500 mt-1">
              The first image will become sliderImage1, the second sliderImage2,
              and the third sliderImage3.
            </p>

            {/* Preview of selected images */}
            {selectedImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Selected Images:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="border rounded-md p-2">
                      <p className="text-sm font-medium mb-2">
                        Slider Image {index + 1}
                      </p>
                      <div className="flex flex-col items-center">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt={`Selected Image ${index + 1}`}
                          width={100}
                          height={60}
                          className="rounded-md"
                        />
                        <span className="text-xs mt-1 truncate max-w-full">
                          {image.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 sm:gap-6 md:gap-8 text-center">
            {Object.keys(formData)
              .filter((key) => key.includes("Count"))
              .map((key, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center relative"
                >
                  <label htmlFor={key} className="block font-medium">
                    {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </label>
                  <input
                    type="number"
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md "
                  />
                </div>
              ))}
          </div>

          {/* Save Button */}
          <div className=" mx-auto flex  justify-center ">
            <Button onClick={handleSave} className="my-4 ">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
