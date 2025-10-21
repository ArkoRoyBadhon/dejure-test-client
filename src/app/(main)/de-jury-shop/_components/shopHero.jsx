"use client";
import { useMemo } from "react";
import { useGetAllShopHerosQuery } from "@/redux/features/WebManage/ShopHero.api";
import CommonPageHero from "../../_components/home/CommonPageHero";

export default function ShopHero() {
  const { data: shopHeroData, isLoading, isError } = useGetAllShopHerosQuery();

  // Map API data -> CommonPageHero props
  const { imageSrc, badgeText, title, description } = useMemo(() => {
    const d =
      Array.isArray(shopHeroData) && shopHeroData.length > 0
        ? shopHeroData[0]
        : {};
    return {
      imageSrc: d?.image || "/palla.svg",
      badgeText: d?.miniTitle || "🛍️ ডি জুরি শপ",
      title: d?.title || "শেখার জন্য দরকারি সবকিছু এক জায়গায়",
      description:
        d?.subTitle ||
        "শুধু ক্লাস নয়, প্রয়োজনীয় বই, নোটস, ম্যাটেরিয়াল ও স্টাডি টুলস — সবকিছু এখন পাবেন এক ক্লিকে।",
    };
  }, [shopHeroData]);

  if (isLoading) {
    return (
      <div className="bg-gray2 py-8 md:py-15 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center opacity-[.04]" />
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0">
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
          <p className="text-red-600">Failed to load shop hero content.</p>
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
