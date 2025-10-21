"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function OrderCancelledPage() {
  const searchParams = useSearchParams();

  const transactionId = searchParams.get("transactionId");
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      toast.error(decodeURIComponent(error));
    } else {
      toast.info("Payment was cancelled.");
    }
  }, [error]);

  return (
    <div className="min-h-[70vh] max-w-[800px] mx-auto my-6 p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-600">
            You have cancelled the payment process. No charges have been made to
            your account.
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-700 text-sm">
              <span className="font-medium">Note:</span>{" "}
              {decodeURIComponent(error)}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-gray-600">
            You can continue shopping or try the payment process again when
            you're ready.
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
            <Link
              href="/de-jury-shop"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
