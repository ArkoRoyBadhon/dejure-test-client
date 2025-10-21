"use client";
import LiveClassCard from "@/components/shared/LiveClassCard";
import CreateLiveClassModal from "@/components/shared/Modals/CreateLiveClassModal";
import { useGetClassByCourseIdQuery } from "@/redux/features/liveClass/liveClass.api";
import { useSelector } from "react-redux";

export default function LiveClassesByCourse({ id }) {
  const { data, isLoading, isError } = useGetClassByCourseIdQuery(id);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  if (isLoading) return <p>লোড হচ্ছে...</p>;
  if (isError) return <p>কিছু ভুল হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।</p>;

  // Function to convert AM/PM time to 24-hour format
  const convertTo24Hour = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");

    if (period === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    }
    if (period === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours}:${minutes}`;
  };

  // Function to calculate class status
  const getClassStatus = (cls) => {
    const time24 = convertTo24Hour(cls.startTime);
    const startDateTime = new Date(`${cls.startDate}T${time24}`);
    const endDateTime = new Date(
      startDateTime.getTime() + cls.duration * 60000
    );
    const now = new Date();

    if (now > endDateTime) return "ended";
    if (now < startDateTime) return "upcoming";
    if (now >= startDateTime && now <= endDateTime) return "ongoing";
    return "ended";
  };

  // Filter classes into categories
  const filterClasses = () => {
    if (!data?.data) return { upcoming: [], ongoing: [], previous: [] };

    return data.data.reduce(
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
    <div className="space-y-6">
      {/* Upcoming Classes */}
      <div className="shadow-lg rounded-xl border">
        <div className="flex items-center justify-between bg-[#F2F7FC] p-4 rounded-t-xl">
          <div className="flex items-center gap-2">
            <img src="/live-streaming.svg" alt="" className="w-5 h-5" />
            <h2 className="font-semibold">আসন্ন লাইভ ক্লাস</h2>
          </div>
          {isAdmin && <CreateLiveClassModal id={id} />}
        </div>
        {[...ongoing, ...upcoming].length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-b-xl">
            {[...ongoing, ...upcoming].map((cls) => (
              <LiveClassCard key={cls._id} cls={cls} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            কোনো আসন্ন লাইভ ক্লাস নেই
          </div>
        )}
      </div>

      {/* Previous Classes */}
      <div className="shadow-lg rounded-xl border">
        <div className="flex items-center bg-[#F2F7FC] p-4 rounded-t-xl">
          <div className="flex items-center gap-2">
            <img src="/play.svg" alt="" className="w-5 h-5" />
            <h2 className="font-semibold">পূর্ববর্তী লাইভ ক্লাস</h2>
          </div>
        </div>
        {previous.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-b-xl">
            {previous.map((cls) => (
              <LiveClassCard key={cls._id} cls={cls} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            কোনো পূর্ববর্তী লাইভ ক্লাস নেই
          </div>
        )}
      </div>
    </div>
  );
}
