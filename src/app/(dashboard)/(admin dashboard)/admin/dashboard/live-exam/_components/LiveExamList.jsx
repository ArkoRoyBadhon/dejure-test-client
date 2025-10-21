"use client";

import { useState, useEffect } from "react";
import { useGetLiveExamsQuery } from "@/redux/features/liveexams/liveExam.Api";
import LiveExamCard from "./LiveExamcard";

export default function LiveExamList({ searchTerm = "", onPermissionError }) {
  const {
    data: apiExams = [],
    isLoading,
    isError,
    error,
  } = useGetLiveExamsQuery();
  const [exams, setExams] = useState([]);

  useEffect(() => {
    if (apiExams && apiExams.length > 0) {
      setExams(apiExams);
    }
  }, [apiExams]);

  // Check for permission error
  useEffect(() => {
    if (
      error?.data?.message === "Insufficient module permissions" &&
      onPermissionError
    ) {
      onPermissionError();
    }
  }, [error, onPermissionError]);

  const filteredExams = exams.filter((exam) => {
    if (!exam) return false;
    return (
      (exam.title &&
        exam.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (exam.subject &&
        exam.subject.name &&
        exam.subject.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (exam.type && exam.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading exams...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          Error loading exams. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 pt-4
    pb-8"
    >
      {filteredExams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No Exams Available Right Now</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <LiveExamCard key={exam._id} examData={exam} />
          ))}
        </div>
      )}
    </div>
  );
}
