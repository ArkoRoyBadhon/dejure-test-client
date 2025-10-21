"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/redux/features/auth/learner.api";

export default function ForgotPasswordPage({ setLoginClick }) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await forgotPassword({ phone }).unwrap();

      if (response.message) {
        setSuccess(true);
        toast.success("OTP sent to your phone!");
      }
    } catch (error) {
      setErrorMessage(
        error.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setLoginClick(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Check Your Phone
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a password reset OTP to {phone}. Please check your SMS
              and follow the instructions.
            </p>
          </div>

          <div className="mt-6">
            <Button
              onClick={() =>
                router.push(
                  `/reset-password?phone=${encodeURIComponent(phone)}`
                )
              }
              className="w-full bg-blue hover:bg-main-dark text-white font-medium py-2 h-12"
            >
              Reset Password
            </Button>

            <Button
              onClick={handleBackToLogin}
              variant="outline"
              className="w-full mt-4 border-gray-300 text-gray-700 font-medium py-2 h-12"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your phone number and we'll send you an OTP to reset your
            password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
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
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-sm text-main hover:text-main-dark underline"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
