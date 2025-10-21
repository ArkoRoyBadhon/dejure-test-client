"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useResendOTPMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/learner.api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setToken, setUser } from "@/redux/features/auth/learnerSlice";
import { trackSignUp } from "@/lib/analytics";

const OTPModal = ({ isOpen, onClose, contactInfo, method }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  const [verifyOtp, { isLoading: isVerifying, error: verifyError }] =
    useVerifyOtpMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();

  useEffect(() => {
    let interval;
    if (timer > 0 && isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, isResendDisabled]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      // Focus previous input on backspace
      const prevInput = e.target.previousSibling;
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.info("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const payload =
        method === "email"
          ? { email: contactInfo, otp: otpCode }
          : { phone: contactInfo, otp: otpCode };

      const response = await verifyOtp(payload).unwrap();

      // Track successful sign up for simple registration
      if (response.learner) {
        trackSignUp(
          response.learner._id,
          "learner",
          response.learner.fullName || "",
          response.learner.email || "",
          response.learner.phone || ""
        );
      }

      // dispatch(setUser(response.learner));
      // dispatch(setToken(response.token));
      //   setLoginClick(false);
      //   router.push("/");
      toast.success("OTP verified successfully!");
      router.push("?otpVerified=true&emailorphone=" + contactInfo);
      onClose();
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const handleResend = async () => {
    try {
      const payload =
        method === "email" ? { email: contactInfo } : { phone: contactInfo };

      await resendOTP(payload).unwrap();
      setTimer(60);
      setIsResendDisabled(true);
      setOtp(["", "", "", "", "", ""]);
      toast.info("New OTP sent successfully!");
    } catch (error) {
      console.error("Resend OTP failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>

        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit code sent to your{" "}
          {method === "email" ? "email" : "phone"}
        </p>

        <p className="text-center font-semibold mb-6">{contactInfo}</p>

        <div className="flex justify-center space-x-2 mb-6">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={data}
              onChange={(e) => handleOtpChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              className="w-12 h-12 border-2 border-gray-300 rounded-md text-center text-xl focus:border-blue-500 focus:outline-none"
            />
          ))}
        </div>

        {verifyError && (
          <p className="text-red-500 text-center mb-4">
            {verifyError.data?.message || "Invalid OTP. Please try again."}
          </p>
        )}

        <Button
          onClick={handleVerify}
          disabled={isVerifying || otp.join("").length !== 6}
          className="w-full mb-4"
        >
          {isVerifying ? "Verifying..." : "Verify OTP"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the code?{" "}
            {isResendDisabled ? (
              <span>Resend in {timer}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending || isResendDisabled}
                className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;
