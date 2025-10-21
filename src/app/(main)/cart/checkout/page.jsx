"use client";

import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateOrderMutation } from "@/redux/features/Products/Order.api";
import { useInitiateOrderPaymentMutation } from "@/redux/features/payment/payment.api";
import {
  useValidateCouponMutation,
  useRedeemCouponMutation,
} from "@/redux/features/coupon/coupon.api";
import { toast } from "sonner";
import { clearCart } from "@/redux/features/cart/cartSlice";
import { trackCheckout } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Check, Loader2 } from "lucide-react";
import LearnerLoginComponent from "@/app/(auth)/login/_components/LearnerLoginComponent";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, selectedItems } = useSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loginClick, setLoginClick] = useState(false);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [initiateOrderPayment, { isLoading: isPaymentLoading }] =
    useInitiateOrderPaymentMutation();
  const learner = useSelector((state) => state.auth?.user?._id);
  const dispatch = useDispatch();

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [validateCoupon, { isLoading: isValidating }] =
    useValidateCouponMutation();
  const [redeemCoupon, { isLoading: isRedeeming }] = useRedeemCouponMutation();

  // Check if user is logged in
  const isLoggedIn = !!learner;

  // Get shipping info from localStorage
  const getShippingInfo = () => {
    if (typeof window !== "undefined") {
      const savedInfo = localStorage.getItem("shippingInfo");
      return savedInfo ? JSON.parse(savedInfo) : null;
    }
    return null;
  };

  const shippingInfo = getShippingInfo();

  // Filter items to only show selected ones
  const selectedCartItems = items.filter((item) =>
    selectedItems.includes(item.id)
  );

  // Calculate totals
  const subtotal = selectedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = shippingInfo?.deliveryArea === "inside" ? 60 : 130;
  const total = subtotal + deliveryFee - discountAmount;

  // Track checkout initiation when component mounts
  useEffect(() => {
    if (selectedCartItems.length > 0) {
      trackCheckout(selectedCartItems, total);
    }
  }, [selectedCartItems, total]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleLoginSuccess = () => {
    setLoginClick(false);
    // After successful login, user can proceed with payment
    // No need to automatically apply coupon as it's already applied
  };

  // Coupon functions
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const validationData = {
        code: couponCode.trim(),
        learnerId: learner || null, // Optional for coupon validation
        productId: selectedCartItems[0]?.id, // For product-specific coupons
        orderTotal: subtotal + deliveryFee,
      };

      const result = await validateCoupon(validationData).unwrap();

      if (result.status) {
        setAppliedCoupon(result.data.coupon);
        setDiscountAmount(result.data.discountAmount);
        toast.success(
          `Coupon applied! You saved TK. ${result.data.discountAmount.toFixed(
            2
          )}`
        );
      }
    } catch (error) {
      toast.error(error?.data?.message || "Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  const handleSubmitOrder = async () => {
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    if (!shippingInfo?.name || !shippingInfo?.phone || !shippingInfo?.address) {
      toast.error("Please complete shipping information first");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    // Check if user is logged in for payment
    if (!learner) {
      setLoginClick(true);
      return;
    }

    try {
      const orderData = {
        learner: learner || null,
        products: selectedCartItems.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
        paymentMethod,
        address: shippingInfo.address,
        phone: shippingInfo.phone,
        alterPhone: shippingInfo.altPhone || "",
        deliveryFee,
        name: shippingInfo.name,
        email: shippingInfo.email || "",
        note: "",
        transactionId: "",
        couponCode: appliedCoupon?.code || "",
        discountAmount: discountAmount,
      };

      // Handle different payment methods
      if (paymentMethod === "cod") {
        // Cash on Delivery - create order directly
        const orderResult = await createOrder(orderData).unwrap();

        // Redeem coupon if applied
        if (appliedCoupon && learner) {
          try {
            await redeemCoupon({
              code: appliedCoupon.code,
              learnerId: learner,
              orderId: orderResult._id,
              productId: selectedCartItems[0]?.id,
              discountedAmount: discountAmount,
            }).unwrap();
          } catch (couponError) {
            console.error("Coupon redemption failed:", couponError);
            // Don't fail the order if coupon redemption fails
          }
        }

        toast.success("Order placed successfully!");

        // Clear the cart after successful order
        dispatch(clearCart());

        // Clear shipping info from localStorage if needed
        if (typeof window !== "undefined") {
          localStorage.removeItem("shippingInfo");
        }

        router.push("/de-jury-shop");
      } else if (paymentMethod === "online") {
        const paymentData = {
          products: selectedCartItems.map((item) => ({
            product: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          })),
          paymentMethod: "online", // Set as online for SSLCommerz
          address: shippingInfo.address,
          phone: shippingInfo.phone,
          alterPhone: shippingInfo.altPhone || "",
          deliveryFee,
          name: shippingInfo.name,
          email: shippingInfo.email || "",
          note: "",
          couponCode: appliedCoupon?.code || "",
          discountAmount: discountAmount,
        };

        try {
          const response = await initiateOrderPayment(paymentData).unwrap();

          if (response.success && response.redirectUrl) {
            toast.success("Redirecting to payment gateway...");
            // Redirect to SSLCommerz payment gateway
            window.location.href = response.redirectUrl;
          } else {
            toast.error("Failed to initiate payment");
          }
        } catch (paymentError) {
          // Collect all possible error messages
          let errorMessage = paymentError?.data?.message || "";
          let fullErrorText = "";

          if (paymentError?.data?.error) {
            fullErrorText += paymentError.data.error + " ";
          }
          if (paymentError?.error) {
            fullErrorText += paymentError.error + " ";
          }
          if (paymentError?.message) {
            fullErrorText += paymentError.message + " ";
          }

          // Combine all error text for comprehensive checking
          const combinedErrorText = (
            errorMessage +
            " " +
            fullErrorText
          ).toLowerCase();

          console.log("Payment Error Debug:", {
            originalError: paymentError,
            errorMessage,
            fullErrorText,
            combinedErrorText,
          });

          // Translate specific SSLCommerz errors to Bengali
          if (
            combinedErrorText.includes("minimum transaction amount") ||
            combinedErrorText.includes("admin configuration") ||
            combinedErrorText.includes("not allowed as per admin")
          ) {
            toast.error(
              "SSLCommerz এ সর্বনিম্ন লেনদেনের পরিমাণ অনুমোদিত নয়! দয়া করে আপনার অর্ডারের পরিমাণ চেক করুন।"
            );
          } else if (combinedErrorText.includes("invalid payment amount")) {
            toast.error(
              "অবৈধ পেমেন্ট পরিমাণ। দয়া করে আপনার অর্ডারের মোট পরিমাণ চেক করুন।"
            );
          } else if (
            combinedErrorText.includes("payment gateway configuration error")
          ) {
            toast.error(
              "পেমেন্ট গেটওয়ে কনফিগারেশন ত্রুটি। দয়া করে সাপোর্টে যোগাযোগ করুন।"
            );
          } else if (
            combinedErrorText.includes("payment gateway authentication failed")
          ) {
            toast.error(
              "পেমেন্ট গেটওয়ে অথেন্টিকেশন ব্যর্থ। দয়া করে সাপোর্টে যোগাযোগ করুন।"
            );
          } else {
            toast.error(
              errorMessage ||
                fullErrorText.trim() ||
                "Failed to initiate payment"
            );
          }
        }
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  if (!shippingInfo) {
    return (
      <div className="min-h-[70vh] max-w-[1200px] mx-auto my-6 p-4 text-center">
        <p className="text-lg mb-4">
          Please complete shipping information first
        </p>
        <Link href="/cart" className="text-blue-600 hover:underline">
          Back to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] max-w-[1200px] mx-auto my-6 p-4">
      {selectedCartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg mb-4">No items selected for checkout</p>
          <Link href="/cart" className="text-blue-600 hover:underline">
            Back to Cart
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Info Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hidden">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span> {shippingInfo.name}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {shippingInfo.phone}
                </p>
                {shippingInfo.email && (
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {shippingInfo.email}
                  </p>
                )}
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {shippingInfo.address}
                </p>
                <p>
                  <span className="font-medium">Delivery Area:</span>{" "}
                  {shippingInfo.deliveryArea === "inside"
                    ? "Inside Dhaka"
                    : "Outside Dhaka"}
                </p>
              </div>
            </div>

            {/* Guest User Notice */}
            {!isLoggedIn && (
              <div className="rounded-lg shadow-sm border border-yellow-200 bg-yellow-50 p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Guest Checkout
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        You are checking out as a guest. Your order will be
                        processed without creating an account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Coupon Section */}
            <div className="rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-md mb-4 border-b p-4">Coupon Code</h2>
              <div className="p-4">
                {!appliedCoupon ? (
                  <div className="flex gap-2  items-center">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      className="flex-1 rounded-md"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={isValidating || !couponCode.trim()}
                    >
                      {isValidating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">
                        {appliedCoupon.code} applied
                      </span>
                      <span className="text-green-600">
                        -TK. {discountAmount.toFixed(2)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-md mb-4 border-b p-4">
                Payment Method{" "}
                <span className="text-sm text-gray-500">
                  (Please select a payment method)
                </span>
              </h2>

              <div className="p-4 space-y-4">
                {/* Cash on Delivery */}
                {/* <div
                  className={`border p-6 rounded-md cursor-pointer transition-colors ${
                    paymentMethod === "cod"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handlePaymentMethodChange("cod")}
                >
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => handlePaymentMethodChange("cod")}
                      className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-4">
                      <span className="text-lg font-semibold text-gray-900">
                        Cash on Delivery
                      </span>
                      <p className="text-gray-600 text-sm mt-1">
                        Pay with cash when your order is delivered
                      </p>
                    </div>
                  </label>
                </div> */}

                {/* Online Payment */}
                <div
                  className={`border p-6 rounded-md cursor-pointer transition-colors ${
                    paymentMethod === "online"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handlePaymentMethodChange("online")}
                >
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => handlePaymentMethodChange("online")}
                      className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-4">
                      <span className="text-lg font-semibold text-gray-900">
                        Online Payment
                      </span>
                      <p className="text-gray-600 text-sm mt-1">
                        Pay securely with cards, bKash, Nagad, or Rocket
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Image
                          src="/payment-methods/visa.png"
                          alt="Visa"
                          width={40}
                          height={20}
                        />
                        <Image
                          src="/payment-methods/bkash.png"
                          alt="bKash"
                          width={40}
                          height={20}
                        />
                        <Image
                          src="/payment-methods/nagad.png"
                          alt="Nagad"
                          width={40}
                          height={20}
                        />
                        <Image
                          src="/payment-methods/rocket.png"
                          alt="Rocket"
                          width={40}
                          height={20}
                        />
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms & Conditions
                </a>
              </span>
            </div>

            {/* Confirm Order Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={isLoading || isPaymentLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading || isPaymentLoading
                ? "Processing..."
                : `Confirm Order TK.${total.toFixed(2)}`}
            </button>
          </div>

          {/* Right Column - Checkout Summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit sticky top-32">
            <h2 className="text-xl font-bold mb-4">Checkout Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({selectedCartItems.length} items)</span>
                <span>TK. {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>TK. {deliveryFee.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-TK. {discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>TK. {Math.max(0, total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {loginClick && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 ease-in-out opacity-0 animate-fade-in"
            onClick={() => setLoginClick(false)}
          />
          <div className="fixed inset-0 flex justify-center items-center z-[999]">
            <div className="animate-grow origin-center">
              <LearnerLoginComponent
                setLoginClick={setLoginClick}
                onLoginSuccess={handleLoginSuccess}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
