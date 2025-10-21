"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function BlogCard({
  blog,
  variant = "vertical",
  className = "",
  showAuthor = true,
  showDate = true,
}) {
  return (
    <Link
      href={`/blog/${blog._id}`}
      className={`group block ${
        variant === "horizontal" ? "flex gap-4" : ""
      } ${className} hover:bg-yellow-50 border-yellow-200 hover:border-yellow-400 rounded-lg overflow-hidden`}
    >
      {/* Thumbnail */}
      <div
        className={`relative ${
          variant === "horizontal"
            ? "w-24 h-24 flex-shrink-0"
            : "w-full h-48 mb-3"
        }`}
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/${blog.thumbnail}`}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={
            variant === "horizontal"
              ? "100px"
              : "(max-width: 768px) 100vw, 400px"
          }
        />
      </div>

      {/* Content */}
      <div className={variant === "horizontal" ? "flex-1" : ""}>
        {/* Title with different link */}
        <Link href={`z:${blog._id}`} className="hover:underline">
          <h3
            className={`font-semibold ${
              variant === "horizontal"
                ? "text-base leading-6 min-h-[3rem]"
                : "text-lg mb-2 leading-7 min-h-[3.5rem]"
            }`}
          >
            {blog.title}
          </h3>
        </Link>

        {/* Description */}
        <div className="prose-quill max-w-none text-sm">
          <div
            dangerouslySetInnerHTML={{
              __html: (() => {
                if (!blog.description) return "";
                const text = blog.description.replace(/<[^>]+>/g, "");
                const truncated = text.slice(0, 20);
                return text.length > 20 ? truncated + "..." : truncated;
              })(),
            }}
          />
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
