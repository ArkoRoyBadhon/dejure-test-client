// src/app/_components/MentorsBlog.jsx
"use client";
import { useGetAllBlogsQuery } from "@/redux/features/Blog/Blog.api";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import Loader from "@/components/shared/Loader";
export default function OthersBlog() {
  const scrollRef = useRef(null);

  const scrollCard = (direction) => {
    const container = scrollRef.current;
    if (container && container.firstChild) {
      // Calculate card width dynamically, including margin-right
      const cardWidth = container.firstChild.offsetWidth + 20; // 20px for gap-5
      container.scrollBy({
        left: direction === "right" ? cardWidth : -cardWidth,
        behavior: "smooth",
      });
    }
  };

  const { data: blogs, isLoading, isError } = useGetAllBlogsQuery();

  // Only blogs where mentor is not null
  const BlogData = blogs?.filter((b) => b.mentor === null) || [];

  if (isLoading) return <Loader />;
  if (isError) return <p>Error loading blogs.</p>;

  return (
    <div className="relative rounded-[60px] max-w-[100vw] w-full overflow-hidden mx-auto px-4 md:px-0 ">
      <div className="flex flex-col relative z-[1] max-w-[1200px] mx-auto min-h-[40vh] my-16">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/pensil.png" alt="book icon" />
            <p className="font-black text-2xl md:text-3xl Z">অন্যান্য টপিক</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scrollCard("left")}>
              <img src="/leftcircle.svg" alt="left" />
            </button>
            <button onClick={() => scrollCard("right")}>
              <img src="/rightSign.svg" alt="right" />
            </button>
          </div>
        </div>

        {/* Scrollable cards container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll gap-5 py-8 hide-scrollbar"
        >
          {BlogData.map((blog) => (
            <Link key={blog._id} href={`/blog/${blog._id}`} className="block">
              <div className="flex-shrink-0 w-70.5 bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between hover:cursor-pointer hover:underline">
                {/* Blog Thumbnail */}
                <div className="relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${
                      blog.thumbnail || ""
                    }`}
                    height={200}
                    width={200}
                    alt="Blog Thumbnail"
                    className="w-full h-[200px] object-cover"
                  />
                </div>

                {/* Blog Content */}
                <div className="p-4 flex flex-col gap-2 flex-grow">
                  {/* Title: always 1 line */}
                  <h3 className="text-base font-bold text-gray-800 truncate">
                    {blog.title}
                  </h3>

                  {/* Description: always 2 lines */}
                  <p
                    className="text-sm text-[#74767C] line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: blog.description || "",
                    }}
                  ></p>
                </div>

                {/* Author Section */}
                <div className="flex items-center gap-2 mt-2 p-4 pt-0 ">
                  {blog.mentor?.image ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${blog.mentor?.image}`}
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
                      {blog.mentor?.fullName || "DE JERY ACADEMY"}
                    </p>
                    <p className="text-xs text-gray-500">
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
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Custom CSS to hide scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}
