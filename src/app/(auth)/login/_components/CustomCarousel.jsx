"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

const CustomCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const slides = [
    {
      title: "আইনের পথে নিশ্চিত প্রস্তুতি",
      description: "জজ ও আইন পেশার জন্য প্রিমিয়াম প্রস্তুতি প্ল্যাটফর্ম",
      image: "/assets/image/Law firm-amico 1.png",
    },
    {
      title: "সাফল্যের নির্ভরযোগ্য সহযাত্রী",
      description: "বিচার বিভাগ ও আইনজীবীদের জন্য আধুনিক শিক্ষণ ব্যবস্থা",
      image: "/assets/image/Law firm-amico 1.png",
    },
    {
      title: "জ্ঞান ও দক্ষতার সমন্বয়",
      description: "পরীক্ষা ও ক্যারিয়ারের জন্য কার্যকরী রিসোর্স ও কনটেন্ট",
      image: "/assets/image/Law firm-amico 1.png",
    },
  ];

  return (
    <div className="relative w-full h-full z-20">
      <div className="relative z-20 w-full h-full p-8 flex flex-col">
        {/* Logo */}
        <div className="w-[126px] h-[80px] mb-8">
          <Image
            src="/assets/icons/DJA logo Transperant-01 2.png"
            alt="Logo"
            width={126}
            height={89}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Swiper Carousel with fixed height */}
        <div className="flex-1 flex flex-col">
          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Pagination]}
            spaceBetween={50}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="h-full w-full"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="h-full flex flex-col items-center justify-center">
                  <h1 className="font-bold text-3xl text-darkColor text-center mb-6">
                    {slide.title}
                  </h1>
                  <div className="h-64 w-64 mb-6">
                    <Image
                      src={slide.image}
                      alt="Illustration"
                      width={256}
                      height={256}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xl text-darkColor text-center">
                    {slide.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom Pagination - Positioned 20px from bottom */}
        <div
          className="flex justify-center items-center gap-2 mb-5"
          style={{ marginBottom: "20px" }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => swiperRef.current?.swiper.slideTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-8 bg-main" : "w-4 bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomCarousel;
