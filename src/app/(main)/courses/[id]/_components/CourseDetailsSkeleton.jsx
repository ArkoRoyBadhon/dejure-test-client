"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetailsSkeleton() {
  return (
    <div className="relative">
      {/* Hero Section Skeleton */}
      <div className="relative bg-gradient-to-r from-transparent to-[rgba(255,184,0,0.1)]">
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center opacity-[.04]" />
        <div className="relative max-w-[1200px] mx-auto py-20 flex flex-col md:flex-row gap-28">
          {/* Left Content Skeleton */}
          <div className="flex-1 space-y-8 my-auto text-center md:text-left px-4 md:px-0">
            {/* Title Skeleton */}
            <Skeleton className="h-8 md:h-12 w-3/4 mx-auto md:mx-0" />

            {/* Description Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Badges Skeleton */}
            <div className="flex gap-2 flex-wrap justify-center md:justify-start">
              <Skeleton className="h-10 w-20 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>

            {/* Stats Cards Skeleton - Desktop */}
            <div className="justify-start hidden md:block">
              <div className="flex overflow-x-auto md:overflow-visible items-center bg-white rounded-xl shadow-lg py-1 w-full border">
                <div className="flex flex-nowrap md:flex-row items-center justify-between w-[590px]">
                  {/* Student Count Skeleton */}
                  <div className="flex items-center space-x-4 p-4 w-full">
                    <Skeleton className="w-8 h-8 rounded" />
                    <div className="flex flex-col space-y-1">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>

                  {/* Live Classes Skeleton */}
                  <div className="flex items-center space-x-4 p-2 w-full">
                    <Skeleton className="w-8 h-8 rounded" />
                    <div className="flex flex-col space-y-1">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>

                  {/* Batch Start Skeleton */}
                  <div className="flex items-center space-x-4 p-2 w-full">
                    <Skeleton className="w-8 h-8 rounded" />
                    <div className="flex flex-col space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-14" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards Skeleton - Mobile */}
            <div className="justify-start px-4 block md:hidden">
              <div className="flex items-center bg-white rounded-xl shadow-lg py-1 w-full border">
                <div className="flex flex-nowrap md:flex-row items-center justify-between">
                  {/* Student Count Skeleton */}
                  <div className="flex items-center p-2 w-full">
                    <Skeleton className="w-8 h-8 rounded" />
                    <div className="flex flex-col space-y-1 ml-2">
                      <Skeleton className="h-3 w-8" />
                      <Skeleton className="h-2 w-16" />
                    </div>
                  </div>

                  {/* Live Classes Skeleton */}
                  <div className="flex items-center p-2 w-full">
                    <Skeleton className="w-8 h-8 rounded" />
                    <div className="flex flex-col space-y-1 ml-2">
                      <Skeleton className="h-3 w-8" />
                      <Skeleton className="h-2 w-12" />
                    </div>
                  </div>

                  {/* Batch Start Skeleton */}
                  <div className="flex items-center p-2 w-full">
                    <Skeleton className="w-8 h-8 rounded" />
                    <div className="flex flex-col space-y-1 ml-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-2 w-10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Skeleton */}
          <div className="relative h-[380px] md:h-[436px] w-[90%] mx-auto md:w-[475px]">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* Mentors and Pricing Section Skeleton */}
      <div className="bg-white py-0 md:py-8 mt-0 mb-8 md:mt-12 md:mb-12 px-4 sm:px-6 lg:px-8 my-auto flex items-center">
        <div className="max-w-[1200px] mx-auto w-full">
          {/* Mobile Price Section Skeleton */}
          <div className="block lg:hidden mb-8">
            <div className="bg-white rounded-lg shadow-lg border p-6">
              {/* Course Type Selector Skeleton */}
              <div className="mb-4 bg-gray-100 p-2 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>

              {/* Price Title Skeleton */}
              <Skeleton className="h-6 w-32 mb-4" />

              {/* Price Skeleton */}
              <div className="mb-4">
                <Skeleton className="h-8 w-24" />
              </div>

              {/* Button Skeleton */}
              <Skeleton className="h-12 w-full rounded-lg mb-6" />

              {/* Features Title Skeleton */}
              <Skeleton className="h-5 w-28 mb-4" />

              {/* Features List Skeleton */}
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mentors Panel Skeleton - Left Side */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-[#F2F7FC] rounded-lg shadow-sm p-6">
                {/* Mentors Title Skeleton */}
                <Skeleton className="h-8 w-32 mb-6 mx-auto lg:mx-0" />

                {/* Mentors Grid Skeleton */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="relative rounded-2xl shadow-md flex flex-col items-center bg-white"
                    >
                      <div className="flex flex-col h-[265px] w-full">
                        {/* Mentor Image Skeleton */}
                        <Skeleton className="w-full h-[150px] rounded-t-2xl" />

                        {/* Mentor Info Skeleton */}
                        <div className="flex flex-col items-center justify-center text-center px-3">
                          <Skeleton className="h-4 w-24 mt-2" />
                          <Skeleton className="h-3 w-16 mb-1 mt-2" />
                          <Skeleton className="h-3 w-full mt-2" />
                          <Skeleton className="h-3 w-3/4 mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Section Skeleton - Right Side (Desktop) */}
            <div className="lg:col-span-1 hidden lg:block order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-lg border p-6 sticky top-8">
                {/* Course Type Selector Skeleton */}
                <div className="mb-4 bg-gray-100 p-2 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-16 rounded-md" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                  </div>
                </div>

                {/* Price Title Skeleton */}
                <Skeleton className="h-6 w-32 mb-4" />

                {/* Price Skeleton */}
                <div className="mb-4">
                  <Skeleton className="h-8 w-24" />
                </div>

                {/* Button Skeleton */}
                <Skeleton className="h-12 w-full rounded-lg mb-6" />

                {/* Features Title Skeleton */}
                <Skeleton className="h-5 w-28 mb-4" />

                {/* Features List Skeleton */}
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus Section Skeleton */}
      <div className="">
        {/* Top Syllabus Part Skeleton */}
        <div className="relative bg-[#FFB80033] rounded-[50px] px-4 md:px-0">
          <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center opacity-[.04] z-0 pointer-events-none" />
          <div className="relative z-10 py-20 max-w-[1200px] mx-auto">
            {/* Syllabus Title Skeleton */}
            <div className="mb-4">
              <Skeleton className="h-6 w-48" />
            </div>

            {/* Syllabus Accordion Skeleton */}
            <div className="space-y-4 px-2 md:px-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  {/* Accordion Header Skeleton */}
                  <div className="rounded-xl w-full flex justify-between items-center p-3 bg-white">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="w-5 h-5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Part Skeleton */}
        <div className="max-w-[1200px] mx-auto pt-16 px-4 md:px-0">
          {/* Section Title Skeleton */}
          <Skeleton className="h-8 w-80 mx-auto md:mx-0 mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full md:w-8/12 mx-auto md:mx-0">
            {/* Routine Section Skeleton */}
            <div className="flex flex-col items-center md:items-start">
              <Skeleton className="w-full h-[240px] rounded-lg" />
              <Skeleton className="h-12 w-full rounded-xl mt-4" />
            </div>

            {/* Prospectus Section Skeleton */}
            <div className="flex flex-col items-center md:items-start">
              <Skeleton className="w-full h-[240px] rounded-lg" />
              <Skeleton className="h-12 w-full rounded-xl mt-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact and Resources Skeleton */}
      <div className="mt-16">
        <Skeleton className="h-32 w-full" />
      </div>

      {/* Download App Skeleton */}
      <div className="mt-8">
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
