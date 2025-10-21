"use client";

import {
  useGetCoursesQuery,
  useGetSubCategoryWiseCourseQuery,
} from "@/redux/features/course/course.api";
import CourseShortCard from "./CourseShortCard";

export default function SubBasedCourse({ id, onCourseClick }) {
  const { data: allCourses } = useGetCoursesQuery();
  const { data: filteredCourses, isLoading } = useGetSubCategoryWiseCourseQuery(
    id,
    {
      skip: !id,
    }
  );

  const coursesToDisplay = id ? filteredCourses : allCourses;

  return (
    <div className="col-span-1">
      <h2 className="text-xl font-bold mb-4 text-darkColor">কোর্স সমূহ</h2>

      <div className="space-y-4">
        {!id && !allCourses?.length ? (
          <p className="text-gray-500">কোন কোর্স পাওয়া যায়নি</p>
        ) : id && isLoading ? (
          <p>লোড হচ্ছে...</p>
        ) : coursesToDisplay?.length > 0 ? (
          coursesToDisplay.map((course) => (
            <CourseShortCard
              course={course}
              key={course._id}
              onClick={onCourseClick}
            />
          ))
        ) : (
          <p className="text-gray-500">
            {id
              ? "এই ক্যাটাগরিতে কোন কোর্স পাওয়া যায়নি"
              : "কোন কোর্স পাওয়া যায়নি"}
          </p>
        )}
      </div>
    </div>
  );
}
