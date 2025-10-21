"use client";
import { useGetAllHomeFeaturesQuery } from "@/redux/features/WebManage/HomeFeatures.api";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Skeleton loader components
const FeatureCardSkeleton = () => (
  <div className="bg-gray-200 rounded-2xl p-8 relative w-full h-[350px] animate-pulse">
    <div className="absolute inset-0 bg-gray-300 opacity-10" />

    {/* Icon skeleton */}
    <div className="w-20 h-20 bg-gray-300 rounded-full absolute top-3 -right-5 md:right-4"></div>

    {/* Content skeleton */}
    <div className="relative z-10">
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-6"></div>

      <div className="space-y-4 mt-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-4/5"></div>
          </div>
        ))}
      </div>

      {/* Arrow button skeleton */}
      <div className="w-10 h-10 bg-gray-300 rounded-full absolute -right-5 md:right-0 -bottom-5 md:bottom-2"></div>
    </div>
  </div>
);

const TitleSkeleton = () => (
  <div className="text-center">
    <div className="h-12 bg-gray-200 rounded animate-pulse w-3/4 mx-auto mb-4"></div>
    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
  </div>
);

export default function FeaturesAndServices() {
  const { data: featuresData, isLoading, error } = useGetAllHomeFeaturesQuery();
  const features = featuresData?.[0];
  const cards = features?.cards;

  // Animation variants for title only
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="max-w-[1200px] mx-auto pb-[20px] md:pb-[120px] pt-10 lg:px-4 xl:px-0">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton-title"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={titleVariants}
          >
            <TitleSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="actual-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={titleVariants}
          >
            <h3 className="text-3xl md:text-[40px] py-1 font-semibold Z text-center text-darkColor line-clamp-2">
              {features?.title || "আইন পেশার জন্য পূর্ণাঙ্গ প্রস্তুতি"}
            </h3>
            <p className="text-xl text-deepGray text-center mt-1 p-4 md:p-0 line-clamp-2">
              {features?.subTitle ||
                "বিচার বিভাগ কিংবা আইনজীবী, আমরা আছি সম্পূর্ণ প্রস্তুতির জন্য।"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-6 my-10 p-4 md:p-0">
        {isLoading ? (
          // Skeleton cards while loading
          <>
            {[...Array(2)].map((_, index) => (
              <FeatureCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        ) : (
          // Actual cards without animations
          cards?.map((card, index) => (
            <div
              key={`card-${index}`}
              className="bg-[#0020B2] rounded-2xl p-8 relative w-full shadow-md overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-0 opacity-5" />

              {/* Icon */}
              <Image
                alt={`${card.title} Icon`}
                src={`${process.env.NEXT_PUBLIC_API_URL}/${card.image}`}
                width={80}
                height={80}
                className="w-15 h-15 lg:w-[90px] lg:h-[90px] absolute top-3 right-4"
                unoptimized
              />

              {/* Content */}
              <div className="relative z-10">
                <h4 className="font-bold text-2xl Z md:text-3xl text-white">
                  {card.title}
                </h4>

                <div className="space-y-4 mt-8">
                  {card?.whatsIn?.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 text-white ">
                      <div className="h-5 w-5 bg-[#FFB800] rounded-full flex items-center justify-center flex-shrink-0">
                        {" "}
                        {/* Added flex-shrink-0 */}
                        <Check
                          strokeWidth={5}
                          className="w-3 h-3 bg-transparent text-darkColor"
                        />
                      </div>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>

                {/* Arrow button */}
                <Link
                  href={card.link}
                  className="w-10 h-10 lg:w-16 lg:h-16 bg-[#FFB800] flex items-center justify-center rounded-full absolute -right-5 md:right-0 -bottom-5 md:bottom-2 shadow-md"
                >
                  <ArrowRight className="-rotate-45 text-darkColor w-6" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
