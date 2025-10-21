"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  PhoneCall,
  X,
  ChevronLeft,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SimpleCallDialer = ({ leadPhoneNumber }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(leadPhoneNumber || "");
  const [callState, setCallState] = useState("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("Ready");
  const dialerRef = useRef(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);

  // Handle clicks outside the dialer to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialerRef.current && !dialerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNumberClick = (num) => {
    setPhoneNumber((prev) => prev + num);
  };

  const handleCall = async () => {
    if (phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      setCallState("calling");
      toast.info(`Calling ${phoneNumber}...`);

      // Simulate call process
      setTimeout(() => {
        setCallState("connected");
        toast.success(`Connected to ${phoneNumber}`);
        setupMediaStreams();
      }, 2000);
    } catch (error) {
      console.error("Call failed:", error);
      toast.error("Call failed: " + error.message);
      setCallState("idle");
    }
  };

  const handleHangup = async () => {
    setCallState("idle");
    cleanup();
    toast.info("Call ended");
  };

  const handleMute = () => {
    if (localAudioRef.current) {
      localAudioRef.current.muted = !localAudioRef.current.muted;
      setIsMuted(!isMuted);
      toast.info(isMuted ? "Unmuted" : "Muted");
    }
  };

  const handleSpeaker = () => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = !remoteAudioRef.current.muted;
      setIsSpeakerOn(!isSpeakerOn);
      toast.info(isSpeakerOn ? "Speaker off" : "Speaker on");
    }
  };

  const cleanup = () => {
    setIsMuted(false);
    setIsSpeakerOn(true);
  };

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPhoneNumber("");
  };

  const setupMediaStreams = async () => {
    try {
      // Get user media
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = localStream;
        localAudioRef.current.play();
      }

      // Simulate remote stream
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = localStream;
        remoteAudioRef.current.play();
      }
    } catch (error) {
      console.error("Error setting up media:", error);
      toast.error("Failed to access microphone");
    }
  };

  return (
    <div className="relative" ref={dialerRef}>
      {/* Call Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`gap-1 ${
          callState === "connected"
            ? "bg-red-500 hover:bg-red-600 text-white"
            : callState === "calling"
            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
            : "bg-green text-white hover:bg-green/90"
        }`}
      >
        <PhoneCall className="h-4 w-4" />
        <span>
          {callState === "connected"
            ? "In Call"
            : callState === "calling"
            ? "Calling..."
            : "Call"}
        </span>
      </Button>

      {/* Hidden audio elements for WebRTC */}
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            <div className="p-5">
              {/* Connection Status */}
              <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-green-600">
                    {connectionStatus}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Demo Call Dialer
                </div>
                <div className="text-xs text-gray-500">
                  Amber IT Integration Ready
                </div>
              </div>

              {/* Call Status */}
              {callState === "connected" && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 dark:text-green-400 font-medium">
                      Connected to {phoneNumber}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleMute}
                        className={`p-2 rounded-full ${
                          isMuted
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isMuted ? (
                          <MicOff className="h-4 w-4" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={handleSpeaker}
                        className={`p-2 rounded-full ${
                          !isSpeakerOn
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isSpeakerOn ? (
                          <Volume2 className="h-4 w-4" />
                        ) : (
                          <VolumeX className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Phone number display */}
              <div className="mb-6">
                <div className="text-xl font-mono text-center py-4 px-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex justify-between items-center">
                  <span className="truncate">
                    {phoneNumber || (
                      <span className="text-gray-400">Enter number</span>
                    )}
                  </span>
                  {phoneNumber && (
                    <button
                      onClick={handleClear}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Keypad - only show when not in call */}
              {callState !== "connected" && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { num: "1", letters: "" },
                    { num: "2", letters: "ABC" },
                    { num: "3", letters: "DEF" },
                    { num: "4", letters: "GHI" },
                    { num: "5", letters: "JKL" },
                    { num: "6", letters: "MNO" },
                    { num: "7", letters: "PQRS" },
                    { num: "8", letters: "TUV" },
                    { num: "9", letters: "WXYZ" },
                    { num: "*", letters: "" },
                    { num: "0", letters: "+" },
                    { num: "#", letters: "" },
                  ].map((item) => (
                    <motion.button
                      key={item.num}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNumberClick(item.num)}
                      className="aspect-square flex flex-col items-center justify-center text-xl font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl relative"
                    >
                      <span>{item.num}</span>
                      {item.letters && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 absolute bottom-2">
                          {item.letters}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-between gap-3">
                {callState === "connected" ? (
                  // Call control buttons
                  <>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleMute}
                      className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
                        isMuted
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {isMuted ? (
                        <MicOff className="h-5 w-5" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                      {isMuted ? "Unmute" : "Mute"}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSpeaker}
                      className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
                        !isSpeakerOn
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {isSpeakerOn ? (
                        <Volume2 className="h-5 w-5" />
                      ) : (
                        <VolumeX className="h-5 w-5" />
                      )}
                      Speaker
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleHangup}
                      className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600"
                    >
                      <Phone className="h-5 w-5" />
                      Hangup
                    </motion.button>
                  </>
                ) : (
                  // Dialer buttons
                  <>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBackspace}
                      disabled={!phoneNumber}
                      className={`flex-1 py-3 rounded-xl flex items-center justify-center ${
                        !phoneNumber
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400"
                          : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={
                        callState === "calling" ? handleHangup : handleCall
                      }
                      disabled={
                        (callState === "idle" && phoneNumber.length < 10) ||
                        callState === "calling"
                      }
                      className={`flex-[2] py-3 rounded-xl flex items-center justify-center gap-2 text-lg font-medium ${
                        callState === "calling"
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : phoneNumber.length < 10
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-green text-white hover:bg-green/90 shadow-md"
                      }`}
                    >
                      <Phone className="h-5 w-5" />
                      {callState === "calling" ? "Cancel" : "Call"}
                    </motion.button>
                  </>
                )}
              </div>

              {/* Connection Status */}
              <div className="mt-4 text-center">
                <div
                  className={`text-sm ${
                    callState === "connected"
                      ? "text-green-600"
                      : callState === "calling"
                      ? "text-yellow-600"
                      : "text-gray-500"
                  }`}
                >
                  {callState === "connected" && "🔊 Call Active"}
                  {callState === "calling" && "📞 Connecting..."}
                  {callState === "idle" && "📱 Ready to call"}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SimpleCallDialer;

