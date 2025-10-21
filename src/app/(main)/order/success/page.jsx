"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { clearCart } from "@/redux/features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { trackPurchase } from "@/lib/analytics";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [orderDetails, setOrderDetails] = useState(null);

  const transactionId = searchParams.get("transactionId");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (transactionId && orderId) {
      // Track purchase completion
      // Note: In a real implementation, you would fetch order details from the backend
      trackPurchase(
        transactionId,
        [], // Items array - would be populated from order details
        0, // Total value - would be populated from order details
        "online", // Payment method
        null // Coupon code
      );

      // Clear cart on successful payment
      dispatch(clearCart());

      // Clear shipping info from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("shippingInfo");
      }

      toast.success("Payment successful! Your order has been placed.");
    } else {
      toast.error("Invalid payment response");
      router.push("/cart");
    }
  }, [transactionId, orderId, dispatch, router]);

  return (
    <div className="min-h-[70vh] max-w-[800px] mx-auto my-6 p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. Your payment has been processed
            successfully.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Transaction ID:</span>
              <p className="text-gray-600">{transactionId}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Order ID:</span>
              <p className="text-gray-600">{orderId}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            You will receive a confirmation email shortly with your order
            details.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/de-jury-shop"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Continue Shopping
            </Link>
            {/* <Link
              href="/dashboard/orders"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              View Orders
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
