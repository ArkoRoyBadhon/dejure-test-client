"use client";
import { useState } from "react";
// import LiveExams from "./LiveExam/LiveExams";
import Resources from "./Resourses/Resourses";
import MentorPanel from "./MentorPanel/MentorPanel";
import Syllabus from "./Syllabus/Syllabus";
import Routine from "./Routine/Routine";
import Enrollment from "./Enrollment/Enrollment";
import LiveClassesByCourse from "./LiveClass/LiveClassesByCourse";
import AdminCourseRecordManagementPage from "./Recorded/Recorded";
import { useSelector } from "react-redux";
// import LiveExamLearner from "@/app/(dashboard)/(learner dashboard)/dashboard/live-exam/_components/LiveExamLearner";
import Prospectus from "./Prospectus/Prospectus";
import LiveExamLearner from "@/app/(dashboard)/(learner dashboard)/dashboard/live-exam/_components/LiveExamLearner";
import LiveExams from "./LiveExam/LiveExams";

export default function Tabs({ course }) {
  const [activeTab, setActiveTab] = useState("live-class");
  const userRole = useSelector((state) => state.auth?.user?.role);

  const allTabs = [
    { label: "লাইভ ক্লাস", key: "live-class" },
    { label: "লাইভ এক্সাম", key: "live-exam" },
    { label: "রেকর্ডেড", key: "recorded" },
    { label: "রিসোর্স", key: "resources" },
    { label: "মেন্টর প্যানেল", key: "mentor-panel" },
    { label: "সিলেবাস", key: "syllabus" },
    { label: "রুটিন", key: "routine" },
    { label: "এনরোলমেন্ট", key: "enrollment" },

    { label: "প্রস্পেক্টাস", key: "prospectus" },
  ];

  const tabs = allTabs.filter((tab) => {
    if (tab.key === "enrollment") {
      return userRole === "admin";
    }
    return true;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "live-class":
        return <LiveClassesByCourse id={course._id} />;
      case "live-exam":
        return userRole === "learner" ? (
          <LiveExamLearner id={course._id} />
        ) : (
          <LiveExams id={course._id} />
        );

      case "recorded":
        return <AdminCourseRecordManagementPage id={course._id} />;
      case "resources":
        return <Resources id={course._id} />;
      case "mentor-panel":
        return <MentorPanel id={course._id} />;
      case "syllabus":
        return <Syllabus id={course._id} />;
      case "routine":
        return <Routine id={course._id} course={course} />;
      case "enrollment":
        return userRole === "admin" ? <Enrollment id={course._id} /> : null;

      case "prospectus":
        return <Prospectus course={course} />;
      default:
        return <div>Content not available.</div>;
    }
  };

  return (
    <div>
      <div className="inline-flex flex-wrap items-start gap-1 sm:gap-0.5 border-b pb-1 bg-[#EEEEEE] p-1 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1 sm:px-4 sm:py-2 shadow-lg rounded-md text-xs sm:text-sm ${
              activeTab === tab.key ? "bg-main" : "bg-white"
            }`}
          >
            <span
              className={`${
                activeTab === tab.key
                  ? "text-[#141B34] font-bold"
                  : "text-[#74767C] font-bold"
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
      <div className="rounded-xl mt-4">{renderTabContent()}</div>
    </div>
  );
}
