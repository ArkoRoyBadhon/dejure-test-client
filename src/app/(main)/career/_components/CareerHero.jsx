"use client";
import { useMemo } from "react";

import { useGetAllJobPortalHerosQuery } from "@/redux/features/WebManage/JobHero.api";
import CommonPageHero from "../../_components/home/CommonPageHero";

export default function CareerHero() {
  const {
    data: jobPortalHeroData,
    isLoading,
    isError,
  } = useGetAllJobPortalHerosQuery();

  // Pick first record safely & map to CommonPageHero props
  const { imageSrc, badgeText, title, description } = useMemo(() => {
    const d =
      Array.isArray(jobPortalHeroData) && jobPortalHeroData.length > 0
        ? jobPortalHeroData[0]
        : {};
    return {
      imageSrc: d?.image,

      badgeText: d?.miniTitle || "💼 জব পোর্টাল",
      title: d?.title || "শেখা শেষ, এবার ক্যারিয়ারের পথে",
      description:
        d?.subTitle ||
        "ডিজুরি শুধু পড়ায় সীমাবদ্ধ নয়, আমরা তৈরি করি ক্যারিয়ারের সুযোগ।",
    };
  }, [jobPortalHeroData]);

  if (isLoading) {
    return (
      <div className="bg-gray2 py-8 md:py-15 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-[.04]" />
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between relative z-[1] max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0">
          <div className="w-full md:max-w-[500px]">
            <div className="h-5 w-28 bg-gray-300 rounded animate-pulse mb-3" />
            <div className="h-10 w-72 bg-gray-300 rounded animate-pulse mb-4" />
            <div className="h-6 w-80 bg-gray-300 rounded animate-pulse" />
          </div>
          <div className="w-[200px] h-[150px] sm:w-[240px] sm:h-[170px] md:w-[280px] md:h-[200px] lg:w-[320px] lg:h-[220px] bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gray2 py-8">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <p className="text-red-600">Failed to load career hero content.</p>
        </div>
      </div>
    );
  }

  return (
    <CommonPageHero
      imageSrc={imageSrc}
      badgeText={badgeText}
      title={title}
      description={description}
    />
  );
}
