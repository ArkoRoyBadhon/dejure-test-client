"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import HomePageSlider from "./HomePageSlider";
import HeroStats from "./HeroStats";
import {
  useGetAllHomeManagesQuery,
  useGetAllHomeManagesPublicQuery,
} from "@/redux/features/WebManage/HomeManage.api";
import { motion, AnimatePresence } from "framer-motion";
import { useLearnerSimpleRegisterMutation } from "@/redux/features/auth/learner.api";
import OTPModal from "./_activity/OTPModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { isTokenExpired } from "@/Utils/tokenUtils";

// Skeleton loader components (keep the same as before)
const TitleSkeleton = () => (
  <div className="space-y-4 hidden md:block">
    <div className="h-12 bg-gray-200 rounded animate-pulse w-3/4"></div>
    <div className="h-12 bg-gray-200 rounded animate-pulse w-4/5 mt-4"></div>
  </div>
);

const MobileTitleSkeleton = () => (
  <div className="space-y-3 sm:space-y-4 block md:hidden">
    <div className="h-8 sm:h-10 bg-gray-200 rounded animate-pulse w-full"></div>
    <div className="h-8 sm:h-10 bg-gray-200 rounded animate-pulse w-full"></div>
    <div className="h-8 sm:h-10 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
  </div>
);

const SubtitleSkeleton = () => (
  <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
);

const InputSkeleton = () => (
  <div className="w-full sm:w-[90%] md:w-[75%] h-12 sm:h-14 bg-gray-100 rounded-2xl animate-pulse"></div>
);

