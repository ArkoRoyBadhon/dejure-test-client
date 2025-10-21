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

const CallDialer = ({ leadPhoneNumber }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(leadPhoneNumber || "");
  const [callState, setCallState] = useState("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("Ready");
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasMediaAccess, setHasMediaAccess] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [userAgent, setUserAgent] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);

  const dialerRef = useRef(null);
  const callDialogRef = useRef(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const durationIntervalRef = useRef(null);

  // SIP Configuration (Node.js Gateway)
  const SIP_CONFIG = {
    server: process.env.NEXT_PUBLIC_SIP_SERVER || "ws://localhost:8089/ws",
    username: process.env.NEXT_PUBLIC_SIP_USERNAME || "webrtc",
    password: process.env.NEXT_PUBLIC_SIP_PASSWORD || "webrtc123",
    domain: process.env.NEXT_PUBLIC_SIP_DOMAIN || "localhost",
  };

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

  // Handle clicks outside call dialog
  useEffect(() => {
    const handleClickOutsideCallDialog = (event) => {
      if (
        callDialogRef.current &&
        !callDialogRef.current.contains(event.target)
      ) {
        handleHangup();
      }
    };

    if (isCallDialogOpen) {
      document.addEventListener("mousedown", handleClickOutsideCallDialog);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCallDialog);
    };
  }, [isCallDialogOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localAudioRef.current?.srcObject) {
        localAudioRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
      if (remoteAudioRef.current?.srcObject) {
        remoteAudioRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  // Initialize WebSocket connection to SIP Gateway
  const initializeWebRTC = async () => {
    try {
      setIsInitializing(true);
      setConnectionStatus("Connecting to SIP Gateway...");

      // Create WebSocket connection to our Node.js gateway
      const ws = new WebSocket(SIP_CONFIG.server);

      return new Promise((resolve, reject) => {
        ws.onopen = () => {
          console.log("✅ Connected to SIP Gateway");
          setConnectionStatus("Connected to SIP Gateway");
          setIsInitializing(false);

          // Register with gateway
          ws.send(
            JSON.stringify({
              type: "register",
              username: SIP_CONFIG.username,
              password: SIP_CONFIG.password,
            })
          );

          setUserAgent(ws);
          resolve(ws);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("📨 Gateway message:", data);

            switch (data.type) {
              case "connected":
                setConnectionStatus("Ready for calls");
                break;
              case "registered":
                setConnectionStatus("Registered and ready");
                break;
              case "ringing":
                setConnectionStatus("Calling...");
                break;
              case "established":
                setCallState("connected");
                setConnectionStatus("Call connected");
                toast.success(data.message);

                // Start call duration timer
                setCallDuration(0);
                durationIntervalRef.current = setInterval(() => {
                  setCallDuration((prev) => prev + 1);
                }, 1000);
                break;
              case "disconnected":
                setCallState("idle");
                setIsCallDialogOpen(false);
                setConnectionStatus("Call ended");
                if (durationIntervalRef.current) {
                  clearInterval(durationIntervalRef.current);
                  durationIntervalRef.current = null;
                }
                break;
              case "error":
                setCallState("idle");
                setIsCallDialogOpen(false);
                toast.error(data.message || "Call failed");
                break;
            }
          } catch (error) {
            console.error("Error parsing gateway message:", error);
          }
        };

        ws.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
          setConnectionStatus("Connection failed");
          setIsInitializing(false);
          toast.error("Failed to connect to SIP Gateway");
          reject(error);
        };

        ws.onclose = (event) => {
          console.log("❌ WebSocket closed:", event.code, event.reason);
          setConnectionStatus("Disconnected");
          setIsInitializing(false);
          if (event.code === 1006) {
            toast.error(
              "SIP Gateway connection lost - Check if gateway is running on port 8089"
            );
          }
        };
      });
    } catch (error) {
      console.error("❌ Failed to initialize WebSocket:", error);
      setConnectionStatus("Connection failed");
      setIsInitializing(false);
      toast.error("Failed to connect: " + error.message);
      throw error;
    }
  };

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
      setIsCallDialogOpen(true);
      toast.info(`Calling ${phoneNumber} via Amber IT...`);

      // Initialize WebSocket if not already done
      let ws = userAgent;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        ws = await initializeWebRTC();
      }

      // Send call request to gateway
      ws.send(
        JSON.stringify({
          type: "invite",
          target: phoneNumber,
          callId: Date.now().toString(),
        })
      );

      setCurrentCall(ws);
    } catch (error) {
      console.error("❌ Call failed:", error);
      toast.error("Call failed: " + error.message);
      setCallState("idle");
      setIsCallDialogOpen(false);
      await cleanup();
    }
  };

  const handleHangup = async () => {
    try {
      if (currentCall && currentCall.readyState === WebSocket.OPEN) {
        // Send hangup request to gateway
        currentCall.send(
          JSON.stringify({
            type: "bye",
            callId: Date.now().toString(),
          })
        );
      }

      setCallState("idle");
      setIsCallDialogOpen(false);
      setCurrentCall(null);

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      await cleanup();
      toast.info("Call ended");
    } catch (error) {
      console.error("Error ending call:", error);
      await cleanup();
    }
  };

  const handleMute = () => {
    if (localAudioRef.current?.srcObject) {
      const audioTrack = localAudioRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        toast.info(audioTrack.enabled ? "Unmuted" : "Muted");
      }
    }
  };

  const handleSpeaker = () => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = !remoteAudioRef.current.muted;
      setIsSpeakerOn(!remoteAudioRef.current.muted);
      toast.info(remoteAudioRef.current.muted ? "Speaker off" : "Speaker on");
    }
  };

  const cleanup = async () => {
    try {
      // Stop local tracks
      if (localAudioRef.current?.srcObject) {
        localAudioRef.current.srcObject.getTracks().forEach((track) => {
          track.stop();
          console.log("Stopped track:", track.kind);
        });
        localAudioRef.current.srcObject = null;
      }

      // Stop remote tracks
      if (remoteAudioRef.current?.srcObject) {
        remoteAudioRef.current.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
        remoteAudioRef.current.srcObject = null;
      }

      setIsMuted(false);
      setIsSpeakerOn(true);
      setHasMediaAccess(false);

      console.log("✅ Media cleanup completed");
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  };

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPhoneNumber("");
  };

  const setupMediaStreams = async (session) => {
    try {
      // Get local media
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      setHasMediaAccess(true);

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = localStream;
        await localAudioRef.current.play();
      }

      // Get remote media from session
      if (session?.sessionDescriptionHandler) {
        const peerConnection = session.sessionDescriptionHandler.peerConnection;

        if (peerConnection) {
          const remoteStream = new MediaStream();

          peerConnection.getReceivers().forEach((receiver) => {
            if (receiver.track) {
              remoteStream.addTrack(receiver.track);
            }
          });

          if (remoteAudioRef.current && remoteStream.getTracks().length > 0) {
            remoteAudioRef.current.srcObject = remoteStream;
            await remoteAudioRef.current.play();
            console.log("✅ Remote audio setup complete");
          }
        }
      }
    } catch (error) {
      console.error("❌ Error setting up media:", error);
      toast.error("Failed to access microphone");
      setHasMediaAccess(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="relative" ref={dialerRef}>
      {/* Call Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`gap-1 transition-all duration-200 ${
          callState === "connected"
            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
            : callState === "calling"
            ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg"
            : "bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg"
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

      {/* Hidden audio elements */}
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />

      {/* Call Dialog */}
      <AnimatePresence>
        {isCallDialogOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              ref={callDialogRef}
              className="w-96 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              {/* Call Dialog Header */}
              <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {callState === "connected" ? "Call Active" : "Calling..."}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {phoneNumber}
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      callState === "connected"
                        ? "bg-green-500 animate-pulse"
                        : "bg-yellow-500 animate-pulse"
                    }`}
                  />
                </div>
              </div>

              {/* Call Controls */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMute}
                    className={`p-3 rounded-xl flex flex-col items-center gap-2 ${
                      isMuted
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isMuted ? (
                      <MicOff className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                    <span className="text-xs">
                      {isMuted ? "Unmute" : "Mute"}
                    </span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSpeaker}
                    className={`p-3 rounded-xl flex flex-col items-center gap-2 ${
                      !isSpeakerOn
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isSpeakerOn ? (
                      <Volume2 className="h-5 w-5" />
                    ) : (
                      <VolumeX className="h-5 w-5" />
                    )}
                    <span className="text-xs">Speaker</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleHangup}
                    className="p-3 rounded-xl flex flex-col items-center gap-2 bg-red-500 text-white"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="text-xs">End</span>
                  </motion.button>
                </div>

                {callState === "connected" && (
                  <div className="text-center">
                    <div className="text-2xl font-mono text-gray-900 dark:text-white">
                      {formatDuration(callDuration)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Call Duration</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialer Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border z-50"
          >
            <div className="p-5">
              {/* Status */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <span className="font-medium text-green-600">
                  {connectionStatus}
                </span>
              </div>

              {/* Phone Display */}
              <div className="mb-5">
                <div className="text-xl text-center py-3 px-4 bg-gray-50 rounded-lg flex justify-between items-center">
                  <span>
                    {phoneNumber || (
                      <span className="text-gray-400">Enter number</span>
                    )}
                  </span>
                  {phoneNumber && (
                    <button onClick={handleClear} className="text-gray-400">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Keypad */}
              {callState !== "connected" && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "*",
                    "0",
                    "#",
                  ].map((num) => (
                    <motion.button
                      key={num}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNumberClick(num)}
                      className="h-12 bg-gray-50 hover:bg-gray-100 rounded-lg text-lg font-medium"
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {callState === "connected" ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleHangup}
                    className="flex-1 py-3 bg-red-500 text-white rounded-lg"
                  >
                    End Call
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBackspace}
                      disabled={!phoneNumber}
                      className="flex-1 py-3 bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft className="h-5 w-5 mx-auto" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCall}
                      disabled={phoneNumber.length < 10}
                      className="flex-[2] py-3 bg-green-500 text-white rounded-lg disabled:bg-gray-300"
                    >
                      Call
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CallDialer;
