"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/redux/features/auth/learnerSlice";
import { useMentorLoginMutation } from "@/redux/features/auth/mentor.api";
import CustomCarousel from "@/app/(auth)/login/_components/CustomCarousel";

const MentorLoginComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mentorLogin] = useMentorLoginMutation();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMessage("");

    try {
      const response = await mentorLogin({
        emailOrPhone: loginData.email,
        password: loginData.password,
      }).unwrap();

      dispatch(setUser(response.mentor));
      dispatch(setToken(response.token));

      router.push("/mentor/dashboard");
    } catch (error) {
      setErrorMessage(error.data?.message || "Invalid credentials");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="h-full lg:h-[600px] flex flex-col md:flex-row w-full lg:w-[1000px] xl:w-[1200px] mx-auto border shadow2 rounded-[16px] bg-gray-50 overflow-hidden">
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
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 overflow-y-auto no-scrollbar relative">
        <div className="w-full p-4 sm:p-8 md:p-6 lg:p-8">
          <div className="space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
              মেন্টর লগিন
            </h1>

            {errorMessage && (
              <div className="p-3 text-center text-sm text-red-600 bg-red-50 rounded-md">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <Input
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="মেন্টর ইমেইল"
                  className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
                  required
                />
              </div>

              <div>
                <Input
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="পাসওয়ার্ড"
                  className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[24px] rounded-[16px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue hover:bg-main-dark text-white font-medium py-3 sm:py-4 rounded-[16px] h-12 sm:h-[56px]"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "লগিন হচ্ছে..." : "লগিন করুন"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorLoginComponent;
