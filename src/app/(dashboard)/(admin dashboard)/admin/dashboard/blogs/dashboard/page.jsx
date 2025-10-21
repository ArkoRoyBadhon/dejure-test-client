"use client";

import { useGetAllBlogsQuery } from "@/redux/features/Blog/Blog.api";
import { CreateBlogDialog } from "../_components/BlogsDialog";
import { Edit, MoreVertical, Search, Filter } from "lucide-react";
import DeleteDialog from "../_components/DeleteBlogDialog";
import { useState, useMemo } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

import Loader from "@/components/shared/Loader";
import PermissionError from "@/components/shared/PermissionError";
export default function BlogManagePage() {
  const { data: allBlogs, isLoading, error } = useGetAllBlogsQuery();
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title"); // 'title' or 'author'
  const [filters, setFilters] = useState({
    approved: false,
    featured: false,
    highlighted: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  const closeMenu = () => setActiveMenu(null);

  // Calculate pending approval count
  const pendingApprovalCount = useMemo(
    () => allBlogs?.filter((b) => !b.isApproved).length || 0,
    [allBlogs]
  );

  // Filter and search blogs
  const filteredBlogs = useMemo(() => {
    if (!allBlogs) return [];

    return allBlogs.filter((blog) => {
      // Apply search filter
      const matchesSearch =
        searchTerm === "" ||
        (searchType === "title"
          ? blog.title.toLowerCase().includes(searchTerm.toLowerCase())
          : blog.mentor?.fullName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()));

      // Apply status filters
      const matchesFilters =
        (!filters.approved || blog.isApproved) &&
        (!filters.featured || blog.isFeatured) &&
        (!filters.highlighted || blog.ishighlighted);

      return matchesSearch && matchesFilters;
    });
  }, [allBlogs, searchTerm, searchType, filters]);

  const toggleFilter = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  if (error?.data?.message === "Insufficient module permissions") {
    return <PermissionError />;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="rounded-xl shadow-md">
        {/* Page Header */}
        <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border flex justify-between items-center">
          <h1 className="text-[#141B34] font-bold text-xl">MANAGE BLOGS</h1>
          <div className="flex items-center gap-4">
            <div>
              <Link href="/admin/dashboard/blogs/approval">
                <Button
                  variant="outline"
                  className="relative bg-yellow-50 hover:bg-yellow-200 border border-yellow-300"
                >
                  Need Approval
                  {pendingApprovalCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingApprovalCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
            <CreateBlogDialog />
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="p-4 bg-white border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search by ${
                  searchType === "title" ? "blog title" : "author name"
                }`}
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
                  <SelectItem
                    value="title"
                    className="hover:bg-yellow-200 hover:border hover:border-yellow-300"
                  >
                    Title
                  </SelectItem>
                  <SelectItem
                    value="author"
                    className="hover:bg-yellow-200 hover:border hover:border-yellow-300"
                  >
                    Author
                  </SelectItem>
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

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="approved-filter"
                  checked={filters.approved}
                  onCheckedChange={() => toggleFilter("approved")}
                  className="bg-yellow-50 hover:bg-yellow-200 border border-yellow-300"
                />
                <label
                  htmlFor="approved-filter"
                  className="text-sm font-medium"
                >
                  Approved Only
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured-filter"
                  checked={filters.featured}
                  onCheckedChange={() => toggleFilter("featured")}
                  className="bg-yellow-50 hover:bg-yellow-200 border border-yellow-300"
                />
                <label
                  htmlFor="featured-filter"
                  className="text-sm font-medium"
                >
                  Featured Only
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="highlighted-filter"
                  checked={filters.highlighted}
                  onCheckedChange={() => toggleFilter("highlighted")}
                  className="bg-yellow-50 hover:bg-yellow-200 border border-yellow-300"
                />
                <label
                  htmlFor="highlighted-filter"
                  className="text-sm font-medium"
                >
                  Highlighted Only
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Blogs List */}
        <div className="p-4 bg-white rounded-b-xl">
          {isLoading ? (
            <Loader />
          ) : filteredBlogs?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="flex-shrink-0 bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between relative cursor-pointer"
                >
                  {/* Status Badges */}
                  <div className="absolute top-2 left-2 z-10 flex gap-1">
                    {blog.isApproved && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Approved
                      </span>
                    )}
                    {blog.isFeatured && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Featured
                      </span>
                    )}
                    {blog.ishighlighted && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Highlighted
                      </span>
                    )}
                  </div>

                  {/* Three-dot menu button */}
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === blog._id ? null : blog._id)
                      }
                      className="py-1 rounded-md bg-yellow-50 transition-colors border border-yellow-500"
                      aria-label="Toggle blog actions menu"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>

                    {/* Dropdown menu */}
                    {activeMenu === blog._id && (
                      <div className="absolute right-0 w-24 shadow-lg bg-white rounded-md">
                        <div
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          {/* Edit dialog */}
                          <CreateBlogDialog blog={blog} onClose={closeMenu}>
                            <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Update
                            </div>
                          </CreateBlogDialog>

                          {/* Delete dialog */}
                          <DeleteDialog blog={blog} onClose={closeMenu}>
                            <button onClick={closeMenu} role="menuitem">
                              Delete
                            </button>
                          </DeleteDialog>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Blog Thumbnail */}
                  <div className="relative">
                    <Link key={blog._id} href={`/blog/${blog._id}`}>
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${
                          blog.thumbnail || ""
                        }`}
                        alt="Blog Thumbnail"
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    </Link>
                  </div>

                  {/* Blog Content */}
                  <div className="p-4 flex flex-col gap-4 flex-grow">
                    <h3 className="text-base font-bold text-gray-800">
                      {blog.title}
                    </h3>
                    <div className="prose-quill max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: (() => {
                            if (!blog.description) return "";

                            // Remove extra whitespace and split words
                            const words = blog.description
                              .replace(/\s+/g, " ")
                              .split(" ")
                              .slice(0, 10)
                              .join(" ");

                            // Add ellipsis if more than 10 words
                            return blog.description.split(" ").length > 10
                              ? words + "..."
                              : words;
                          })(),
                        }}
                      />
                    </div>
                  </div>

                  {/* Author Section */}
                  <div className="flex items-center gap-2 mt-2 p-4 pt-0">
                    {blog.mentor?.image ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${blog.mentor?.image}`}
                        alt="mentor"
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <Image
                        src="https://www.svgrepo.com/show/452030/avatar-default.svg"
                        alt="mentor"
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {blog.mentor?.fullName || "DE JERY ACADEMY"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              {searchTerm || Object.values(filters).some(Boolean)
                ? "No blogs match your search criteria"
                : "No blogs found"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
