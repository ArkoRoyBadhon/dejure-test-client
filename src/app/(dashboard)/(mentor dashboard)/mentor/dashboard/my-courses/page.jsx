"use client";

import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useGetCoursesByMentorQuery } from "@/redux/features/course/course.api";

export default function MentorCoursesPage() {
  const mentorId = useSelector((state) => state.auth?.user?._id);
  const {
    data: courses,
    isLoading,
    isError,
  } = useGetCoursesByMentorQuery(undefined, {
    skip: !mentorId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!courses?.data || courses?.data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">
          You haven't created any courses yet
        </h1>
        <Link href="/dashboard/course-create">
          <Button>Create New Course</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 bg-[#F8FAFC]">
      <div className="mb-6 flex flex-col justify-between border rounded-xl shadow-md">
        <div className="flex p-4 gap-2 rounded-t-xl bg-[#F2F7FC]">
          <img src="/course.svg" alt="Course Logo" />
          <p className="font-bold">My Created Courses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {courses &&
            courses?.data?.length > 0 &&
            courses?.data?.map((course) => (
              <Link
                key={course._id}
                href={`/mentor/dashboard/my-courses/${course.slug}`}
                className="block"
              >
                <div className="mb-6">
                  {/* Course body */}
                  <div className="rounded-b-xl">
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
                            {course.shortDescription ||
                              "No description available"}
                          </p>

                          <div className="flex gap-2">
                            <p className="rounded-xl my-1 bg-[#0047FF33] px-2 py-1 w-fit text-xs">
                              Batch {course.batchNo}
                            </p>
                            <p className="rounded-xl my-1 bg-[#FFB80033] px-2 py-1 w-fit text-xs">
                              {course.status || "Active"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
