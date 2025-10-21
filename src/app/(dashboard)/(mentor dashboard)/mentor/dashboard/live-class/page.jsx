"use client";
import LiveClassCard from "@/components/shared/LiveClassCard";
import React from "react";
import { useSelector } from "react-redux";
import { useGetAllLiveClassesByMentorQuery } from "@/redux/features/liveClass/liveClass.api";

import Loader from "@/components/shared/Loader";
const Page = () => {
  // Get mentor ID from Redux store
  const { user } = useSelector((state) => state.auth);
  const mentorId = user?._id;

  // Fetch all live classes for the mentor
  const {
    data: liveClasses = {},
    isLoading,
    error,
  } = useGetAllLiveClassesByMentorQuery(mentorId, { skip: !mentorId });

  if (!mentorId) {
    return (
      <div className="text-center py-8">
        Please login as a mentor to view this page
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading live classes. Please try again later.
      </div>
    );
  }

  // Function to convert AM/PM time to 24-hour format
  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "00:00";

    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours, 10);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    // Pad hours and minutes with leading zeros
    return `${hours.toString().padStart(2, "0")}:${minutes || "00"}`;
  };

  // Function to calculate class status
  const getClassStatus = (cls) => {
    try {
      const time24 = convertTo24Hour(cls.startTime);
      const startDateTime = new Date(`${cls.startDate}T${time24}:00`);
      const endDateTime = new Date(
        startDateTime.getTime() + cls.duration * 60000
      );
      const now = new Date();

      if (now > endDateTime) return "ended";
      if (now < startDateTime) return "upcoming";
      if (now >= startDateTime && now <= endDateTime) return "ongoing";
      return "ended";
    } catch (error) {
      console.error("Error calculating class status:", error);
      return "ended";
    }
  };

  // Filter classes into categories
  const filterClasses = () => {
    if (!liveClasses?.data || !Array.isArray(liveClasses.data)) {
      return { upcoming: [], ongoing: [], previous: [] };
    }

    return liveClasses.data.reduce(
      (acc, cls) => {
        const status = getClassStatus(cls);

        if (status === "upcoming") acc.upcoming.push(cls);
        else if (status === "ongoing") acc.ongoing.push(cls);
        else acc.previous.push(cls);

        return acc;
      },
      { upcoming: [], ongoing: [], previous: [] }
    );
  };

  const { upcoming, ongoing, previous } = filterClasses();

  return (
    <div className="p-4">
      {/* Upcoming Classes Section */}
      <div className="shadow-lg rounded-xl border mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-[#F2F7FC] p-3 sm:p-4 rounded-t-xl">
          <div className="flex gap-2 mb-2 sm:mb-0">
            <img src="/live-streaming.svg" alt="" className="w-5 h-5" />
            <h2 className="text-sm sm:text-md font-semibold">
              আসন্ন লাইভ ক্লাস
            </h2>
          </div>
        </div>

        {upcoming.length === 0 && ongoing.length === 0 ? (
          <div className="text-center text-deepGray py-20 text-sm sm:text-base">
            কোনো আসন্ন লাইভ ক্লাস পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 bg-white rounded-xl p-3 sm:p-4">
            {[...upcoming, ...ongoing].map((cls) => (
              <LiveClassCard key={cls._id} cls={cls} />
            ))}
          </div>
        )}
      </div>

      {/* Previous Classes Section */}
      <div className="shadow-lg rounded-xl border mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-[#F2F7FC] p-3 sm:p-4 rounded-t-xl">
          <div className="flex gap-2 mb-2 sm:mb-0">
            <img src="/play.svg" alt="" className="w-5 h-5" />
            <h2 className="text-sm sm:text-md font-semibold">
              পূর্ববর্তী লাইভ ক্লাস
            </h2>
          </div>
        </div>

        {previous.length === 0 ? (
          <div className="text-center text-deepGray py-20 text-sm sm:text-base">
            কোনো পূর্ববর্তী লাইভ ক্লাস পাওয়া যায়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 bg-white rounded-xl p-3 sm:p-4">
            {previous.map((cls) => (
              <LiveClassCard key={cls._id} cls={cls} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
