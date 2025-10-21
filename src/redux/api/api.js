import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "@/redux/features/auth/learnerSlice";

// export const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const baseUrl = "https://de-jure-server.onrender.com/api/v1";

// Enhanced baseQuery with token expiration handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Check if the result is a 401/403 error (token expired/invalid)
  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 403)
  ) {
    console.log("Token expired or invalid, logging out user");

    // Dispatch logout action to clear user data
    api.dispatch(logout());

    // Clear localStorage/sessionStorage if needed
    if (typeof window !== "undefined") {
      localStorage.removeItem("persist:auth");
      sessionStorage.clear();

      // Dispatch custom event for global error handling
      window.dispatchEvent(
        new CustomEvent("api-error", {
          detail: {
            error: result.error,
            args,
            timestamp: Date.now(),
          },
        })
      );
    }

    // Return a custom error that can be handled by components
    return {
      ...result,
      error: {
        ...result.error,
        data: {
          ...result.error.data,
          tokenExpired: true,
          message: "Session expired. Please login again.",
        },
      },
    };
  }

  return result;
};

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Skip token if explicitly requested via meta
    if (endpoint?.meta?.skipToken) {
      return headers;
    }

    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "learners",
    "admin",
    "mentor",
    "staff",
    "courses",
    "categories",
    "subcategories",
    "curriculums",
    "bank",
    "subjects",
    "questionSet",
    "liveClasses",
    "lectures",
    "modules",
    "syllabus",
    "records",
    "liveExams",
    "classes",
    "submissions",
    "resources",
    "enrollments",
    "routines",
    "message",
    "conversation",
    "transaction",
    "leads",
    "Lead",
    "Stage",
    "Learner",
    "Representative",
    "Leaderboard",
    "progress",
    "notifications",
    "products",
    "productCategories",
    "orders",
    "blogs",
    "careers",
    "freeResources",
    "timelines",
    "coupons",
    "notice",
    "homeManage",
    "photoGallery",
    "shopHero",
    "jobPortalHero",
    "freeResourceHero",
    "blogManage",
    "activityGallery",
    "homeFeature",
    "homeCourse",
    "appDownload",
    "contact",
    "footer",
    "review",
    "mixHero",
    "social",
    "about",
    "certificates",
  ],
  endpoints: () => ({}),
});
