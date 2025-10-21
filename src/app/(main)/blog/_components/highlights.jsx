"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useGetAllBlogsQuery } from "@/redux/features/Blog/Blog.api";
import Image from "next/image";
import Link from "next/link";

export default function BlogHighlights() {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef(null);

  // Fetch all blogs
  const { data: blogs, isLoading, isError } = useGetAllBlogsQuery();

  // Filter highlighted and approved blogs for the left slider
  const highlightedBlogs = blogs?.filter(
    (b) => b.ishighlighted && b.isApproved
  );

  // Filter featured and approved blogs for the right section
  const featuredBlogs = blogs?.filter((b) => b.isFeatured && b.isApproved);

   if (isLoading) {
    return (
      <div className="container mx-auto pb-32 pt-12 font-sans max-w-[1200px] px-4 md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section - Skeleton Loader for Highlighted Blogs */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-300 rounded-md w-1/2"></div> {/* Title Skeleton */}
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-gray-200 rounded-md"></div> {/* Image Skeleton */}
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded-md"></div> {/* Author Section Skeleton */}
                <div className="h-6 bg-gray-200 rounded-md w-3/4"></div> {/* Description Skeleton */}
              </div>
            </div>
          </div>

          {/* Right Section - Skeleton Loader for Featured Blogs */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-300 rounded-md w-1/2"></div> {/* Title Skeleton */}
            <div className="space-y-4 animate-pulse">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-200 rounded-xl p-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-md"></div> {/* Thumbnail Skeleton */}
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-300 rounded-md w-3/4"></div> {/* Blog Title Skeleton */}
                    <div className="h-4 bg-gray-300 rounded-md w-1/2"></div> {/* Date Skeleton */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  if (isError) return <p>Error loading blogs.</p>;

  return (
    <div className="container mx-auto pb-32 pt-12 font-sans max-w-[1200px] px-4 md:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Section - Highlighted Blogs Slider */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 Z">ব্লগ হাইলাইটস</h2>
          <div className="flex flex-col">
            <Swiper
              onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              slidesPerView={1}
              loop
              className="rounded-3xl w-full shadow-md"
            >
              {highlightedBlogs?.map((slide) => (
                <SwiperSlide key={slide._id}>
                  <Link key={slide._id} href={`/blog/${slide._id}`}>
                    <div className="rounded-3xl overflow-hidden cursor-pointer ">
                      {/* Hero Image Section */}
                      <div className="relative overflow-hidden">
                        <Image
                          height={300}
                          width={300}
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${
                            slide.thumbnail || ""
                          }`}
                          alt={slide.title}
                          unoptimized
                          className="w-full h-[300px] object-cover"
                        />
                      </div>

                      {/* Blog Card */}
                      <div className="flex flex-col items-start gap-4 p-6">
                        {/* Author section */}
                        <div className="flex items-center justify-center gap-2 mt-2 ">
                          {slide.mentor?.image ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_URL}/${slide.mentor?.image}`}
                              alt="mentor"
                              width={50}
                              height={50}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <Image
                              src="https://www.svgrepo.com/show/452030/avatar-default.svg"
                              alt="mentor"
                              width={50}
                              height={50}
                              className="w-12 h-12 rounded-full"
                            />
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-700">
                              {slide.mentor?.fullName || "DE JERY ACADEMY"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {slide.createdAt
                                ? new Date(slide.createdAt).toLocaleDateString(
                                    undefined,
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : ""}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold mb-4  hover:underline">
                            {slide.title}
                          </h3>

                          <p
                            className="text-sm text-[#74767C] line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html: slide.description
                                ? slide.description
                                    .split(" ")
                                    .slice(0, 20)
                                    .join(" ") +
                                  (slide.description.split(" ").length > 20
                                    ? "..."
                                    : "")
                                : "",
                            }}
                          ></p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom pagination dots */}
            <div className="flex items-center justify-center gap-2 my-4 mx-auto">
              {highlightedBlogs?.map((_, i) => (
                <button
                  key={i}
                  onClick={() => swiperRef.current?.slideTo(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeSlide
                      ? "w-12 bg-main"
                      : "w-5 bg-gray-400 opacity-50"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Featured Blogs */}
        <div className="mt-16 md:mt-0">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 Z">ফিচার্ড ব্লগস</h2>
          <div className="space-y-6">
            {featuredBlogs?.slice(0, 5).map((blog) => (
              <Link key={blog._id} href={`/blog/${blog._id}`} className="block">
                <div className="flex items-start gap-6 p-4 border rounded-xl hover:bg-gray-50 transition-colors shadow-md cursor-pointer">
                  <div className="flex-shrink-0">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${blog.thumbnail}`}
                      alt="mentor"
                      width={50}
                      height={50}
                      className="w-12 h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">
                      {blog.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : ""}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
