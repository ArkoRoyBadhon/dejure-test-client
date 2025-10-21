"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import CategorySlider from "./CategorySlider";
import { useGetCategoriesQuery } from "@/redux/features/category/category.api";
import {
  useGetCoursesQuery,
  useGetSubCategoryWiseCourseQuery,
} from "@/redux/features/course/course.api";
import { useGetAllHomeCoursesQuery } from "@/redux/features/WebManage/HomeCourses.api";
import CourseCard from "@/components/shared/CourseCard";
import Loader from "@/components/shared/Loader";

export default function InteractiveCourses() {
  // Fetch header (title + subtitle) from same API as ManageInterCourses
  const { data: homeCourses, isLoading: isHeaderLoading } =
    useGetAllHomeCoursesQuery();

  const headerData = homeCourses?.[0] || {
    title: "ইন্টারেক্টিভ লাইভ কোর্সসমূহ",
    subTitle: "যেন ক্লাসরুম আপনার ঘরেই",
    icon: "/assets/icons/live-streaming.png",
  };

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetCategoriesQuery();
  const activeCategories = categoriesData?.filter((cat) => cat.isActive) || [];

  // Extract all subcategories from active categories
  const allSubcategories = activeCategories.flatMap(
    (category) =>
      category.subCategories?.filter((subCat) => subCat.isActive) || []
  );

  // State for active subcategory and filtered courses
  const [activeSubCatId, setActiveSubCatId] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Fetch all courses
  const { data: allCourses, isLoading: isAllCoursesLoading } =
    useGetCoursesQuery();

  // Fetch courses for selected subcategory
  const { data: subCategoryCourses, isLoading: isCoursesLoading } =
    useGetSubCategoryWiseCourseQuery(
      activeSubCatId === "all" ? null : activeSubCatId,
      {
        skip: activeSubCatId === "all",
      }
    );

  // Default: show all courses
  useEffect(() => {
    if (allCourses) {
      setFilteredCourses(allCourses);
    }
  }, [allCourses]);

  // Update when subcategory changes
  useEffect(() => {
    if (activeSubCatId === "all" && allCourses) {
      setFilteredCourses(allCourses);
    } else if (subCategoryCourses) {
      setFilteredCourses(subCategoryCourses);
    }
  }, [activeSubCatId, subCategoryCourses, allCourses]);

  // Loading / Error handling
  if (isHeaderLoading || isCategoriesLoading || isAllCoursesLoading) {
    return <Loader text="Loading courses..." className="p-8" />;
  }
  if (isCategoriesError) {
    return (
      <div className="text-center p-8 text-red-500">
        Error loading categories
      </div>
    );
  }

  return (
    <div className="px-5 md:px-24 mb-8 max-w-[1600px] mx-auto">
      <div className="bg-gray2 py-[70px] md:py-24 rounded-4xl ">
        {/* Dynamic Header */}
        <div className="px-4">
          <h3 className="flex Z line-clamp-2 flex-col md:flex-row text-center items-center justify-center gap-4 md:gap-2.5 text-darkColor text-3xl md:text-4xl font-bold leading-[120%] py-1">
            <Image
              alt="Live Stream icon"
              src="/assets/icons/live-streaming.png"
              height={40}
              width={40}
              className="w-10 h-10"
            />
            {headerData.title}
          </h3>
          <p className="text-[20px] md:text-2xl text-[#74767C] mt-4 text-center">
            {headerData.subTitle}
          </p>
        </div>

        {/* Subcategory Slider */}
        {allSubcategories.length > 0 && (
          <CategorySlider
            setActiveCatId={setActiveSubCatId}
            activeCatId={activeSubCatId}
            categories={[
              { _id: "all", title: "All", thumbnail: null },
              ...allSubcategories,
            ]}
          />
        )}

        {/* Courses List */}
        {isCoursesLoading ? (
          <Loader text="Loading courses..." className="p-8" />
        ) : filteredCourses?.length === 0 ? (
          <div className="text-center p-8">No courses available</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mx-2 lg:mx-24">
            {filteredCourses?.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
