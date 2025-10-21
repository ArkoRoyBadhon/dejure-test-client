"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function OrderFailedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const transactionId = searchParams.get("transactionId");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast.error(decodeURIComponent(error));
    } else {
      toast.error("Payment failed. Please try again.");
    }
  }, [error]);

  return (
    <div className="min-h-[70vh] max-w-[800px] mx-auto my-6 p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600">
            Unfortunately, your payment could not be processed. Please try
            again.
          </p>
        </div>

        {transactionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Transaction ID:</span>
              <p className="text-gray-600">{transactionId}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">
              <span className="font-medium">Error:</span>{" "}
              {decodeURIComponent(error)}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-gray-600">
            Don't worry, no charges have been made to your account. You can try
            again or choose a different payment method.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cart/checkout"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/cart"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
