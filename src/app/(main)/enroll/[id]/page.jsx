"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useGetCourseByIdOrSlugQuery } from "@/redux/features/course/course.api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, X, Check } from "lucide-react";
import LearnerLoginComponent from "@/app/(auth)/login/_components/LearnerLoginComponent";
import { useInitiatePaymentMutation } from "@/redux/features/payment/payment.api";
import { useCreateEnrollmentMutation } from "@/redux/features/enroll/enroll.api";
import {
  useValidateCouponMutation,
  useRedeemCouponMutation,
} from "@/redux/features/coupon/coupon.api";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function EnrollmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCourseTypeId = searchParams.get("courseTypeId");

  const pathname = usePathname();

  const currentPath = useMemo(() => {
    const qs = searchParams?.toString();
    return qs ? `${pathname}?${qs}` : pathname || "/";
  }, [pathname, searchParams]);

  const [processing, setProcessing] = useState(false);
  const [loginClick, setLoginClick] = useState(false);
  const [initiatePayment, { isLoading: isPaymentLoading }] =
    useInitiatePaymentMutation();
  const [Enroll, { isLoading: isPayLoading }] = useCreateEnrollmentMutation();

  const { data: course, isLoading } = useGetCourseByIdOrSlugQuery(id);
  const learner = useSelector((state) => state.auth?.user);

  const [selectedModes, setSelectedModes] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedPayTerm, setSelectedPayTerm] = useState("one-time");
  const [paid, setPaid] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false); // New state for terms acceptance

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [validateCoupon, { isLoading: isValidating }] =
    useValidateCouponMutation();
  const [redeemCoupon, { isLoading: isRedeeming }] = useRedeemCouponMutation();

  // Set initial selected mode
  useEffect(() => {
    if (initialCourseTypeId && course?.types?.length > 0) {
      const preSelectedType = course.types.find(
        (type) => type._id === initialCourseTypeId
      );
      if (preSelectedType) setSelectedModes([preSelectedType.mode]);
    }
  }, [initialCourseTypeId, course]);

  const selectedTypes = useMemo(() => {
    return (
      course?.types?.filter((type) => selectedModes.includes(type.mode)) || []
    );
  }, [selectedModes, course]);

  const baseAmount = useMemo(() => {
    return selectedTypes.reduce(
      (sum, type) => sum + (type.salePrice || type.price || 0),
      0
    );
  }, [selectedTypes]);

  const firstMilestoneAmount = useMemo(() => {
    if (course?.milestones?.length > 0) {
      const firstMilestonePercentage = course.milestones[0].percentage;
      return Math.round(baseAmount * (firstMilestonePercentage / 100));
    }
    return 0;
  }, [baseAmount, course?.milestones]);

  const due = useMemo(() => {
    return Math.max(0, baseAmount - paid - discountAmount);
  }, [baseAmount, paid, discountAmount]);

  useEffect(() => {
    if (course?.paymentType?.toLowerCase() === "free") {
      setPaid(0);
      setPaymentMethod("free");
    } else if (selectedPayTerm === "one-time") {
      setPaid(baseAmount);
    } else if (selectedPayTerm === "milestone") {
      setPaid(firstMilestoneAmount);
    }
  }, [selectedPayTerm, baseAmount, firstMilestoneAmount, course]);

  const handleCheckboxChange = useCallback(
    (mode) => {
      if (initialCourseTypeId) return;
      setSelectedModes((prev) =>
        prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
      );
    },
    [initialCourseTypeId]
  );

  // Coupon functions
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    // if (!learner) {
    //   toast.error("Please login to use coupons");
    //   return;
    // }

    try {
      const validationData = {
        code: couponCode.trim(),
        learnerId: learner?._id || null, // Optional for coupon validation
        courseId: course._id,
        orderTotal: baseAmount,
      };

      const result = await validateCoupon(validationData).unwrap();

      if (result.status) {
        setAppliedCoupon(result.data.coupon);
        setDiscountAmount(result.data.discountAmount);

        // Check if it's a 100% discount coupon
        const finalAmount = baseAmount - result.data.discountAmount;
        if (finalAmount <= 0) {
          toast.success(`100% discount coupon applied! Course is now free.`);
        } else {
          toast.success(
            `Coupon applied! You saved TK. ${result.data.discountAmount.toFixed(
              2
            )}`
          );
        }
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

  const handleEnroll = async () => {
    if (!learner) {
      setLoginClick(true);
      return;
    }

    // Check if terms are accepted
    if (!termsAccepted) {
      toast.error("অনুগ্রহ করে শর্তাবলী এবং নীতিমালা গ্রহণ করুন");
      return;
    }

    // Paid টাইপে নির্বাচিত না হলে ব্লক করুন; ফ্রি হলে নয়
    if (
      selectedTypes?.length === 0 &&
      course?.paymentType?.toLowerCase() !== "free"
    ) {
      toast.error("কমপক্ষে একটি কোর্স টাইপ নির্বাচন করুন");
      return;
    }

    const getErrorMessage = (err) => {
      // RTK Query / fetch দুই দিকই কাভার
      let errorMessage = "";
      let fullErrorText = "";

      // Collect all possible error messages
      if (err?.data?.message) {
        errorMessage = err.data.message;
      }
      if (err?.data?.error) {
        fullErrorText += err.data.error + " ";
      }
      if (err?.error) {
        fullErrorText += err.error + " ";
      }
      if (err?.message) {
        fullErrorText += err.message + " ";
      }

      // Combine all error text for comprehensive checking
      const combinedErrorText = (
        errorMessage +
        " " +
        fullErrorText
      ).toLowerCase();

      console.log("Error Debug:", {
        originalError: err,
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
        return "SSLCommerz এ সর্বনিম্ন লেনদেনের পরিমাণ অনুমোদিত নয়! দয়া করে আপনার অর্ডারের পরিমাণ চেক করুন।";
      } else if (combinedErrorText.includes("invalid payment amount")) {
        return "অবৈধ পেমেন্ট পরিমাণ। দয়া করে আপনার অর্ডারের মোট পরিমাণ চেক করুন।";
      } else if (
        combinedErrorText.includes("payment gateway configuration error")
      ) {
        return "পেমেন্ট গেটওয়ে কনফিগারেশন ত্রুটি। দয়া করে সাপোর্টে যোগাযোগ করুন।";
      } else if (
        combinedErrorText.includes("payment gateway authentication failed")
      ) {
        return "পেমেন্ট গেটওয়ে অথেন্টিকেশন ব্যর্থ। দয়া করে সাপোর্টে যোগাযোগ করুন।";
      } else if (combinedErrorText.includes("payment initiation failed")) {
        return "পেমেন্ট শুরু করতে ব্যর্থ। দয়া করে আবার চেষ্টা করুন।";
      }

      return errorMessage || fullErrorText.trim() || "অজানা ত্রুটি ঘটেছে";
    };

    try {
      setProcessing(true);

      if (course?.paymentType?.toLowerCase() === "free") {
        // ✅ শুধুমাত্র আইডি পাঠান
        const payload = {
          learner: learner?._id,
          course: course?._id || course?.id,
        };

        try {
          const enrollResult = await Enroll(payload).unwrap();

          // Redeem coupon if applied for free courses
          if (appliedCoupon && learner) {
            try {
              await redeemCoupon({
                code: appliedCoupon.code,
                learnerId: learner._id,
                courseId: course._id,
                enrollmentId: enrollResult._id,
                discountedAmount: discountAmount,
              }).unwrap();
            } catch (couponError) {
              console.error("Coupon redemption failed:", couponError);
              // Don't fail the enrollment if coupon redemption fails
            }
          }

          toast.success("Success");
          router.push("/dashboard/courses");
        } catch {
          toast.error(Error);
        }
        return; // এখানে থামুন
      }

      // ---- Paid flow ----
      const finalAmount = baseAmount - discountAmount;

      // Check if it's a 100% discount coupon
      if (finalAmount <= 0 && appliedCoupon) {
        // Handle 100% discount coupon - enroll directly without payment
        const payload = {
          learner: learner?._id,
          course: course?._id || course?.id,
        };

        try {
          const enrollResult = await Enroll(payload).unwrap();

          // Redeem coupon for 100% discount
          if (appliedCoupon && learner) {
            try {
              await redeemCoupon({
                code: appliedCoupon.code,
                learnerId: learner._id,
                courseId: course._id,
                enrollmentId: enrollResult._id,
              }).unwrap();
            } catch (redeemError) {
              console.error("Coupon redemption error:", redeemError);
              // Don't fail enrollment if coupon redemption fails
            }
          }

          toast.success("Successfully enrolled with 100% discount!");
          router.push("/dashboard/courses");
          return;
        } catch (enrollError) {
          console.error("Enrollment error:", enrollError);
          throw enrollError;
        }
      }

      // Regular payment flow
      const paymentData = {
        courseId: course._id,
        selectedTypes: selectedTypes.map((t) => ({
          mode: t.mode,
          price: t.price,
          salePrice: t.salePrice,
        })),
        paymentType: selectedPayTerm,
        ...(selectedPayTerm === "milestone" && { milestoneIndex: 0 }),
        couponCode: appliedCoupon?.code || "",
        discountAmount: discountAmount,
      };

      const payRes = await initiatePayment(paymentData).unwrap();
      if (payRes?.success && payRes?.redirectUrl) {
        // Note: For online payments, coupon redemption will be handled
        // on the server side after successful payment verification
        // The paymentData already includes couponCode and discountAmount
        window.location.href = payRes.redirectUrl;
      } else {
        throw new Error(payRes?.message || "Payment initiation failed");
      }
    } catch (error) {
      console.error("Payment/Enroll error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading || !course)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  return (
    <>
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
                redirectUrl={currentPath}
              />
            </div>
          </div>
        </>
      )}

      {processing && (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-white bg-opacity-90 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-sm w-full">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-6" />
            <p className="text-2xl font-bold text-gray-800 mb-3">
              {course?.paymentType?.toLowerCase() === "free"
                ? "এনরোল প্রসেসিং হচ্ছে..."
                : "পেমেন্ট প্রসেসিং হচ্ছে..."}
            </p>
            <p className="text-lg text-gray-600">
              {course?.paymentType?.toLowerCase() === "free"
                ? "অনুগ্রহ করে অপেক্ষা করুন। আপনি ফ্রি কোর্সে এনরোল হচ্ছেন।"
                : "অনুগ্রহ করে অপেক্ষা করুন। আপনার পেমেন্ট গেটওয়েতে রিডাইরেক্ট হচ্ছে।"}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-[1000px] mx-auto py-2 my-4 bg-white shadow-md rounded-lg">
        <p className="py-2 m-2 font-bold">কমপ্লিট পেমেন্ট</p>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-2 p-2">
            {/* Course Info */}
            <div className="bg-white shadow-md overflow-hidden border border-gray-200 rounded-md">
              <div className="flex p-2 m-2 border gap-6 items-center rounded-md border-yellow-200 bg-yellow-50">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`}
                  alt="thumbnail"
                  className="rounded-lg w-[70px] h-[70px]"
                />
                <div>
                  <h1 className="text-md font-bold">{course.title}</h1>
                </div>
              </div>

              {/* Course Type Selection (only show if not free and no initial selection) */}
              {course.paymentType?.toLowerCase() !== "free" &&
                !initialCourseTypeId && (
                  <div className="p-4">
                    <h3 className="font-medium mb-3">
                      কোর্স টাইপ নির্বাচন করুন:
                    </h3>
                    <div className="space-y-2">
                      {course.types?.map((type) => (
                        <label
                          key={type._id}
                          className="flex items-center space-x-3"
                        >
                          <input
                            type="checkbox"
                            checked={selectedModes.includes(type.mode)}
                            onChange={() => handleCheckboxChange(type.mode)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="flex-1">
                            {type.mode} - ৳{type.salePrice || type.price}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

              {/* Payment Term */}
              {course.paymentType?.toLowerCase() !== "free" && (
                <div className="p-6">
                  <RadioGroup
                    value={selectedPayTerm}
                    onValueChange={setSelectedPayTerm}
                    className="space-y-2"
                  >
                    {course.payTerm?.includes("one-time") && (
                      <div className="flex items-center space-x-3 p-1 hover:bg-gray-50 rounded-lg transition-colors">
                        <RadioGroupItem value="one-time" id="one-time" />
                        <label
                          htmlFor="one-time"
                          className="cursor-pointer flex-1"
                        >
                          <div className="font-medium">এককালীন পেমেন্ট</div>
                          <p className="text-sm text-gray-600 mt-1">
                            সম্পূর্ণ কোর্স ফি একবারে পরিশোধ করুন
                          </p>
                        </label>
                      </div>
                    )}
                    {course.payTerm?.includes("milestone") &&
                      course.milestones?.length > 0 && (
                        <div className="flex items-center space-x-3 p-1 hover:bg-gray-50 rounded-lg transition-colors">
                          <RadioGroupItem value="milestone" id="milestone" />
                          <label
                            htmlFor="milestone"
                            className="cursor-pointer flex-1"
                          >
                            <div className="font-medium">
                              মাইলস্টোন ভিত্তিক ({course.milestones.length}{" "}
                              কিস্তি)
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              কোর্সের বিভিন্ন পর্যায়ে পেমেন্ট করুন
                            </p>
                          </label>
                        </div>
                      )}
                  </RadioGroup>
                </div>
              )}
            </div>

            {/* Milestones Section */}
            {selectedPayTerm === "milestone" &&
              course.milestones?.length > 0 && (
                <div className="bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
                  <div className="p-4 space-y-4">
                    <h3 className="font-medium">মাইলস্টোন বিবরণ:</h3>
                    {course.milestones.map((milestone, index) => {
                      const originalMilestoneAmount = Math.round(
                        baseAmount * (milestone.percentage / 100)
                      );
                      // Distribute discount proportionally across all milestones
                      const milestoneDiscount =
                        discountAmount > 0
                          ? Math.round(
                              (originalMilestoneAmount / baseAmount) *
                                discountAmount
                            )
                          : 0;
                      const milestoneAmount = Math.max(
                        0,
                        originalMilestoneAmount - milestoneDiscount
                      );

                      return (
                        <div
                          key={milestone._id || index}
                          className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              <span className="text-primary">
                                মাইলস্টোন {index + 1}:
                              </span>{" "}
                              {milestone.title || "Untitled"}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {milestone.percentage}% of total
                            </p>
                            {milestoneDiscount > 0 && (
                              <p className="text-sm text-green-600 mt-1">
                                কুপন অ্যাপ্লাই হয়েছে: -৳
                                {milestoneDiscount.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            {originalMilestoneAmount !== milestoneAmount && (
                              <p className="text-sm text-gray-500 line-through">
                                ৳{originalMilestoneAmount}
                              </p>
                            )}
                            <p className="text-green-600 font-bold">
                              ৳{milestoneAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>

          {/* Right Column */}
          <div className="space-y-6 p-2">
            {/* Coupon Section */}
            {course.paymentType?.toLowerCase() !== "free" && (
              <div className="bg-white shadow-md overflow-hidden border border-gray-200 rounded-md">
                <div className="p-6">
                  <h3 className="font-medium mb-4">কুপন কোড</h3>
                  {!appliedCoupon ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="কুপন কোড লিখুন"
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
                          "অ্যাপ্লাই"
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">
                          {appliedCoupon.code} অ্যাপ্লাই হয়েছে
                        </span>
                        <span className="text-green-600">
                          -৳{discountAmount.toFixed(2)}
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
            )}

            {/* Payment Summary */}
            <div className="bg-white shadow-md overflow-hidden border border-gray-200 rounded-md">
              <div className="p-6 space-y-4">
                <h3 className="font-medium">অর্ডার সামারি:</h3>

                {course.paymentType?.toLowerCase() === "free" ? (
                  <>
                    <div className="text-green-600 font-bold text-center text-lg py-4">
                      সম্পূর্ণ ফ্রি কোর্স!
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">পেমেন্ট পদ্ধতি:</span>
                      <span className="font-bold">ফ্রি</span>
                    </div>
                  </>
                ) : selectedPayTerm === "one-time" ? (
                  <>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">মূল মূল্য:</span>
                      <span className="text-gray-600">৳{baseAmount}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between py-2 border-b text-green-600">
                        <span>ডিসকাউন্ট ({appliedCoupon?.code}):</span>
                        <span className="font-bold">
                          -৳{discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">মোট পরিশোধযোগ্য:</span>
                      <span className="text-green-600 font-bold">
                        ৳{Math.max(0, baseAmount - discountAmount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">পেমেন্ট পদ্ধতি:</span>
                      <span className="font-bold">এককালীন পেমেন্ট</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">মূল মূল্য:</span>
                      <span className="text-gray-600">৳{baseAmount}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between py-2 border-b text-green-600">
                        <span>ডিসকাউন্ট ({appliedCoupon?.code}):</span>
                        <span className="font-bold">
                          -৳{discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">মোট পরিশোধযোগ্য:</span>
                      <span className="text-blue-600 font-bold">
                        ৳{Math.max(0, baseAmount - discountAmount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">প্রথম কিস্তি:</span>
                      <span className="text-green-600 font-bold">
                        ৳
                        {Math.max(
                          0,
                          firstMilestoneAmount - discountAmount
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">বাকি অর্থ:</span>
                      <span className="text-red-600 font-bold">
                        ৳{due.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">পেমেন্ট পদ্ধতি:</span>
                      <span className="font-bold">
                        মাইলস্টোন ({course.milestones?.length || 0} কিস্তি)
                      </span>
                    </div>
                  </>
                )}

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-start space-x-2 py-4 border-t">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-normal flex flex-wrap items-center cursor-pointer"
                  >
                    আমি{" "}
                    <Link
                      href="/terms-conditions"
                      className="text-blue-600 hover:underline mx-1"
                      target="_blank"
                    >
                      শর্তাবলী
                    </Link>
                    ,{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-blue-600 hover:underline whitespace-nowrap mx-1"
                      target="_blank"
                    >
                      গোপনীয়তা নীতি
                    </Link>
                    <span>, এবং </span>
                    <Link
                      href="/refund-policy"
                      className="text-blue-600 hover:underline whitespace-nowrap mx-1"
                      target="_blank"
                    >
                      ফেরত ও প্রত্যাবর্তন নীতি
                    </Link>{" "}
                    পড়েছি এবং গ্রহণ করেছি
                  </label>
                </div>

                <Button
                  onClick={handleEnroll}
                  className="w-full py-6 text-lg font-bold"
                  disabled={
                    isPaymentLoading ||
                    (selectedTypes.length === 0 &&
                      course?.paymentType?.toLowerCase() !== "free") ||
                    !termsAccepted
                  }
                >
                  {isPaymentLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      প্রসেসিং...
                    </>
                  ) : course?.paymentType?.toLowerCase() === "free" ? (
                    "এখনই এনরোল করুন"
                  ) : (
                    "পেমেন্ট করুন"
                  )}
                </Button>

                {selectedTypes.length === 0 &&
                  course?.paymentType?.toLowerCase() !== "free" && (
                    <p className="text-sm text-red-500 text-center mt-2">
                      এনরোল করতে কমপক্ষে একটি কোর্স টাইপ নির্বাচন করুন
                    </p>
                  )}

                {!termsAccepted && (
                  <p className="text-sm text-red-500 text-center mt-2">
                    শর্তাবলী গ্রহণ করতে হবে
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
