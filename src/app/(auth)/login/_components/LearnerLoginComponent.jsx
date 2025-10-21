"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Image from "next/image";
import {
  useLearnerCheckerMutation,
  useLearnerLoginMutation,
  useSetupPasswordMutation,
  useVerifyOtpMutation,
  useResendOTPMutation,
  useForceLogoutOtherSessionMutation,
} from "@/redux/features/auth/learner.api";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/redux/features/auth/learnerSlice";
import CustomCarousel from "./CustomCarousel";
import LearnerRegisterComponent from "./LearnerRegisterComponent";
import { toast } from "sonner";
import Link from "next/link";
import { trackLogin } from "@/lib/analytics";

export default function LearnerLoginComponent({
  setLoginClick,
  redirectUrl = "/dashboard",
  prefilledContact = null,
  onClose = () => {},
  onLoginSuccess = null,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showOtpAfterRegistration = searchParams.get("otp") === "true";
  const otpVerified = searchParams.get("otpVerified") === "true";
  const emailOrPhoneFromUrl = searchParams.get("emailorphone");
  const phoneFromUrl = searchParams.get("phone");
  const emailFromUrl = searchParams.get("email");
  const [activeTab, setActiveTab] = useState("login");
  const [loginStep, setLoginStep] = useState("identifier");
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [isForceLoggingOut, setIsForceLoggingOut] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [registeredEmailOrPhone, setRegisteredEmailOrPhone] = useState("");

  const [loginData, setLoginData] = useState({
    fullName: "",
    emailOrPhone: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
    forceLogoutPassword: "",
  });

  const isMountedRef = useRef(true);
  const dispatch = useDispatch();
  const [learnerChecker] = useLearnerCheckerMutation();
  const [learnerLogin] = useLearnerLoginMutation();
  const [setPassword] = useSetupPasswordMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOTP] = useResendOTPMutation();
  const [forceLogoutOtherSession] = useForceLogoutOtherSessionMutation();

  // Check for OTP verified URL parameters on component mount
  useEffect(() => {
    if (otpVerified && emailOrPhoneFromUrl) {
      setLoginData((prev) => ({
        ...prev,
        emailOrPhone: emailOrPhoneFromUrl,
      }));
      setLoginStep("setup-password");
      setActiveTab("login");
      setRegisteredEmailOrPhone(emailOrPhoneFromUrl);
    }
  }, [otpVerified, emailOrPhoneFromUrl]);

  // Handle phone/email query parameters from registration redirect
  useEffect(() => {
    if (phoneFromUrl || emailFromUrl) {
      const contactInfo = phoneFromUrl || emailFromUrl;
      setLoginData((prev) => ({
        ...prev,
        emailOrPhone: contactInfo,
      }));
      setLoginStep("password"); // Skip directly to password step
      setActiveTab("login");
    }
  }, [phoneFromUrl, emailFromUrl]);

  // Handle prefilled contact from HomePageHero
  useEffect(() => {
    if (prefilledContact) {
      setLoginData((prev) => ({
        ...prev,
        emailOrPhone: prefilledContact.contactInfo,
      }));
      setLoginStep("password"); // Skip directly to password step
      setActiveTab("login");
    }
  }, [prefilledContact]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Countdown timer effect with proper cleanup
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

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const safeSetState = useCallback((setter, value) => {
    if (isMountedRef.current) {
      setter(value);
    }
  }, []);

  const closeLogin = useCallback(() => {
    if (isMountedRef.current) {
      setLoginClick(false);
      onClose(); // Clear prefilled contact
      router.push("/");
    }
  }, [setLoginClick, onClose]);

  const handleIdentifierSubmit = async (e) => {
    e.preventDefault();
    safeSetState(setIsChecking, true);
    safeSetState(setErrorMessage, "");

    try {
      const response = await learnerChecker({
        emailOrPhone: loginData.emailOrPhone,
      }).unwrap();

      if (isMountedRef.current) {
        if (response.exists && response.isOTPVerified) {
          safeSetState(
            setLoginStep,
            response.requiresPasswordSetup ? "setup-password" : "password"
          );
        } else {
          safeSetState(setActiveTab, "register");
          safeSetState(setLoginData, (prev) => ({
            ...prev,
            emailOrPhone: loginData.emailOrPhone,
          }));
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        safeSetState(setActiveTab, "register");
        safeSetState(setLoginData, (prev) => ({
          ...prev,
          emailOrPhone: loginData.emailOrPhone,
        }));
      }
    } finally {
      if (isMountedRef.current) {
        safeSetState(setIsChecking, false);
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    safeSetState(setIsLoggingIn, true);
    safeSetState(setErrorMessage, "");

    try {
      const response = await learnerLogin({
        emailOrPhone: loginData.emailOrPhone,
        password: loginData.password,
      }).unwrap();

      if (isMountedRef.current) {
        if (!response.learner.isOTPVerified) {
          safeSetState(setLoginStep, "otp-verification");
          safeSetState(setRegisteredEmailOrPhone, loginData.emailOrPhone);
          safeSetState(setCountdown, 180);
          toast.info("Please verify your OTP to complete login.");
        } else {
          dispatch(setUser(response.learner));
          dispatch(setToken(response.token));

          // Track successful login
          trackLogin(
            response.learner._id,
            "learner",
            loginData.emailOrPhone.includes("@") ? "email" : "phone"
          );

          closeLogin();
          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            router.push(redirectUrl);
          }
          toast.success("Login successful!");
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        if (error.status === 409) {
          safeSetState(setLoginStep, "force-logout");
          toast.warning("You're already logged in on another device.");
        } else if (error.data?.requiresPasswordSetup) {
          safeSetState(setLoginStep, "setup-password");
        } else if (error.data?.requiresOtpVerification) {
          safeSetState(setLoginStep, "otp-verification");
          safeSetState(setRegisteredEmailOrPhone, loginData.emailOrPhone);
          safeSetState(setCountdown, 180);
          toast.info("Please verify your OTP to complete login.");
        } else {
          safeSetState(
            setErrorMessage,
            error.data?.message || "Invalid credentials. Please try again."
          );
        }
      }
    } finally {
      if (isMountedRef.current) {
        safeSetState(setIsLoggingIn, false);
      }
    }
  };

  const handleForceLogout = async (e) => {
    e.preventDefault();
    safeSetState(setIsForceLoggingOut, true);
    safeSetState(setErrorMessage, "");

    try {
      const response = await forceLogoutOtherSession({
        emailOrPhone: loginData.emailOrPhone,
        // password: loginData.forceLogoutPassword,
        password: loginData.password,
      }).unwrap();

      if (isMountedRef.current) {
        if (response.success) {
          toast.success(
            "Other session logged out successfully. You can now login."
          );
          safeSetState(setLoginStep, "password");
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        safeSetState(
          setErrorMessage,
          error.data?.message ||
            "Failed to logout other session. Please try again."
        );
      }
    } finally {
      if (isMountedRef.current) {
        safeSetState(setIsForceLoggingOut, false);
      }
    }
  };

  const handlePasswordSetup = async (e) => {
    e.preventDefault();
    safeSetState(setIsSettingPassword, true);
    safeSetState(setErrorMessage, "");

    if (loginData.newPassword !== loginData.confirmPassword) {
      safeSetState(setErrorMessage, "Passwords do not match");
      safeSetState(setIsSettingPassword, false);
      return;
    }

    try {
      const response = await setPassword({
        fullName: loginData.fullName,
        emailOrPhone: loginData.emailOrPhone,
        password: loginData.newPassword,
        confirmPassword: loginData.confirmPassword,
      }).unwrap();

      // After setting password, transition to OTP verification
      if (isMountedRef.current) {
        safeSetState(setRegisteredEmailOrPhone, loginData.emailOrPhone);
        if (!response?.learner?.isOTPVerified) {
          safeSetState(setLoginStep, "otp-verification");
          safeSetState(setCountdown, 180);
          toast.info("Please verify your OTP to complete registration.");
        } else {
          // Track successful login after password setup
          trackLogin(
            response.learner._id,
            "learner",
            loginData.emailOrPhone.includes("@") ? "email" : "phone"
          );

          toast.success("Login successfully");
          dispatch(setUser(response.learner));
          dispatch(setToken(response.token));
          closeLogin();
          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            router.push(redirectUrl);
          }
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        safeSetState(
          setErrorMessage,
          error.data?.message || "Failed to set password"
        );
      }
    } finally {
      if (isMountedRef.current) {
        safeSetState(setIsSettingPassword, false);
      }
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    safeSetState(setIsVerifyingOtp, true);
    safeSetState(setErrorMessage, "");

    try {
      const response = await verifyOtp({
        email: registeredEmailOrPhone,
        otp: loginData.otp,
      }).unwrap();

      if (isMountedRef.current) {
        // Track successful login after OTP verification
        trackLogin(
          response.learner._id,
          "learner",
          registeredEmailOrPhone.includes("@") ? "email" : "phone"
        );

        dispatch(setUser(response.learner));
        dispatch(setToken(response.token));
        closeLogin();
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          router.push(redirectUrl);
        }
        toast.success("OTP verified successfully!");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Invalid OTP. Please try again.");
      if (isMountedRef.current) {
        // Handle OTP expiration specifically
        if (
          error.data?.message?.includes("expired") ||
          error.data?.message?.includes("invalid")
        ) {
          safeSetState(
            setErrorMessage,
            "OTP has expired. Please request a new one."
          );
          safeSetState(setCountdown, 0); // Reset countdown to allow resend
        } else {
          safeSetState(
            setErrorMessage,
            error.data?.message || "Invalid OTP. Please try again."
          );
        }
      }
    } finally {
      if (isMountedRef.current) {
        safeSetState(setIsVerifyingOtp, false);
      }
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return; // Prevent multiple calls while countdown is active

    safeSetState(setIsResendingOtp, true);
    safeSetState(setErrorMessage, "");

    try {
      await resendOTP({ email: registeredEmailOrPhone }).unwrap();
      if (isMountedRef.current) {
        safeSetState(setCountdown, 180); // Reset to 3 minutes
        safeSetState(setLoginData, (prev) => ({ ...prev, otp: "" })); // Clear previous OTP
        toast.success("New OTP sent successfully!");
      }
    } catch (error) {
      if (isMountedRef.current) {
        safeSetState(
          setErrorMessage,
          error.data?.message || "Failed to resend OTP. Please try again."
        );
      }
    } finally {
      if (isMountedRef.current) {
        safeSetState(setIsResendingOtp, false);
      }
    }
  };

  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const resetLoginFlow = () => {
    if (isMountedRef.current) {
      setLoginStep("identifier");
      setCountdown(0); // Reset countdown
      setLoginData({
        emailOrPhone: loginData.emailOrPhone,
        password: "",
        newPassword: "",
        confirmPassword: "",
        otp: "",
        forceLogoutPassword: "",
      });
      setErrorMessage("");
    }
  };

  const handleRegistrationSuccess = (emailOrPhone) => {
    if (isMountedRef.current) {
      if (showOtpAfterRegistration) {
        setShowOtpVerification(true);
        setRegisteredEmailOrPhone(emailOrPhone);
        setActiveTab("login");
        setLoginStep("otp-verification");
        setCountdown(180);
      } else {
        // If no OTP required, call onLoginSuccess callback
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    }
  };

  return (
    <div className="h-full lg:h-[600px] z-[999] flex flex-col md:flex-row w-full lg:w-[1000px] xl:w-[1200px] mx-auto border shadow2 rounded-[16px] bg-gray-50 overflow-hidden">
      {/* Left side - Carousel */}
      <div className="hidden md:flex md:w-1/2 relative min-h-[300px] md:min-h-full">
        <Image
          src="/assets/image/login-bg.png"
          alt="Background"
          fill
          className="object-cover z-0"
        />
        <div className="absolute inset-0 gradientColor opacity-5 z-10" />
        <CustomCarousel />
      </div>

      {/* Right side - Form */}
      <div
        className={`w-full max-h-screen md:w-1/2 flex items-center justify-center p-4 md:p-8 ${
          activeTab === "register"
            ? showOtpVerification || loginStep === "otp-verification"
              ? "md:pt-[300px]"
              : ""
            : ""
        } overflow-y-auto no-scrollbar relative`}
      >
        <button
          onClick={closeLogin}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer "
          aria-label="Close login"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="w-full p-4 sm:p-8 md:p-6 lg:p-8 mt-4 ">
          <div className="">
            <h1
              className={`text-xl sm:text-2xl font-bold text-center text-gray-800 ${
                showOtpVerification || loginStep === "otp-verification"
                  ? "mt-8"
                  : activeTab === "login"
                  ? loginStep === "identifier"
                    ? "mt-8"
                    : loginStep === "setup-password"
                    ? "mt-8"
                    : loginStep === "force-logout"
                    ? "mt-8"
                    : "mt-8"
                  : "mt-20"
              }`}
            >
              {showOtpVerification || loginStep === "otp-verification"
                ? "OTP যাচাই করুন"
                : activeTab === "login"
                ? loginStep === "identifier"
                  ? "একাউন্টে লগিন করুন"
                  : loginStep === "setup-password"
                  ? "প্রোফাইল সেট করুন"
                  : loginStep === "force-logout"
                  ? "সেশন কনফ্লিক্ট"
                  : "পাসওয়ার্ড দিন"
                : "নতুন একাউন্ট তৈরি করুন"}
            </h1>

            {!showOtpVerification &&
              activeTab === "login" &&
              loginStep !== "setup-password" &&
              loginStep !== "otp-verification" &&
              loginStep !== "force-logout" && (
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => {
                      setActiveTab("login");
                      resetLoginFlow();
                    }}
                    className={`flex-1 py-2 sm:py-[12px] px-2 text-sm sm:text-base font-medium transition-colors text-darkColor rounded-[14px] ${
                      activeTab === "login" ? "bg-main shadow-sm" : ""
                    }`}
                  >
                    লগিন
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("register");
                      resetLoginFlow();
                    }}
                    className={`flex-1 py-2 sm:py-[12px] px-2 text-sm sm:text-base font-medium transition-colors text-darkColor rounded-[14px] ${
                      activeTab === "register" ? "bg-main shadow-sm" : ""
                    }`}
                  >
                    নতুন একাউন্ট
                  </button>
                </div>
              )}

            {errorMessage && (
              <div className="p-3 text-center text-sm text-red-600 bg-red-50 rounded-md">
                {errorMessage}
              </div>
            )}

            {showOtpVerification || loginStep === "otp-verification" ? (
              <form onSubmit={handleOtpVerification} className="space-y-4">
                <div className="text-center text-sm text-gray-600">
                  <p>আমরা একটি OTP পাঠিয়েছি: {registeredEmailOrPhone}</p>
                  <p>দয়া করে OTP টি প্রবেশ করুন</p>
                  {countdown === 0 && (
                    <p className="text-red-500 mt-2">
                      OTP has expired. Please request a new one.
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    name="otp"
                    type="text"
                    value={loginData.otp}
                    onChange={handleLoginChange}
                    placeholder="OTP দিন"
                    className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
                    required
                    disabled={countdown === 0}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue hover:bg-main-dark text-white font-medium py-2 h-12 sm:h-[56px]"
                  disabled={isVerifyingOtp || countdown === 0}
                >
                  {isVerifyingOtp
                    ? "Verifying..."
                    : countdown === 0
                    ? "OTP Expired"
                    : "OTP যাচাই করুন"}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  OTP পাইনি?{" "}
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

                {countdown === 0 && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={resetLoginFlow}
                      className="text-sm text-main hover:text-main-dark underline"
                    >
                      Back to login
                    </button>
                  </div>
                )}
              </form>
            ) : loginStep === "force-logout" ? (
              <form onSubmit={handleForceLogout} className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <h3 className="font-medium text-yellow-800">
                    সেশন কনফ্লিক্ট
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    আপনি ইতিমধ্যে অন্য একটি ডিভাইসে লগইন আছেন। অন্য ডিভাইস থেকে
                    লগআউট করতে আপনার পাসওয়ার্ড দিন।
                  </p>
                </div>

                {/* <div>
                  <Input
                    name="forceLogoutPassword"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="পাসওয়ার্ড দিন"
                    className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
                    required
                  />
                </div> */}

                <Button
                  type="submit"
                  className="w-full bg-blue hover:bg-main-dark text-white font-medium py-2 h-12 sm:h-[56px]"
                  disabled={isForceLoggingOut}
                >
                  {isForceLoggingOut
                    ? "Processing..."
                    : "অন্যান্য সেশন থেকে লগআউট করুন"}
                </Button>

                <button
                  type="button"
                  onClick={resetLoginFlow}
                  className="w-full text-center text-sm text-main hover:text-main-dark underline"
                >
                  অন্য একাউন্ট ব্যবহার করুন
                </button>
              </form>
            ) : activeTab === "login" ? (
              <div className="space-y-4">
                {loginStep === "identifier" ? (
                  <form onSubmit={handleIdentifierSubmit} className="space-y-4">
                    <div>
                      <Input
                        name="emailOrPhone"
                        type="text"
                        value={loginData.emailOrPhone}
                        onChange={handleLoginChange}
                        placeholder="ফোন নাম্বার বা ইমেইল দিন"
                        className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue text-white font-medium py-3 sm:py-4 rounded-[16px] h-12 sm:h-[56px]"
                      disabled={isChecking}
                    >
                      {isChecking ? "Checking..." : "এগিয়ে যাই"}
                    </Button>
                  </form>
                ) : loginStep === "password" ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">
                        লগইন করছেন: {loginData.emailOrPhone}
                      </p>
                      <button
                        type="button"
                        onClick={resetLoginFlow}
                        className="text-sm text-main hover:text-main-dark underline"
                      >
                        পরিবর্তন করুন
                      </button>
                    </div>

                    <div>
                      <Input
                        name="password"
                        type="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="পাসওয়ার্ড দিন"
                        className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue hover:bg-main-dark text-white font-medium py-2 h-12 sm:h-[56px]"
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? "Logging in..." : "লগিন করুন"}
                    </Button>

                    <div className="text-center">
                      <Link
                        href={"/forgot-password"}
                        type="button"
                        className="text-sm text-main hover:text-main-dark underline"
                        onClick={closeLogin}
                      >
                        পাসওয়ার্ড ভুলে গেছেন?
                      </Link>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordSetup} className="space-y-4">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">
                        প্রোফাইল সেট করছেন: {loginData.emailOrPhone}
                      </p>
                      <button
                        type="button"
                        onClick={resetLoginFlow}
                        className="text-sm text-main hover:text-main-dark underline"
                      >
                        পরিবর্তন করুন
                      </button>
                    </div>

                    <div>
                      <Input
                        name="fullName"
                        type="text"
                        value={loginData.fullName}
                        onChange={handleLoginChange}
                        placeholder=" পূর্ণ নাম"
                        className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
                        required
                      />
                    </div>
                    <div>
                      <Input
                        name="newPassword"
                        type="password"
                        value={loginData.newPassword}
                        onChange={handleLoginChange}
                        placeholder="নতুন পাসওয়ার্ড"
                        className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
                        required
                      />
                    </div>

                    <div>
                      <Input
                        name="confirmPassword"
                        type="password"
                        value={loginData.confirmPassword}
                        onChange={handleLoginChange}
                        placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                        className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue hover:bg-main-dark text-white font-medium py-2 h-12 sm:h-[56px]"
                      disabled={isSettingPassword}
                    >
                      {isSettingPassword
                        ? "Setting up..."
                        : "প্রোফাইল সেট করুন"}
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <LearnerRegisterComponent
                setActiveTab={setActiveTab}
                setLoginClick={setLoginClick}
                onRegistrationSuccess={handleRegistrationSuccess}
                showOtpAfterRegistration={showOtpAfterRegistration}
                prefilledEmailOrPhone={loginData.emailOrPhone}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
