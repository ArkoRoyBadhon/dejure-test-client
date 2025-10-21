"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { useGetCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetSubCategoriesQuery } from "@/redux/features/category/subcategory.api";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";

export default function CoursesHeader({ activeSubCatId, setActiveSubCatId }) {
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: allSubCategories = [] } = useGetSubCategoriesQuery();
  const { data: allCourses = [] } = useGetCoursesQuery();

  const courseCountMap = useMemo(() => {
    const counts = {};
    allCourses.forEach((course) => {
      const subCatId =
        typeof course.subCategory === "object"
          ? course.subCategory?._id
          : course.subCategory;
      if (subCatId) {
        counts[subCatId] = (counts[subCatId] || 0) + 1;
      }
    });
    return counts;
  }, [allCourses]);

  const [parentCatId, setParentCatId] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const filteredSubCategories = parentCatId
    ? allSubCategories.filter(
        (subCat) => subCat.parentCategory?._id === parentCatId
      )
    : allSubCategories;

  const subPrevRef = useRef(null);
  const subNextRef = useRef(null);

  useEffect(() => {
    if (filteredSubCategories.length > 0) {
      if (
        !activeSubCatId ||
        !filteredSubCategories.some((cat) => cat._id === activeSubCatId)
      ) {
        setActiveSubCatId(filteredSubCategories[0]._id);
      }
    } else {
      setActiveSubCatId(null);
    }
  }, [parentCatId, filteredSubCategories]);

  const currentParentCategory = categories.find(
    (cat) => cat._id === parentCatId
  );

  return (
    <div className="relative bg-gray2 border-b min-h-[264px] md:h-[264px] flex flex-col justify-center p-4 md:p-0">
      {/* hero bg */}
      <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-[.04]" />

      <div className="relative max-w-[1200px] mx-auto w-full">
        {/* Parent Categories Dropdown */}
        <div className="relative mb-6 px-2 md:px-4">
          <div className="w-full md:max-w-md">
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="w-full flex items-center justify-between bg-white rounded-lg shadow-md p-3 md:p-4 hover:shadow-lg transition-all duration-300"
            >
              <span className="font-medium text-gray-900 text-sm md:text-base">
                {currentParentCategory?.title || "All Categories"}
              </span>
              {isCategoryDropdownOpen ? (
                <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
              )}
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute z-20 mt-2 w-full md:w-5/12 bg-white rounded-lg shadow-lg max-h-[60vh] md:max-h-96 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {/* All Categories Option */}
                  <div
                    onClick={() => {
                      setParentCatId(null);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                      parentCatId === null
                        ? "bg-main text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <h4 className="font-medium text-sm">All Categories</h4>
                  </div>

                  {/* Actual Categories */}
                  {categories?.map((cat) => (
                    <div
                      key={cat._id}
                      onClick={() => {
                        setParentCatId(cat._id);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors duration-200 ${
                        cat._id === parentCatId
                          ? "bg-main text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <h4 className="font-medium text-sm">{cat.title}</h4>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL || ""}/${
                          cat.thumbnail
                        }`}
                        alt={cat.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subcategories Swiper */}
        <div className="relative px-2 min-h-[80px]">
          {" "}
          {/* Added min-height */}
          {/* Left navigation - Always visible */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
            <button
              ref={subPrevRef}
              className="h-6 w-6 md:h-8 md:w-8 flex items-center justify-center rounded-full bg-white shadow-md text-darkColor hover:bg-main hover:text-white transition-colors duration-300"
            >
              <ChevronLeft
                strokeWidth={2.5}
                className="h-3 w-3 md:h-4 md:w-4"
              />
            </button>
          </div>
          {/* Right navigation - Always visible */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <button
              ref={subNextRef}
              className="h-6 w-6 md:h-8 md:w-8 flex items-center justify-center rounded-full bg-white shadow-md text-darkColor hover:bg-main hover:text-white transition-colors duration-300"
            >
              <ChevronRight
                strokeWidth={2.5}
                className="h-3 w-3 md:h-4 md:w-4"
              />
            </button>
          </div>
          <Swiper
            modules={[Navigation]}
            spaceBetween={8}
            slidesPerView="auto"
            className="!px-8 md:!px-10" // Changed from mx to px
            navigation={{
              prevEl: subPrevRef.current,
              nextEl: subNextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = subPrevRef.current;
              swiper.params.navigation.nextEl = subNextRef.current;
            }}
            breakpoints={{
              320: { slidesPerView: 1.8, spaceBetween: 8 },
              480: { slidesPerView: 2.5, spaceBetween: 12 },
              640: { slidesPerView: 3.5, spaceBetween: 12 },
              768: { slidesPerView: 4.2, spaceBetween: 16 },
              1024: { slidesPerView: "auto", spaceBetween: 16 }, // Changed to auto
            }}
          >
            {filteredSubCategories?.length > 0 ? (
              filteredSubCategories.map((cat) => (
                <SwiperSlide key={cat._id} className="!w-auto">
                  <div
                    onClick={() => setActiveSubCatId(cat._id)}
                    className={`flex items-center mb-1 gap-2 md:gap-3 rounded-lg p-2 md:p-3 cursor-pointer transition-all duration-300 ${
                      cat._id === activeSubCatId
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg"
                        : "bg-white hover:bg-gray-50 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {cat.thumbnail && (
                      <div className="flex-shrink-0">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL || ""}/${
                            cat.thumbnail
                          }`}
                          alt={cat.name}
                          width={48}
                          height={48}
                          className="h-8 w-8 md:h-12 md:w-12 rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs md:text-sm truncate">
                        {cat.name}
                      </h4>
                      <p className="text-[10px] md:text-xs mt-0.5 md:mt-1 text-gray-500">
                        {courseCountMap[cat._id] || 0} courses
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide className="!w-auto">
                <div className="flex items-center mb-1 gap-2 md:gap-3 rounded-lg p-2 md:p-3 bg-white shadow-md">
                  <p className="text-gray-500">No subcategories available</p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
