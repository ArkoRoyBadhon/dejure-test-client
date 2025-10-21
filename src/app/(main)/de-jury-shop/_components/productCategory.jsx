"use client";

import { useGetAllproductCategoriesQuery } from "@/redux/features/Products/ProductCategory.api";
import { useState, useRef, useEffect } from "react";

export default function ProductCategory({
  activeCategoryId,
  setActiveCategoryId,
}) {
  const { data: Categories = [], isLoading } =
    useGetAllproductCategoriesQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);

  // Number of items to show based on screen size
  const itemsToShow =
    typeof window !== "undefined" ? (window.innerWidth < 768 ? 1 : 3) : 3;
  const totalSlides = Math.ceil(Categories.length / itemsToShow);

  const handleCategoryClick = (categoryId) => {
    setActiveCategoryId(categoryId);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  // Handle touch events for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 5) {
      goToNext(); // swipe left
    } else if (distance < -5) {
      goToPrev(); // swipe right
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Calculate visible categories based on current index
  const visibleCategories = Categories.slice(
    currentIndex * itemsToShow,
    (currentIndex + 1) * itemsToShow
  );

  return (
    <div className="flex flex-col relative z-[1] max-w-[1200px] mx-auto min-h-[40vh] mt-28 px-4 md:px-0 py-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-black text-2xl md:text-3xl Z">প্রোডাক্ট ক্যাটাগরি</p>
        <div className="flex items-center gap-2">
          <button onClick={goToPrev}>
            <img src="/leftcircle.svg" alt="Left" />
          </button>
          <button onClick={goToNext}>
            <img src="/rightSign.svg" alt="Right" />
          </button>
        </div>
      </div>

      {/* Category Cards */}
      <div
        className="mt-8 overflow-hidden"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 transition-transform duration-300">
          {isLoading ? (
            <p>লোড হচ্ছে...</p>
          ) : Categories.length > 0 ? (
            visibleCategories.map((category) => (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
                className={`flex items-center justify-between border p-4 mb-1 shadow-md rounded-xl h-[142px] cursor-pointer hover:bg-gray-50 ${
                  activeCategoryId === category._id ? "border-main" : ""
                }`}
              >
                <div className="space-y-6">
                  <p className="font-bold">{category.title}</p>
                  <button>
                    <img src="/rightcircle.svg" alt="Go" />
                  </button>
                </div>
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${category.image}`}
                  alt="Category Icon"
                  className="w-24 h-24"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No categories found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
