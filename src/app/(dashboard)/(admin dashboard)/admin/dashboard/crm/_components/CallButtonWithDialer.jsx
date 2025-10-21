"use client";
import JsSIP from "jssip";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const CallButtonWithDialer = ({ phoneNumber }) => {
  const uaRef = useRef(null);

  const startCall = () => {
    const socket = new JsSIP.WebSocketInterface(
      "wss://pabx.amberit.com.bd:8190"
    );
    const configuration = {
      sockets: [socket],
      uri: "sip:8318810@pabx.amberit.com.bd",
      password: "7147",
      session_timers: false,
    };

    const ua = new JsSIP.UA(configuration);
    uaRef.current = ua;

    ua.start();

    ua.on("connected", () => {});

    ua.on("registered", () => {
      toast.success("SIP Registration successful");
      const session = ua.call(`sip:${phoneNumber}@pabx.amberit.com.bd`, {
        mediaConstraints: { audio: true, video: false },
        rtcOfferConstraints: {
          offerToReceiveAudio: 1,
          offerToReceiveVideo: 0,
        },
      });

      session.on("progress", () => {
        toast.info("Ringing...");
      });

      session.on("failed", (e) => {
        toast.error("Call Failed");
        console.error(e);
      });

      session.on("ended", () => {
        toast.info("Call Ended");
      });

      session.on("confirmed", () => {
        toast.success("Call Connected");
      });
    });

    ua.on("registrationFailed", (e) => {
      toast.error("SIP Registration Failed");
      console.error("Registration failed:", e);
    });
  };

  return (
    <button
      onClick={startCall}
      className="bg-green text-white px-3 py-2 rounded hover:bg-green/90"
    >
      কল করুন
    </button>
  );
};

export default CallButtonWithDialer;
