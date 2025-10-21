"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/assets/icons/DJA logo Transperant-01 2.png"
              alt="De Jure Academy Logo"
              width={120}
              height={76}
              className="h-[76px] w-[120px] object-contain mx-auto hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Large 404 Text */}
            <div className="text-8xl sm:text-9xl lg:text-[200px] font-bold text-gray-200 leading-none select-none">
              404
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-2">
            দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি পাওয়া যায়নি।
          </p>
          <p className="text-base text-gray-500">
            পৃষ্ঠাটি সরানো, মুছে ফেলা বা অস্থায়ীভাবে অনুপলব্ধ হতে পারে।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 min-w-[160px]">
              <Home className="w-5 h-5" />
              হোম পেজে যান
            </Button>
          </Link>

          <Link href="/courses">
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 min-w-[160px]"
            >
              <BookOpen className="w-5 h-5" />
              কোর্সসমূহ দেখুন
            </Button>
          </Link>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-700 transition-colors duration-300 flex items-center gap-2 mx-auto group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="border-b border-blue-300 group-hover:border-blue-500">
              পূর্ববর্তী পৃষ্ঠায় ফিরে যান
            </span>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-50 animate-pulse hidden lg:block"></div>
        <div
          className="absolute bottom-20 right-10 w-16 h-16 bg-indigo-100 rounded-full opacity-50 animate-pulse hidden lg:block"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 right-20 w-12 h-12 bg-purple-100 rounded-full opacity-50 animate-pulse hidden lg:block"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </div>
  );
}
