"use client";

import { useParams, useRouter } from "next/navigation";

import Image from "next/image";
import { Check, X, ExternalLink, Download, ArrowDown } from "lucide-react";
import StarRating from "@/components/shared/StarRating";
import {
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
} from "@/redux/features/Products/Products.api";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { useState, useEffect } from "react";
import { trackBuyNow, trackAddToCart } from "@/lib/analytics";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProductDetails() {
  const { id } = useParams();
  const { data: product, isLoading } = useGetProductByIdQuery(id);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get related products from same category
  const { data: relatedProducts = [] } = useGetProductsByCategoryQuery(
    product?.category?._id,
    { skip: !product?.category?._id }
  );

  // Filter out current product and limit to 4
  const filteredRelatedProducts = relatedProducts
    ?.filter((p) => p._id !== id)
    ?.slice(0, 8);

  const handleBuyNow = (product) => {
    trackBuyNow(product, 1);
    dispatch(addToCart(product));

    toast.success("🎉Go to cart");

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.4 },
      colors: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
      shapes: ["star", "circle"],
      scalar: 1.2,
    });

    // Additional burst after a short delay for extra celebration
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#FFD700", "#FF6B6B"],
      });
    }, 200);

    router.push("/cart");
  };

  const handleAddToCart = (product) => {
    trackAddToCart(product, 1);
    dispatch(addToCart(product));

    toast.success("🎉 কার্টে যুক্ত হয়েছে!");

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (isLoading)
    return (
      <div className="min-h-[70vh] max-w-[1200px] mx-auto my-6">
        {/* Breadcrumbs Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>

        {/* Main Content Skeleton */}
        <div className="flex flex-col md:flex-row gap-6 p-4 md:p-10 bg-white shadow animate-pulse">
          {/* Image Skeleton */}
          <div className="w-full md:w-1/3 flex justify-center p-4 border items-center">
            <div className="w-[250px] h-[350px] bg-gray-300"></div>
          </div>

          {/* Info Skeleton */}
          <div className="w-full md:w-2/3 space-y-4 p-8 md:p-0">
            {/* Title */}
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            {/* Author */}
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            {/* Category */}
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            {/* Rating */}
            <div className="h-4 bg-gray-200 rounded w-1/5"></div>
            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            {/* Price */}
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            {/* Stock status */}
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            {/* Button */}
            <div className="h-10 bg-gray-300 rounded w-full sm:w-auto"></div>
          </div>
        </div>
      </div>
    );
  if (!product)
    return <p className="text-center text-red-500">পণ্য পাওয়া যায়নি</p>;

  return (
    <div className="min-h-[70vh] max-w-[1200px] mx-auto my-6">
      <div className="text-sm text-gray-500 mb-4 pl-4 md:pl-0">
        <Link href="/" className="text-gray-400 hover:underline">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/de-jury-shop" className="text-gray-400 hover:underline">
          Shop
        </Link>{" "}
        / <span className="text-gray-800 font-semibold">Product Details</span>
      </div>
      <div className=" flex flex-col md:flex-row items-center gap-6 p-4 md:p-10  bg-white shadow">
        {/* Book Image with Preview Option */}
        <div className="w-full md:w-1/3 flex flex-col p-4 border items-center h-full relative">
          {product.PreviewPages && (
            <div className=" bg-yellow-100 text-red-500 px-2 py-1 rounded font-semibold text-md static right-14 ">
              <p className="flex items-center gap-2">
                <span className="font-bold">একটু পড়ে দেখুন</span>
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </p>
            </div>
          )}
          <div
            className="cursor-pointer relative"
            onClick={() => {
              if (product.PreviewPages) {
                if (isMobile) {
                  // Mobile: Direct open in new tab
                  window.open(
                    `${process.env.NEXT_PUBLIC_API_URL}/${product.PreviewPages}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                } else {
                  // Desktop: Open dialog
                  setIsPreviewOpen(true);
                }
              }
            }}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${product.image}`}
              alt={product.title}
              height={500}
              width={400}
              className="h-[350px] w-auto"
            />
            {product.PreviewPages && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-opacity-30">
                <span className="bg-white px-3 py-1 rounded-md text-sm font-medium">
                  Preview
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Book Info */}
        <div className="w-full md:w-2/3 space-y-4 p-8 md:p-0 ">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              {product.title}
            </h2>
            <p className="text-sm text-blue-600 mt-1">
              {product.author || "Unknown Author"}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            <strong>Category:</strong> {product.category?.title}
          </div>

          <StarRating
            starCount={product?.starCount || 0}
            totalRatings={product?.totalRatings || 0}
            totalReviews={product?.totalReviews || 0}
            size="sm"
          />

          <div className="text-sm text-gray-700 leading-6">
            {product.description || "No description available."}
          </div>

          <div className="text-lg">
            <div className="flex items-center gap-3">
              {product.oldPrice && (
                <span className="line-through text-gray-500 text-sm">
                  TK. {product.oldPrice}
                </span>
              )}
              <span className="font-bold text-xl text-green-600">
                TK. {product.price}
              </span>
            </div>
          </div>

          <div>
            <p className="flex gap-2">
              <span className="flex items-center justify-center">
                <Check className="bg-green-500 rounded-full h-4 w-4 text-white" />
              </span>
              {product.stock > 0
                ? `In Stock (${product.stock} copies available)`
                : "Stock Out"}
            </p>
            <p className="text-sm">* স্টক আউট হওয়ার আগেই অর্ডার করুন</p>
          </div>

          {/* Button */}

          {product.stock > 0 ? (
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button
                onClick={() => handleBuyNow(product)}
                className="bg-main hover:bg-yellow-200 px-4 py-2 rounded-md font-semibold w-full sm:w-auto transition-colors"
              >
                Buy Now
              </button>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-main hover:bg-yellow-200 px-4 py-2 rounded-md font-semibold w-full sm:w-auto transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button
                onClick={() => handleBuyNow(product)}
                className="bg-main hover:bg-yellow-200 px-4 py-2 rounded-md font-semibold w-full sm:w-auto transition-colors"
                disabled={true}
              >
                স্টক শেষ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {filteredRelatedProducts?.length > 0 && (
        <div className="mt-12 px-4 md:px-2">
          <h3 className="text-xl font-semibold mb-6">Related Books</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {filteredRelatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className=" bg-white rounded-xl  mb-4"
              >
                <div className="relative flex items-center justify-center cursor-pointer">
                  <Link href={`/de-jury-shop/${relatedProduct._id}`}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${relatedProduct.image}`}
                      alt={relatedProduct.title}
                      width={400} // optionally use real dimensions if you have
                      height={300}
                      className=" h-[210px] w-[150px]"
                    />
                  </Link>
                </div>

                <div className=" mt-2 flex-1 flex flex-col justify-between h-30">
                  <div className="flex flex-col justify-center items-center gap-2 text-sm h-2/3 mb-2">
                    <p className="font-semibold text-lg text-gray-800   overflow-hidden text-ellipsis">
                      {relatedProduct.title}
                    </p>

                    <p className="text-gray-600">
                      {relatedProduct.author || "unknown"}
                    </p>

                    <StarRating
                      starCount={relatedProduct?.starCount || 0}
                      totalRatings={relatedProduct?.totalRatings || 0}
                      totalReviews={relatedProduct?.totalReviews || 0}
                      size="xs"
                      showCounts={false}
                    />

                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 font-semibold">
                        {relatedProduct.price} TK
                      </span>

                      {/* <span className="text-red-500 line-through">
                        ৳{product.oldPrice}
                      </span> */}
                    </div>
                  </div>

                  {relatedProduct.stock > 0 ? (
                    <div className="h-1/3  flex items-center justify-center">
                      <button
                        className="bg-main hover:bg-amber-300 py-3 font-bold rounded-md mx-auto text-sm w-[130px]"
                        disabled={relatedProduct.stock <= 0}
                        onClick={() => handleAddToCart(relatedProduct)}
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
            ))}
          </div>
        </div>
      )}

      {/* PDF Preview Dialog - Desktop Only */}
      {!isMobile && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="custom-dialog-width2 w-full h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-sm md:text-lg">
                {product.title} - Preview
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1">
              {/* Desktop PDF Preview */}
              <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${product.PreviewPages}#toolbar=0&navpanes=0&zoom=100`}
                  className="w-full h-full border-0"
                  title="Book Preview"
                  style={{
                    minHeight: "100%",
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
