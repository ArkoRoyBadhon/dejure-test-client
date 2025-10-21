"use client";

import Image from "next/image";

export default function CourseCategoryShortCard({
  cat,
  active = false,
  isSubCat = false,
  count = 0,
}) {
  const { title } = cat;

  return (
    <div
      className={`flex justify-between items-center gap-[14px] rounded-xl text-sm cursor-pointer transition p-2 pr-4 hover:bg-main/20 border-b hover:border-main ${
        active ? "bg-main/20 border-main" : "bg-white border-transparent"
      }`}
    >
      <div className="relative w-10 h-10 flex-shrink-0">
        <Image
          alt={title}
          src={`${process.env.NEXT_PUBLIC_API_URL}/${cat?.thumbnail}`}
          fill
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="grow">
        <p className="text-darkColor text-sm font-bold mb-1 line-clamp-1">
          {title}
        </p>
        <span className="text-deepGray text-xs line-clamp-1">
          {count} {count === 1 ? "Course" : "Courses"}
        </span>
      </div>
    </div>
  );
}
