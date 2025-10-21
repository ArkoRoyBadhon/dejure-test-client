"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Edit,
  MoreVertical,
  Search,
  Filter,
  Wallet,
  UserRound,
  MapPin,
  BriefcaseBusiness,
  MousePointer2,
} from "lucide-react";
import {
  useDeleteCareerMutation,
  useGetCareersQuery,
} from "@/redux/features/career/career.api";
import { CreateCareerDialog } from "./_components/CreateJobDialog";
import DeleteCareerDialog from "./_components/DeleteJob";

import Loader from "@/components/shared/Loader";
import PermissionError from "@/components/shared/PermissionError";
export default function CareerManagePage() {
  const { data: jobs, isLoading, error } = useGetCareersQuery();
  const [deleteCareer] = useDeleteCareerMutation();

  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [filters, setFilters] = useState({ isActive: false });
  const [showFilters, setShowFilters] = useState(false);

  const closeMenu = () => setActiveMenu(null);

  // Filter and search jobs
  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter((job) => {
      const matchesSearch =
        searchTerm === "" ||
        (searchType === "title"
          ? job.title.toLowerCase().includes(searchTerm.toLowerCase())
          : job.type.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilters = !filters.isActive || job.isActive;

      return matchesSearch && matchesFilters;
    });
  }, [jobs, searchTerm, searchType, filters]);

  const toggleFilter = (filterName) => {
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  if (error?.data?.message === "Insufficient module permissions") {
    return <PermissionError />;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="rounded-xl shadow-md">
        {/* Header */}
        <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border flex justify-between items-center">
          <h1 className="text-[#141B34] font-bold text-xl">
            Manage Job Portal
          </h1>
          <div className="flex items-center gap-4">
            <CreateCareerDialog />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 bg-white border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search by ${searchType}`}
                className="pl-10 bg-yellow-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 items-center">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-[120px] bg-yellow-50 border border-yellow-300 hover:bg-yellow-200">
                  <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent className="bg-yellow-50 border border-yellow-300">
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex gap-2 bg-yellow-50 hover:bg-yellow-200 border border-yellow-300"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active-filter"
                  checked={filters.isActive}
                  onCheckedChange={() => toggleFilter("isActive")}
                  className="bg-yellow-50 hover:bg-yellow-200 border border-yellow-300"
                />
                <label htmlFor="active-filter" className="text-sm font-medium">
                  Active Jobs Only
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Jobs List */}
        <div className="p-4 bg-white rounded-b-xl">
          {isLoading ? (
            <Loader />
          ) : filteredJobs?.length > 0 ? (
            <div className="flex flex-col gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 bg-white rounded-xl shadow-md relative border"
                >
                  {/* Job Info */}
                  <div className="flex gap-4 items-center">
                    <Image
                      alt="job_title"
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${job.thumbnail}`}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                    <h5 className="text-darkColor font-bold">{job?.title}</h5>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-darkColor">
                    <div className="inline-flex items-center gap-2.5">
                      <Wallet size={20} />
                      {job.salaryRange}
                    </div>
                    <div className="inline-flex items-center gap-2.5">
                      <UserRound size={20} />
                      {job.type}
                    </div>
                    <div className="inline-flex items-center gap-2.5">
                      <MapPin size={20} />
                      {job.location}
                    </div>
                    <div className="inline-flex items-center gap-2.5">
                      <BriefcaseBusiness size={20} />
                      {job.experience}
                    </div>
                    {/* Qualification Field */}
                    <div className="inline-flex items-center gap-2.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      {job.qualification || "Not specified"}
                    </div>
                    {/* Deadline Field */}
                    <div className="inline-flex items-center gap-2.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {job.deadline
                        ? new Date(job.deadline).toLocaleDateString()
                        : "Not specified"}
                    </div>
                  </div>

                  {/* Three-dot menu */}
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === job._id ? null : job._id)
                      }
                      className="py-1 rounded-md bg-yellow-50 transition-colors border border-yellow-500"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>

                    {activeMenu === job._id && (
                      <div className="absolute right-0 w-24 shadow-lg bg-white rounded-md">
                        <div>
                          <CreateCareerDialog job={job} onClose={closeMenu}>
                            <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Update
                            </div>
                          </CreateCareerDialog>

                          <DeleteCareerDialog
                            job={job}
                            onDelete={() => deleteCareer(job._id)}
                            onClose={closeMenu}
                          >
                            <button onClick={closeMenu} role="menuitem">
                              Delete
                            </button>
                          </DeleteCareerDialog>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Apply Button */}
                  <Button className="rounded-2xl py-3 px-6 gap-2.5 text-darkColor w-fit">
                    Apply Now <MousePointer2 strokeWidth={1} />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No jobs found</p>
          )}
        </div>
      </div>
    </div>
  );
}
