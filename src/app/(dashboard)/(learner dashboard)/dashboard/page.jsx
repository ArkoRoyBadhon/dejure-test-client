"use client";

import {
  Video,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  CreditCard,
  Mail,
  Phone,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useGetDueEnrollmentBylearnerQuery } from "@/redux/features/enroll/enroll.api";
import { useGetLiveClassesByLearnerQuery } from "@/redux/features/liveClass/liveClass.api";
import { useGetAllLiveExamsByLearnerQuery } from "@/redux/features/liveexams/liveExam.Api";
import LiveExamCardLearner from "./live-exam/_components/LiveExamCardLearner";
import Loader from "@/components/shared/Loader";
import LiveClassCard from "@/components/shared/LiveClassCard";

export default function DashboardSection() {
  const user = useSelector((state) => state.auth?.user);
  const learner = useSelector((state) => state.auth?.user?._id);
  const { data: dueEnrollments } = useGetDueEnrollmentBylearnerQuery(learner);

  // Helper function to calculate days left
  const calculateDaysLeft = (nextPayDate) => {
    const now = new Date();
    const payDate = new Date(nextPayDate);
    const timeDiff = payDate.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  // Replace the static Course Card with this dynamic version
  const CourseCard = () => {
    if (!dueEnrollments?.data) return null;

    const enrollment = dueEnrollments;
    const secondMilestone = enrollment.milestonePayments?.[1];
    const daysLeft = secondMilestone?.nextPayDate
      ? calculateDaysLeft(secondMilestone.nextPayDate)
      : null;

    return (
      <Card className="p-6 h-full">
        <CardHeader className="flex flex-col space-y-4 px-0 font-bold">
          গুরুত্বপূর্ণ নোটিশ
        </CardHeader>
        <CardContent className="p-0 h-full">
          {dueEnrollments?.data?.length > 0 ? (
            <div className="space-y-4">
              {dueEnrollments.data.map((enrollment) => {
                const secondMilestone = enrollment.milestonePayments?.[1];
                const daysLeft = secondMilestone?.nextPayDate
                  ? calculateDaysLeft(secondMilestone.nextPayDate)
                  : null;

                return (
                  <div key={enrollment?._id} className="flex flex-col">
                    <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 border-[1.5px] border-main p-4 sm:p-6 rounded-[24px] bg-main/5">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-[16px] flex-shrink-0 overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${enrollment.course.thumbnail}`}
                          alt="Course thumbnail"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 h-full flex justify-center flex-col w-full">
                        <h3 className="font-bold text-darkColor text-[16px] sm:text-[20px] leading-[160%] mb-2">
                          {enrollment.course.title}
                        </h3>
                        {daysLeft && (
                          <p className="text-[14px] sm:text-[16px] text-darkColor font-medium">
                            আপনার পরবর্তী ইনস্টলমেন্ট প্রধান এর সময় বাকি{" "}
                            {daysLeft} দিন
                          </p>
                        )}
                        <Link href="/dashboard/payments" className="mt-2">
                          <Button className="bg-main hover:bg-main text-white px-4 sm:px-6 py-2 rounded-full w-full text-sm sm:text-base">
                            পে করুন
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Empty state UI
            <div className="flex flex-col items-center justify-center p-8 text-center h-full">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                কোন নোটিশ নেই
              </h3>
              <p className="text-gray-500 mb-4">
                এই মুহূর্তে আপনার জন্য কোন গুরুত্বপূর্ণ নোটিশ নেই
              </p>
              <Link href="/dashboard/courses">
                <Button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full">
                  কোর্স ব্রাউজ করুন
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const quickAccessItems = [
    {
      title: "লাইভ ক্লাসগুলো",
      subtitle: "Live Classes",
      icon: Video,
      isActive: true,
      href: "/dashboard/courses",
    },
    {
      title: "নোটিশ বোর্ডগুলো",
      subtitle: "Notice Boards",
      icon: FileText,
      isActive: false,
      href: "/dashboard/notice",
    },
    {
      title: "ক্যালেন্ডার",
      subtitle: "Calendar",
      icon: Calendar,
      isActive: false,
      href: "/dashboard/calendar",
    },
    {
      title: "আমার টেস্ট",
      subtitle: "My Tests",
      icon: Users,
      isActive: false,
      href: "/dashboard/courses",
    },
    {
      title: "পারফরমেন্স",
      subtitle: "Performance",
      icon: TrendingUp,
      isActive: false,
      href: "/dashboard/reports",
    },
    {
      title: "পেমেন্ট",
      subtitle: "Payment",
      icon: CreditCard,
      isActive: false,
      href: "/dashboard/payments",
    },
  ];

  const { data, isLoading, isError } = useGetLiveClassesByLearnerQuery();

  // // const id = "hhh"
  const { data: allExamsResponse } = useGetAllLiveExamsByLearnerQuery();

  if (isLoading) return <Loader text="লোড হচ্ছে..." />;
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

  // // Function to calculate class status
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

  // // Filter classes into categories
  const filterClasses = () => {
    if (!data?.data.all) return { upcoming: [], ongoing: [], previous: [] };

    return data.data.all.reduce(
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
    <div className="p-2 sm:p-4 bg-gray-50 min-h-screen">
      {/* Main Content Grid */}
      <Card className="w-full p-2 sm:p-4 shadow2">
        <div className="grid grid-cols-1 lg:grid-cols-2 border p-3 sm:p-6 rounded-[16px] bg-gray2 gap-4 lg:gap-6">
          {/* User Profile Card */}
          <Card className=" bg-transparent border-none shadow-none">
            <CardContent className="p-0">
              <div className="flex flex-col space-y-4">
                <Image
                  src={
                    user?.image
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${user?.image}`
                      : "/assets/icons/avatar.png"
                  }
                  alt="User Profile"
                  height={100}
                  width={100}
                  className="w-20 h-20 object-cover rounded-full"
                />

                <div className=" space-y-2">
                  <h3 className="text-[20px] font-bold leading-[150%] text-darkColor">
                    {user?.fullName || "ভাগ্যকিশোর সানি"}
                  </h3>

                  <div className="space-y-[10px] text-sm text-darkColor">
                    <div className="flex items-center space-x-2  ">
                      <Mail className="h-4 w-4" />
                      <span>{user?.email || "testfaq@gmail.com"}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{user?.phone || "01961343967"}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4" />
                      <span>ID: {user?.studentId || "252405"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Course Card */}
          <CourseCard />
        </div>

        {/* Quick Access Section */}
        <div className="space-y-4">
          <h2 className="text-[18px] sm:text-[20px] font-bold leeading-[150%] text-darkColor">
            দ্রুত অ্যাক্সেস
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {quickAccessItems.map((item, index) => (
              <Link href={item.href} key={index} passHref>
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    item.isActive
                      ? "bg-main text-white shadow-lg"
                      : "bg-main/5 border-main hover:bg-main/20"
                  }`}
                >
                  <CardContent className="p-2 sm:p-4 text-center">
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex justify-center">
                        <item.icon
                          className={`h-6 w-6 sm:h-8 sm:w-8 ${
                            item.isActive ? "text-white" : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`text-xs sm:text-sm font-medium ${
                            item.isActive ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p
                          className={`text-[10px] sm:text-xs ${
                            item.isActive ? "text-amber-100" : "text-gray-500"
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
        {/* Upcoming Classes */}
        <div className="shadow-lg rounded-xl border">
          <div className="flex items-center justify-between bg-[#F2F7FC] p-3 sm:p-4 rounded-t-xl">
            <div className="flex items-center gap-2">
              <img
                src="/live-streaming.svg"
                alt=""
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              <h2 className="font-semibold text-sm sm:text-base">
                আসন্ন লাইভ ক্লাস
              </h2>
            </div>
          </div>
          {[...ongoing, ...upcoming].length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-b-xl">
              {[...ongoing, ...upcoming].map((cls) => (
                <LiveClassCard key={cls?._id} cls={cls} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10 sm:py-20 text-sm sm:text-base">
              কোনো আসন্ন লাইভ ক্লাস নেই
            </div>
          )}
        </div>

        {/* Previous Classes */}
        <div className="shadow-lg rounded-xl border">
          <div className="flex items-center bg-[#F2F7FC] p-3 sm:p-4 rounded-t-xl">
            <div className="flex items-center gap-2">
              <img
                src="/assets/icons/note-03 (2).png"
                alt=""
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              <h2 className="font-semibold text-sm sm:text-base">
                আসন্ন লাইভ এক্সাম
              </h2>
            </div>
          </div>
          {allExamsResponse && allExamsResponse?.upcomingExams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-b-xl">
              {allExamsResponse &&
                allExamsResponse?.upcomingExams?.map((exam) => (
                  <LiveExamCardLearner
                    key={exam?._id}
                    examData={exam}
                    onDelete={() => {}}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10 sm:py-20 text-sm sm:text-base">
              কোনো পূর্ববর্তী লাইভ এক্সাম নেই
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
