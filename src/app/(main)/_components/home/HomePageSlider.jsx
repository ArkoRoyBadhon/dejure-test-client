"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/react";
import { motion } from "framer-motion";

const HomePageSlider = ({ image1, image2, image3, isLoading }) => {
  const [active, setActive] = useState(2);
  const swiperRef = useRef(null);

  const sliders = [image1, image2, image3];

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="rounded-2xl sm:rounded-3xl w-full max-w-[350px] sm:max-w-[400px] md:max-w-[500px] h-[200px] sm:h-[300px] md:h-[400px] bg-gray-200 animate-pulse"></div>
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-3 sm:my-4 mx-auto">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-2 sm:h-2.5 w-4 sm:w-5 bg-gray-300 rounded-full animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Swiper
        onSlideChange={(swiper) => setActive(swiper.activeIndex)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={1}
        loop
        className="rounded-2xl sm:rounded-3xl w-full max-w-[350px] sm:max-w-[400px] md:max-w-[500px] h-auto items-end space-x-2"
        touchRatio={1}
        touchAngle={45}
        threshold={5}
      >
        {sliders.map((src, index) => (
          <SwiperSlide key={index}>
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${src}`}
              alt={`slider-${index}`}
              height={540}
              width={400}
              unoptimized
              className="rounded-2xl sm:rounded-3xl w-full h-auto object-cover"
              priority={index === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-3 sm:my-4 mx-auto">
        {sliders.map((_, i) => (
          <button
            key={i}
            onClick={() => swiperRef.current?.slideTo(i)}
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer touch-manipulation ${
              i === active
                ? "w-8 sm:w-12 bg-main"
                : "w-4 sm:w-5 bg-darkColor opacity-50"
            }`}
          ></button>
        ))}
      </div>
    </motion.div>
  );
};

export default HomePageSlider;
