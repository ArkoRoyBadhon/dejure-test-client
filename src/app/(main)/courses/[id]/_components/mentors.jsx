"use client";

import TypeModal from "@/app/(main)/enroll/_components/typeModal";
import { useGetEnrollmentsByUserQuery } from "@/redux/features/enroll/enroll.api";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { trackViewCourse, trackClickEnroll } from "@/lib/analytics";

export default function MentorsPrices({ mentors, whatsIn, types, id, course }) {
  const [activeType, setActiveType] = useState(types?.[0]?.mode || "online");
  const [showTypeSelectionModal, setShowTypeSelectionModal] = useState(false);
  const learner = useSelector((state) => state.auth?.user?._id);
  const router = useRouter();

  const { data: enrollments } = useGetEnrollmentsByUserQuery(learner, {
    skip: !learner,
  });

  const isEnrolled = enrollments?.some((enroll) => enroll.course?._id === id);
  const hasMultipleTypes = types?.length > 1;
  const currentType =
    types?.find((type) => type.mode === activeType) || types?.[0];

  const isFree = course?.paymentType?.toLowerCase() === "free";
  const isPaid = course?.paymentType?.toLowerCase() === "paid";

  // Track course view when component mounts
  useEffect(() => {
    if (course) {
      trackViewCourse(course);
    }
  }, [course]);

  const handleEnrollClick = () => {
    // Track enrollment click
    trackClickEnroll(course, currentType);
    setShowTypeSelectionModal(true);
  };

  const handleTypeSelectedAndCloseModal = (selectedType) => {
    setShowTypeSelectionModal(false);
    if (isFree && !hasMultipleTypes) {
      router.push(`/enroll/${course?.slug}`);
    } else {
      router.push(`/enroll/${course?.slug}?courseTypeId=${selectedType._id}`);
    }
  };

  return (
    <div className="bg-white py-0 md:py-8 mt-0 mb-8 md:mt-12 md:mb-12 px-4 sm:px-6 lg:px-8 my-auto flex items-center">
      <div className="max-w-[1200px] mx-auto w-full">
        {/* Mobile: Price Section First */}
        <div className="block lg:hidden mb-8 ">
          <div className="bg-white rounded-lg shadow-lg border p-6">
            {/* Course Type Selector */}
            {hasMultipleTypes && (
              <div className="mb-4 bg-gray-100 p-2 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {types?.map((type) => (
                    <button
                      key={type._id || type.mode}
                      onClick={() => setActiveType(type.mode)}
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        activeType === type.mode
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {type.mode.charAt(0).toUpperCase() + type.mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ফুল কোর্স প্রাইস
            </h3>

            <div className="mb-4">
              {isFree ? (
                <span className="text-green-700 font-bold text-xl">
                  সম্পূর্ণ ফ্রি!
                </span>
              ) : currentType?.salePrice ? (
                <>
                  <span className="text-sm text-gray-600">মাত্র </span>
                  <span className="text-2xl font-bold text-gray-900">
                    ৳ {currentType.salePrice}
                  </span>
                  <span className="text-sm text-red-500 line-through ml-2">
                    ৳ {currentType.price}
                  </span>
                  {currentType?.salePrice && (
                    <span className="ml-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                      {Math.round(
                        ((currentType.price - currentType.salePrice) /
                          currentType.price) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-600">মাত্র </span>
                  <span className="text-2xl font-bold text-gray-900">
                    ৳ {currentType?.price}
                  </span>
                </>
              )}
            </div>

            {isEnrolled ? (
              <Link href={`/dashboard/courses/${course?.slug}`}>
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg mb-6 transition-colors duration-200 flex items-center justify-center gap-2">
                  শেখা শুরু করুন
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </Link>
            ) : (
              <button
                onClick={handleEnrollClick}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-4 rounded-lg mb-6 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isFree ? "এনরোল করি" : "ব্যাচে ভর্তি হোন"}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                এই কোর্স যা পাবেন
              </h4>

              <div className="space-y-3">
                {whatsIn.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Leadership Panel - Left Side */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-[#F2F7FC] rounded-lg shadow-sm p-2 md:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left">
                মেন্টর প্যানেল
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mentors.map((mentor) => (
                  <div
                    key={mentor._id}
                    className="relative rounded-2xl shadow-md hover:shadow-lg flex flex-col items-center bg-white   "
                  >
                    <div className="flex flex-col h-[265px] w-full">
                      <div className="text-center">
                        <Image
                          src={
                            mentor?.image
                              ? `${process.env.NEXT_PUBLIC_API_URL}/${mentor?.image}`
                              : "/assets/icons/avatar.png"
                          }
                          height={400}
                          width={400}
                          alt={mentor.fullName}
                          className="w-full h-[150px] object-cover rounded-t-2xl"
                        />
                      </div>

                      <div className="flex flex-col items-center justify-center text-center px-3">
                        <h3 className="text-sm font-bold mt-2 line-clamp-2">
                          {mentor.fullName}
                        </h3>
                        <p className="text-xs font-md text-gray-500 mb-1 mt-2">
                          ( {mentor.designation} )
                        </p>
                        {/* part 3 */}
                        <p className="text-xs text-gray-500 text-left mt-2">
                          <span className="font-medium line-clamp-2">
                            {mentor.description || "--"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Section - Right Side (Hidden on mobile, shown on desktop) */}
          <div className="lg:col-span-1 hidden lg:block order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-lg border p-6 sticky top-8">
              {/* Course Type Selector */}
              {hasMultipleTypes && (
                <div className="mb-4 bg-gray-100 p-2 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {types?.map((type) => (
                      <button
                        key={type._id || type.mode}
                        onClick={() => setActiveType(type.mode)}
                        className={`px-3 py-1 rounded-md text-xs font-medium ${
                          activeType === type.mode
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {type.mode.charAt(0).toUpperCase() + type.mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ফুল কোর্স প্রাইস
              </h3>

              <div className="mb-4">
                {isFree ? (
                  <span className="text-green-700 font-bold text-xl">
                    সম্পূর্ণ ফ্রি!
                  </span>
                ) : currentType?.salePrice ? (
                  <>
                    <span className="text-sm text-gray-600">মাত্র </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ৳ {currentType.salePrice}
                    </span>
                    <span className="text-sm text-red-500 line-through ml-2">
                      ৳ {currentType.price}
                    </span>
                    {currentType?.salePrice && (
                      <span className="ml-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                        {Math.round(
                          ((currentType.price - currentType.salePrice) /
                            currentType.price) *
                            100
                        )}
                        % OFF
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-sm text-gray-600">মাত্র </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ৳ {currentType?.price}
                    </span>
                  </>
                )}
              </div>

              {isEnrolled ? (
                <Link href={`/dashboard/courses/${course?.slug}`}>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg mb-6 transition-colors duration-200 flex items-center justify-center gap-2">
                    শেখা শুরু করুন
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </Link>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-4 rounded-lg mb-6 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isFree ? "এনরোল করি" : "ব্যাচে ভর্তি হোন"}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  এই কোর্স যা পাবেন
                </h4>

                <div className="space-y-3">
                  {whatsIn.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                      <span className="text-sm text-gray-700 leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Type Selection Modal */}
      {showTypeSelectionModal && (
        <TypeModal
          courseTypes={types}
          onSelectType={handleTypeSelectedAndCloseModal}
          onClose={() => setShowTypeSelectionModal(false)}
          course={course}
        />
      )}
    </div>
  );
}
