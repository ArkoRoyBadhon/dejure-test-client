"use client";

import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import CourseCard from "@/components/shared/CourseCard";
import { useGetEnrollmentsByUserQuery } from "@/redux/features/enroll/enroll.api";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";

export default function MyCoursesPage() {
  const learner = useSelector((state) => state.auth?.user?._id);
  const {
    data: enrollments,
    isLoading,
    isError,
  } = useGetEnrollmentsByUserQuery(learner, {
    skip: !learner,
  });

  const { data: allCourses } = useGetCoursesQuery();
  const otherCourses = allCourses
    ?.filter(
      (course) =>
        !enrollments?.some(
          (enrollment) => enrollment.course?._id === course._id
        )
    )
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">
          You haven't enrolled in any courses yet
        </h1>
        <Link href="/dashboard/course-enroll">
          <Button>Browse Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 bg-[#F8FAFC]">
      <div className="mb-6 flex flex-col justify-between border rounded-xl shadow-md">
        <div className="flex p-4 gap-2 rounded-t-xl bg-[#F2F7FC]">
          <img src="/course.svg" alt="Course Logo" />
          <p className="font-bold">আমার কোর্সমূহ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {enrollments.map((enrollment) => {
            const course = enrollment.course;
            return (
              <Link
                key={enrollment?._id}
                href={`/dashboard/courses/${course.slug}`}
                className="block"
              >
                <div className="mb-6 ">
                  {/* Course body */}
                  <div className=" rounded-b-xl">
                    <div className="bg-[#FFB8000D] border border-[#FFB80066] p-2 rounded-xl w-full h-[192px] mb-4">
                      <div className="flex gap-[24px]">
                        <div className="p-2">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`}
                            alt={course.title}
                            className="h-[160px] w-[160px] rounded-xl"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h1 className="text-lg font-bold">{course.title}</h1>
                          <p className="text-[#74767C] my-1 text-sm">
                            বাংলাদেশের সংবিধান, মৌলিক অধিকার
                          </p>

                          <div className="flex gap-2">
                            <p className="rounded-xl my-1 bg-[#0047FF33] px-2 py-1 w-fit text-xs">
                              ব্যাচ {course.batchNo}
                            </p>
                            <p className="rounded-xl my-1 bg-[#FFB80033] px-2 py-1 w-fit text-xs">
                              অনগোয়িং কোর্স
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Other Courses Section */}
      <div className="my-6 max-w-7xl mx-auto rounded-xl  border">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-[#F2F7FC] px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-semibold">
              Other Courses You Might Like
            </h2>
          </div>
          <div className="p-6">
            {otherCourses?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            ) : (
              <p>No other courses available at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
