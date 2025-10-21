"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCareersQuery } from "@/redux/features/career/career.api";
import {
  BriefcaseBusiness,
  Calendar,
  FileText,
  MapPin,
  MousePointer2,
  UserRound,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentJobList() {
  const { data, isLoading } = useGetCareersQuery({});
  const [filter, setFilter] = useState("");

  // Apply filter only if selected
  const jobs = (data || [])
    .filter((job) => job.isActive === true)
    .filter((job) => (filter ? job.type?.toLowerCase() === filter : true));

  return (
    <section className="bg-main/20 py-24 rounded-[50px] relative mt-12 md:mt-0 mb-0 md:mb-12">
      {/* Background opacity image */}
      <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-5" />

      <div className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="text-darkColor font-bold text-2xl md:text-3xl Z">Recent job list</h2>

          <Select onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className={"bg-white"}>
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="onsite">Onsite</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 bg-white rounded-xl shadow-md"
              >
                {/* Skeleton for Column 1 - Job Title */}
                <div className="flex gap-4 items-center md:w-[200px]">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <Skeleton className="h-5 w-40" />
                </div>

                {/* Skeleton for Column 2 - Job Details */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-4 text-darkColor md:w-[700px]">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-28" />
                  {/* Skeleton for Qualification column */}
                  <Skeleton className="h-5 w-24" />
                  {/* Skeleton for Deadline column */}
                  <Skeleton className="h-5 w-24" />
                </div>

                {/* Skeleton for Column 3 - Action Button */}
                <div className="md:w-[150px]">
                  <Skeleton className="h-10 w-28 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <p>No jobs found</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-0  p-4 bg-white rounded-xl shadow-md"
              >
                {/* Column 1 - Job Title */}
                <div className="flex gap-4 items-center md:w-[200px]">
                  <Image
                    alt="image"
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${job.thumbnail}`}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                  <h5 className="text-darkColor font-bold truncate">
                    {job.title}
                  </h5>
                </div>

                {/* Column 2 - Job Details with Fixed Widths */}
                <div className="flex flex-col gap-4 md:w-[700px]">
                  {/* First Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="inline-flex items-center gap-2.5 min-w-[120px]">
                      <Wallet size={20} />
                      <span className="truncate">{job.salaryRange}</span>
                    </div>
                    <div className="inline-flex items-center gap-2.5 min-w-[100px]">
                      <UserRound size={20} />
                      <span className="truncate">{job.type}</span>
                    </div>
                    <div className="inline-flex items-center gap-2.5 min-w-[120px]">
                      <MapPin size={20} />
                      <span className="truncate">{job.location}</span>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="inline-flex items-center gap-2.5 min-w-[130px]">
                      <BriefcaseBusiness size={20} />
                      <span className="truncate">{job.experience}</span>
                    </div>
                    <div className="inline-flex items-center gap-2.5 min-w-[120px]">
                      <FileText size={20} />
                      <span className="truncate">
                        {job.qualification || "Not specified"}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2.5 min-w-[120px]">
                      <Calendar size={20} />
                      <span className="truncate">
                        {job.deadline
                          ? new Date(job.deadline).toLocaleDateString()
                          : "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 3 - Action Button */}
                <div className="md:w-[150px] flex justify-start md:justify-end">
                  <a href={job.link} target="_blank" rel="noopener noreferrer">
                    <Button className="rounded-2xl py-3 px-6 gap-2.5 text-white bg-blue hover:bg-blue-500 w-fit">
                      Apply Now <MousePointer2 strokeWidth={1} />
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
