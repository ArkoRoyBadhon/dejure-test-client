"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/redux/features/auth/learnerSlice";
import { isTokenExpired, shouldRedirectToLogin } from "@/Utils/tokenUtils";
import { useLearnerLogoutMutation } from "@/redux/features/auth/learner.api";
import { toast } from "sonner";

/**
 * Global Token Expiration Handler
 * This component monitors token expiration and handles automatic logout
 */
const TokenExpirationHandler = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useSelector((state) => state.auth);
  const [learnerLogout] = useLearnerLogoutMutation();

  useEffect(() => {
    // Check token expiration on mount and when token changes
    if (token && isTokenExpired(token)) {
      console.log("Token expired, logging out user");

      // Show notification
      toast.error("Your session has expired. Please login again.", {
        id: "token-expiration",
      });

      // Call logout API to clear backend sessions
      const handleLogout = async () => {
        try {
          if (user?.role === "learner") {
            await learnerLogout(token).unwrap();
            console.log("Backend logout successful - sessions cleared");
          }
        } catch (error) {
          console.error("Backend logout failed:", error);
          // Continue with frontend logout even if backend fails
        }

        // Dispatch logout to clear frontend state
        dispatch(logout());

        // Clear storage
        if (typeof window !== "undefined") {
          localStorage.removeItem("persist:auth");
          sessionStorage.clear();
        }

        // Redirect to appropriate login page
        if (shouldRedirectToLogin(token, pathname)) {
          //   if (pathname.includes("/admin") || pathname.includes("/dashboard")) {
          //     router.push("/admin/login");
          //   } else if (pathname.includes("/mentor")) {
          //     router.push("/mentor/login");
          //   } else {
          router.push("/");
          //   }
        }
      };

      handleLogout();
    }
  }, [token, pathname, dispatch, router, user, learnerLogout]);

  // Monitor for API errors that indicate token expiration
  useEffect(() => {
    const handleApiError = async (event) => {
      const { detail } = event;

      if (detail?.error?.data?.tokenExpired) {
        console.log("API error indicates token expiration");

        toast.error("Session expired. Please login again.");

        // Call logout API to clear backend sessions
        try {
          if (user?.role === "learner") {
            await learnerLogout(token).unwrap();
            console.log("Backend logout successful - sessions cleared");
          }
        } catch (error) {
          console.error("Backend logout failed:", error);
          // Continue with frontend logout even if backend fails
        }

        dispatch(logout());

        if (typeof window !== "undefined") {
          localStorage.removeItem("persist:auth");
          sessionStorage.clear();
        }

        // Redirect based on current path
        if (pathname.includes("/admin") || pathname.includes("/dashboard")) {
          router.push("/admin/login");
        } else if (pathname.includes("/mentor")) {
          router.push("/mentor/login");
        } else {
          router.push("/");
        }
      }
    };

    // Listen for custom API error events
    window.addEventListener("api-error", handleApiError);

    return () => {
      window.removeEventListener("api-error", handleApiError);
    };
  }, [dispatch, router, pathname, user, token, learnerLogout]);

  return <>{children}</>;
};

export default TokenExpirationHandler;
