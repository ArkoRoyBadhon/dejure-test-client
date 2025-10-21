"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Image from "next/image";
import {
  useLearnerRegisterMutation,
  useVerifyOtpMutation,
  useResendOTPMutation, // Import the resend OTP mutation
} from "@/redux/features/auth/learner.api";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/redux/features/auth/learnerSlice";
import { toast } from "sonner";
import { trackSignUp } from "@/lib/analytics";

export default function LearnerRegisterComponent({
  setActiveTab,
  setLoginClick,
  redirectUrl = "/dashboard",
  prefilledEmailOrPhone = "", // Add this prop to receive pre-filled data
  onRegistrationSuccess = null,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0); // Countdown state
  const [LearnerRegister] = useLearnerRegisterMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOTP] = useResendOTPMutation(); // Resend OTP mutation
  const [registerData, setRegisterData] = useState({
    fullName: "",
    phone:
      prefilledEmailOrPhone && !prefilledEmailOrPhone.includes("@")
        ? prefilledEmailOrPhone
        : "",
    email:
      prefilledEmailOrPhone && prefilledEmailOrPhone.includes("@")
        ? prefilledEmailOrPhone
        : "",
    password: "",
    confirmPassword: "",
    shippingAddress: "",
    profileImage: null,
  });
  const [profilePreview, setProfilePreview] = useState(null);

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

  useEffect(() => {
    if (registerData.profileImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(registerData.profileImage);
    } else {
      setProfilePreview(null);
    }
  }, [registerData.profileImage]);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleFileUpload = (type, e) => {
    if (e.target.files && e.target.files[0]) {
      setRegisterData((prev) => ({
        ...prev,
        [type]: e.target.files[0],
      }));
    }
  };

  const handleRemoveFile = (type) => {
    setRegisterData((prev) => ({
      ...prev,
      [type]: null,
    }));
    if (type === "profileImage") {
      setProfilePreview(null);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage("Passwords don't match!");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", registerData.fullName);
    formData.append("phone", registerData.phone);
    formData.append("email", registerData.email);
    formData.append("password", registerData.password);
    formData.append("shippingAddress", registerData.shippingAddress);
    if (registerData.profileImage) {
      formData.append("image", registerData.profileImage);
    }

    try {
      const response = await LearnerRegister(formData).unwrap();

      if (response) {
        // Always show OTP verification after registration
        setRegistrationSuccess(true);
        setRegisteredEmail(registerData.phone || registerData.email);
        setCountdown(180); // Start 3-minute countdown (180 seconds)
        toast.success("Please verify OTP.");
      } else {
        setErrorMessage(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error?.data?.message + " or use another phone/email" ||
          "Something Went Wrong!"
      );
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsVerifyingOtp(true);
    setErrorMessage("");

    try {
      const isEmail = registeredEmail.includes("@");

      const payload = isEmail
        ? {
            email: registeredEmail.trim(),
            otp: otp,
          }
        : {
            phone: registeredEmail.trim(),
            otp: otp,
          };

      const response = await verifyOtp(payload).unwrap();

      // Set user and token after successful OTP verification
      dispatch(setUser(response.learner));
      dispatch(setToken(response.token));

      // Track successful sign up
      trackSignUp(
        response.learner._id,
        "learner",
        response.learner.fullName || "",
        response.learner.email || "",
        response.learner.phone || ""
      );

      setLoginClick(false);
      if (onRegistrationSuccess) {
        onRegistrationSuccess(registeredEmail);
      } else {
        router.push(redirectUrl);
      }
      toast.success("OTP verified successfully!");
    } catch (error) {
      setErrorMessage(error.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return; // Prevent multiple calls while countdown is active

    setIsResendingOtp(true);
    setErrorMessage("");

    try {
      await resendOTP({ email: registeredEmail }).unwrap();
      setCountdown(180); // Reset countdown to 3 minutes
      toast.success("New OTP sent successfully!");
    } catch (error) {
      setErrorMessage(
        error.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setIsResendingOtp(false);
    }
  };

  // Format countdown to MM:SS
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Show OTP verification form after successful registration
  if (registrationSuccess) {
    return (
      <form onSubmit={handleOtpVerification} className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">OTP Verification</h2>
          <p className="text-sm text-gray-600 mt-2">
            We've sent an OTP to: {registeredEmail}
          </p>
        </div>

        <div>
          <Input
            name="otp"
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter OTP"
            className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
            required
          />
        </div>

        {errorMessage && (
          <div className="p-3 text-center text-sm text-red-600 bg-red-50 rounded-md">
            {errorMessage}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-blue hover:bg-main-dark text-white rounded-[16px] font-medium h-12 sm:h-[56px]"
          disabled={isVerifyingOtp}
        >
          {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
        </Button>

        <div className="text-center text-sm text-gray-600">
          Didn't receive OTP?{" "}
          <button
            type="button"
            className="text-main hover:text-main-dark underline disabled:text-gray-400 disabled:cursor-not-allowed"
            onClick={handleResendOtp}
            disabled={countdown > 0 || isResendingOtp}
          >
            {isResendingOtp ? "Sending..." : "Resend OTP"}
            {countdown > 0 && ` (${formatCountdown(countdown)})`}
          </button>
        </div>
      </form>
    );
  }

  // Show registration form by default
  return (
    <form onSubmit={handleRegisterSubmit} className="space-y-4">
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex flex-col items-center justify-center border-2 border-dashed bg-gray1 border-gray-300 rounded-full cursor-pointer hover:border-main transition-colors h-[120px] w-[120px] overflow-hidden">
                {profilePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={profilePreview || "/assets/icons/avatar.png"}
                      alt="Profile preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile("profileImage")}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Image
                      src="/assets/icons/avatar.png"
                      alt="profile preview"
                      width={52}
                      height={52}
                      className="w-[120px] h-[120px] object-cover rounded-md"
                    />
                  </>
                )}
              </div>
              <div className="mt-2 sm:mt-4 text-center sm:text-left">
                <div className="cursor-pointer border px-4 py-2 text-[14px] font-bold text-darkColor rounded-[16px] hover:bg-gray-200">
                  প্রোফাইল আপলোড করুন
                </div>
                <p className="max-w-[255px] text-[12px] sm:text-[14px] mt-2 text-gray-400">
                  At least 800x800 px recommended. JPG or PNG is allowed
                </p>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload("profileImage", e)}
                />
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Input
            name="fullName"
            type="text"
            value={registerData.fullName}
            onChange={handleRegisterChange}
            placeholder="সম্পূর্ণ নাম দিন"
            className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
            required
          />
        </div>

        <div>
          <Input
            name="phone"
            type="tel"
            value={registerData.phone}
            onChange={handleRegisterChange}
            placeholder="ফোন নাম্বার"
            className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
            required
          />
        </div>

        <div>
          <Input
            name="email"
            type="email"
            value={registerData.email}
            onChange={handleRegisterChange}
            placeholder="ইমেইল (optional)"
            className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
            // required
          />
        </div>

        <div>
          <Input
            name="password"
            type="password"
            value={registerData.password}
            onChange={handleRegisterChange}
            placeholder="পাসওয়ার্ড দিন"
            className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
            required
          />
        </div>

        <div>
          <Input
            name="confirmPassword"
            type="password"
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            placeholder="পাসওয়ার্ড নিশ্চিত করুন"
            className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
            required
          />
        </div>

        <div>
          <Input
            name="shippingAddress"
            type="text"
            value={registerData.shippingAddress}
            onChange={handleRegisterChange}
            placeholder="শিপিং এড্রেস দিন (optional)"
            className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
            // required
          />
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 text-center text-sm text-red-600 bg-red-50 rounded-md">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-blue hover:bg-main-dark text-white rounded-[16px] font-medium h-12 sm:h-[56px]"
      >
        রেজিস্টার করুন
      </Button>

      <div className="text-center text-sm text-gray-600">
        ইতিমধ্যে একাউন্ট আছে?{" "}
        <button
          type="button"
          onClick={() => setActiveTab("login")}
          className="text-main hover:text-main-dark underline"
        >
          লগিন করুন
        </button>
      </div>
    </form>
  );
}
