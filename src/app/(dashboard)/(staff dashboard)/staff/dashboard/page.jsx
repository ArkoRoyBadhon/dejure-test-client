"use client";
import React from "react";
import LiveClassCard from "@/components/shared/LiveClassCard";
import { useSelector } from "react-redux";
import { useGetUpcomingLiveClassesByMentorQuery } from "@/redux/features/liveClass/liveClass.api";

import Loader from "@/components/shared/Loader";
const Page = () => {
  const { user } = useSelector((state) => state.auth);
  const mentorId = user?._id;

  // Fetch upcoming live classes
  const {
    data: upcomingClassesResponse,
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useGetUpcomingLiveClassesByMentorQuery(mentorId, { skip: !mentorId });

  // Function to calculate class status
  const getClassStatus = (cls) => {
    const startDateTime = new Date(cls.dateTime); // directly from API
    const endDateTime = new Date(
      startDateTime.getTime() + cls.duration * 60000
    );
    const now = new Date();

    if (now > endDateTime) return "ended";
    if (now < startDateTime) return "upcoming";
    return "ongoing";
  };

  // Filter classes into upcoming and ongoing
  const filterClasses = (classes) => {
    if (!classes?.length) return { upcoming: [], ongoing: [] };

    return classes.reduce(
      (acc, cls) => {
        const status = getClassStatus(cls);
        if (status === "upcoming") acc.upcoming.push(cls);
        else if (status === "ongoing") acc.ongoing.push(cls);
        return acc;
      },
      { upcoming: [], ongoing: [] }
    );
  };

  const upcomingClasses = upcomingClassesResponse || [];
  const { upcoming, ongoing } = filterClasses(upcomingClasses);

  // Sort so ongoing first, then upcoming by soonest date
  const activeClasses = [
    ...ongoing.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)),
    ...upcoming.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)),
  ];

  if (upcomingLoading) return <Loader />;
  if (upcomingError) return <div className="p-4">Error loading classes</div>;

  return (
    <div className="p-4">
      stuff dashboard
      {/* <DashboardBody /> */}
      {/* <div className="shadow-lg rounded-xl border mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-[#F2F7FC] p-3 sm:p-4 rounded-t-xl">
          <div className="flex gap-2 mb-2 sm:mb-0">
            <img src="/live-streaming.svg" alt="" className="w-5 h-5" />
            <h2 className="text-sm sm:text-md font-semibold">
              আসন্ন লাইভ ক্লাস
            </h2>
          </div>
        </div>

        {activeClasses.length === 0 ? (
          <div className="text-center text-gray-500 py-20 text-sm sm:text-base">
            কোনো আসন্ন ক্লাস নেই।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 bg-white rounded-xl p-3 sm:p-4">
            {activeClasses.map((cls) => (
              <LiveClassCard key={cls._id} cls={cls} />
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Page;
