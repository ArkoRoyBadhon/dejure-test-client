"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function FreeResourcesDrawer({ isOpen, onClose }) {
  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const drawer = document.querySelector(".free-resources-drawer");
      if (isOpen && drawer && !drawer.contains(event.target)) {
        const freeResourcesBtn = document.querySelector(
          '[aria-label="Free Resources"]'
        );
        if (!freeResourcesBtn || !freeResourcesBtn.contains(event.target)) {
          onClose();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleResourceClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 md:top-16 md:left-0 md:right-0 md:bottom-0 z-30 bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer content */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed pt-10 lg:pt-0 top-0 left-0 right-0 bottom-0 z-40 bg-white shadow-lg border-t border-gray-200 free-resources-drawer overflow-y-auto md:top-16 md:bottom-auto h-[100vh] md:max-h-[80vh]"
            aria-label="Free Resources drawer"
          >
            <div className="max-w-[1200px] mx-auto px-4 md:px-5 py-4 md:py-8 pt-16 md:pt-8 pb-20 md:pb-8">
              {/* Mobile Close Button */}
              <div className="md:hidden absolute top-20 right-4 z-[100]">
                <button
                  onClick={onClose}
                  className="p-4  hover:bg-red-600 transition-colors"
                  aria-label="Close Free Resources"
                >
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-darkColor mb-2">
                  ফ্রি রিসোর্সেস
                </h2>
                <p className="text-sm md:text-base text-gray-600 px-4 line-clamp-1">
                  আপনার শিক্ষার জন্য বিনামূল্যে উপকরণসমূহ
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
                {/* Case Studies Option */}
                <Link
                  href="/case-studies"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    setTimeout(() => {
                      window.location.href = "/case-studies";
                    }, 300);
                  }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 md:p-8 border border-blue-200 hover:shadow-xl transition-all duration-500 ease-out hover:scale-[1.02] cursor-pointer hover:border-blue-300">
                    <div className="text-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-blue-600 transition-all duration-300 ease-out group-hover:scale-110">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-darkColor mb-2 md:mb-3">
                        কেস স্টাডিজ
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-1">
                        বাস্তব জীবনের আইনি সমস্যা ও সমাধান সম্পর্কে বিস্তারিত
                        আলোচনা
                      </p>
                      <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
                        দেখুন
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300 ease-out"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Dictionaries Option */}
                <Link
                  href="/dictionaries"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    setTimeout(() => {
                      window.location.href = "/dictionaries";
                    }, 300);
                  }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 md:p-8 border border-green-200 hover:shadow-xl transition-all duration-500 ease-out hover:scale-[1.02] cursor-pointer hover:border-green-300">
                    <div className="text-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-green-600 transition-all duration-300 ease-out group-hover:scale-110">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-darkColor mb-2 md:mb-3">
                        ডিকশনারি & ম্যাক্সিমস
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-1">
                        আইনি পরিভাষা ও গুরুত্বপূর্ণ শব্দের সংজ্ঞা ও ব্যাখ্যা
                      </p>
                      <div className="inline-flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors duration-300">
                        দেখুন
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300 ease-out"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* CV Generator Option */}
                <Link
                  href="/cv-generator"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    setTimeout(() => {
                      window.location.href = "/cv-generator";
                    }, 300);
                  }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 md:p-8 border border-orange-200 hover:shadow-xl transition-all duration-500 ease-out hover:scale-[1.02] cursor-pointer hover:border-orange-300">
                    <div className="text-center">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-orange-600 transition-all duration-300 ease-out group-hover:scale-110">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-darkColor mb-2 md:mb-3">
                        CV জেনারেটর
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                        পেশাদার CV তৈরি করুন সহজেই
                      </p>
                      <div className="inline-flex items-center text-orange-600 font-semibold group-hover:text-orange-700 transition-colors duration-300">
                        দেখুন
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300 ease-out"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Additional Info Section */}
              <div className="mt-6 md:mt-12 text-center">
                <div className="bg-gray-50 rounded-xl p-4 md:p-6 max-w-2xl mx-auto">
                  <h4 className="text-base md:text-lg font-semibold text-darkColor mb-2">
                    আরও জানতে চান?
                  </h4>
                  <p className="text-sm md:text-base text-gray-600">
                    আমাদের ফ্রি রিসোর্সেস নিয়মিত আপডেট করা হয়। নতুন কন্টেন্টের
                    জন্য আমাদের সাথে থাকুন।
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
