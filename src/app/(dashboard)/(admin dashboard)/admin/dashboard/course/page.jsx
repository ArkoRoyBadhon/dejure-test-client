"use client";

import React, { useState } from "react";
import {
  useGetCoursesQuery,
  useGetCourseStatsQuery,
} from "@/redux/features/course/course.api";
import AdminCourseCard from "@/components/shared/AdminCourseCard";
import CreateCourseModal from "@/components/shared/Modals/CreateCourseModal";
import { BookOpen, DollarSign, FilePenLine, Lock, Unlock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import Loader from "@/components/shared/Loader";
import PermissionError from "@/components/shared/PermissionError";

export default function AdminCoursesPage() {
  const { data: coursesData, isLoading, isError } = useGetCoursesQuery();
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useGetCourseStatsQuery();
  const statsArray = [
    {
      title: "Active Courses",
      value: stats?.activeCourses || 0,
      icon: Unlock,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Free Course",
      value: stats?.freeCourses || 0,
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Paid Course",
      value: stats?.paidCourses || 0,
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Closed Course",
      value: stats?.closedCourses || 0,
      icon: Lock,
      color: "bg-red-100 text-red-600",
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

  if (isLoading || statsLoading) return <Loader text="লোড হচ্ছে..." />;
  if (isError) return <div>কোর্স লোড করা যাচ্ছে না।</div>;

  const courses = coursesData || [];

  // Filter courses based on activeTab
  const filteredCourses =
    activeTab === "active"
      ? courses.filter((course) => course.isActive)
      : courses.filter((course) => !course.isActive);

  if (statsError?.data?.message === "Insufficient module permissions")
    return <PermissionError />;

  return (
    <div className="px-4 py-2 mt-2">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
        {/* Header */}
        <div className="bg-[#fff8e5] px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center mb-2">
          <h1 className="text-lg font-semibold text-center text-darkColor">
            ALL COURSE
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex gap-2 bg-yellow-100 border border-yellow-500 px-4 py-2 rounded-lg"
          >
            <FilePenLine />
            Create Course
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4  p-4">
          {statsArray.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={index}
                className="bg-main/5 border-main rounded-[24px] max-h-[131px]"
              >
                <CardContent className="px-6">
                  <div>
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

        <div className=" flex rounded-lg p-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`w-full border border-yellow-500 p-2 rounded-lg ${
              activeTab === "active" ? "bg-yellow-50" : "bg-white"
            }`}
          >
            Active Courses
          </button>
          <button
            onClick={() => setActiveTab("finished")}
            className={`w-full border border-yellow-500 p-2 rounded-lg ${
              activeTab === "finished" ? "bg-yellow-50" : "bg-white"
            }`}
          >
            Finished Courses
          </button>
        </div>

        {/* Grid of course cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredCourses.map((course) => (
            <AdminCourseCard key={course._id} course={course} />
          ))}
        </div>

        {/* Create Course Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <CreateCourseModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Dialog>
      </div>
    </div>
  );
}
