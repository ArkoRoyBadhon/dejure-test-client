"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  AlertTriangle,
  Edit,
  Loader2,
  MoreVertical,
  Trash2,
  Clock,
  X,
  PlayCircle,
  Ban,
  AlertCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateLiveClassModal from "./Modals/CreateLiveClassModal";

import {
  useDeleteLiveClassMutation,
  useUpdateLiveClassMutation,
} from "@/redux/features/liveClass/liveClass.api";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import Image from "next/image";
import LiveClassRecordPlayer from "../Admin/LiveClass/LiveClassRecordPlayer";

export default function LiveClassCard({ cls }) {
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [signature, setSignature] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmStatusChange, setConfirmStatusChange] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const updateBtnRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const isAdmin =
    user?.role === "admin" ||
    user?.role === "superadmin" ||
    user.role === "staff";

  const isMentor = user?.role === "mentor";

  const [deleteLiveClass, { isLoading }] = useDeleteLiveClassMutation();
  const [updateLiveClass, { isLoading: isUpdating }] =
    useUpdateLiveClassMutation();

  const parseDateTime = useCallback((dateStr, timeStr) => {
    if (!dateStr || !timeStr) return new Date();

    const [year, month, day] = dateStr.split("-").map(Number);
    let [hours, minutes] = timeStr.split(":").map(Number);

    if (timeStr.includes(" ")) {
      const [timePart, period] = timeStr.split(" ");
      [hours, minutes] = timePart.split(":").map(Number);
      if (period.toLowerCase() === "pm" && hours < 12) hours += 12;
      if (period.toLowerCase() === "am" && hours === 12) hours = 0;
    }

    return new Date(year, month - 1, day, hours, minutes || 0, 0);
  }, []);

  // Calculate current status based on time and API status
  const calculateCurrentStatus = useCallback(() => {
    if (cls?.status === "cancelled") return "cancelled";

    const startDateTime = parseDateTime(cls?.startDate, cls?.startTime);
    const endDateTime = new Date(
      startDateTime.getTime() + (cls?.duration || 60) * 60 * 1000
    );
    const now = new Date();

    if (isNaN(startDateTime.getTime())) {
      console.error("Invalid startDateTime", cls?.startDate, cls?.startTime);
      return "unknown";
    }

    if (now < startDateTime) return "upcoming";
    if (now >= startDateTime && now <= endDateTime) return "ongoing";
    return "ended";
  }, [cls?.startDate, cls?.startTime, cls?.duration, cls?.status]);

  // Calculate countdown with early join logic
  const calculateCountdown = useCallback(() => {
    const now = new Date();
    const start = parseDateTime(cls?.startDate, cls?.startTime);
    const end = new Date(start.getTime() + cls?.duration * 60 * 1000);

    const target = now < start ? start : now < end ? end : null;
    if (!target) return null;

    const diff = target - now;
    if (diff <= 0) return null;

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
      totalSeconds,
      isEndingSoon: totalSeconds < 1800, // 30 minutes
    };
  }, [cls?.startDate, cls?.startTime, cls?.duration]);

  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update status and countdown when currentTime changes
  useEffect(() => {
    const newStatus = calculateCurrentStatus();
    const newCountdown = calculateCountdown();

    setCurrentStatus(newStatus);
    setCountdown(newCountdown);
  }, [currentTime, calculateCurrentStatus, calculateCountdown]);

  // Early join logic for mentor (same as dashboard)
  const canJoinEarly = useMemo(() => {
    if (!cls?.startDate || !cls?.startTime) return false;

    const startTime = parseDateTime(cls.startDate, cls.startTime);
    const tenMinutesBeforeStart = new Date(startTime.getTime() - 10 * 60000);

    return currentTime >= tenMinutesBeforeStart;
  }, [cls?.startDate, cls?.startTime, currentTime]);

  // Different join logic for mentors vs students
  const canJoin = useMemo(() => {
    if (currentStatus === "ongoing") return true;
    if (isMentor) return canJoinEarly; // Mentors can join 10min early
    return false; // Students can only join when ongoing
  }, [currentStatus, isMentor, canJoinEarly]);

  const handleDelete = async () => {
    try {
      await deleteLiveClass(cls?._id).unwrap();
      toast.success("Live class has been deleted");
      setConfirmDelete(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete");
    }
  };

  const handleStatusChange = async () => {
    try {
      await updateLiveClass({
        id: cls?._id,
        body: { status: newStatus },
      }).unwrap();
      toast.success(
        `Live class has been ${
          newStatus === "cancelled" ? "cancelled" : "resumed"
        }`
      );
      setConfirmStatusChange(false);
      setCurrentStatus(calculateCurrentStatus());
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const meetingNumber = Number(cls?.zoomMeetingData?.id);
  const passWord = cls?.zoomMeetingData?.password;
  const userName = user?.fullName;
  const userEmail = user?.email;
  const role = isMentor ? 1 : 0; // 1 for host (mentor), 0 for participant

  const leaveUrl =
    user?.role === "admin"
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/admin/dashboard/live-class`
      : user?.role === "mentor"
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/mentor/dashboard/live-class`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/courses`;

  const getSignature = async () => {
    if (!cls) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/zoom/generate-signature`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meetingNumber,
            role,
            userName: userName || "User",
          }),
        }
      );

      const data = await response.json();
      if (data.signature) {
        setSignature(data.signature);
        startMeeting(data.signature);
      }
    } catch (err) {
      console.error("Failed to fetch signature", err);
      toast.error("Failed to join meeting");
    }
  };

  const startMeeting = async (signature) => {
    const { ZoomMtg } = await import("@zoom/meetingsdk");

    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const rootElement = document.getElementById("zmmtg-root");
    if (rootElement) {
      rootElement.style.display = "block";
      rootElement.style.height = "95vh";
      rootElement.style.width = "100%";
      rootElement.style.maxWidth = "1545px";
      rootElement.style.position = "fixed";
      rootElement.style.top = "55px";
      rootElement.style.left = "49%";
      rootElement.style.transform = "translateX(-50%) scaleY(0.95)";
      rootElement.style.backgroundColor = "#000";
      document.body.style.backgroundColor = "#000";
      // z index 99
      rootElement.style.zIndex = "99";
    }

    ZoomMtg.init({
      leaveUrl,
      patchJsMedia: true,
      leaveOnPageUnload: true,
      isSupportAV: true,
      success: () => {
        ZoomMtg.join({
          sdkKey: "hAoaCN2RXWAAL0dKOQxyw",
          signature,
          meetingNumber,
          userName: userName || "User",
          userEmail: userEmail || "user@example.com",
          passWord: passWord,
          success: (res) => {
            setIsMeetingStarted(true);
          },
          error: (err) => {
            console.error("Join error", err);
            toast.error("Failed to join meeting");
          },
        });
      },
      error: (err) => {
        console.error("Init error", err);
        toast.error("Failed to initialize meeting");
      },
    });
  };

  // Render countdown timer (same as dashboard)
  const renderCountdownTimer = (position = "top") => {
    if (!countdown) return null;

    const message = currentStatus === "upcoming" ? "Starts in" : "Ends in";

    if (position === "bottom") {
      return (
        <>
          {message} {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
        </>
      );
    }

    return (
      <div
        className={`flex items-center gap-2 text-xs ${
          countdown.isEndingSoon
            ? "bg-red-100 text-red-800"
            : "bg-blue-100 text-blue-800"
        } px-3 py-1.5 rounded-full`}
      >
        <Clock className="w-3 h-3 flex-shrink-0" />
        <span className="whitespace-nowrap font-medium">
          {message} {countdown.hours}h:{countdown.minutes}m:{countdown.seconds}s
        </span>
      </div>
    );
  };

  // Render join button with early join logic only for mentors
  const renderJoinButton = () => {
    if (currentStatus === "cancelled") {
      return (
        <div className="rounded-lg border border-gray-300 bg-gray-100 w-full mb-2">
          <div className="block w-full px-4 py-2 rounded text-center font-medium text-gray-600">
            Cancelled
          </div>
        </div>
      );
    }

    if (currentStatus === "ended") {
      if (
        cls?.zoomRecordingFiles?.length > 0 &&
        cls?.zoomRecordingFiles[0]?.vimeoUri
      ) {
        return (
          <div className="rounded-lg border border-[#0020B2] hover:bg-[#FFB800] w-full mb-2">
            <button
              onClick={() => setShowPlayer(true)}
              className="block w-full px-4 py-2 rounded text-center font-bold text-[#141B34]"
            >
              রেকর্ডিং দেখুন
            </button>
          </div>
        );
      }
      return (
        <div className="rounded-lg border border-gray-300 bg-gray-100 w-full mb-2">
          <div className="block w-full px-4 py-2 rounded text-center font-medium text-gray-600">
            {cls?.zoomRecordingFiles?.length > 0
              ? cls?.zoomRecordingFiles[0]?.vimeoUri
                ? null
                : "No Recording Available"
              : "Recording is Processing"}
          </div>
        </div>
      );
    }

    // For students: show countdown until class starts
    if (!isMentor && currentStatus === "upcoming") {
      return (
        <div className="flex flex-col gap-2 w-full mb-2">
          <div className="rounded-lg border border-blue-500 bg-blue-50 w-full">
            <div className="flex items-center justify-center gap-2 px-4 py-2">
              <Clock className="w-4 h-4 text-blue-700" />
              <span className="text-blue-700 font-medium text-sm">
                {renderCountdownTimer("bottom")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full justify-center">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span className="whitespace-nowrap">Class will start soon</span>
          </div>
        </div>
      );
    }

    // For mentors: early join logic
    if (isMentor && currentStatus === "upcoming" && !canJoin) {
      return (
        <div className="flex flex-col gap-2 w-full mb-2">
          <div className="flex items-center gap-2 text-xs bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full justify-center">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span className="whitespace-nowrap">
              Can join 10min before start
            </span>
          </div>
          {countdown && (
            <div className="rounded-lg border border-blue-500 bg-blue-50 w-full">
              <div className="flex items-center justify-center gap-2 px-4 py-2">
                <Clock className="w-4 h-4 text-blue-700" />
                <span className="text-blue-700 font-medium text-sm">
                  {renderCountdownTimer("bottom")}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Join button for both mentors and students when allowed
    const buttonText =
      isMentor && currentStatus === "upcoming" ? "Start Early" : "Join Class";

    return (
      <div className="rounded-lg border border-[#0020B2] hover:bg-[#FFB800] w-full mb-2">
        <button
          onClick={getSignature}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded text-center font-bold text-[#141B34] cursor-pointer"
        >
          <PlayCircle className="w-4 h-4" />
          {buttonText}
        </button>
      </div>
    );
  };

  const videoObj = useMemo(
    () => ({
      url: cls?.zoomRecordingFiles[0]?.vimeoUri || cls?.meetingLink,
      title: cls?.title,
    }),
    [cls?.zoomRecordingFiles, cls?.meetingLink, cls?.title]
  );

  return (
    <div className="relative rounded-xl shadow-lg border p-5 transition-shadow duration-200 group bg-white">
      <div id="zmmtg-root"></div>

      {/* Status and Countdown Header */}
      <div className="flex justify-between mb-2">
        <div className="flex gap-2 mt-1">
          <span
            className={`px-2 py-1 text-xs rounded-full capitalize flex items-center gap-1 ${
              currentStatus === "upcoming"
                ? "bg-blue-100 text-blue-800"
                : currentStatus === "ongoing"
                ? "bg-green-100 text-green-800"
                : currentStatus === "cancelled"
                ? "bg-gray-100 text-gray-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {currentStatus === "ongoing" && (
              <span className="relative flex h-2 w-2 mt-[1px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
            {currentStatus}
          </span>
        </div>
        <div className="flex gap-2 mt-1 mr-8">
          {currentStatus !== "cancelled" &&
            countdown &&
            renderCountdownTimer("top")}
        </div>
      </div>

      {/* Class Title and Admin Menu */}
      <div className="flex mb-2">
        <div>
          <h3 className="text-lg font-bold text-[#141B34] line-clamp-2 pr-4 capitalize">
            {cls?.title || "Live Class"}
          </h3>
        </div>
        <div>
          {isAdmin && (
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-black p-1 rounded-full"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 w-30 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-black hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center shadow"
                    onClick={() => {
                      setShowMenu(false);
                      updateBtnRef.current?.click();
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Update
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-black hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center shadow"
                    onClick={() => {
                      setShowMenu(false);
                      setNewStatus(
                        currentStatus === "cancelled" ? "active" : "cancelled"
                      );
                      setConfirmStatusChange(true);
                    }}
                  >
                    {currentStatus === "cancelled" ? (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2 text-green-600" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Ban className="w-4 h-4 mr-2 text-red-600" />
                        Cancel
                      </>
                    )}
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-yellow-200 transition-colors flex items-center"
                    onClick={() => {
                      setShowMenu(false);
                      setConfirmDelete(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mentor Info */}
      <div className="flex gap-4 my-6 items-center">
        <div>
          <Image
            src={
              cls?.mentor?.image
                ? `${process.env.NEXT_PUBLIC_API_URL}/${cls?.mentor.image}`
                : `/assets/icons/avatar.png`
            }
            alt={cls?.mentor?.fullName}
            height={500}
            width={500}
            className="w-16 h-16 rounded-full object-cover border"
          />
        </div>
        <div>
          <p className="font-bold">{cls?.mentor?.fullName || "Name"}</p>
          <p>{cls?.mentor?.designation || "Assistant Judge"}</p>
        </div>
      </div>

      {/* Courses */}
      <div
        className={`space-y-1 h-fit max-h-[74px] mb-2 ${
          cls?.courseId?.length > 1 && " overflow-y-auto no-scrollbar"
        }`}
      >
        {cls?.courseId?.map((course) => (
          <div
            key={course._id}
            className="bg-main/5 border border-main rounded-[16px] p-3 flex items-center gap-3"
          >
            <div className="w-[40px] h-[40px] bg-gray-200 flex items-center justify-center overflow-hidden rounded-[8px]">
              <Image
                src={
                  `${process.env.NEXT_PUBLIC_API_URL}/${course?.thumbnail}` ||
                  "/assets/icons/avatar.png"
                }
                alt="Course"
                height={40}
                width={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-[16px] leading-[150%] text-darkColor line-clamp-1">
              {course?.title || "Exam"}
            </span>
          </div>
        ))}
      </div>

      {/* Class Details */}
      <div className="flex flex-col mb-4">
        <div className="flex">
          <p className="text-[#74767C] font-bold w-[40%]">মডিউল</p>
          <p className="text-[#141B34] font-bold ml-12 w-[60%] line-clamp-1">
            {cls?.subjectType?.map((s) => s.subjectType).join(", ")}
          </p>
        </div>

        <div className="flex">
          <p className="text-[#74767C] font-bold w-[40%]">সাবজেক্ট</p>
          <p className="text-[#141B34] font-bold ml-12 w-[60%] line-clamp-1">
            {cls?.subjectId?.name}
          </p>
        </div>

        <div className="flex">
          <p className="text-[#74767C] font-bold w-[40%]">শুরু</p>
          <p className="text-[#141B34] font-bold ml-12 w-[60%]">
            {new Date(cls?.startDate).toLocaleDateString("en-GB")} -
            {new Date(`${cls?.startDate}T${cls?.startTime}`).toLocaleTimeString(
              "en-US",
              {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }
            )}
          </p>
        </div>

        <div className="flex">
          <p className="text-[#74767C] font-bold w-[40%]">সময়</p>
          <p className="text-[#141B34] font-bold ml-12 w-[60%]">
            {cls?.duration} minutes
          </p>
        </div>
      </div>

      {/* Action Button */}
      {renderJoinButton()}

      {/* Hidden Update Modal Trigger */}
      <CreateLiveClassModal
        isEdit
        initialData={cls}
        trigger={
          <button
            ref={updateBtnRef}
            style={{ display: "none" }}
            className="hidden"
          >
            Hidden Update Trigger
          </button>
        }
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-sm rounded-xl text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-lg font-medium text-black">
            Are you sure?
          </DialogTitle>
          <p className="text-sm text-black">
            Do you want to delete this live class? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button
              onClick={() => setConfirmDelete(false)}
              variant="outline"
              className="w-24 cursor-pointer border-gray-300 hover:bg-neutral-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white w-24 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <Dialog open={confirmStatusChange} onOpenChange={setConfirmStatusChange}>
        <DialogContent className="max-w-sm rounded-xl text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <DialogTitle className="text-lg font-medium text-black">
            Are you sure?
          </DialogTitle>
          <p className="text-sm text-black">
            {newStatus === "cancelled"
              ? "Do you want to cancel this live class?"
              : "Do you want to resume this live class?"}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button
              onClick={() => setConfirmStatusChange(false)}
              variant="outline"
              className="w-24 cursor-pointer border-gray-300 hover:bg-neutral-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusChange}
              className="bg-yellow-600 hover:bg-yellow-700 text-white w-24 cursor-pointer"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Yes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Player Modal */}
      {showPlayer && (
        <LiveClassRecordPlayer
          open={showPlayer}
          onClose={() => setShowPlayer(false)}
          video={videoObj}
        />
      )}
    </div>
  );
}
