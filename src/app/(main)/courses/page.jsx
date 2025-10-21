"use client";

import DownloadApp from "../_components/AppDownload";
import ContactAndResources from "../_components/ContactAndResources";
import CourseCardContainer from "../../../components/shared/CourseCardContainer";
import CoursesHeader from "./_components/CoursesHeader";
import { useMemo, useState, useEffect, useRef } from "react";
import { useGetSubCategoriesQuery } from "@/redux/features/category/subcategory.api";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";

export default function CoursesPage() {
  const {
    data: subCategories = [],
    isLoading: isSubCategoriesLoading,
    isError: isSubCategoriesError,
  } = useGetSubCategoriesQuery();

  const {
    data: allCourses = [],
    isLoading: isCoursesLoading,
    isError: isCoursesError,
  } = useGetCoursesQuery();

  const [activeSubCatId, setActiveSubCatId] = useState(null);
  const sectionRefs = useRef({});

  const coursesBySubCategory = useMemo(() => {
    const grouped = {};
    allCourses.forEach((course) => {
      if (course.subCategory) {
        if (!grouped[course.subCategory]) {
          grouped[course.subCategory] = [];
        }
        grouped[course.subCategory].push(course);
      }
    });
    return grouped;
  }, [allCourses]); // Set initial active subcategory

  useEffect(() => {
    if (subCategories.length > 0 && !activeSubCatId) {
      setActiveSubCatId(subCategories[0]._id);
    }
  }, [subCategories, activeSubCatId]); // Scroll to the selected section

  useEffect(() => {
    if (activeSubCatId && sectionRefs.current[activeSubCatId]) {
      sectionRefs.current[activeSubCatId].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeSubCatId]); // Loading and Error states remain the same...

  return (
    <div>
      <CoursesHeader
        activeSubCatId={activeSubCatId}
        setActiveSubCatId={setActiveSubCatId}
      />

      {subCategories
        .filter((subCat) => (coursesBySubCategory[subCat._id] || []).length > 0) // remove empty
        .map((subCat, index) => {
          const courses = coursesBySubCategory[subCat._id] || [];

          const isOdd = index % 2 !== 0; // now this is based on only valid subcategories

          return (
            <div
              key={subCat._id}
              ref={(el) => (sectionRefs.current[subCat._id] = el)}
              className={
                isOdd
                  ? "relative bg-[#FFB80033] rounded-[50px] px-4 md:px-0"
                  : ""
              }
            >
              {isOdd && (
                <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center opacity-[.04] z-0" />
              )}

              <CourseCardContainer
                key={subCat._id}
                iconSrc={
                  subCat.thumbnail
                    ? `${process.env.NEXT_PUBLIC_API_URL}/${subCat.thumbnail}`
                    : "/assets/icons/user-sharing.png"
                }
                title={subCat.name}
                courses={courses}
              />
            </div>
          );
        })}

      <ContactAndResources />
      <DownloadApp />
    </div>
  );
}
