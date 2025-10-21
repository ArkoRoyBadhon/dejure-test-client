"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { trackPurchase } from "@/lib/analytics";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (transactionId) {
      // Track purchase completion
      // Note: In a real implementation, you would fetch order details from the backend
      // For now, we'll track with basic information
      trackPurchase(
        transactionId,
        [], // Items array - would be populated from order details
        0, // Total value - would be populated from order details
        "online", // Payment method
        null // Coupon code
      );

      setLoading(false);
    }
  }, [transactionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-4">
          Thank you for your payment. Your transaction has been completed
          successfully.
        </p>
        {transactionId && (
          <p className="text-sm text-gray-500 mb-6">
            Transaction ID: {transactionId}
          </p>
        )}
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/dashboard/courses">Go to My Courses</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
