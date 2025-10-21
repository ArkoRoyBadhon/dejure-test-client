"use client";

import { useState, useEffect } from "react";
import { useGetSyllabusByCourseIdQuery } from "@/redux/features/syllabus/syllabus.api";
import dynamic from "next/dynamic";
import { useGetRoutinesByCourseQuery } from "@/redux/features/routine/routine.api";
import { toast } from "sonner";
import Image from "next/image";

export default function SyllabusPublic({ course }) {
  const { data: syllabusData = [], isLoading } = useGetSyllabusByCourseIdQuery(
    course?._id
  );
  const { data: routines = [], isLoading: routinesLoading } =
    useGetRoutinesByCourseQuery(course?._id);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (syllabusData && syllabusData.length > 0) {
      const initialExpanded = {};

      // Expand first one if only one; first two if more
      const countToExpand = Math.min(2, syllabusData.length);

      syllabusData.slice(0, countToExpand).forEach((section) => {
        initialExpanded[section._id] = true;
      });

      setExpandedSections(initialExpanded);
    }
  }, [syllabusData]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Check if prospectus exists and is valid
  const hasProspectus = course?.prospectus && course.prospectus.trim() !== "";
  const prospectusUrl = hasProspectus
    ? `${process.env.NEXT_PUBLIC_API_URL}/${course?.prospectus}`
    : null;

  // Check if prospectus image exists
  const hasProspectusImage =
    course?.prospectusImage && course.prospectusImage.trim() !== "";
  const prospectusImageUrl = hasProspectusImage
    ? `${process.env.NEXT_PUBLIC_API_URL}/${course?.prospectusImage}`
    : null;

  // Check if routine image exists
  const hasRoutineImage =
    course?.routineImage && course.routineImage.trim() !== "";
  const routineImageUrl = hasRoutineImage
    ? `${process.env.NEXT_PUBLIC_API_URL}/${course?.routineImage}`
    : null;

  // Check if routines exist
  const hasRoutines = routines && routines.length > 0;

  const handleDownload = async () => {
    if (!hasProspectus) {
      toast.error("প্রসপেক্টাস এখনো আপলোড করা হয়নি।");
      return;
    }

    try {
      // Fetch the PDF file
      const response = await fetch(prospectusUrl);

      if (!response.ok) {
        throw new Error("প্রসপেক্টাস ফাইল পাওয়া যায়নি।");
      }

      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "prospectus.pdf";

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(
        "প্রসপেক্টাস ডাউনলোড করতে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।"
      );
    }
  };

  const handleRoutineDownload = () => {
    if (!hasRoutines) {
      toast.error("ক্লাস রুটিন এখনো তৈরি করা হয়নি।");
      return;
    }

    if (!course?._id) {
      toast.error("কোর্স ID পাওয়া যায়নি।");
      return;
    }

    // Open in new tab for download
    window.open(
      // `https://api.dejureacademy.com/api/v1/routine/${course._id}/download-pdf`,
      `${process.env.NEXT_PUBLIC_API_URL}/routine/${course._id}/download-pdf`,
      "_blank"
    );
  };

  return (
    <div className="">
      {/* Top syllabus Part */}
      <div className="relative bg-[#FFB80033] rounded-[50px] px-4 md:px-0">
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center opacity-[.04] z-0 pointer-events-none" />
        <div className="relative z-10 py-20 max-w-[1200px] mx-auto">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">প্রোগ্রামের সিলেবাস</h2>
          </div>

          {isLoading ? (
            <p className="text-center py-4">লোড হচ্ছে...</p>
          ) : syllabusData?.length === 0 ? (
            <p className="text-center py-4">সিলেবাস এখনো নির্ধারণ করা হয়নি</p>
          ) : (
            <div className="space-y-4 px-2 md:px-0">
              {syllabusData?.map((section) => (
                <div key={section._id} className="rounded-lg overflow-hidden">
                  {/* Accordion Header */}
                  <button
                    className={`rounded-xl w-full flex justify-between items-center p-3 border-0 outline-none cursor-pointer ${
                      expandedSections[section._id]
                        ? "bg-[#FFB800]"
                        : "bg-white"
                    }`}
                    onClick={() => toggleSection(section._id)}
                    type="button"
                  >
                    <h3 className="font-bold text-lg text-left flex-1">
                      {section.sectionName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          expandedSections[section._id]
                            ? "transform rotate-180"
                            : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Accordion Content - Table */}
                  {expandedSections[section._id] && (
                    <div className="">
                      <div className="overflow-x-auto">
                        <table className="min-w-full table-fixed border-separate border-spacing-x-2 border-spacing-y-2">
                          <thead>
                            <tr>
                              <th className="w-[25%] p-3 text-left font-bold bg-[#F2F7FC] rounded-xl border-0">
                                বিষয়
                              </th>
                              <th className="w-[25%] p-3 text-left font-bold bg-[#F2F7FC] rounded-xl border-0">
                                ক্লাস সংখ্যা
                              </th>
                              <th className="w-[25%] p-3 text-left font-bold bg-[#F2F7FC] rounded-xl border-0">
                                প্রিলি এক্সাম
                              </th>
                              <th className="w-[25%] p-3 text-left font-bold bg-[#F2F7FC] rounded-xl border-0">
                                লিখিত
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {section.subjects?.map((subject, idx) => (
                              <tr key={idx}>
                                <td className="w-[25%] p-3 text-md text-gray-700 bg-white rounded-xl border-0">
                                  {subject.subject}
                                </td>
                                <td className="w-[25%] p-3 text-md text-gray-700 bg-white rounded-xl border-0">
                                  {subject.classCount}
                                </td>
                                <td className="w-[25%] p-3 text-md text-gray-700 bg-white rounded-xl border-0">
                                  {subject.preliminaryExamCount}
                                </td>
                                <td className="w-[25%] p-3 text-md text-gray-700 bg-white rounded-xl border-0">
                                  {subject.writtenExamCount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Part */}
      <div className="max-w-[1200px] mx-auto pt-16 px-4 md:px-0">
        <h1 className="text-[#141B34] font-extrabold md:font-bold mb-8 text-2xl md:text-xl text-center md:text-start">
          প্রোগ্রামের ক্লাস রুটিন & প্রসপেক্টাস
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full md:w-8/12 mx-auto md:mx-0">
          {/* Routine Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-full h-[240px] relative bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={routineImageUrl || "/routine.svg"}
                alt="Class Routine"
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  e.target.src = "/routine.svg";
                }}
              />
            </div>
            {routinesLoading ? (
              <div className="flex gap-2 w-full border items-center justify-center py-3 rounded-xl bg-gray-300 mt-4 cursor-not-allowed">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="font-bold text-gray-600">লোড হচ্ছে...</span>
              </div>
            ) : hasRoutines ? (
              <button
                onClick={handleRoutineDownload}
                className="flex gap-2 w-full border items-center justify-center py-3 rounded-xl bg-[#FFB800] hover:bg-[#FFB800]/90 mt-4 transition-colors"
              >
                <img src="/download.svg" alt="Download" />
                <span className="font-bold">ডাউনলোড ক্লাস রুটিন</span>
              </button>
            ) : (
              <div className="flex gap-2 w-full border items-center justify-center py-3 rounded-xl bg-gray-300 mt-4 cursor-not-allowed">
                <img
                  src="/download.svg"
                  alt="Download"
                  className="opacity-50"
                />
                <span className="font-bold text-gray-600">
                  রুটিন এখনো তৈরি হয়নি
                </span>
              </div>
            )}
          </div>

          {/* Prospectus Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-full h-[240px] relative bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={prospectusImageUrl || "/c.svg"}
                alt="Prospectus"
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  e.target.src = "/c.svg";
                }}
              />
            </div>
            {hasProspectus ? (
              <button
                onClick={handleDownload}
                className="flex gap-2 w-full border items-center justify-center py-3 rounded-xl bg-[#0047FF] hover:bg-[#0047FF]/90 mt-4 text-white transition-colors"
              >
                <img src="/download.svg" alt="Download" />
                <span className="font-bold">ডাউনলোড প্রসপেক্টাস</span>
              </button>
            ) : (
              <div className="flex gap-2 w-full border items-center justify-center py-3 rounded-xl bg-gray-300 mt-4 cursor-not-allowed">
                <img
                  src="/download.svg"
                  alt="Download"
                  className="opacity-50"
                />
                <span className="font-bold text-gray-600">
                  প্রসপেক্টাস এখনো আপলোড হয়নি
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {!hasRoutines && !hasProspectus && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-yellow-800 text-sm">
                <strong>নোট:</strong> এই কোর্সের জন্য ক্লাস রুটিন এবং
                প্রসপেক্টাস এখনো প্রস্তুত করা হয়নি। শীঘ্রই আপলোড করা হবে।
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
