"use client";
import LoginSignUpBtn from "@/components/header/LoginSignUpBtn";
import LogoContainer from "@/components/header/LogoContainer";
import MobileMenu from "@/components/header/MobileMenu";
import Link from "next/link";
import AllCoursesModalBtn from "@/components/header/AllCoursesModalBtn";
import FreeResourcesModalBtn from "@/components/header/FreeResourcesModalBtn";
import ShoppingCartBtn from "@/components/header/ShoppingCartBtn";
import { useEffect, useState, useRef } from "react";
import { requestFCMToken } from "@/Utils/firebaseUtils";
import { useSelector, useDispatch } from "react-redux";
import { useLearnerLogoutMutation } from "@/redux/features/auth/learner.api";
import { logout } from "@/redux/features/auth/learnerSlice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AllCoursesDrawer from "@/components/header/CoursesDrawer";
import FreeResourcesDrawer from "@/components/header/FreeResourcesDrawer";

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFreeResourcesDrawerOpen, setIsFreeResourcesDrawerOpen] =
    useState(false);
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [learnerLogout] = useLearnerLogoutMutation();
  const gTranslateInitialized = useRef(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleFreeResourcesDrawer = () => {
    setIsFreeResourcesDrawerOpen(!isFreeResourcesDrawerOpen);
  };

  const handleLogout = async () => {
    dispatch(logout());
    if (user?.role === "learner") {
      await learnerLogout(token).unwrap();
    }
    toast.success("Successfully logged out", {
      description: "You have been logged out successfully.",
    });
    router.push("/");
  };

  const navLinks = [
    { link: "/free-courses", label: "ম্যাটেরিয়ালস" },
    { link: "/career", label: "জব পোর্টাল" },
    { link: "/de-jury-shop", label: "স্টোর" },
    { link: "/blog", label: "ব্লগ & আর্টিকেল" },
    { link: "/timeline", label: "মিডিয়া" },
  ];
  const navLinksMbl = [
    { link: "/free-courses", label: "ম্যাটেরিয়ালস" },
    { link: "/career", label: "জব পোর্টাল" },
    { link: "/de-jury-shop", label: "স্টোর" },
    { link: "/blog", label: "ব্লগ & আর্টিকেল" },
    { link: "/timeline", label: "মিডিয়া" },
    { link: "/courses", label: "সব কোর্স" },
  ];

  useEffect(() => {
    const fetchFCMToken = async () => {
      try {
        const FCMToken = await requestFCMToken();

        if (FCMToken && token) {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/learners/update-profile`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ fcmToken: FCMToken }),
            }
          );
        }
      } catch (error) {
        // Silently handle FCM token errors to prevent app crashes
        console.warn("FCM token setup failed:", error.message);
      }
    };

    fetchFCMToken();
  }, [token]);

  // useEffect(() => {
  //   if (typeof window !== "undefined" && !gTranslateInitialized.current) {
  //     gTranslateInitialized.current = true;

  //     const cleanupGTranslate = () => {
  //       const selectors = [
  //         "#google_translate_element",
  //         "#google_translate_element2",
  //         "#gt_float_wrapper",
  //         ".gt_float_switcher",
  //         ".goog-te-gadget",
  //         ".goog-te-menu-frame",
  //         ".goog-te-ftab-frame",
  //       ];
  //       selectors.forEach((selector) => {
  //         document.querySelectorAll(selector).forEach((el) => el.remove());
  //       });
  //       document
  //         .querySelectorAll('script[src*="gtranslate.net"]')
  //         .forEach((script) => script.remove());
  //     };

  //     cleanupGTranslate();

  //     window.gtranslateSettings = {
  //       default_language: "bn",
  //       languages: ["bn", "en"],
  //       wrapper_selector: ".gtranslate_wrapper",
  //       switcher_horizontal_position: "inline",
  //       switcher_vertical_position: "inline",
  //       flag_style: "3d",
  //       alt_flags: { en: "usa" },
  //       detect_browser_language: false,
  //     };

  //     const script = document.createElement("script");
  //     script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
  //     script.defer = true;

  //     script.onload = () => {
  //       // Give GTranslate time to initialize
  //       const forceBengali = () => {
  //         const select = document.querySelector(".goog-te-combo");
  //         if (select) {
  //           select.value = "bn";
  //           select.dispatchEvent(new Event("change"));
  //         } else {
  //           // Retry if the select isn't ready yet
  //           setTimeout(forceBengali, 500);
  //         }
  //       };

  //       forceBengali();

  //       const floatWrapper = document.getElementById("gt_float_wrapper");
  //       if (floatWrapper) floatWrapper.style.display = "none";
  //     };

  //     document.head.appendChild(script);

  //     return () => {
  //       cleanupGTranslate();
  //       gTranslateInitialized.current = false;
  //     };
  //   }
  // }, []);

  return (
    <>
      <header className="sticky top-0 border-b border-gray3 py-2 z-50 [background-image:linear-gradient(to_right,#FFB8004D_0%,#ffffff_40%),linear-gradient(#f2f2f2,#f2f2f2)] bg-no-repeat [background-size:100%_100%] px-4 md:px-0">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between h-16">
            <LogoContainer />

            <div className="flex items-center space-x-4">
              <nav className="hidden lg:flex items-center space-x-8">
                <AllCoursesModalBtn
                  isOpen={isDrawerOpen}
                  toggleDrawer={toggleDrawer}
                />

                {navLinks.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className="text-gray-700 hover:text-gray-400 text-[16px] font-bold flex gap-2 items-center transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
                <FreeResourcesModalBtn
                  isOpen={isFreeResourcesDrawerOpen}
                  toggleDrawer={toggleFreeResourcesDrawer}
                />
              </nav>

              <div className="flex items-center space-x-4">
                <ShoppingCartBtn />
                <div className="hidden lg:block">
                  <LoginSignUpBtn onLogout={handleLogout} />
                </div>
                <div className="gtranslate_wrapper hidden lg:block"></div>
                <div className="block lg:hidden">
                  <MobileMenu
                    navLinks={navLinksMbl}
                    isFreeResourcesDrawerOpen={isFreeResourcesDrawerOpen}
                    toggleFreeResourcesDrawer={toggleFreeResourcesDrawer}
                    onLogout={handleLogout}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AllCoursesDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
      <FreeResourcesDrawer
        isOpen={isFreeResourcesDrawerOpen}
        onClose={toggleFreeResourcesDrawer}
      />
    </>
  );
}
