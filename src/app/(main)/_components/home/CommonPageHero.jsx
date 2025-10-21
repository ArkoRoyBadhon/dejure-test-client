"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CommonPageHero({
  imageSrc,
  badgeText,
  title,
  description,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple animation trigger without Framer Motion
    setIsVisible(true);
  }, []);

  return (
    <div className=" bg-gray2 py-8 md:py-15 relative overflow-hidden">
      {/* Background opacity image */}
      <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-[.03]" />

      {/* Content */}
      <div className="relative z-[1] flex flex-col lg:flex-row gap-6 items-center justify-between max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0">
        <div
          className={`max-w-full md:max-w-[500px] text-center lg:text-start transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-darkColor text-sm md:text-base font-medium">
            🎁 {badgeText}
          </p>
          <h3 className="text-darkColor text-2xl md:text-[40px] font-bold mt-2 md:mt-3 Z">
            {title}
          </h3>
          <p className="text-deepGray mt-4 md:mt-6 text-xl line-clamp-2 ">
            {description}
          </p>
        </div>

        <div
          className={`px-2 md:px-4 mt-6 lg:mt-0 transition-all duration-700 ease-out delay-300 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <Image
            alt="Hero image"
            src={`${process.env.NEXT_PUBLIC_API_URL}/${imageSrc}`}
            height={200}
            width={200}
            className="w-[200px] h-[150px] sm:w-[240px] sm:h-[170px] md:w-[280px] md:h-[200px] lg:w-[320px] lg:h-[220px]"
            priority
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
