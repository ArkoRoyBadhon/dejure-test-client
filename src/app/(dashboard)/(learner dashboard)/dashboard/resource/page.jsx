"use client";
import { useState, useEffect } from "react";
import { useGetEnrollmentsByUserQuery } from "@/redux/features/enroll/enroll.api";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CourseResources from "./_components/course-resources";

export default function ResourcePage() {
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;

  const { data: enrollmentsData, isLoading: enrollmentsLoading } =
    useGetEnrollmentsByUserQuery(userId);
  const enrollments = enrollmentsData || [];

  const enrolledCourseIds = [
    ...new Set(enrollments.map((enrollment) => enrollment.course._id)),
  ];

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [resourcesStatus, setResourcesStatus] = useState({
    loading: true,
    hasResources: false,
  });

  useEffect(() => {
    if (!selectedCourseId && enrolledCourseIds.length > 0) {
      setSelectedCourseId(enrolledCourseIds[0]);
    }
  }, [enrolledCourseIds, selectedCourseId]);

  const courses = enrollments.map((enrollment) => enrollment.course);

  const handleCourseSelection = (courseId) => {
    setSelectedCourseId(courseId);
    setResourcesStatus({ loading: true, hasResources: false });
  };

  const handleResourcesStatus = (status) => {
    setResourcesStatus(status);
  };

  return (
    <div className="bg-white rounded-xl shadow-md m-4 border">
      <div className="overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-2 gap-2 rounded-t-xl bg-[#F2F7FC]">
          <div className="flex items-center justify-center gap-2 ml-4">
            <img src="/resources.svg" alt="resource Logo" />
            <p className="font-bold">সকল রিসোর্সেস</p>
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="Search by..."
              className="pl-8 pr-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Course Selection */}
        <div className="p-4 mt-2">
          <p className="text-[#74767C] font-bold mb-3">
            আপনার ব্যাচটি সিলেক্ট করে নিন
          </p>
          <div className="flex flex-wrap gap-3">
            {enrollmentsLoading ? (
              <div className="flex justify-center items-center h-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : enrolledCourseIds.length === 0 ? (
              <p className="text-sm text-gray-500">
                You haven't enrolled in any courses yet.
              </p>
            ) : (
              courses.map((course) => (
                <button
                  key={course._id}
                  className={`flex items-center gap-2 p-2 rounded-md transition-all duration-200 ${
                    selectedCourseId === course._id
                      ? "bg-[#FFB800] shadow-md"
                      : "bg-[#FFB8000D] border border-[#FFB80066] hover:bg-gray-300"
                  }`}
                  onClick={() => handleCourseSelection(course._id)}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`}
                    alt={course.title}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="font-bold text-sm">{course.title}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Resources Section */}
        {selectedCourseId ? (
          <div key={selectedCourseId}>
            <CourseResources
              courseId={selectedCourseId}
              enrollments={enrollments}
              onResourcesStatus={handleResourcesStatus}
            />
            {!resourcesStatus.loading && !resourcesStatus.hasResources && (
              <div className="p-4 text-center text-gray-500">
                This course has no resources available.
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Select a course to view resources
          </div>
        )}
      </div>
    </div>
  );
}
