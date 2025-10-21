// components/PrintedBooks.jsx
"use client";
import { CheckoutDialog } from "@/components/shared/Modals/CheckoutModal";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { useGetAllProductsQuery } from "@/redux/features/Products/Products.api";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PrintedBooks() {
  const { user } = useSelector((state) => state.auth);
  const scrollRef = useRef(null);
  const { data: Products, isLoading } = useGetAllProductsQuery();
  const dispatch = useDispatch();

  const printedBooks =
    Products?.filter(
      (product) => product.category?.title?.trim() === "প্রিন্টেড বই"
    ) || [];

  const scrollCard = (direction) => {
    const container = scrollRef.current;
    if (container && container.firstChild) {
      const cardWidth = container.firstChild.offsetWidth + 20;
      container.scrollBy({
        left: direction === "right" ? cardWidth : -cardWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative  rounded-[60px] max-w-[100vw] w-full overflow-hidden mx-auto  px-4 md:px-0">
      {/* Background image */}
      {/* <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-[.04]" /> */}

      <div className="flex flex-col relative z-[1] max-w-[1200px] mx-auto min-h-[40vh] my-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/book.svg" alt="book icon" />
            <p className="font-black text-2xl md:text-3xl">প্রিন্টেড বই</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scrollCard("left")}>
              <img src="/leftcircle.svg" alt="left" />
            </button>
            <button onClick={() => scrollCard("right")}>
              <img src="/rightSign.svg" alt="right" />
            </button>
          </div>
        </div>

        {/* Scrollable cards container */}
        <div
          // ref={scrollRef}
          // className="mt-8 flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide"
          className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {isLoading ? (
            <p className="text-gray-500">লোড হচ্ছে...</p>
          ) : printedBooks.length > 0 ? (
            printedBooks.map((product) => (
              <div key={product._id} className=" bg-white rounded-xl  mb-4">
                <div className="relative flex items-center justify-center cursor-pointer">
                  <Link href={`/de-jury-shop/${product._id}`}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${product.image}`}
                      alt={product.title}
                      width={400} // optionally use real dimensions if you have
                      height={300}
                      className=" h-[210px] w-[150px]"
                    />
                  </Link>
                </div>

                <div className=" mt-2 flex-1 flex flex-col justify-between h-30">
                  <div className="flex flex-col justify-center items-center gap-2 text-sm h-2/3 mb-2">
                    <p className="font-semibold text-lg text-gray-800 line-clamp-2 ">
                      {product.title.length > 25
                        ? product.title.slice(0, 23) + "..."
                        : product.title}
                    </p>

                    <p className="text-gray-600">আরিফ খান</p>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 font-semibold">
                        {product.price} TK
                      </span>

                      {/* <span className="text-red-500 line-through">
                        ৳{product.oldPrice}
                      </span> */}
                    </div>
                  </div>

                  {product.stock > 0 ? (
                    <div className="h-1/3  flex items-center justify-center">
                      <button
                        className="bg-main hover:bg-amber-300 py-3 font-bold rounded-md mx-auto text-sm w-[130px]"
                        disabled={product.stock <= 0}
                        onClick={() => dispatch(addToCart(product))}
                      >
                        কার্ট এড করুন
                      </button>
                    </div>
                  ) : (
                    <div className="h-1/3 flex items-center justify-center">
                      <button
                        className="bg-gray-300 text-white  py-3 font-bold rounded-md mx-auto text-sm w-[130px] 
                disabled:cursor-not-allowed"
                        disabled
                      >
                        স্টক শেষ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">কোনো প্রিন্টেড বই পাওয়া যায়নি।</p>
          )}
        </div>
      </div>
    </div>
  );
}
