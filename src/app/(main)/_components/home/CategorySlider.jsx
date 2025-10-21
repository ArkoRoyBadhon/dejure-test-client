"use client";
import React from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useGetCategoryWiseCourseQuery } from "@/redux/features/course/course.api";

export default function CategorySlider({
  setActiveCatId,
  activeCatId,
  categories,
}) {
  // Filter out the "All" category from rendering but keep it in the system logic
  const visibleCategories = categories.filter((cat) => cat._id !== "all");

  return (
    <div className="relative md:mx-15">
      {/* Custom navigation buttons */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer h-8 w-8 flex items-center justify-center rounded-full bg-[#141B341A] text-darkColor hover:bg-main duration-300"
        id="swiper-prev"
      >
        <ChevronLeft strokeWidth={2.5} className="h-4 w-4" />
      </button>

      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer h-8 w-8 flex items-center justify-center rounded-full bg-[#141B341A] text-darkColor hover:bg-main duration-300"
        id="swiper-next"
      >
        <ChevronRight strokeWidth={2.5} className="h-4 w-4" />
      </button>

      {/* Swiper */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView="auto"
        className="!py-10 !mx-10"
        navigation={{
          prevEl: "#swiper-prev",
          nextEl: "#swiper-next",
        }}
        breakpoints={{
          320: { slidesPerView: 2.2 },
          640: { slidesPerView: 3.2 },
          1024: { slidesPerView: 5 },
        }}
      >
        {visibleCategories?.map((cat) => {
          const { data: categoryCourses = [], isLoading } =
            useGetCategoryWiseCourseQuery(cat._id, {
              skip: !cat._id,
            });

          return (
            <SwiperSlide key={cat._id} className="!w-fit">
              <div
                onClick={() => setActiveCatId(cat._id)}
                className={`w-fit flex items-center gap-[14px] rounded-lg bg-white p-2 shadow-sm border border-main/40 cursor-pointer ${
                  cat._id === activeCatId
                    ? "bg-yellow-400"
                    : "bg-[#FFF8E9] text-black"
                } hover:shadow-md transition`}
              >
                {cat.thumbnail && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${cat.thumbnail}`}
                    alt="cate_image"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-lg"
                  />
                )}
                <div className="">
                  <h4 className="font-bold text-darkColor text-sm whitespace-nowrap">
                    {cat.name}
                  </h4>
                  {/* <p className="text-xs mt-1 text-deepGray">
                    {isLoading ? "..." : categoryCourses.length || 0} courses
                  </p> */}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
