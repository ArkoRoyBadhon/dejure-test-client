"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Home, Search, ArrowLeft } from "lucide-react";

export default function CourseNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-16 h-16 text-blue-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-yellow-800 text-xl">?</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            কোর্স পাওয়া যায়নি
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            দুঃখিত, আপনি যে কোর্সটি খুঁজছেন তা পাওয়া যায়নি
          </p>
          <p className="text-gray-500">
            কোর্সটি মুছে ফেলা হতে পারে বা ভুল লিংক ব্যবহার করেছেন
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                সব কোর্স দেখুন
              </Button>
            </Link>

            <Link href="/">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                হোমপেজে যান
              </Button>
            </Link>
          </div>

          <div className="pt-4">
            <Link href="/courses">
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                কোর্স তালিকায় ফিরে যান
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center space-x-4">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
