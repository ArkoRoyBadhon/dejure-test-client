// components/CourseSidebar.js
import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react"; // Using lucide-react for icons

export default function CourseSidebar({ progress, sections }) {
  const [openSection, setOpenSection] = useState(null); // State to manage open/closed sections

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-2">
      {/* Progress Bar */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {progress.completedPercentage}% completed
          <span className="ml-2 text-gray-600 font-normal text-base">
            {progress.completedLessons} of {progress.totalLessons}
          </span>
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full"
            style={{ width: `${progress.completedPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Course Sections */}
      <div className="space-y-3">
        {sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="border border-gray-200 rounded-md overflow-hidden"
          >
            {/* Section Header */}
            <button
              className={`flex justify-between items-center w-full p-3 text-left font-medium rounded-t-md transition-colors duration-200
                ${
                  openSection === sectionIndex
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              onClick={() => toggleSection(sectionIndex)}
            >
              <span className="text-base">{section.title}</span>
              {openSection === sectionIndex ? (
                <ChevronUp size={20} className="text-gray-900" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </button>

            {/* Lessons List (conditionally rendered) */}
            {openSection === sectionIndex && (
              <ul className="bg-white">
                {section.lessons.length > 0 ? (
                  section.lessons.map((lesson, lessonIndex) => (
                    <li
                      key={lessonIndex}
                      className={`flex items-center justify-between p-3 border-t border-gray-200 text-gray-700
                        ${
                          lesson.completed
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center">
                        {lesson.completed && (
                          <CheckCircle
                            size={18}
                            className="text-blue-500 mr-2"
                          />
                        )}
                        <span className="text-sm">{lesson.name}</span>
                      </div>
                      {lesson.duration && (
                        <span className="text-xs text-gray-500">
                          {lesson.duration}
                        </span>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-center text-gray-500 text-sm">
                    No lessons available.
                  </li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
