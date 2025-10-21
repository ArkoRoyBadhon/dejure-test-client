"use client";

import { addToCart } from "@/redux/features/cart/cartSlice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { trackAddToCart } from "@/lib/analytics";

export default function CategoryProducts({
  category,
  products,
  sectionRef,
  index,
}) {
  const dispatch = useDispatch();
  const isOdd = index % 2 !== 0;

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    trackAddToCart(product, 1);

    toast.success("🎉 কার্টে যুক্ত হয়েছে!");

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div
      ref={sectionRef}
      className={`relative max-w-[100vw] py-8 w-full overflow-hidden mx-auto px-4 md:px-0 my-10 ${
        isOdd ? "bg-[#FFB80033] rounded-[50px]" : ""
      }`}
    >
      {isOdd && (
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center opacity-[.04] z-0" />
      )}

      <div className="flex flex-col relative z-[1] max-w-[1200px] mx-auto min-h-[40vh] pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/book.svg" alt="book icon" />
            <p className="font-black text-2xl md:text-3xl Z">
              {category.title}
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl py-3 shadow-lg border"
              >
                <div className="relative flex items-center justify-center cursor-pointer">
                  <Link href={`/de-jury-shop/${product._id}`}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${product.image}`}
                      alt={product.title}
                      width={400}
                      height={300}
                      className="h-[210px] w-[150px] object-contain rounded-xl"
                    />
                  </Link>
                </div>

                <div className="mt-2 flex flex-col items-center gap-2">
                  <p className="font-semibold text-lg text-gray-800 text-center">
                    {product.title.length > 25
                      ? product.title.slice(0, 23) + "..."
                      : product.title}
                  </p>
                  <p className="text-gray-600 px-2 text-center line-clamp-2">
                    {product.author || "unknown"}
                  </p>
                  <span className="text-gray-800 font-semibold">
                    {product.price} TK
                  </span>

                  {product.stock > 0 ? (
                    <button
                      className="bg-blue hover:bg-blue-500 py-2 text-white font-bold rounded-md text-sm w-[130px]"
                      onClick={() => handleAddToCart(product)}
                    >
                      কার্ট এড করুন
                    </button>
                  ) : (
                    <button
                      className="bg-gray-300 text-white py-2 font-bold rounded-md text-sm w-[130px]"
                      disabled
                    >
                      স্টক শেষ
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              এই ক্যাটাগরিতে কোনো প্রোডাক্ট পাওয়া যায়নি।
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
