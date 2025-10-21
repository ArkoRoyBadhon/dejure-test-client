"use client";

import { useEffect, useState, useMemo } from "react";
import { useGetCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetSubCategoriesQuery } from "@/redux/features/category/subcategory.api";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import { motion, AnimatePresence } from "framer-motion";
import CourseCategoryShortCard from "../shared/CourseCategoryShortCard";
import SubBasedCourse from "../shared/CoomonCourse";
import Link from "next/link";

export default function AllCoursesDrawer({ isOpen, onClose }) {
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: allSubCategories = [] } = useGetSubCategoriesQuery();
  const { data: allCourses = [] } = useGetCoursesQuery();
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSubCat, setSelectedSubCat] = useState(null);

  // Build category & subcategory course counts
  const courseCountMap = useMemo(() => {
    const counts = {};
    allCourses.forEach((course) => {
      const catId =
        typeof course.category === "object"
          ? course.category?._id
          : course.category;

      const subCatId =
        typeof course.subCategory === "object"
          ? course.subCategory?._id
          : course.subCategory;

      if (catId) counts[catId] = (counts[catId] || 0) + 1;
      if (subCatId) counts[subCatId] = (counts[subCatId] || 0) + 1;
    });
    return counts;
  }, [allCourses]);

  const handleCourseClick = () => {
    onClose();
  };

  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const drawer = document.querySelector(".courses-drawer");
      if (isOpen && drawer && !drawer.contains(event.target)) {
        const allCoursesBtn = document.querySelector(
          '[aria-label="All courses"]'
        );
        if (!allCoursesBtn || !allCoursesBtn.contains(event.target)) {
          onClose();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer content */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white shadow-lg border-t border-gray-200 courses-drawer overflow-y-auto"
            aria-label="Courses drawer"
            style={{ maxHeight: "calc(100vh - 64px)" }}
          >
            <div className="max-w-[1200px] mx-auto px-5 h-[75vh] mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 h-full">
                {/* Left side: Categories & Subcategories */}
                <div className="flex flex-col h-full min-h-0">
                  <h2 className="text-xl font-bold mb-4 text-darkColor">
                    কোর্স ক্যাটাগরি
                  </h2>

                  <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
                    {/* Categories Column */}
                    <div className="w-full md:w-1/2 flex flex-col min-h-0">
                      <div className="overflow-y-auto pr-2 space-y-4 flex-1 min-h-0">
                        {categories.length === 0 ? (
                          <p className="text-gray-500">কোনো ক্যাটাগরি নেই</p>
                        ) : (
                          categories.map((cat) => (
                            <div
                              key={cat._id}
                              onClick={() => {
                                setSelectedCat(cat._id);
                                setSelectedSubCat(null);
                              }}
                              className="cursor-pointer shadow border rounded-2xl"
                            >
                              <CourseCategoryShortCard
                                cat={cat}
                                active={selectedCat === cat._id}
                                count={courseCountMap[cat._id] || 0}
                              />
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Subcategories Column */}
                    <div className="w-full md:w-1/2 flex flex-col min-h-0">
                      <div className="overflow-y-auto pr-2 space-y-4 flex-1 min-h-0">
                        {selectedCat ? (
                          categories.find((c) => c._id === selectedCat)
                            ?.subCategories?.length > 0 ? (
                            categories
                              .find((c) => c._id === selectedCat)
                              .subCategories.map((sub) => (
                                <div
                                  key={sub._id}
                                  onClick={() => setSelectedSubCat(sub._id)}
                                  className="cursor-pointer shadow rounded-2xl border"
                                >
                                  <CourseCategoryShortCard
                                    cat={{
                                      title: sub.name,
                                      thumbnail: sub.thumbnail,
                                      _id: sub._id,
                                    }}
                                    active={selectedSubCat === sub._id}
                                    isSubCat={true}
                                    count={courseCountMap[sub._id] || 0}
                                  />
                                </div>
                              ))
                          ) : (
                            <p className="text-gray-500">সাব-ক্যাটাগরি নেই</p>
                          )
                        ) : allSubCategories.length > 0 ? (
                          allSubCategories.map((sub) => (
                            <div
                              key={sub._id}
                              onClick={() => setSelectedSubCat(sub._id)}
                              className="cursor-pointer shadow rounded-2xl border"
                            >
                              <CourseCategoryShortCard
                                cat={{
                                  title: sub.name,
                                  thumbnail: sub.thumbnail,
                                  _id: sub._id,
                                }}
                                active={selectedSubCat === sub._id}
                                isSubCat={true}
                                count={courseCountMap[sub._id] || 0}
                              />
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">
                            অনুগ্রহ করে একটি ক্যাটাগরি নির্বাচন করুন
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/courses"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      setTimeout(() => {
                        window.location.href = "/courses";
                      }, 300);
                    }}
                  >
                    <button className="w-full border bg-[#0020B2] text-white my-2 font-bold rounded-xl flex items-center justify-center gap-2 h-[40px]">
                      সকল কোর্সসমূহ <img src="/arrow-right.png" alt="" />
                    </button>
                  </Link>
                </div>

                {/* Right side: Courses */}
                <div className="flex flex-col h-full min-h-0">
                  <div className="overflow-y-auto flex-1 min-h-0">
                    <SubBasedCourse
                      id={selectedSubCat || selectedCat}
                      onCourseClick={handleCourseClick}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
