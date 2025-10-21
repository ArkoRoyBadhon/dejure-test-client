import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import {
  isServiceWorkerSupported,
  isNotificationSupported,
  isFacebookInApp,
} from "./mobileUtils";
import {
  safeFirebaseOperation,
  isFirebaseSupported,
} from "./firebaseErrorHandler";

const firebaseConfig = {
  apiKey: "AIzaSyBSt8K9YjJU_ojBQCWcOnXZj0uJDHoB2ic",
  authDomain: "de-jure-academy-2k25.firebaseapp.com",
  projectId: "de-jure-academy-2k25",
  storageBucket: "de-jure-academy-2k25.firebasestorage.app",
  messagingSenderId: "277182989439",
  appId: "1:277182989439:web:0f9bd2e3570e060016eb4a",
};

const vapidKey =
  "BOhDNMiBcvm_J9UsUVRfzzZ449vG1CT5g1tIHTqfBEfbgTu_nqpS-lH_9rH-p0NuUv4pEydLyy2yR9L22dboj_M";

// Lazy initialization to prevent errors in unsupported environments
let app = null;
let messaging = null;

const getFirebaseApp = () => {
  if (!app) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.warn("Firebase app initialization failed:", error);
      return null;
    }
  }
  return app;
};

const getFirebaseMessaging = () => {
  if (!messaging) {
    try {
      const firebaseApp = getFirebaseApp();
      if (!firebaseApp) return null;
      messaging = getMessaging(firebaseApp);
    } catch (error) {
      console.warn("Firebase messaging initialization failed:", error);
      return null;
    }
  }
  return messaging;
};

export const requestFCMToken = async () => {
  // Early check for Firebase support
  if (!isFirebaseSupported()) {
    console.warn("Firebase messaging not supported in this environment");
    return null;
  }

  return await safeFirebaseOperation(async () => {
    // Get Firebase messaging instance (lazy initialization)
    const firebaseMessaging = getFirebaseMessaging();
    if (!firebaseMessaging) {
      throw new Error("Firebase messaging not available");
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // Additional check for service worker support before registration
      if (
        !navigator.serviceWorker ||
        typeof navigator.serviceWorker.register !== "function"
      ) {
        throw new Error("Service worker registration not supported");
      }

      const serviceWorkerRegistration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      const token = await getToken(firebaseMessaging, {
        vapidKey,
        serviceWorkerRegistration,
      });

      return token;
    } else {
      throw new Error("Notification permission denied");
    }
  });
};
