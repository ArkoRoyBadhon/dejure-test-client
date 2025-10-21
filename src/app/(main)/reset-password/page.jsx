"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useResetPasswordMutation,
  useVerifyResetOtpMutation,
} from "@/redux/features/auth/learner.api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneFromUrl = searchParams.get("phone");

  const [step, setStep] = useState("otp"); // 'otp' or 'password'
  const [phone, setPhone] = useState(phoneFromUrl || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resetPassword] = useResetPasswordMutation();
  const [verifyResetOtp] = useVerifyResetOtpMutation();

  // Countdown timer effect
  useEffect(() => {
    let intervalId = null;

    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [countdown]);

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await verifyResetOtp({ phone, otp }).unwrap();

      if (response.valid) {
        setStep("password");
        toast.success("OTP verified successfully!");
      }
    } catch (error) {
      setErrorMessage(error.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await resetPassword({
        phone,
        otp,
        newPassword,
        confirmPassword,
      }).unwrap();

      if (response.message) {
        toast.success("Password reset successfully!");
        // setLoginClick(true);
        router.push("/");
      }
    } catch (error) {
      setErrorMessage(
        error.data?.message || "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  //   const handleBackToLogin = () => {
  //     router
  //   };

  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            {step === "otp" ? "Verify OTP" : "Set New Password"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === "otp"
              ? "Enter the OTP sent to your phone"
              : "Create a new password for your account"}
          </p>
        </div>

        {step === "otp" ? (
          <form className="mt-8 space-y-6" onSubmit={handleOtpVerification}>
            <div>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full bg-gray1 px-4 py-3 rounded-[16px] mb-4"
                required
                disabled={!!phoneFromUrl}
              />
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full bg-gray1 px-4 py-3 rounded-[16px]"
                required
              />
            </div>

            {errorMessage && (
              <div className="p-3 text-center text-sm text-red-600 bg-red-50 rounded-md">
                {errorMessage}
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full bg-blue hover:bg-main-dark text-white font-medium py-2 h-12"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Didn't receive OTP?{" "}
              <button
                type="button"
                className="text-main hover:text-main-dark underline disabled:text-gray-400 disabled:cursor-not-allowed"
                disabled={countdown > 0}
              >
                Resend OTP
                {countdown > 0 && ` (${formatCountdown(countdown)})`}
              </button>
            </div>

            {/* <div className="text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm text-main hover:text-main-dark underline"
              >
                Back to Login
              </button>
            </div> */}
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
            <div className="space-y-4">
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full bg-gray1 px-4 py-3 rounded-[16px]"
                required
                minLength={6}
              />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-gray1 px-4 py-3 rounded-[16px]"
                required
                minLength={6}
              />
            </div>

            {errorMessage && (
              <div className="p-3 text-center text-sm text-red-600 bg-red-50 rounded-md">
                {errorMessage}
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full bg-blue hover:bg-main-dark text-white font-medium py-2 h-12"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("otp")}
                className="text-sm text-main hover:text-main-dark underline"
              >
                Back to OTP verification
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
