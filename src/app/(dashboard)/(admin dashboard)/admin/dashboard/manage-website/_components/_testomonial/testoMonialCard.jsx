"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import Image from "next/image";

export default function TestimonialCard({ review, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-[280px] h-[250px] shadow-md flex flex-col border rounded-lg relative">
      <div className="flex flex-col items-start p-6 flex-grow overflow-hidden">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="overflow-hidden">
            <Image
              height={100}
              width={100}
              src={`${process.env.NEXT_PUBLIC_API_URL}/${review.image}`}
              alt="User avatar"
              unoptimized
              className="w-12 h-12 rounded-full border"
            />
            {/* <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/${review.image}`}
              alt="User avatar"
              unoptimized
              className="w-12 h-12 rounded-full border"
            /> */}
          </div>
          <div className="flex flex-col items-start gap-1">
            <h3 className="font-bold text-[#141b34] text-base">
              {review.name}
            </h3>
            <p className="text-[#141b34] text-sm font-normal">
              {review.designation}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex mt-2">
          {Array.from({ length: review.rating }, (_, index) => (
            <Image
              key={index}
              className="h-4 w-4"
              alt="Star rating"
              src="/star.svg"
              height={20}
              width={20}
              unoptimized
            />
          ))}
        </div>

        {/* Comment */}
        <p className="text-[#57595e] text-base leading-6 font-normal line-clamp-4 mt-2">
          {review.comment}
        </p>

        {/* Quote */}
        <Image
          className="absolute w-6 h-5 bottom-6 right-6"
          alt="Quote mark"
          src="/quote.svg"
          height={20}
          width={20}
          unoptimized
        />
      </div>

      {/* 3-dot menu */}
      <div className="absolute top-2 right-2 z-20">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 rounded-md bg-white border hover:bg-gray-100"
        >
          <MoreVertical className="h-4 w-4 text-gray-600" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-28 rounded-md bg-white border shadow-lg">
            <button
              onClick={() => {
                onEdit(review);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left"
            >
              <Pencil className="h-4 w-4" /> Update
            </button>
            <button
              onClick={() => {
                onDelete(review);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
