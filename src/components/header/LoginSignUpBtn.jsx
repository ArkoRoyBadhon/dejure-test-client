"use client";

import LearnerLoginComponent from "@/app/(auth)/login/_components/LearnerLoginComponent";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bell, LayoutDashboard, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter, useSearchParams } from "next/navigation";
import { logout } from "@/redux/features/auth/learnerSlice";
import { toast } from "sonner";

const LoginSignUpBtn = ({ shouldOpenLogin, onLoginOpened, onLogout }) => {
  const [loginClick, setLoginClick] = useState(false);
  const [prefilledContact, setPrefilledContact] = useState(null);
  const { user, token } = useSelector((state) => state.auth);

  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const otp = searchParams.get("otp");
  const otpVerified = searchParams.get("otpVerified");

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      dispatch(logout());
      toast.success("Successfully logged out", {
        description: "You have been logged out successfully.",
      });
      router.push("/");
    }
  };

  const handleDashboard = () => {
    if (user.role === "learner") {
      router.push("/dashboard");
    }
    if (
      user.role === "admin" ||
      user.role === "staff" ||
      user.role === "superadmin"
    ) {
      router.push("/admin/dashboard");
    }
    if (user.role === "representative") {
      router.push("/admin/dashboard/crm/course-support");
    }
    if (user.role === "mentor") {
      router.push("/mentor/dashboard");
    }
  };

  useEffect(() => {
    if (otpVerified === "true" || otpVerified === true) {
      setLoginClick(true);
    }
  }, [otpVerified]);

  // Handle shouldOpenLogin prop from mobile menu
  useEffect(() => {
    if (shouldOpenLogin) {
      setLoginClick(true);
      if (onLoginOpened) {
        onLoginOpened();
      }
    }
  }, [shouldOpenLogin, onLoginOpened]);

  // Listen for custom event from HomePageHero
  useEffect(() => {
    const handleOpenLoginPopup = (event) => {
      console.log("Received openLoginPopup event:", event.detail);
      const { contactInfo, isEmail, isPhone } = event.detail;
      setPrefilledContact({
        contactInfo,
        isEmail,
        isPhone,
      });
      setLoginClick(true);
      console.log("Set loginClick to true and prefilledContact:", {
        contactInfo,
        isEmail,
        isPhone,
      });
    };

    // Add window function for direct access
    window.triggerLoginModal = (contactInfo, isEmail, isPhone) => {
      console.log("triggerLoginModal called with:", {
        contactInfo,
        isEmail,
        isPhone,
      });
      setPrefilledContact({
        contactInfo,
        isEmail,
        isPhone,
      });
      setLoginClick(true);
    };

    console.log("Adding event listener for openLoginPopup");
    window.addEventListener("openLoginPopup", handleOpenLoginPopup);

    return () => {
      console.log("Removing event listener for openLoginPopup");
      window.removeEventListener("openLoginPopup", handleOpenLoginPopup);
      delete window.triggerLoginModal;
    };
  }, []);

  // Debug state changes
  useEffect(() => {
    console.log("loginClick state changed:", loginClick);
    console.log("prefilledContact state changed:", prefilledContact);
  }, [loginClick, prefilledContact]);

  console.log("user", `${process.env.NEXT_PUBLIC_API_URL}/${user?.image}`);

  return (
    <>
      {token ? (
        <>
          <div className="flex items-center space-x-3">
            {/* <Button
              variant="ghost"
              size="icon"
              className="relative cursor-pointer hover:bg-black/10 text-black"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-3 cursor-pointer hover:bg-black/10 rounded-lg px-3 py-2 transition-colors">
                  <Avatar className="h-[36px] w-[36px] sm:h-[46px] sm:w-[46px] border-2">
                    <AvatarImage
                      src={
                        user?.image
                          ? `${process.env.NEXT_PUBLIC_API_URL}/${user?.image}`
                          : "/assets/icons/avatar.png"
                      }
                    />
                    {/* <AvatarFallback className="bg-white text-amber-600 font-semibold">
                      {user?.fullName
                        ? user.fullName.charAt(0).toUpperCase()
                        : "U"}
                    </AvatarFallback> */}
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="center" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.fullName || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || user?.phone}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(
                        user.role === "learner"
                          ? "/dashboard/profile"
                          : user?.role === "mentor"
                          ? "/mentor/dashboard/profile"
                          : "/admin/dashboard/profile"
                      )
                    }
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDashboard()}
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      ) : (
        <>
          <Button
            onClick={() => setLoginClick(true)}
            data-testid="login-button"
            className="bg-main hover:bg-main cursor-pointer text-darkColor px-4 py-4 md:py-2 rounded-md text-[18px] md:text-[14px] font-bold flex items-center w-full h-full justify-center "
          >
            লগিন/সাইনআপ
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {(loginClick || otp || otpVerified === "true") && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/30 bg-opacity-50 z-40 transition-opacity duration-200 ease-in-out opacity-0 animate-fade-in"
                onClick={() => setLoginClick(false)}
              />

              {/* Modal container */}
              <div className="fixed inset-0 flex justify-center items-center z-[999]">
                <div className="animate-grow origin-center">
                  <LearnerLoginComponent
                    setLoginClick={setLoginClick}
                    prefilledContact={prefilledContact}
                    onClose={() => setPrefilledContact(null)}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default LoginSignUpBtn;
