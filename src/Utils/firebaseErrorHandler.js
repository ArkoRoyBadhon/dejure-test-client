/**
 * Firebase Error Handler
 * Provides safe error handling for Firebase operations in unsupported environments
 */

export const safeFirebaseOperation = async (
  operation,
  fallbackValue = null
) => {
  try {
    return await operation();
  } catch (error) {
    // Check if it's a service worker related error
    if (error.message && error.message.includes("serviceWorker")) {
      console.warn(
        "Service worker not supported in this environment:",
        error.message
      );
      return fallbackValue;
    }

    // Check if it's a Firebase messaging error
    if (error.message && error.message.includes("messaging")) {
      console.warn(
        "Firebase messaging not supported in this environment:",
        error.message
      );
      return fallbackValue;
    }

    // Check if it's a navigator related error
    if (
      error.message &&
      (error.message.includes("navigator") ||
        error.message.includes("addEventListener"))
    ) {
      console.warn(
        "Browser API not supported in this environment:",
        error.message
      );
      return fallbackValue;
    }

    // Log other errors but don't crash the app
    console.warn("Firebase operation failed:", error.message);
    return fallbackValue;
  }
};

export const isFirebaseSupported = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  // Check for Facebook in-app browser
  if (/FBAN|FBAV|FBIOS|FB_IAB|FB4A/i.test(navigator.userAgent)) {
    return false;
  }

  // Check for service worker support
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  // Check for notification support
  if (!("Notification" in window)) {
    return false;
  }

  return true;
};

