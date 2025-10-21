"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { trackCustomEvent } from "@/lib/analytics";

export default function PaymentFailed() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Track payment cancellation
    trackCustomEvent("payment_cancelled", {
      transaction_id: transactionId,
      error_message: error,
    });

    setLoading(false);
  }, [transactionId, error]);

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
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-4">
          Sorry, your payment could not be processed. Please try again.
        </p>
        {error && <p className="text-sm text-red-500 mb-2">Error: {error}</p>}
        {transactionId && (
          <p className="text-sm text-gray-500 mb-6">
            Transaction ID: {transactionId}
          </p>
        )}
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/courses">Try Again</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
