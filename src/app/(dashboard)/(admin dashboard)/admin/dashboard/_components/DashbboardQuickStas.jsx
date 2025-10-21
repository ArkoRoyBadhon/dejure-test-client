"use client";
import {
  Video,
  Radio,
  BookOpen,
  Users,
  Bell,
  UserPlus,
  GraduationCap,
  Ticket,
  Monitor,
  BookOpenCheck,
  User,
  UserCheck,
  DollarSign,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCoursesQuery } from "@/redux/features/course/course.api";
import { useDashboardStatsQuery } from "@/redux/features/auth/admin.api";
import { useSelector } from "react-redux";

export default function DashbboardQuickStas() {
  const { user } = useSelector((state) => state.auth);

  const {
    data: coursesData,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useGetCoursesQuery();
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
  } = useDashboardStatsQuery();

  // Check if staff user has access to dashboard module
  const hasDashboardAccess = () => {
    if (user?.role !== "staff") return true;

    // Find dashboard module in user's moduleAccess
    const dashboardModule = user?.roleType?.moduleAccess?.find(
      (module) => module.module?.name === "dashboard"
    );

    return dashboardModule?.isEnabled === true;
  };

  // If staff user doesn't have dashboard access, show permission error
  if (user?.role === "staff" && !hasDashboardAccess()) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full mx-auto p-8 text-center bg-red-100 border-red-200">
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-red-100 rounded-full">
                <Shield className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Access Denied
              </h2>
              <p className="text-gray-600">
                You don't have permission to access the dashboard. Please
                contact your administrator.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <AlertTriangle className="w-4 h-4" />
              <span>Permission Error</span>
            </div>

            {/* visit other permitted pages  */}
            <div className="flex items-center justify-center space-x-2 text-gray-500 text-2xl font-bold">
              Visit other permitted pages: By clicking the Sidebar Menu
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const actionCards = [
    {
      title: "Schedule live Class",
      icon: Video,
      highlighted: true,
      path: "/admin/dashboard/live-class",
    },
    {
      title: "Schedule live Exam",
      icon: Radio,
      highlighted: false,
      path: "/admin/dashboard/live-exam",
    },
    {
      title: "Create Course",
      icon: BookOpen,
      highlighted: false,
      path: "/admin/dashboard/course",
    },
    {
      title: "Create Question Set",
      icon: Users,
      highlighted: false,
      path: "/admin/dashboard/question-set",
    },
    {
      title: "Create Notice",
      icon: Bell,
      highlighted: false,
      path: "/admin/dashboard/notice",
    },
    {
      title: "Create Student",
      icon: UserPlus,
      highlighted: false,
      path: "/admin/dashboard/manage-students",
    },
    {
      title: "Enrolled Student",
      icon: GraduationCap,
      highlighted: false,
      path: "/admin/dashboard/enrollment",
    },
    {
      title: "Create Coupon Code",
      icon: Ticket,
      highlighted: false,
      path: "/admin/dashboard/manage-promotion/coupon",
    },
    {
      title: "CRM",
      icon: Monitor,
      highlighted: false,
      path: "/admin/dashboard/crm/dashboard",
    },
  ];

  // Default stats structure if data is loading or not available
  const defaultStats = [
    {
      title: "Active Courses",
      value: "0",
      icon: BookOpenCheck,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Total Student",
      value: "0",
      icon: User,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Currently Enrolled",
      value: "0",
      icon: UserCheck,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Total Mentor",
      value: "0",
      icon: GraduationCap,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Total Revenue",
      value: "0 ৳",
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "This Month Revenue",
      value: "0 ৳",
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Upcoming Revenue",
      value: "0 ৳",
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "This Year Revenue",
      value: "0 ৳",
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  // Use actual stats data if available
  const stats = statsData?.data || defaultStats;

  // Calculate total revenue for each course
  const calculateCourseRevenue = (course) => {
    // This is a placeholder - you'll need to implement actual revenue calculation
    // based on your business logic (e.g., sum of all enrollments for this course)
    return course.students.length * 5000; // Example calculation
  };

  return (
    <div className="">
      <div className=" mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h1 className="text-xl font-semibold text-darkColor mb-4">
            Dashboard
          </h1>
          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {actionCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <Link key={index} href={card.path} className="block">
                  <Card
                    className={`cursor-pointer transition-all rounded-[24px] hover:shadow-md max-h- ${
                      card.highlighted
                        ? "bg-[#FFB800] text-white border-yellow-400"
                        : "bg-main/5 border-main hover:border-yellow-300"
                    }`}
                  >
                    <CardContent className="p-1 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <IconComponent
                          className={`w-8 h-8 font-bold text-darkColor`}
                        />
                        <span
                          className={`text-[18px] leading-[150%]  ${
                            card.highlighted
                              ? "text-darkColor font-bold"
                              : "text-darkColor"
                          }`}
                        >
                          {card.title}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-darkColor">Statistics</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;

                // Show skeleton while loading
                if (statsLoading) {
                  return (
                    <Card
                      key={index}
                      className="bg-main/5 border-main rounded-[24px] max-h-[131px]"
                    >
                      <CardContent className="px-6 py-4">
                        <div className="space-y-3">
                          <Skeleton className="h-4 w-3/4 bg-gray-300" />
                          <div className="flex items-center mt-4 justify-between">
                            <Skeleton className="h-8 w-1/2 bg-gray-300" />
                            <Skeleton className="h-12 w-12 rounded-lg bg-gray-300" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }

                return (
                  <Card
                    key={index}
                    className="bg-main/5 border-main rounded-[24px] max-h-[131px]"
                  >
                    <CardContent className="px-6">
                      <div className="">
                        <div className="space-y-2">
                          <p className="text-[18px] leading-[150%] font-medium text-darkColor">
                            {stat.title}
                          </p>
                        </div>
                        <div className="flex items-center mt-4 justify-between">
                          <p className="text-2xl font-bold text-darkColor">
                            {stat.value}
                          </p>

                          <div className={`p-3 rounded-lg ${stat.color}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Performing Course Section */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-darkColor">
              Top Performing Courses
            </h2>

            {coursesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-[#FFB8000D] border border-[#FFB80066] p-4 rounded-xl w-full h-full"
                  >
                    <div className="flex flex-col lg:flex-row gap-4">
                      <Skeleton className="h-40 w-40 rounded-xl bg-gray-300 mx-auto lg:mx-0" />
                      <div className="flex flex-col justify-center space-y-2 text-center lg:text-left w-full">
                        <Skeleton className="h-6 w-3/4 bg-gray-300 mx-auto lg:mx-0" />
                        <Skeleton className="h-4 w-full bg-gray-300" />
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                          <Skeleton className="h-6 w-20 bg-gray-300" />
                          <Skeleton className="h-6 w-24 bg-gray-300" />
                        </div>
                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-2">
                          <Skeleton className="h-8 w-32 bg-gray-300" />
                          <Skeleton className="h-8 w-36 bg-gray-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : coursesError ? (
              <div className="text-center py-8 text-red-500">
                Failed to load courses
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(coursesData) &&
                  [...coursesData]
                    .sort((a, b) => b.students.length - a.students.length)
                    .slice(0, 4) // Show only top 4 courses
                    .map((course) => (
                      <Link
                        key={course._id}
                        href={`/admin/dashboard/course/manage/${course._id}`}
                        className="block"
                      >
                        <div className="bg-[#FFB8000D] border border-[#FFB80066] p-4 rounded-xl w-full h-full">
                          <div className="flex flex-col lg:flex-row gap-4">
                            {/* Thumbnail */}
                            <div className="flex-shrink-0 mx-auto lg:mx-0">
                              <img
                                src={
                                  `${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}` ||
                                  "/placeholder-image.jpg"
                                }
                                alt={course.title}
                                className="h-40 w-40 rounded-xl object-cover"
                              />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col justify-center space-y-2 text-center lg:text-left">
                              <h1 className="text-lg font-bold">
                                {course.title}
                              </h1>
                              <p className="text-[#74767C] text-sm">
                                {course.subTitle ||
                                  course.description.substring(0, 50) + "..."}
                              </p>

                              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                <p className="rounded-xl bg-[#0047FF33] px-2 py-1 text-xs w-fit">
                                  ব্যাচ {course.batchNo}
                                </p>
                                <p className="rounded-xl bg-[#FFB80033] px-2 py-1 text-xs w-fit">
                                  অনগোয়িং কোর্স
                                </p>
                              </div>

                              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-2">
                                <div className="bg-white px-3 py-1 border border-yellow-500 rounded-xl">
                                  <h1 className="text-[#74767C] text-sm">
                                    Total Enrollment:{" "}
                                    <span className="text-[#141B34] font-bold">
                                      {course.students.length}
                                    </span>
                                  </h1>
                                </div>
                                <div className="bg-white px-3 py-1 border border-yellow-500 rounded-xl text-sm text-[#141B34]">
                                  Total Revenue:{" "}
                                  {calculateCourseRevenue(
                                    course
                                  ).toLocaleString()}{" "}
                                  ৳
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
