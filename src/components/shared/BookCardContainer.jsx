"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye, SquareArrowDown } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function BookCardContainer({
  iconSrc,
  title,
  containerClass,
  products,
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const router = useRouter();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Group products into sets of 3
  const groupProducts = [];
  for (let i = 0; i < products.length; i += 3) {
    groupProducts.push(products.slice(i, i + 3));
  }

  // Handle preview
  const handlePreview = (product) => {
    if (product.PreviewPages) {
      setSelectedProduct(product);
      setIsPreviewOpen(true);
    } else {
      router.push(`/products/${product._id}`);
    }
  };

  // Handle download
  const handleDownload = (downloadUrl) => {
    if (!downloadUrl) return;

    const finalUrl = `${process.env.NEXT_PUBLIC_API_URL}/${downloadUrl}`;
    const link = document.createElement("a");
    link.href = finalUrl;
    link.target = "_blank";
    link.download = "preview.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      className={cn("bg-white py-20 max-w-[1200px] mx-auto", containerClass)}
    >
      {/* Section header */}
      <div className="flex items-center justify-between gap-4 mb-6 px-4">
        <Image src={iconSrc} alt={title} width={40} height={40} />
        <h2 className="md:text-3xl Z text-2xl font-bold text-darkColor grow">
          {title}
        </h2>

        {/* Slider buttons container */}
        <div className="inline-flex gap-2 items-center">
          <button
            ref={prevRef}
            className="cursor-pointer h-8 w-8 flex items-center justify-center rounded-full bg-[#141B341A] text-darkColor hover:bg-main duration-300"
          >
            <ChevronLeft strokeWidth={2.5} className="h-4 w-4" />
          </button>
          <button
            ref={nextRef}
            className="cursor-pointer h-8 w-8 flex items-center justify-center rounded-full bg-[#141B341A] text-darkColor hover:bg-main duration-300"
          >
            <ChevronRight strokeWidth={2.5} className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Swiper products Slider */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        slidesPerGroup={1}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {groupProducts.map((productGroup, index) => (
          <SwiperSlide key={index}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-3 px-1">
              {productGroup.map((product) => (
                <div
                  key={product._id}
                  className="p-6 flex gap-6 items-center rounded-2xl shadow-[0px_4px_4px_#0000001A] border"
                >
                  <div className="flex-1 py-3 px-2 bg-[#0047FF33] rounded-md relative">
                    <Image
                      alt={product.title}
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${product.image}`}
                      width={140}
                      height={200}
                      className="rounded w-full h-auto cursor-pointer"
                      onClick={() => handlePreview(product)}
                    />
                  </div>

                  <div className="flex-1 flex flex-col py-2 justify-between  h-full">
                    <h4 className="text-darkColor font-bold line-clamp-3">
                      {product.title}
                    </h4>
                    <p className="text-sm text-deepGray mb-6 mt-2 line-clamp-3">
                      {product.description}
                    </p>
                    <Button
                      onClick={() => handlePreview(product)}
                      className={"w-full py-3 px-6 rounded-2xl bg-blue text-white hover:bg-blue-600"}
                    >
                      <Eye size={16} /> এখন পড়ুন
                    </Button>
                    {/* {product.PreviewPages && (
                      <Button
                        onClick={() => handleDownload(product.PreviewPages)}
                        className={
                          "w-full py-3 px-6 rounded-2xl bg-gray4 hover:bg-gray4 mt-2"
                        }
                      >
                        <SquareArrowDown size={16} /> ডাউনলোড
                      </Button>
                    )} */}
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* PDF Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="custom-dialog-width2 h-[90vh] flex flex-col max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.title} - Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1">
            {selectedProduct?.PreviewPages && (
              <iframe
                src={`${process.env.NEXT_PUBLIC_API_URL}/${selectedProduct.PreviewPages}#toolbar=0&navpanes=0&zoom=100`}
                className="w-full h-full"
                title="Book Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
