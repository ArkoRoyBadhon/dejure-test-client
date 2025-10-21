"use client";
import Image from "next/image";
import Tabs from "../Admin/Tabs";
import { useGetCourseByIdOrSlugQuery } from "@/redux/features/course/course.api";

import Loader from "@/components/shared/Loader";
import CourseNotFound from "@/components/shared/CourseNotFound";
export default function CourseDetailsInfo({ id }) {
  const { data: course, isLoading, isError } = useGetCourseByIdOrSlugQuery(id);

  if (isLoading) return <Loader />;
  if (isError || !course) return <CourseNotFound />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6  min-h-screen">
      <div className="mb-6 flex flex-col justify-between border rounded-xl">
        <div className="flex p-3 sm:p-4 gap-2 rounded-t-xl bg-[#F2F7FC]">
          <Image
            src={
              course?.thumbnail
                ? `${process.env.NEXT_PUBLIC_API_URL}/${course?.thumbnail}`
                : "/assets/fallImg.jpg"
            }
            height={500}
            width={500}
            alt="Course Logo"
            className="w-6 h-6"
          />
          <p className="font-bold text-sm sm:text-base">{course?.title}</p>
        </div>
        <div className="bg-white p-2 sm:p-4 rounded-b-xl">
          <div className="bg-[#FFB8000D] border border-[#FFB80066] p-3 rounded-xl w-full max-w-full sm:w-[600px] h-auto sm:h-[192px] mb-4 mx-auto sm:ml-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="p-2 mx-auto sm:mx-0">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${course?.thumbnail}`}
                  alt={course?.title}
                  className="h-[120px] sm:h-[160px] w-[120px] sm:w-[160px] rounded-xl object-cover"
                />
              </div>
              <div className="flex flex-col justify-center text-center sm:text-left">
                <h1 className="text-base sm:text-lg font-bold">
                  {course?.title}
                </h1>
                <p className="text-[#74767C] my-1 text-xs sm:text-sm">
                  {course.category?.title}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <p className="rounded-xl my-1 bg-[#0047FF33] px-2 py-1 text-xs">
                    ব্যাচ {course?.batchNo}
                  </p>
                  <p className="rounded-xl my-1 bg-[#FFB80033] px-2 py-1 text-xs">
                    অনগোয়িং কোর্স
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tabs course={course} />
    </div>
  );
}