const StatsSkeleton = () => (
  <div className="mx-auto max-w-[1200px] px-4 md:px-0">
    <div className="w-full bg-white rounded-2xl shadow-[0px_8px_40px_rgba(0,0,0,0.1)] p-10 -translate-y-1/6 lg:-translate-y-2/4 relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-8 text-center">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center relative px-4 ${
              index === 2 ? "col-span-2 md:col-auto" : ""
            }`}
          >
            <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mt-4"></div>
            {index !== 4 && (
              <div
                className={`absolute right-0 top-1/2 -translate-y-1/2 h-full w-px bg-gray3 ${
                  index === 2 ? "hidden md:block" : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function HomePageHero() {
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);

  // Smart data loading - try authenticated first, fallback to public
  const {
    data: homeManageData,
    isLoading: isLoadingAuth,
    error: errorAuth,
  } = useGetAllHomeManagesQuery(undefined, {
    skip: !token || isTokenExpired(token), // Skip if no token or expired
  });

  const {
    data: homeManageDataPublic,
    isLoading: isLoadingPublic,
    error: errorPublic,
  } = useGetAllHomeManagesPublicQuery(undefined, {
    skip: token && !isTokenExpired(token), // Skip if we have valid token
  });

  // Determine which data to use
  const isLoading = isLoadingAuth || isLoadingPublic;
  const error = errorAuth || errorPublic;
  const homeManageDataToUse = homeManageData || homeManageDataPublic;
  const [simpleRegister, { isLoading: isRegistering }] =
    useLearnerSimpleRegisterMutation();

  // Fallback data for when API fails or token is expired
  const fallbackData = {
    title: "ডিজুরি একাডেমি",
    subTitle: "বাংলাদেশের সেরা অনলাইন শিক্ষা প্ল্যাটফর্ম",
    sliderImage1: "/assets/image/education_concept.png",
    sliderImage2: "/assets/image/education_concept.png",
    sliderImage3: "/assets/image/education_concept.png",
    studentCount: "১০০০০+",
    mentorCount: "১০০+",
    materialCount: "৫০০+",
    bcsCount: "৯৫%",
    liveClassCount: "৫০+",
    barCount: "৮০%",
    liveExamCount: "২০০+",
  };

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    sliderImage1: "",
    sliderImage2: "",
    sliderImage3: "",
    studentCount: "",
    mentorCount: "",
    materialCount: "",
    bcsCount: "",

    liveClassCount: "",
    barCount: "",
    liveExamCount: "",
  });

  // Set form data when API data is available or use fallback
  useEffect(() => {
    let dataToUse = fallbackData;

    // Use API data if available (either authenticated or public)
    if (homeManageDataToUse && homeManageDataToUse.length > 0) {
      dataToUse = homeManageDataToUse[0];
      console.log("Using API data for landing page:", dataToUse.title);
    } else {
      console.log("Using fallback data for landing page");
    }

    setFormData({
      title: dataToUse.title || fallbackData.title,
      subTitle: dataToUse.subTitle || fallbackData.subTitle,
      sliderImage1: dataToUse.sliderImage1 || fallbackData.sliderImage1,
      sliderImage2: dataToUse.sliderImage2 || fallbackData.sliderImage2,
      sliderImage3: dataToUse.sliderImage3 || fallbackData.sliderImage3,
      studentCount: dataToUse.studentCount || fallbackData.studentCount,
      mentorCount: dataToUse.mentorCount || fallbackData.mentorCount,
      materialCount: dataToUse.materialCount || fallbackData.materialCount,
      bcsCount: dataToUse.bcsCount || fallbackData.bcsCount,
      liveClassCount: dataToUse.liveClassCount || fallbackData.liveClassCount,
      barCount: dataToUse.barCount || fallbackData.barCount,
      liveExamCount: dataToUse.liveExamCount || fallbackData.liveExamCount,
    });
  }, [homeManageDataToUse]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const handleJoin = async () => {
    // Check if user is already logged in
    if (token && user) {
      toast.info("আপনি ইতিমধ্যে লগইন আছেন!", {
        description: "ড্যাশবোর্ডে যেতে ক্লিক করুন",
        duration: 3000,
        action: {
          label: "ড্যাশবোর্ড",
          onClick: () => {
            if (user.role === "learner") {
              router.push("/dashboard");
            } else if (
              user.role === "admin" ||
              user.role === "staff" ||
              user.role === "superadmin"
            ) {
              router.push("/admin/dashboard");
            } else if (user.role === "representative") {
              router.push("/admin/dashboard/crm/course-support");
            } else if (user.role === "mentor") {
              router.push("/mentor/dashboard");
            }
          },
        },
      });
      return;
    }

    if (!inputValue.trim()) {
      toast.info("Please enter your email or phone number");
      return;
    }

    // Simple validation for email or phone
    const isEmail = inputValue.includes("@");
    const isPhone = /^[0-9+]{10,15}$/.test(inputValue.replace(/\D/g, ""));

    if (!isEmail && !isPhone) {
      toast.info("Please enter a valid email or phone number");
      return;
    }

    try {
      const payload = isEmail
        ? { email: inputValue.trim() }
        : { phone: inputValue.trim() };

      const result = await simpleRegister(payload).unwrap();
      if (result.verificationRequired) {
        setContactInfo(inputValue.trim());
        setVerificationMethod(isEmail ? "email" : "sms");
        setShowOtpModal(true);
      }
    } catch (error) {
      console.log(error);

      // Check if user already exists
      if (
        error?.data?.exists === true ||
        error?.data?.message?.includes("already exists")
      ) {
        toast.info(
          "এই ইমেইল/ফোন দিয়ে ইতিমধ্যে একাউন্ট আছে। লগইন পেজ খোলা হচ্ছে...",
          {
            description: "আপনার পাসওয়ার্ড দিয়ে লগইন করুন",
            duration: 3000,
          }
        );
        // Try multiple approaches to open the login modal
        setTimeout(() => {
          const contactInfo = inputValue.trim();
          console.log("Attempting to open login popup with:", {
            contactInfo,
            isEmail,
            isPhone,
          });

          // Check if it's mobile device
          const isMobile = window.innerWidth < 768; // md breakpoint

          if (isMobile) {
            // For mobile, use the mobile-specific trigger
            console.log("Mobile device detected, using mobile login trigger");
            if (window.triggerMobileLoginModal) {
              window.triggerMobileLoginModal();
            }
            // Also dispatch the event for mobile menu to catch
            const event = new CustomEvent("openLoginPopup", {
              detail: {
                contactInfo,
                isEmail,
                isPhone,
              },
            });
            window.dispatchEvent(event);
          } else {
            // For desktop, use the existing methods
            // Method 1: Custom event
            const event = new CustomEvent("openLoginPopup", {
              detail: {
                contactInfo,
                isEmail,
                isPhone,
              },
            });
            window.dispatchEvent(event);

            // Method 2: Direct button click (fallback)
            setTimeout(() => {
              console.log("Trying fallback method - clicking login button");
              const loginButton = document.querySelector(
                '[data-testid="login-button"]'
              );
              if (loginButton) {
                console.log("Found login button, clicking it");
                loginButton.click();
              } else {
                console.log(
                  "Login button not found, trying alternative selectors"
                );
                // Try alternative selectors
                const altButton =
                  document.querySelector('button[class*="bg-main"]') ||
                  document.querySelector('button:contains("লগিন")') ||
                  document.querySelector('button:contains("সাইনআপ")');
                if (altButton) {
                  console.log("Found alternative login button, clicking it");
                  altButton.click();
                } else {
                  console.log("No login button found with any selector");
                }
              }
            }, 200);

            // Method 3: Try to trigger via window object
            setTimeout(() => {
              if (window.triggerLoginModal) {
                console.log("Using window.triggerLoginModal");
                window.triggerLoginModal(contactInfo, isEmail, isPhone);
              }
            }, 300);
          }
        }, 1500);
      } else {
        toast.error(
          "Registration failed. Please try again or use a different Phone or Email"
        );
      }
    }
  };
  const handleCloseModal = () => {
    setShowOtpModal(false);
    setInputValue("");
  };

  // Test function to manually trigger login modal
  const testLoginModal = () => {
    console.log("Testing login modal manually");
    const event = new CustomEvent("openLoginPopup", {
      detail: {
        contactInfo: "test@example.com",
        isEmail: true,
        isPhone: false,
      },
    });
    window.dispatchEvent(event);
  };

  return (
    <div>
      <style jsx>{`
        @media (max-width: 375px) {
          .xs-text-2xl {
            font-size: 1.5rem;
            line-height: 1.75rem;
          }
          .xs-text-sm {
            font-size: 0.875rem;
            line-height: 1.25rem;
          }
          .xs-px-2 {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          .xs-h-10 {
            height: 2.5rem;
          }
          .xs-text-xs {
            font-size: 0.75rem;
            line-height: 1rem;
          }
        }
      `}</style>
      <div className="relative [background-image:linear-gradient(90deg,rgba(255,184,0,0)_-5.25%,rgba(255,184,0,0.1)_41.47%)] border-b ">
        {/* hero bg -*/}
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-[.04]" />

        {/* hero content */}
        <div className="min-h-[500px] sm:min-h-[600px] md:min-h-[650px] lg:min-h-[650px] py-8 sm:py-12 md:py-16 lg:py-[70px] px-4 sm:px-6 md:px-8 flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-14 items-center justify-between relative z-[1] lg:px-4 xl:px-0 max-w-[1200px] mx-auto">
          {isLoading ? (
            // Skeleton loader while data is loading
            <>
              <div className="flex-1 flex-col space-y-4 hidden -mt-16 md:block">
                <TitleSkeleton />
                <SubtitleSkeleton />
                <InputSkeleton />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>

              <div className="flex-1 flex-col space-y-3 sm:space-y-4 items-center justify-center block md:hidden w-full">
                <MobileTitleSkeleton />
                <div className="h-4 sm:h-6 bg-gray-200 rounded animate-pulse w-2/3 mx-auto"></div>
                <InputSkeleton />
                <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
              </div>

              <div className="flex-1 w-full max-w-[350px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px] mx-auto lg:mx-0">
                <div className="rounded-3xl w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gray-200 animate-pulse"></div>
                <div className="flex items-center justify-center gap-2 my-3 sm:my-4 md:my-5 mx-auto">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-2 sm:h-2.5 md:h-3 w-4 sm:w-5 md:w-6 bg-gray-300 rounded-full animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Actual content with animations
            <>
              {/* For PC */}
              <motion.div
                className="flex-1 flex-col space-y-4 hidden -mt-16 md:block"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Title */}
                <motion.h1
                  className="line-clamp-2 py-2 Z font-semibold text-start text-4xl md:text-[42px] lg:text-[45px] text-[#141B34]"
                  variants={itemVariants}
                >
                  {formData?.title}
                </motion.h1>

                {/* Sub Title */}
                <motion.p
                  className="text-deepGray text-xl md:text-[22px] lg:text-2xl font-bold text-start"
                  style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                  variants={itemVariants}
                >
                  {formData.subTitle}
                </motion.p>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="join"
                    className={`w-full sm:w-[90%] md:w-[80%] lg:w-[75%] flex items-center border p-1 pl-3 sm:pl-4 md:pl-5 rounded-2xl h-12 sm:h-14 md:h-16 bg-white outline-none ${
                      token && user ? "border-main bg-main/5" : "border-main"
                    }`}
                  >
                    <input
                      type="text"
                      id="join"
                      value={
                        token && user
                          ? user.fullName || user.email || user.phone
                          : inputValue
                      }
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        token && user
                          ? "আপনি ইতিমধ্যে লগইন আছেন"
                          : "ফোন নাম্বার বা ইমেইল দিন"
                      }
                      className="flex-1 h-full placeholder:text-deepGray border-none focus:outline-none bg-transparent text-sm sm:text-base md:text-lg"
                      style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleJoin();
                      }}
                      disabled={token && user}
                    />
                    <Button
                      onClick={
                        token && user
                          ? () => {
                              if (user.role === "learner") {
                                router.push("/dashboard");
                              } else if (
                                user.role === "admin" ||
                                user.role === "staff" ||
                                user.role === "superadmin"
                              ) {
                                router.push("/admin/dashboard");
                              } else if (user.role === "representative") {
                                router.push(
                                  "/admin/dashboard/crm/course-support"
                                );
                              } else if (user.role === "mentor") {
                                router.push("/mentor/dashboard");
                              }
                            }
                          : handleJoin
                      }
                      disabled={isRegistering}
                      className={`h-full font-bold rounded-xl text-white text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 ${
                        token && user
                          ? "bg-main hover:bg-main-dark"
                          : "bg-blue hover:bg-blue-500"
                      }`}
                    >
                      {token && user
                        ? "ড্যাশবোর্ডে যান"
                        : isRegistering
                        ? "Processing..."
                        : "ফ্রি জয়েন করুন"}
                    </Button>
                  </label>

                  {token && user && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-left"
                    >
                      <p className="text-sm md:text-base text-main font-medium">
                        স্বাগতম! আপনার একাউন্টে প্রবেশ করতে উপরের বাটনে ক্লিক
                        করুন
                      </p>
                    </motion.div>
                  )}
                </motion.div>
                {!token && (
                  <motion.p
                    className="text-darkColor text-start text-sm md:text-base"
                    style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                  >
                    আমরা যাচাইয়ের জন্য একটি ওটিপি পাঠাবো।
                  </motion.p>
                )}
              </motion.div>

              {/* For Mobile */}
              <motion.div
                className="flex-1 flex-col space-y-3 sm:space-y-4 items-center justify-center block md:hidden w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Title */}
                <motion.h1
                  className="line-clamp-3 font-[700] text-3xl text-[#141B34] text-center p-1 sm:p-2 leading-tight"
                  style={{
                    fontFamily:
                      "'Li Ador Noirrit', 'Noto Serif Bengali', serif",
                  }}
                  variants={itemVariants}
                >
                  {formData.title && (
                    <>
                      <span>{formData.title}</span>
                    </>
                  )}
                </motion.h1>

                {/* Sub Title */}
                <motion.p
                  className="text-deepGray text-lg font-bold text-center mx-2 line-clamp-2 "
                  style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                  variants={itemVariants}
                >
                  {formData.subTitle ||
                    "ক্যারিয়ার গড়ার নিশ্চয়তা, লাইভ ক্লাস আর সঠিক গাইডলাইনে।"}
                </motion.p>

                <motion.div variants={itemVariants} className="w-full">
                  <label
                    htmlFor="join-mobile"
                    className={`w-full max-w-[400px] flex items-center border p-1 pl-2 sm:pl-3 lg:pl-4 rounded-2xl h-12 sm:h-12 lg:h-14 bg-white outline-none mx-auto ${
                      token && user ? "border-main bg-main/5" : "border-main"
                    }`}
                  >
                    <input
                      type="text"
                      id="join-mobile"
                      value={
                        token && user
                          ? user.fullName || user.email || user.phone
                          : inputValue
                      }
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        token && user
                          ? "আপনি ইতিমধ্যে লগইন আছেন"
                          : "ফোন নাম্বার বা ইমেইল দিন"
                      }
                      className="flex-1 h-full placeholder:text-deepGray border-none focus:outline-none bg-transparent text-xs xs:text-sm sm:text-base"
                      style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleJoin();
                      }}
                      disabled={token && user}
                    />
                    <Button
                      onClick={
                        token && user
                          ? () => {
                              if (user.role === "learner") {
                                router.push("/dashboard");
                              } else if (
                                user.role === "admin" ||
                                user.role === "staff" ||
                                user.role === "superadmin"
                              ) {
                                router.push("/admin/dashboard");
                              } else if (user.role === "representative") {
                                router.push(
                                  "/admin/dashboard/crm/course-support"
                                );
                              } else if (user.role === "mentor") {
                                router.push("/mentor/dashboard");
                              }
                            }
                          : handleJoin
                      }
                      disabled={isRegistering}
                      className={`h-full font-bold rounded-xl text-white text-xs xs:text-sm sm:text-sm px-3 xs:px-4 sm:px-3 ${
                        token && user
                          ? "bg-main hover:bg-main-dark"
                          : "bg-blue hover:bg-blue-500"
                      }`}
                    >
                      {token && user
                        ? "ড্যাশবোর্ডে যান"
                        : isRegistering
                        ? "Processing..."
                        : "ফ্রি জয়েন করুন"}
                    </Button>
                  </label>

                  {token && user && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-left"
                    >
                      <p className="text-xs text-main font-medium">
                        স্বাগতম! আপনার একাউন্টে প্রবেশ করতে উপরের বাটনে ক্লিক
                        করুন
                      </p>
                    </motion.div>
                  )}
                </motion.div>
                {!token && (
                  <motion.p
                    className="text-darkColor text-center text-xs xs:text-sm"
                    style={{ fontFamily: "'Noto Serif Bengali', serif" }}
                    variants={itemVariants}
                  >
                    আমরা যাচাইয়ের জন্য একটি ওটিপি পাঠাবো।
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-4 md:mb-6 lg:mb-0 w-[95%] sm:w-[95%] md:max-w-[450px] lg:max-w-[500px] mx-auto lg:mx-0"
              >
                <HomePageSlider
                  image1={formData.sliderImage1}
                  image2={formData.sliderImage2}
                  image3={formData.sliderImage3}
                />
              </motion.div>
            </>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StatsSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="actual-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 lg:mt-0"
          >
            <HeroStats
              student={formData.studentCount}
              mentor={formData.mentorCount}
              material={formData.materialCount}
              bcs={formData.bcsCount}
              liveClass={formData.liveClassCount}
              bar={formData.barCount}
              liveExam={formData.liveExamCount}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* OTP Modal - Fixed the condition here */}
      <OTPModal
        isOpen={showOtpModal}
        onClose={handleCloseModal}
        contactInfo={contactInfo}
        method={verificationMethod}
      />
    </div>
  );
}
