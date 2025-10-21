"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { cn } from "@/lib/utils";
import CourseCard from "./CourseCard";

export default function CourseCardContainer({
  iconSrc,
  title,
  containerClass,
  courses = [],
  isLoading = false,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Group courses into sets of 3
  const groupedCourses = [];
  for (let i = 0; i < courses.length; i += 3) {
    groupedCourses.push(courses.slice(i, i + 3));
  }

  useEffect(() => {
    setIsMounted(true);
    setIsTitleVisible(true);
  }, []);

  return (
    <section
      className={cn(
        "py-12 md:py-16 lg:py-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0",
        containerClass
      )}
    >
      {/* Always show section header */}
      <div className="flex items-center justify-between gap-3 md:gap-4 mb-6 md:mb-8 ">
        <Image
          src={iconSrc}
          alt={title}
          width={40}
          height={40}
          className="w-8 h-8 md:w-10 md:h-10 lg:w-[40px] lg:h-[40px] object-cover"
        />

        <h2
          className={`text-2xl  md:text-3xl Z font-bold text-darkColor grow whitespace-nowrap overflow-hidden text-ellipsis min-w-0 transition-all duration-700 ease-out ${
            isTitleVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-4"
          }`}
        >
          {title}
        </h2>

        <div className="inline-flex gap-1 md:gap-2 items-center z-10 flex-shrink-0">
          <button
            ref={prevRef}
            className="cursor-pointer h-7 w-7 md:h-8 md:w-8 flex items-center justify-center rounded-full bg-[#141B341A] text-darkColor hover:bg-main duration-300"
          >
            <ChevronLeft strokeWidth={2.5} className="h-3 w-3 md:h-4 md:w-4" />
          </button>
          <button
            ref={nextRef}
            className="cursor-pointer h-7 w-7 md:h-8 md:w-8 flex items-center justify-center rounded-full bg-[#141B341A] text-darkColor hover:bg-main duration-300"
          >
            <ChevronRight strokeWidth={2.5} className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </div>
      </div>

      {/* Content area */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 sm:h-48 bg-gray-200 animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 md:py-16 bg-white rounded-xl shadow-md border">
          <p className="text-base md:text-lg font-semibold text-gray-600">
            🚀 এখনো কোনো ফ্রি কোর্স যুক্ত হয়নি
          </p>
          <p className="text-sm text-gray-500 mt-1">
            নতুন কোর্স যুক্ত হলে এখানে দেখতে পাবেন।
          </p>
        </div>
      ) : (
        isMounted && (
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.destroy();
              swiper.navigation.init();
              swiper.navigation.update();
            }}
          >
            {courses.map((course) => (
              <SwiperSlide key={course._id}>
                <CourseCard course={course} />
              </SwiperSlide>
            ))}
          </Swiper>
        )
      )}
    </section>
  );
}
