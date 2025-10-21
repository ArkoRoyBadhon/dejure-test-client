"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useGetEnhancedExamLeaderboardQuery } from "@/redux/features/submission/submission.api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const LeaderBoardComponent = ({ examid, show = false }) => {
  const { data, isLoading, isError, error } =
    useGetEnhancedExamLeaderboardQuery(examid);

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="rounded-xl shadow-md overflow-hidden">
        {/* <CardHeader className="text-center">
          <CardTitle className="text-xl">Error Loading Leaderboard</CardTitle>
        </CardHeader> */}
        <CardContent>
          <p className="text-darkColor text-center py-20">
            {error?.data?.message || "Failed to load leaderboard data"}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.leaderboard || data.leaderboard.length === 0) {
    return (
      <Card className="rounded-xl shadow-md overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">No Data Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">No participants found for this exam</p>
        </CardContent>
      </Card>
    );
  }

  const calculatePercentage = (obtainedMarks, totalMarks) => {
    if (!totalMarks || isNaN(obtainedMarks)) return "0%";
    const percentage = (obtainedMarks / totalMarks) * 100;
    return `${percentage.toFixed(2)}%`;
  };

  const enhancedLeaderboard = data.leaderboard.map((student) => ({
    ...student,
    percentage: isNaN(parseFloat(student.percentage))
      ? calculatePercentage(student.obtainedMarks, data.examDetails.totalMarks)
      : student.percentage,
  }));

  return (
    <div className="space-y-6">
      {!show && (
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {/* <span>পূর্ববর্তী</span> */}
          <span>Go Back</span>
        </Button>
      )}

      {/* Header Card with Exam Information */}
      <Card className="mb-6 p-0">
        <CardHeader className="bg-gray2 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/DJA logo Transperant-01 2.png"
                alt="DJA Logo"
                width={63}
                height={40}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <h2 className="text-[20px] font-bold text-darkColor leading-[150%] mb-2">
              {data.examDetails.course || "ডি জুির একােডিম"}
            </h2>
            <h1 className="text-[40px] leading-[150%] font-bold mb-2">
              {data.examDetails.examName || "Exam"}
            </h1>
            <div className="flex justify-center gap-8 font-bold text-sm text-darkColor">
              <span>পূর্ণমান- {data.examDetails.totalMarks || "১০০"}</span>
              <span>সময়: {data.examDetails.duration || "২ ঘন্টা"} মিনিট</span>
            </div>
          </div>

          <div className="">
            <p className="text-center text-[16px] text-[#74767C] font-bold">
              পরীক্ষার ফলাফল
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-4 text-[16px] mb-4">
            <div className="flex">
              <p className="">
                <span className="text-[#74767C]">মডিউল</span>{" "}
                <span className="font-bold ml-2">
                  {data.examDetails.course || "অপরাধ সংক্রন্ত আইন"}
                </span>
              </p>
            </div>
            <div className="flex">
              <p className="">
                <span className="text-[#74767C]">সাবজেক্ট</span>{" "}
                <span className="font-bold ml-2">
                  {data.examDetails.subject[0]?.name || "পেনাল কোড"}
                </span>
              </p>
            </div>
            <div className="flex">
              <p className="">
                <span className="text-[#74767C]">টাইপ</span>{" "}
                <span className="font-bold ml-2">
                  {data.examDetails.examType || "WRITTEN"}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="rounded-xl shadow-md overflow-hidden p-0 gap-0 ">
        <CardHeader className="bg-main/50 pt-4 pb-2">
          <CardTitle className="text-[18px] text-center">
            Exam Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Participants</p>
            <p className="font-medium">
              {data.statistics.totalParticipants || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Highest Mark</p>
            <p className="font-medium">{data.statistics.highestMark || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Mark</p>
            <p className="font-medium">
              {data.statistics.averageMark || "0.00"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pass Percentage</p>
            <p className="font-medium">
              {data.statistics.passPercentage || "0%"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Passed Count</p>
            <p className="font-medium">{data.statistics.passedCount || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Failed Count</p>
            <p className="font-medium">{data.statistics.failedCount || 0}</p>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Table */}
      <Card className="rounded-xl shadow2 p-0 overflow-hidden gap-0">
        <CardHeader className="text-center bg-main/50 pt-4 pb-2">
          <CardTitle className="text-[18px]">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto px-0 pt-0">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted">
              <tr className="text-left">
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Submission Date</th>
                <th className="px-4 py-3">Marks</th>
                <th className="px-4 py-3">Percentage</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {enhancedLeaderboard.map((student) => (
                <tr
                  key={`${student.meritPosition}-${student.studentName}`}
                  className="border-t hover:bg-muted/50"
                >
                  <td className="px-4 py-3">{student.meritPosition}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {student.studentImage && (
                        <div className="relative h-8 w-8 rounded-full overflow-hidden border">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${student.studentImage}`}
                            alt={student.studentName || "Student"}
                            fill
                            className="object-cover"
                            sizes="32px"
                            priority={student.meritPosition <= 3}
                          />
                        </div>
                      )}
                      <span>{student.studentName || "Unknown Student"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {student.submissionDate || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {student.obtainedMarks || 0}/{data.examDetails.totalMarks}
                  </td>
                  <td className="px-4 py-3">{student.percentage}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        student.grade === "F" ? "destructive" : "default"
                      }
                      className="bg-main/50 text-darkColor"
                    >
                      {student.grade || "N/A"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={student.isPassed ? "default" : "destructive"}
                      className="bg-main/50 text-darkColor"
                    >
                      {student.isPassed ? "Passed" : "Failed"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderBoardComponent;
