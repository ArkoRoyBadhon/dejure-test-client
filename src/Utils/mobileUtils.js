// Mobile and iOS compatibility utilities

/**
 * Safely access window object with fallback
 */
export const safeWindow = () => {
  if (typeof window !== "undefined") {
    return window;
  }
  return null;
};

/**
 * Safely access document object with fallback
 */
export const safeDocument = () => {
  if (typeof document !== "undefined") {
    return document;
  }
  return null;
};

/**
 * Check if device is mobile
 */
export const isMobile = () => {
  if (typeof window === "undefined") return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Check if device is iOS
 */
export const isIOS = () => {
  if (typeof window === "undefined") return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * Check if device is Safari
 */
export const isSafari = () => {
  if (typeof window === "undefined") return false;

  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

/**
 * Check if running in Facebook in-app browser
 */
export const isFacebookInApp = () => {
  if (typeof window === "undefined") return false;

  return /FBAN|FBAV|FBIOS|FB_IAB|FB4A/i.test(navigator.userAgent);
};

/**
 * Check if service workers are supported
 */
export const isServiceWorkerSupported = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  // Facebook in-app browser doesn't support service workers
  if (isFacebookInApp()) {
    return false;
  }

  // Check if serviceWorker exists and has required methods
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  // Additional check for service worker methods
  if (
    !navigator.serviceWorker ||
    typeof navigator.serviceWorker.register !== "function"
  ) {
    return false;
  }

  return true;
};

/**
 * Check if notifications are supported
 */
export const isNotificationSupported = () => {
  if (typeof window === "undefined") return false;

  return "Notification" in window;
};

/**
 * Safely add event listener with cleanup
 */
export const addSafeEventListener = (element, event, handler) => {
  if (!element || typeof element.addEventListener !== "function") {
    return () => {};
  }

  element.addEventListener(event, handler);

  return () => {
    try {
      element.removeEventListener(event, handler);
    } catch (error) {
      console.warn("Error removing event listener:", error);
    }
  };
};

/**
 * Safely set body styles for mobile
 */
export const setBodyStyles = (styles) => {
  const doc = safeDocument();
  if (!doc || !doc.body) return;

  try {
    Object.entries(styles).forEach(([property, value]) => {
      doc.body.style[property] = value;
    });
  } catch (error) {
    console.warn("Error setting body styles:", error);
  }
};

/**
 * Safely restore body styles
 */
export const restoreBodyStyles = () => {
  const doc = safeDocument();
  if (!doc || !doc.body) return;

  try {
    doc.body.style.overflow = "auto";
    doc.body.style.position = "";
    doc.body.style.width = "";
    doc.body.style.height = "";
  } catch (error) {
    console.warn("Error restoring body styles:", error);
  }
};

/**
 * iOS-specific media constraints
 */
export const getIOSMediaConstraints = () => {
  if (isIOS()) {
    return {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100,
        channelCount: 1,
      },
    };
  }

  return {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  };
};

/**
 * Safe media device access
 */
export const safeGetUserMedia = async (constraints) => {
  if (typeof navigator === "undefined" || !navigator.mediaDevices) {
    throw new Error("MediaDevices API not supported");
  }

  if (!navigator.mediaDevices.getUserMedia) {
    throw new Error("getUserMedia not supported");
  }

  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error("Error accessing media devices:", error);
    throw error;
  }
};

/**
 * Safe script loading with cleanup
 */
export const loadScript = (src, options = {}) => {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Document not available"));
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = options.async !== false;
    script.crossOrigin = options.crossOrigin || "anonymous";

    script.onload = () => resolve(script);
    script.onerror = (error) => reject(error);

    document.head.appendChild(script);
  });
};

/**
 * Safe script removal
 */
export const removeScript = (script) => {
  if (!script || typeof document === "undefined") return;

  try {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  } catch (error) {
    console.warn("Error removing script:", error);
  }
};
