"use client";
import { useGetAllMixHerosQuery } from "@/redux/features/WebManage/MixHero.api";
import { motion } from "framer-motion";

export default function TimelineHero() {
  const { data: headerData } = useGetAllMixHerosQuery();
  const mainData = headerData?.[0];

  // Variants for animations
  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const subtitleVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut", delay: 0.2 },
    },
  };

  return (
    <div className="relative bg-gray2 border-b md:h-[264px] h-[300px]">
      {/* hero bg */}
      <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-[.04]" />

      {/* hero content */}
      <div className="flex flex-col items-center justify-center relative z-[1] max-w-[1200px] mx-auto py-24 space-y-6">
        {/* Title */}
        <motion.p
          className="font-black text-[40px] hidden md:block Z"
          initial="hidden"
          animate="visible"
          variants={textVariant}
        >
          📆 {mainData?.Title4 || "ডি জুরি টাইমলাইন – আমাদের পথচলার প্রতিচ্ছবি"}
        </motion.p>
        <motion.p
          className="font-black text-2xl block md:hidden text-center px-2 Z line-clamp-2"
          initial="hidden"
          animate="visible"
          variants={textVariant}
        >
          📆 {mainData?.Title4 || "ডি জুরি টাইমলাইন – আমাদের পথচলার প্রতিচ্ছবি"}
        </motion.p>

        {/* Subtitle */}
        <motion.p
          className="text-[#74767C] hidden md:block text-xl"
          initial="hidden"
          animate="visible"
          variants={subtitleVariant}
        >
          {mainData?.miniTitle4 ||
            "সফলতার প্রতিটি ধাপ আমরা তুলে ধরেছি স্মৃতির পাতায়, এবার দেখুন সময়ের ধারায়।"}
        </motion.p>
        <motion.p
          className="text-[#74767C] block md:hidden px-2 text-center line-clamp-2"
          initial="hidden"
          animate="visible"
          variants={subtitleVariant}
        >
          {mainData?.miniTitle4 ||
            "সফলতার প্রতিটি ধাপ আমরা তুলে ধরেছি স্মৃতির পাতায়, এবার দেখুন সময়ের ধারায়।"}
        </motion.p>
      </div>
    </div>
  );
}
