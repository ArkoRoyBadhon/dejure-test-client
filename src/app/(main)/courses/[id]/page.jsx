"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useGetCourseByIdOrSlugQuery } from "@/redux/features/course/course.api";
import MentorsPrices from "./_components/mentors";
import SyllabusPublic from "./_components/SyllabusPublic";
import ContactAndResources from "../../_components/ContactAndResources";
import DownloadApp from "../../_components/AppDownload";
import CourseDetailsSkeleton from "./_components/CourseDetailsSkeleton";
import { convertToBanglaNumber, formatDateToBangla } from "@/Utils/banglaFont";
import CourseNotFound from "@/components/shared/CourseNotFound";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const { data: course, isLoading, isError } = useGetCourseByIdOrSlugQuery(id);

  if (isLoading) return <CourseDetailsSkeleton />;
  if (isError || !course) return <CourseNotFound />;

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-transparent to-[rgba(255,184,0,0.1)]">
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center opacity-[.04]" />
        <div className="relative max-w-[1200px] mx-auto py-20 flex flex-col-reverse md:flex-row gap-28">
          <div className="flex-1 space-y-8 my-auto text-center md:text-left px-4 md:px-0">
            <h1 className="text-2xl md:text-4xl font-bold text-[#141B34] mb-6">
              {course.title}
            </h1>

            <div className="prose-quill max-w-none">
              <div
                className="text-sm text-[#74767C] md:text-left"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>

            <div className="flex gap-2 flex-wrap justify-center md:justify-start ">
              <p className="rounded-full bg-[#0047FF33] px-4 py-3 w-fit text-xs">
                ব্যাচ {course.batchNo}
              </p>
              <p className="rounded-full bg-[#FFB80033] px-8 py-3 w-fit text-xs">
                অনগোয়িং কোর্স
              </p>
            </div>

            <div className="justify-start hidden md:block">
              <div className="flex overflow-x-auto md:overflow-visible items-center bg-white rounded-xl shadow-lg py-1 w-full border">
                <div className="flex flex-nowrap md:flex-row items-center justify-between w-full max-w-[590px]">
                  <div className="flex items-center space-x-3 p-3 w-full">
                    <div className="icon w-8 h-8 flex justify-center items-center flex-shrink-0">
                      <img
                        src="/count.svg"
                        alt="Student Icon"
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="text-sm font-bold text-gray-800">
                        {convertToBanglaNumber(
                          course?.totalAdmittedStudents || 0
                        )}
                        +
                      </div>
                      <div className="text-sm text-gray-600">
                        ভর্তিকৃত শিক্ষার্থী
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 w-full">
                    <div className="icon w-8 h-8 flex justify-center items-center flex-shrink-0">
                      <img src="/yt.svg" alt="Live Icon" className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="text-sm font-bold text-gray-800">
                        {convertToBanglaNumber(course?.totalLiveClasses || 0)}+
                      </div>
                      <div className="text-sm text-gray-600">লাইভ ক্লাস</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 w-full">
                    <div className="icon w-8 h-8 flex justify-center items-center flex-shrink-0">
                      <img
                        src="/one.svg"
                        alt="Batch Icon"
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="text-sm font-bold text-gray-800">
                        {formatDateToBangla(course?.startFrom)}
                      </div>
                      <div className="text-sm text-gray-600">ব্যাচ শুরু</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ZFor MBL,Hidden in Large Device */}
            <div className="justify-start px-4 block md:hidden">
              <div className="flex items-center bg-white rounded-xl shadow-lg py-2 w-full border">
                <div className="flex flex-nowrap items-center justify-between w-full">
                  <div className="flex items-center p-2 w-full">
                    <div className="icon w-6 h-6 flex justify-center items-center flex-shrink-0">
                      <img
                        src="/count.svg"
                        alt="Student Icon"
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 ml-2">
                      <div className="text-xs font-bold text-gray-800">
                        {convertToBanglaNumber(
                          course?.totalAdmittedStudents || 0
                        )}
                        +
                      </div>
                      <div className="text-[10px] text-gray-600">
                        ভর্তিকৃত শিক্ষার্থী
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-2 w-full">
                    <div className="icon w-6 h-6 flex justify-center items-center flex-shrink-0">
                      <img src="/yt.svg" alt="Live Icon" className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0 ml-2">
                      <div className="text-xs font-bold text-gray-800">
                        {convertToBanglaNumber(course?.totalLiveClasses || 0)}+
                      </div>
                      <div className="text-[10px] text-gray-600">
                        লাইভ ক্লাস
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-2 w-full">
                    <div className="icon w-6 h-6 flex justify-center items-center flex-shrink-0">
                      <img
                        src="/one.svg"
                        alt="Batch Icon"
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 ml-2">
                      <div className="text-xs font-bold text-gray-800">
                        {formatDateToBangla(course?.startFrom)}
                      </div>
                      <div className="text-[10px] text-gray-600">
                        ব্যাচ শুরু
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image section - hidden on mobile, visible from md breakpoint */}
          <div className=" relative h-[380px] md:h-[436px] w-[90%] mx-auto md:w-[475px]">
            {course.thumbnail && (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`}
                alt={course.title}
                fill
                className=" rounded-lg"
                unoptimized
              />
            )}
          </div>
        </div>
      </div>

      <MentorsPrices
        mentors={course.mentors}
        whatsIn={course.whatsIn}
        types={course.types}
        id={course._id}
        course={course}
      />
      <SyllabusPublic course={course} />
      <ContactAndResources />
      <DownloadApp />
    </div>
  );
}
