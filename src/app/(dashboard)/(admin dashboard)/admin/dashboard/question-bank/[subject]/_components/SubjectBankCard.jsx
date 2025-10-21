"use client";

import {
  BookOpen,
  Gavel,
  Scale,
  MoreVertical,
  Ban,
  CheckCircle2,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const SubjectCard = ({ subject, curriculumId, onActionClick }) => {
  const router = useRouter();
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOptionsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = () => {
    switch (subject.subjectType) {
      case "Constitutional Law":
        return <Scale className="h-5 w-5" />;
      case "Criminal Law":
        return <Gavel className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="relative">
      {/* Custom Dropdown */}
      <div className="absolute top-2 right-2 z-10" ref={dropdownRef}>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsOptionsExpanded((prev) => !prev);
          }}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>

        {isOptionsExpanded && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <button
              onClick={() =>
                router.push(
                  `/admin/dashboard/question-bank/${curriculumId}/${subject._id}`
                )
              }
              className="w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 text-left flex items-center"
            >
              <Eye className="h-4 w-4 mr-2 inline" />
              View Details
            </button>

            <button
              onClick={() => onActionClick(subject._id, "delete")}
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2 inline" />
              Delete
            </button>
          </div>
        )}
      </div>
      <div
        onClick={() =>
          router.push(
            `/admin/dashboard/question-bank/${curriculumId}/${subject._id}`
          )
        }
        className="p-6 bg-main/5 rounded-xl shadow-sm border hover:shadow-md transition-shadow border-main relative cursor-pointer"
      >
        {!subject.isActive && (
          <div className="absolute top-3 right-3 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
            Disabled
          </div>
        )}

        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 mb-4 hover:underline cursor-pointer">
            <div className="p-2 rounded-lg bg-gray-100">{getIcon()}</div>
            <div>
              <h3 className="font-semibold text-lg h-[60px]">{subject.name}</h3>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <span>{subject.questionCount || 0} Questions</span>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
