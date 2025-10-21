"use client";

import React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MoreVertical, Trash2, Ban, CheckCircle2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const QuestionTypecard = ({ questionBankType, onActionClick }) => {
  const router = useRouter();
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false);
  const dropdownRef = useRef(null);

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOptionsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Safe data fallback to prevent errors when data is missing
  const safeData = {
    _id: questionBankType?._id || "",
    name: questionBankType?.curriculum.subjectType || "Unknown Type",
    isActive: questionBankType?.isActive || false,
    subjects: questionBankType?.subjects || [],
    questionsCount: questionBankType?.totalQuestions || 0,
  };

  if (!isMounted) {
    return (
      <Card className="border rounded-xl overflow-hidden p-0 bg-main/5 border-main animate-pulse">
        <CardHeader className="p-5 pb-3">
          <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
        </CardHeader>
        <div className="px-5 py-3 border-t">
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 w-20 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Custom Dropdown */}
      <div className="absolute top-2 right-2" ref={dropdownRef}>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 text-darkColor hover:bg-gray-50 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsOptionsExpanded((prev) => !prev);
          }}
        >
          <MoreVertical className="h-4 w-4" aria-hidden="true" />
        </Button>

        {isOptionsExpanded && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <button
              onClick={() => onActionClick(safeData._id, "delete")}
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
            >
              <Trash2 className="h-4 w-4 mr-2 inline" />
              Delete
            </button>
          </div>
        )}
      </div>
      <Card
        onClick={() =>
          router.push(`/admin/dashboard/question-bank/${safeData._id}`)
        }
        className="group hover:shadow-md transition-all duration-200 border rounded-xl overflow-hidden p-0 hover:bg-main/5 hover:border-main cursor-pointer"
      >
        {!safeData.isActive && (
          <div className="absolute top-3 right-3 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
            Disabled
          </div>
        )}

        <CardHeader className="p-5 pb-3">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 hover:underline cursor-pointer">
              <h3
                className={`text-xl capitalize text-center font-semibold mb-2 ${
                  !safeData.isActive ? "text-gray-500" : "text-darkColor"
                }`}
              >
                {safeData.name}
              </h3>
            </div>
          </div>
        </CardHeader>

        <div className="px-5 py-3 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-2 rounded-lg border">
              <p className="text-xs text-gray-500 text-center">Subjects</p>
              <p
                className={`font-semibold text-center ${
                  safeData.isActive ? "text-green-600" : "text-gray-500"
                }`}
              >
                {safeData.subjects.length}
              </p>
            </div>
            <div className="p-2 rounded-lg border">
              <p className="text-xs text-gray-500 text-center">
                Total Questions
              </p>
              <p
                className={`font-semibold text-center ${
                  !safeData.isActive ? "text-gray-500" : "text-indigo-600"
                }`}
              >
                {safeData.questionsCount}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuestionTypecard;
