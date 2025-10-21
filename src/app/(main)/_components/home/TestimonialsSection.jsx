"use client";
import { useGetAllMixHerosQuery } from "@/redux/features/WebManage/MixHero.api";
import { useGetAllReviewsQuery } from "@/redux/features/WebManage/Reviews.api";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function InfiniteTestimonials() {
  const { data: reviews = [], isLoading } = useGetAllReviewsQuery();
  const { data: headerData } = useGetAllMixHerosQuery();

  // Duplicate the reviews to create seamless infinite loop
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef(null);
  const speed = 1;
  const cardWidth = 400; // Adjust based on your card width

  useEffect(() => {
    if (isPaused || isLoading) return;

    let animationId;
    let position1 = 0;
    let position2 = 0;
    let row1Width = 0;
    let row2Width = 0;

    const animate = () => {
      if (!row1Ref.current || !row2Ref.current) return;

      // Initialize widths if not set
      if (row1Width === 0) row1Width = row1Ref.current.scrollWidth / 3;
      if (row2Width === 0) row2Width = row2Ref.current.scrollWidth / 3;

      // First row moves left to right
      position1 -= speed;
      if (position1 <= -row1Width) {
        position1 = 0;
      }
      row1Ref.current.style.transform = `translateX(${position1}px)`;

      // Second row moves right to left
      position2 += speed;
      if (position2 >= row2Width) {
        position2 = 0;
      }
      row2Ref.current.style.transform = `translateX(${position2}px)`;

      animationId = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, isLoading]);

  return (
    <div className="flex flex-col w-full mx-auto items-start gap-8 px-4 mt-1 md:mt-24 md:mb-24">
      <div className="flex w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col items-start gap-2 flex-1">
          {headerData?.map((data, index) => (
            <div key={index}>
              <h3 className="self-stretch font-bold text-[#74767c] text-md md:text-xl">
                {data.miniTitle2}
              </h3>
              <h2 className="font-bold text-[#141b34] text-3xl md:text-[40px]  Z">
                {data.Title2}
              </h2>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full overflow-hidden relative">
        {isLoading ? (
          // Skeleton loader while data is loading
          <>
            {/* First row skeleton */}
            <div className="overflow-hidden py-4">
              <div className="flex w-max">
                {[...Array(6)].map((_, index) => (
                  <div key={`skeleton-row1-${index}`} className="w-[300px]">
                    <TestimonialCardSkeleton />
                  </div>
                ))}
              </div>
            </div>

            {/* Second row skeleton */}
            <div className="overflow-hidden py-4">
              <div className="flex w-max">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={`skeleton-row2-${index}`}
                    className="flex-shrink-0 w-[300px]"
                  >
                    <TestimonialCardSkeleton />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Actual content when data is available
          <>
            {/* First row - moves left to right */}
            <div className="overflow-hidden py-4">
              <div
                ref={row1Ref}
                className="flex w-max will-change-transform"
                style={{
                  transition: isPaused ? "transform 0.3s ease" : "none",
                }}
              >
                {duplicatedReviews.map((review, index) => (
                  <div
                    key={`row1-${review.id}-${index}`}
                    className=" w-[300px]"
                  >
                    <TestimonialCard review={review} />
                  </div>
                ))}
              </div>
            </div>

            {/* Second row - moves right to left */}
            <div className="overflow-hidden py-4">
              <div
                ref={row2Ref}
                className="flex w-max will-change-transform"
                style={{
                  transition: isPaused ? "transform 0.3s ease" : "none",
                  marginLeft: `-${reviews.length * cardWidth}px`,
                }}
              >
                {duplicatedReviews.map((review, index) => (
                  <div
                    key={`row2-${review.id}-${index}`}
                    className="flex-shrink-0 w-[300px]"
                  >
                    <TestimonialCard review={review} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TestimonialCard({ review }) {
  return (
    <div className="w-[280px] h-[250px] shadow-md flex flex-col border rounded-lg">
      <div className="flex flex-col items-start p-6 relative flex-grow overflow-hidden">
        {/* Header with avatar and name */}
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex items-center gap-4">
            <div className="overflow-hidden">
              <Image
                height={100}
                width={100}
                src={`${process.env.NEXT_PUBLIC_API_URL}/${review.image}`}
                alt="User avatar"
                className="w-12 h-12 rounded-full border"
              />
            </div>
            <div className="flex flex-col items-start gap-1">
              <h3 className="font-bold text-[#141b34] text-base">
                {review.name}
              </h3>
              <p className="text-[#141b34] text-sm font-normal">
                {review.designation}
              </p>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex mt-2">
          {Array.from({ length: review.rating }, (_, index) => (
            <Image
              key={index}
              className="h-4 w-4"
              alt="Star rating"
              src="https://pngimg.com/uploads/star/star_PNG41462.png"
              height={20}
              width={20}
              unoptimized
            />
          ))}
        </div>

        {/* Review Text */}
        <p className="text-[#57595e] text-base leading-6 font-normal line-clamp-4 mt-2">
          {review.comment}
        </p>

        {/* Quote Icon */}
        <Image
          className="absolute w-6 h-5 bottom-6 right-6"
          alt="Quote mark"
          src="/quote.svg"
          height={20}
          width={20}
          unoptimized
        />
      </div>
    </div>
  );
}

// Skeleton loader component
function TestimonialCardSkeleton() {
  return (
    <div className="w-[280px] h-[250px] shadow-md flex flex-col border rounded-lg">
      <div className="flex flex-col items-start p-6 relative flex-grow overflow-hidden">
        {/* Header with avatar and name skeleton */}
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex items-center gap-4">
            <div className="overflow-hidden">
              <div className="w-16 h-12 rounded-full border bg-gray-200 animate-pulse"></div>
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Star Rating skeleton */}
        <div className="flex mt-2 gap-1">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-4 w-4 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>

        {/* Review Text skeleton */}
        <div className="w-full mt-2 space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-4/5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Quote Icon skeleton */}
        <div className="absolute w-6 h-5 bottom-6 right-6 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  );
}
