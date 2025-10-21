"use client";
import { useState, useEffect } from "react";
import { useGetEnrollmentsByUserQuery } from "@/redux/features/enroll/enroll.api";
import { useSelector } from "react-redux";
import { useGetLearningReportQuery } from "@/redux/features/learning-report/learning-report.api";
import Loader from "@/components/shared/Loader";

export default function Reportpage() {
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;

  const { data: enrollmentsData, isLoading: enrollmentsLoading } =
    useGetEnrollmentsByUserQuery(userId);
  const enrollments = enrollmentsData || [];

  const enrolledCourseIds = [
    ...new Set(enrollments.map((enrollment) => enrollment.course._id)),
  ];

  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Get learning report for selected course
  const { data: learningReport, isLoading: reportLoading } =
    useGetLearningReportQuery(
      { courseId: selectedCourseId, learnerId: userId },
      { skip: !selectedCourseId }
    );

  useEffect(() => {
    if (!selectedCourseId && enrolledCourseIds.length > 0) {
      setSelectedCourseId(enrolledCourseIds[0]);
    }
  }, [enrolledCourseIds, selectedCourseId]);

  const courses = enrollments.map((enrollment) => enrollment.course);

  const handleCourseSelection = (courseId) => {
    setSelectedCourseId(courseId);
  };

  const selectedCourse = courses.find(
    (course) => course._id === selectedCourseId
  );

  if (enrollmentsLoading || reportLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (enrolledCourseIds.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 bg-[#F8FAFC]">
        <p className="text-center text-gray-500">
          You haven't enrolled in any courses yet.
        </p>
      </div>
    );
  }

  if (!selectedCourseId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 bg-[#F8FAFC]">
        <Loader text="Loading course data..." className="text-center" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4  bg-[#F8FAFC]">
      {/* Course Selection Section */}
      <div className="mb-6 bg-white rounded-xl shadow-md p-4 border">
        <p className="text-[#74767C] font-bold mb-3">
          আপনার ব্যাচটি সিলেক্ট করে নিন
        </p>
        <div className="flex flex-wrap gap-3">
          {courses.map((course) => (
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
          ))}
        </div>
      </div>

      {/* Course Report Section */}
      {selectedCourse && learningReport && (
        <div>
          <div className="mb-6 flex flex-col justify-between border rounded-xl shadow-md">
            <div className="flex p-4 gap-2 rounded-t-xl bg-[#F2F7FC] border ">
              <img
                src="/logo.svg"
                alt="Course Logo"
                className="w-[63px] mx-auto"
              />
            </div>

            <div className="grid grid-cols-1 place-items-center text-center p-4 bg-white rounded-b-xl">
              <p className="font-bold text-[20px] text-[#141B34]">
                ডি জুরি একাডেমি
              </p>
              <p className="font-bold text-[40px] text-[#141B34]">
                {selectedCourse.title}
              </p>
              <p className="font-bold text-[16px] text-[#74767C]">
                {selectedCourse.subTitle}
              </p>
              <p className="font-bold text-[32px] text-[#141B34]">
                পারফর্মান্স রিপোর্ট
              </p>
            </div>
          </div>

          <div className="my-6 flex justify-between rounded-xl border-2 bg-white">
            {/* profile Info */}
            <div className="flex gap-6 p-3">
              <div className="flex justify-center">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${user.image}`}
                  alt="Profile"
                  className="w-[120px] h-[120px] rounded-full"
                />
              </div>
              <div className=" text-[#141B34] space-y-1">
                <p className="text-[20px] font-bold flex gap-2">
                  {user?.fullName} <img src="/pro.svg" alt="" />
                </p>
                <p className="text-[16px]">{user?.email}</p>
                <p className="text-[16px]">{user?.phone}</p>
                <p className="text-[14px] bg-[#0BCD8233] w-[90px] p-[2px] rounded-xl text-center">
                  ID : {user?.studentId || "ST-105"}
                </p>
              </div>
            </div>
            {/* Course Info */}
            <div className="grid grid-cols-1 justify-items-end text-end text-[#141B34] text-[14px] py-6 px-3 space-y-1">
              <p className="bg-[#0047FF33] flex items-center justify-center pr-1 rounded-xl text-center w-[60px]">
                {selectedCourse?.batchNo}
              </p>

              <p className="bg-[#FFB80033] flex items-center justify-center pr-1 rounded-xl text-center w-[100px]">
                {selectedCourse?.courseType} কোর্স
              </p>
              <p className="bg-[#0BCD8233] flex items-center justify-center px-2 rounded-xl text-center">
                {selectedCourse?.types.map((type, index) => (
                  <span key={index}>
                    {type.mode}
                    {index < selectedCourse.types.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Live Class Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
            {/* Header */}
            <div className="bg-[#fff8e5] px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-center">লাইভ ক্লাস</h2>
            </div>

            {/* Table Header */}
            <div className="bg-[#F2F7FC] rounded-t-xl px-4 py-2 border-b border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-7 gap-2 text-[13px] font-bold text-[#141B34]">
                <div>NO</div>
                <div>NAME</div>
                <div>DATE</div>
                <div>TIME</div>
                <div>DURATION</div>
                <div>STATUS</div>
                <div>ATTEND</div>
              </div>
            </div>

            {/* Table Body */}
            <div className=" py-4 space-y-2 text-[14px] text-[#141B34]">
              {learningReport.data.classAttendance.detailed.map(
                (classItem, index) => (
                  <div key={classItem.classId} className="border-b">
                    <div className="grid grid-cols-7 gap-2 items-center pb-2 px-4">
                      <div>{index + 1}</div>
                      <div>{classItem.title}</div>
                      <div>{classItem.date}</div>
                      <div>{classItem.time}</div>
                      <div>{classItem.duration} min</div>
                      <div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            classItem.status === "completed"
                              ? "bg-blue-100 text-blue-600"
                              : classItem.status === "ongoing"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {classItem.status}
                        </span>
                      </div>
                      <div>
                        <span
                          className={`px-3 py-[2px] rounded-full text-xs font-medium ${
                            classItem.attended
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {classItem.attended ? "YES" : "NO"}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Summary Footer */}
            <div className="flex justify-end px-6 pb-4">
              <div className="text-[13px] space-y-1 bg-[#F2F7FC] rounded-md px-4 py-2 text-end">
                <p className="text-[#74767C] font-bold">
                  সর্বমোট লাইভ ক্লাস{" "}
                  <span className="font-bold mx-4 text-black">
                    {learningReport.data.classAttendance.summary.total}
                  </span>
                </p>
                <p className="text-[#74767C] font-bold">
                  এটেন্ড করেছে{" "}
                  <span className="font-bold mx-4 text-black">
                    {learningReport.data.classAttendance.summary.attended}
                  </span>
                </p>
                <p className="text-[#74767C] font-bold">
                  অ্যাটেন্ডেন্স রেট{" "}
                  <span className="font-bold mx-4 text-black">
                    {learningReport.data.classAttendance.summary.attendanceRate}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Live Exam Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
            {/* Header */}
            <div className="bg-[#fff8e5] px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-lg font-semibold text-center">পরীক্ষা</h2>
            </div>

            {/* Table Header */}
            <div className="bg-[#F2F7FC] rounded-t-xl px-4 py-2 border-b border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-9 gap-2 text-[13px] font-bold text-[#141B34]">
                <div>NO</div>
                <div>NAME</div>
                <div>DATE</div>
                <div>TIME</div>
                <div>ATTEND</div>
                <div>TYPE</div>
                <div>TOTAL</div>
                <div>OBTAINED</div>
                <div>STATUS</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="py-4 space-y-2 text-[14px] text-[#141B34]">
              {learningReport.data.examPerformance.detailed.map(
                (exam, index) => (
                  <div key={exam.examId} className="border-b">
                    <div className="grid grid-cols-9 gap-2 items-center pb-2 px-4">
                      <div>{index + 1}</div>
                      <div>{exam.title}</div>
                      <div>{exam.date}</div>
                      <div>{exam.time}</div>
                      <div>
                        <span
                          className={`px-3 py-[2px] rounded-full text-xs font-medium ${
                            exam.attended
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {exam.attended ? "YES" : "NO"}
                        </span>
                      </div>
                      <div>{exam.type}</div>
                      <div>{exam.totalMarks}</div>
                      <div>
                        {exam.obtainedMarks >= 0 ? exam.obtainedMarks : "N/E"}
                      </div>
                      <div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            exam.passStatus === "passed"
                              ? "bg-green-100 text-green-600"
                              : exam.passStatus === "failed"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {exam.passStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Summary Footer */}
            <div className="flex justify-end px-6 pb-4">
              <div className="text-[13px] bg-[#F2F7FC] rounded-md px-4 py-2 grid grid-cols-2 gap-x-10 text-end">
                <div className="space-y-1">
                  <p className="text-[#74767C] font-bold">
                    সর্বমোট এক্সাম{" "}
                    <span className="font-bold mx-2 text-black">
                      {learningReport.data.examPerformance.summary.total}
                    </span>
                  </p>
                  <p className="text-[#74767C] font-bold">
                    এটেন্ড করেছে{" "}
                    <span className="font-bold mx-2 text-black">
                      {learningReport.data.examPerformance.summary.attended}
                    </span>
                  </p>
                  <p className="text-[#74767C] font-bold">
                    অ্যাটেন্ডেন্স রেট{" "}
                    <span className="font-bold mx-2 text-black">
                      {
                        learningReport.data.examPerformance.summary
                          .attendanceRate
                      }
                    </span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[#74767C] font-bold">
                    সর্বমোট নাম্বার{" "}
                    <span className="font-bold mx-2 text-black">
                      {
                        learningReport.data.examPerformance.summary
                          .totalPossibleMarks
                      }
                    </span>
                  </p>
                  <p className="text-[#74767C] font-bold">
                    সর্বমোট পেয়েছে{" "}
                    <span className="font-bold mx-2 text-black">
                      {
                        learningReport.data.examPerformance.summary
                          .totalObtainedMarks
                      }
                    </span>
                  </p>
                  <p className="text-[#74767C] font-bold">
                    গড় স্কোর{" "}
                    <span className="font-bold mx-2 text-black">
                      {learningReport.data.examPerformance.summary.averageScore}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
