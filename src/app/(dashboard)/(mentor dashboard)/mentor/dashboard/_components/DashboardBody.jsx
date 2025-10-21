"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetHighlightedExamsAndClassesQuery } from "@/redux/features/liveexams/liveExam.Api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { Clock, PlayCircle, AlertCircle } from "lucide-react";

const DashboardBody = () => {
  const router = useRouter();
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [signature, setSignature] = useState(null);
  const [meetingNumber, setMeetingNumber] = useState(null);
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch highlighted exams and classes
  const {
    data: highlightedData,
    isLoading,
    isError,
  } = useGetHighlightedExamsAndClassesQuery();

  const quickAccessItems = [
    {
      icon: "/assets/icons/calendar-02.png",
      title: "রুটিন",
      link: "/mentor/dashboard/class-calendar",
    },
    {
      icon: "/assets/icons/live-streaming.png",
      title: "লাইভ এক্সামসমূহ",
      link: "/mentor/dashboard/exam-assessment",
    },
    {
      icon: "/assets/icons/note-03.png",
      title: "লাইভ ক্লাসমূহ",
      link: "/mentor/dashboard/live-class",
    },
    {
      icon: "/assets/icons/mentoring.png",
      title: "আমার কোর্স",
      link: "/mentor/dashboard/my-courses",
    },
  ];

  // Extract data from the query result
  const highlightedExam = highlightedData?.data?.highlightedExam;
  const examType = highlightedData?.data?.examType;
  const highlightedLiveClass = highlightedData?.data?.highlightedLiveClass;
  const liveClassType = highlightedData?.data?.liveClassType;
  const canJoinEarly = highlightedData?.data?.canJoinEarly || false;
  const serverCountdown = highlightedData?.data?.countdown;

  // Memoized countdown calculation
  const countdown = useMemo(() => {
    if (
      !highlightedLiveClass ||
      !highlightedLiveClass.startDate ||
      !highlightedLiveClass.startTime
    ) {
      return null;
    }

    // Use server countdown if available
    if (serverCountdown) {
      return {
        hours: serverCountdown.hours.toString().padStart(2, "0"),
        minutes: serverCountdown.minutes.toString().padStart(2, "0"),
        seconds: serverCountdown.seconds.toString().padStart(2, "0"),
        totalSeconds: serverCountdown.totalSeconds,
        isEndingSoon: serverCountdown.totalSeconds < 1800, // 30 minutes in seconds
      };
    }

    const parseDateTime = (dateStr, timeStr) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      let [hours, minutes] = timeStr.split(":").map(Number);

      if (timeStr.includes(" ")) {
        const [timePart, period] = timeStr.split(" ");
        [hours, minutes] = timePart.split(":").map(Number);
        if (period.toLowerCase() === "pm" && hours < 12) hours += 12;
        if (period.toLowerCase() === "am" && hours === 12) hours = 0;
      }

      return new Date(year, month - 1, day, hours, minutes || 0, 0);
    };

    const start = parseDateTime(
      highlightedLiveClass.startDate,
      highlightedLiveClass.startTime
    );
    const end = new Date(
      start.getTime() + highlightedLiveClass.duration * 60000
    );

    const target = currentTime < start ? start : currentTime < end ? end : null;
    if (!target) {
      return null;
    }

    const diff = target - currentTime;
    if (diff <= 0) {
      return null;
    }

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
  }, [highlightedLiveClass, serverCountdown, currentTime]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Zoom Meeting SDK Integration
  const getSignature = async (liveClass) => {
    if (!liveClass) return;

    const meetingNum = Number(liveClass.zoomMeetingData.id);
    const passWord = liveClass.zoomMeetingData.password;
    const role = 1; // 1 for host (mentor)

    setMeetingNumber(meetingNum);
    setPassword(passWord);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/zoom/generate-signature`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meetingNumber: meetingNum,
            role,
            userName: userName || "Mentor User",
          }),
        }
      );

      const data = await response.json();
      if (data.signature) {
        setSignature(data.signature);
        startMeeting(data.signature, meetingNum, passWord);
      }
    } catch (err) {
      console.error("Failed to fetch signature", err);
    }
  };

  const startMeeting = async (signature, meetingNumber, password) => {
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
    }

    ZoomMtg.init({
      leaveUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/mentor/dashboard/live-class`,
      patchJsMedia: true,
      leaveOnPageUnload: true,
      isSupportAV: true,
      success: () => {
        ZoomMtg.join({
          sdkKey: "hAoaCN2RXWAAL0dKOQxyw",
          signature,
          meetingNumber,
          userName: userName || "Mentor User",
          userEmail: userEmail || "mentor@example.com",
          passWord: password,
          success: (res) => {
            setIsMeetingStarted(true);
          },
          error: (err) => {},
        });
      },
      error: (err) => {},
    });
  };

  const renderCountdownTimer = () => {
    if (
      !highlightedLiveClass ||
      !highlightedLiveClass.startDate ||
      !highlightedLiveClass.startTime
    ) {
      return null;
    }

    const parseDateTime = (dateStr, timeStr) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      let [hours, minutes] = timeStr.split(":").map(Number);

      if (timeStr.includes(" ")) {
        const [timePart, period] = timeStr.split(" ");
        [hours, minutes] = timePart.split(":").map(Number);
        if (period.toLowerCase() === "pm" && hours < 12) hours += 12;
        if (period.toLowerCase() === "am" && hours === 12) hours = 0;
      }

      return new Date(year, month - 1, day, hours, minutes || 0, 0);
    };

    const start = parseDateTime(
      highlightedLiveClass.startDate,
      highlightedLiveClass.startTime
    );
    const end = new Date(
      start.getTime() + highlightedLiveClass.duration * 60000
    );

    const target = currentTime < start ? start : currentTime < end ? end : null;
    if (!target) {
      return null;
    }

    const diff = target - currentTime;
    if (diff <= 0) {
      return null;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const isEndingSoon = totalSeconds < 1800; // 30 minutes

    const message = liveClassType === "ongoing" ? "Ends in" : "Starts in";

    return (
      <div
        className={`flex items-center gap-2 text-xs ${
          isEndingSoon ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
        } px-3 py-1.5 rounded-full`}
      >
        <Clock className="w-3 h-3 flex-shrink-0" />
        <span className="whitespace-nowrap font-medium">
          {message} {hours.toString().padStart(2, "0")}h:
          {minutes.toString().padStart(2, "0")}m:
          {seconds.toString().padStart(2, "0")}s
        </span>
      </div>
    );
  };

  const renderJoinButton = () => {
    if (!highlightedLiveClass) return null;

    // Parse the start time
    const parseDateTime = (dateStr, timeStr) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      let [hours, minutes] = timeStr.split(":").map(Number);

      if (timeStr.includes(" ")) {
        const [timePart, period] = timeStr.split(" ");
        [hours, minutes] = timePart.split(":").map(Number);
        if (period.toLowerCase() === "pm" && hours < 12) hours += 12;
        if (period.toLowerCase() === "am" && hours === 12) hours = 0;
      }

      return new Date(year, month - 1, day, hours, minutes || 0, 0);
    };

    const startTime = parseDateTime(
      highlightedLiveClass.startDate,
      highlightedLiveClass.startTime
    );

    // Calculate 10 minutes before start time
    const tenMinutesBeforeStart = new Date(startTime.getTime() - 10 * 60000);

    // Check if current time is within the allowed window
    const canJoinEarly = currentTime >= tenMinutesBeforeStart;
    const canJoin = liveClassType === "ongoing" || canJoinEarly;

    if (!canJoin) {
      return (
        <div className="flex items-center gap-2 text-xs bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span className="whitespace-nowrap">Can join 10min before start</span>
        </div>
      );
    }

    return (
      <Button
        size="sm"
        className="text-xs px-3 py-1.5 rounded-full bg-main text-white hover:bg-main/90 whitespace-nowrap"
        onClick={() => getSignature(highlightedLiveClass)}
      >
        <PlayCircle className="w-3 h-3 mr-1" />
        {liveClassType === "ongoing" ? "Join Class" : "Start Early"}
      </Button>
    );
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading data. Please try again later.
      </div>
    );
  }

  return (
    <div className="shadow2 p-4 rounded-[16px]">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Quick Access */}
        <div className="flex-1">
          <h4 className="font-bold text-[20px] text-darkColor">
            দ্রুত অ্যাক্সেস
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {quickAccessItems.map((item, index) => (
              <div
                key={index}
                onClick={() => router.push(item.link)}
                className="bg-main/3 border border-main rounded-[16px] p-4 shadow2 h-[152px] center flex-col gap-4 
                hover:bg-main hover:border-main transition-all duration-300 cursor-pointer"
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <p className="text-center">{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 shadow-lg rounded-xl border">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-[#F2F7FC] p-3 sm:p-4 rounded-t-xl">
            <div className="flex gap-2 mb-2 sm:mb-0">
              <img src="/assets/icons/note-03.png" alt="" className="w-5 h-5" />
              <h2 className="text-sm sm:text-md font-semibold">
                হাইলাইটেড টাস্ক
              </h2>
            </div>
          </div>

          <div className="space-y-4 p-4">
            {/* Exam Card */}
            {highlightedExam && (
              <Card className="bg-white border-gray-200 shadow-sm py-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">
                      {examType === "ongoing"
                        ? "Ongoing "
                        : "Evaluation Pending "}
                      {highlightedExam.scheduledDate}
                    </span>
                    <Button
                      size="sm"
                      variant={
                        examType === "ongoing" ? "default" : "destructive"
                      }
                      className={`text-xs px-3 py-1 rounded-full ${
                        examType === "ongoing"
                          ? "bg-blue hover:bg-blue/90 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                      onClick={() =>
                        router.push(
                          `/mentor/dashboard/exam-assessment/${highlightedExam?._id}`
                        )
                      }
                    >
                      {examType === "ongoing"
                        ? "পরীক্ষা মূল্যায়ন"
                        : "মূল্যায়ন করুন"}
                    </Button>
                  </div>

                  <div className="flex items-start md:items-center gap-3 mb-3 bg-main/3 rounded-[16px] border border-main p-3">
                    <div className="w-[80px] h-[68px] rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {highlightedExam.courses[0]?.thumbnail && (
                        <Image
                          src={
                            highlightedExam.courses[0].thumbnail
                              ? `${process.env.NEXT_PUBLIC_API_URL}/${highlightedExam.courses[0].thumbnail}`
                              : "/assets/fallImg.jpg"
                          }
                          alt="Course"
                          width={80}
                          height={68}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {highlightedExam.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {highlightedExam.courses[0]?.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {examType === "ongoing" ? "Ends at: " : "Ended at: "}
                        {highlightedExam.scheduledDate} at{" "}
                        {highlightedExam.scheduledTime}
                        {examType === "ongoing" &&
                          ` (${highlightedExam.durationMinutes} minutes)`}
                      </p>
                      {examType !== "ongoing" && (
                        <p className="text-xs text-red-500 mt-1">
                          Result not published yet
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Live Class Card */}
            <Card className="bg-white border-gray-200 shadow-sm py-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 font-medium">
                    Today - {currentTime.toLocaleDateString()}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs px-3 py-1 rounded-full border-gray-300 text-gray-700 hover:bg-main/90"
                    onClick={() => router.push("/mentor/dashboard/live-class")}
                  >
                    লাইভ ক্লাস
                  </Button>
                </div>

                {highlightedLiveClass ? (
                  <div className="flex items-start md:items-center gap-3 mb-3 bg-main/3 rounded-[16px] border border-main p-3">
                    <div className="w-[80px] h-[68px] rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={
                          highlightedLiveClass.subjectId.thumbnail
                            ? `${process.env.NEXT_PUBLIC_API_URL}/${highlightedLiveClass.subjectId.thumbnail}`
                            : "/assets/fallImg.jpg"
                        }
                        alt={highlightedLiveClass.subjectId.name}
                        width={80}
                        height={68}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base mb-1">
                        {highlightedLiveClass.title}
                      </h3>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm text-gray-600">
                        <span className="text-left">
                          {highlightedLiveClass.subjectId.name}
                        </span>
                        <span className="hidden md:block">•</span>
                        <span>
                          {highlightedLiveClass.startDate} at{" "}
                          {highlightedLiveClass.startTime}
                        </span>
                        {liveClassType === "ongoing" && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                            Live Now
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {renderJoinButton()}
                        {renderCountdownTimer()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No live classes scheduled
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Zoom Meeting Container */}
      <div id="zmmtg-root"></div>
    </div>
  );
};

export default DashboardBody;
