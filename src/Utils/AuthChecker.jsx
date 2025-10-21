"use client";

import { useGetAdminQuery } from "@/redux/features/auth/admin.api";
import { useGetLearnersQuery } from "@/redux/features/auth/learner.api";
import { logout, setUser } from "@/redux/features/auth/learnerSlice";
import { useGetMentorProfileQuery } from "@/redux/features/auth/mentor.api";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FullScreenLoader from "@/components/shared/Loader";

const AuthChecker = ({ children, requiredRole }) => {
  const { token, user } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  // Fetch user data based on role
  const {
    data: learnerData,
    error: learnerError,
    isLoading: learnerLoading,
  } = useGetLearnersQuery(undefined, {
    skip: user?.role !== "learner",
  });

  const {
    data: adminData,
    error: adminError,
    isLoading: adminLoading,
  } = useGetAdminQuery(undefined, {
    skip: !["admin", "superadmin", "staff", "representative"].includes(
      user?.role
    ),
  });

  const {
    data: mentorData,
    error: mentorError,
    isLoading: mentorLoading,
  } = useGetMentorProfileQuery(undefined, {
    skip: user?.role !== "mentor",
  });

  // Update user data in Redux when fetched
  useEffect(() => {
    if (user?.role === "learner" && learnerData) {
      dispatch(setUser(learnerData));
    } else if (
      ["admin", "superadmin", "staff", "representative"].includes(user?.role) &&
      adminData
    ) {
      dispatch(setUser(adminData));
    } else if (user?.role === "mentor" && mentorData) {
      dispatch(setUser(mentorData));
    }
  }, [learnerData, adminData, mentorData, user?.role, dispatch]);

  // Check if user has the required role
  const hasAccess = () => {
    if (!user?.role) return false;

    // Staff and representatives should have access to admin routes
    if (
      requiredRole === "admin" &&
      ["staff", "representative"].includes(user.role)
    ) {
      return true;
    }

    return user.role === requiredRole;
  };

  // Handle loading state
  if (learnerLoading || adminLoading || mentorLoading) {
    return <FullScreenLoader text="Authenticating..." />;
  }

  // Handle unauthorized access
  if (
    !token ||
    !hasAccess() ||
    learnerError?.data ||
    adminError?.data ||
    mentorError?.data
  ) {
    // Logout if there's an authentication error
    if (learnerError?.data || adminError?.data || mentorError?.data) {
      dispatch(logout());
    }

    // Redirect based on required role
    if (
      ["admin", "superadmin", "staff", "representative"].includes(requiredRole)
    ) {
      router.push("/admin/login");
    } else if (requiredRole === "mentor") {
      router.push("/mentor/login");
    } else {
      router.push("/");
    }

    return null;
  }

  // If everything is okay, render children
  return <>{children}</>;
};

export default AuthChecker;
