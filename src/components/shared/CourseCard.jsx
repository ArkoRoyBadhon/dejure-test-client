"use client";
import { useGetEnrollmentsByUserQuery } from "@/redux/features/enroll/enroll.api";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useState } from "react";
import TypeModal from "@/app/(main)/enroll/_components/typeModal";
import { useRouter } from "next/navigation";
import { trackViewCourse, trackClickEnroll } from "@/lib/analytics";

export default function CourseCard({ course }) {
  const firstType = course.types?.[0] || {};
  const hasMultipleTypes = course.types?.length > 1;
  const learner = useSelector((state) => state.auth?.user?._id);
  const router = useRouter();

  const [showTypeSelectionModal, setShowTypeSelectionModal] = useState(false);

  const { data: enrollments } = useGetEnrollmentsByUserQuery(learner, {
    skip: !learner,
  });

  // Check if user is already enrolled in this course
  const isEnrolled = enrollments?.some(
    (enrollment) => enrollment.course?._id === course._id
  );

  const isPaid = course.paymentType?.toLowerCase() === "paid";
  const isFree = course.paymentType?.toLowerCase() === "free";

  const handleEnrollClick = () => {
    // Track enrollment click
    trackClickEnroll(course, firstType);
    // Always open modal for free or paid
    setShowTypeSelectionModal(true);
  };

  const handleTypeSelectedAndCloseModal = (selectedType) => {
    setShowTypeSelectionModal(false);
    if (isFree && !hasMultipleTypes) {
      router.push(`/enroll/${course.slug}`);
    } else {
      router.push(`/enroll/${course.slug}?courseTypeId=${selectedType._id}`);
    }
  };

  return (
    <div className="border rounded-xl shadow hover:shadow-lg transition-all flex flex-col bg-white h-[550px] relative">
      <Link href={`/courses/${course.slug}`} className="block">
        <div className="w-full h-[300px] rounded-t-xl overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity">
          {course.thumbnailType === "youtube" && course.youtubeUrl ? (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">YouTube Thumbnail</span>
            </div>
          ) : (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <Link
            href={`/courses/${course.slug}`}
            onClick={() => trackViewCourse(course)}
          >
            <h3 className="text-lg font-semibold leading-5 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors">
              {course.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-700 my-2 line-clamp-2">
            {course.subTitle}
          </p>

          <div className="text-md my-2">
            {isFree ? (
              <span className="text-green-700 font-bold text-xl">
                সম্পূর্ণ ফ্রি!
              </span>
            ) : firstType.salePrice ? (
              <>
                <span>
                  মাত্র{" "}
                  <span className="text-red-500 line-through mr-2">
                    ৳ {firstType.price}
                  </span>
                </span>
                <span className="text-black font-bold text-xl">
                  ৳ {firstType.salePrice}
                </span>
              </>
            ) : (
              <span className="text-black font-bold text-xl">
                ৳ {firstType.price}
              </span>
            )}

            {hasMultipleTypes && (
              <span className="text-xs text-gray-500 ml-2">
                (+{course.types.length - 1} more options)
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mb-3 text-xs">
            <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
              {course.courseType === "live" ? "লাইভ" : "রেকর্ডেড"}
            </span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              ব্যাচ {course.batchNo}
            </span>
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
              {course.durationMonths} মাস
            </span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              {isPaid ? "পেইড" : "ফ্রি"}
            </span>
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
              {course.seat} সিট বাকি
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex gap-2">
            {isEnrolled ? (
              <div className="flex-1">
                <button
                  className="bg-gray-400 text-white py-2 rounded-md text-sm w-full font-bold cursor-not-allowed"
                  disabled
                >
                  Already Enrolled
                </button>
              </div>
            ) : (
              <button
                onClick={handleEnrollClick}
                className="bg-[#0020B2] text-white py-2 rounded-md hover:bg-blue-500 text-sm w-full font-bold flex-1"
              >
                এনরোল করি
              </button>
            )}
            <Link href={`/courses/${course.slug}`} className="flex-1">
              <button
                onClick={() => trackViewCourse(course)}
                className="bg-gray-300 text-black py-2 rounded-md hover:bg-gray-200 text-sm w-full"
              >
                বিস্তারিত দেখি
              </button>
            </Link>
          </div>
        </div>
      </div>

      {showTypeSelectionModal && (
        <TypeModal
          courseTypes={course.types}
          onSelectType={handleTypeSelectedAndCloseModal}
          onClose={() => setShowTypeSelectionModal(false)}
          course={course}
        />
      )}
    </div>
  );
}
