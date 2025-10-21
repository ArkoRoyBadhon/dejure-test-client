"use client";

import { useEffect, useState, useRef } from "react";
import { ZoomMtg } from "@zoom/meetingsdk";

const ZoomTest = () => {
  const [zoomReady, setZoomReady] = useState(false);
  const tk = useRef("");
  const meetingNumber = "89772490676";
  const passWord = "149173";
  const role = 0;
  const userName = "Arko";
  const userEmail = "arkoroyb@gmail.com";
  const leaveUrl = "http://localhost:5173";
  const authEndpoint =
    "${process.env.NEXT_PUBLIC_API_URL}/zoom/generate-signature";

  // Initialize the Zoom SDK only after React is fully mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareWebSDK();
        setZoomReady(true);
      }
    }, 100); // Delay for 100ms to ensure React hydration completes

    return () => clearTimeout(timer);
  }, []);

  const getSignature = async () => {
    try {
      const res = await fetch(authEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingNumber, role, userName }),
      });
      const data = await res.json();
      const signature = data.signature;
      startMeeting(signature);
    } catch (e) {
      console.error("Signature fetch failed:", e);
    }
  };

  const startMeeting = (signature) => {
    const root = document.getElementById("zmmtg-root");
    if (root) root.style.display = "block";

    ZoomMtg.init({
      leaveUrl,
      patchJsMedia: true,
      leaveOnPageUnload: true,
      success: () => {
        ZoomMtg.join({
          sdkKey: "hAoaCN2RXWAAL0dKOQxyw",
          signature,
          meetingNumber,
          passWord,
          userName,
          userEmail,
          tk: tk.current,
        });
      },
      error: (err) => console.error("Init error", err),
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-center">Join Zoom Meeting</h1>

      <div
        id="zmmtg-root"
        className="hidden w-full h-screen border border-gray-300 rounded-xl shadow-lg"
      />

      <div className="flex justify-center">
        <button
          onClick={getSignature}
          //   disabled={!zoomReady}
          className="px-6 py-2 bg-blue-600 text-red rounded hover:bg-blue-700  transition-all"
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
};

export default ZoomTest;
