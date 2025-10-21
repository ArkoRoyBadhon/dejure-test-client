"use client";

import React from "react";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import CourseCard from "@/components/shared/CourseCard";
import Loader from "@/components/shared/Loader";

const CoursesPage = () => {
  const { data, isLoading, isError } = useGetCoursesQuery(undefined);

  if (isLoading) return <Loader text="লোড হচ্ছে..." />;
  if (isError) return <div>কোর্স লোড করা যাচ্ছে না।</div>;

  const courses = data || [];

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-1">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
};

export default CoursesPage;
