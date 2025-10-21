"use client";

import { Edit, MoreVertical, Trash } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetMyBlogsQuery } from "@/redux/features/Blog/Blog.api";
import { CreateBlogDialog } from "@/app/(dashboard)/(admin dashboard)/admin/dashboard/blogs/_components/BlogsDialog";
import DeleteDialog from "@/app/(dashboard)/(admin dashboard)/admin/dashboard/blogs/_components/DeleteBlogDialog";

export default function MentorBlogsPage() {
  const { data: myBlogs, isLoading } = useGetMyBlogsQuery();
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeTab, setActiveTab] = useState("published"); // 'published' or 'pending'

  const closeMenu = () => setActiveMenu(null);

  // Filter blogs based on active tab
  const filteredBlogs = myBlogs?.filter((blog) =>
    activeTab === "published" ? blog.isApproved : !blog.isApproved
  );

  return (
    <div className="container mx-auto px-4 py-4 ">
      <div className="rounded-xl shadow-md">
        {/* Page Header */}
        <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border flex justify-between items-center">
          <h1 className="text-[#141B34] font-bold text-xl">আমার ব্লগ</h1>
          <CreateBlogDialog />
        </div>

        {/* Tab Buttons */}
        <div className="flex w-full items-center justify-center my-4 px-4 gap-2">
          <button
            className={`w-full py-4 rounded-xl ${
              activeTab === "published" ? "bg-main" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("published")}
          >
            পাবলিশড ব্লগ
          </button>
          <button
            className={`w-full py-4 rounded-xl ${
              activeTab === "pending" ? "bg-main" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            পেন্ডিং ব্লগ
          </button>
        </div>

        {/* Blogs List */}
        <div className="p-4 bg-white rounded-b-xl min-h-[60vh]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading your blogs...</p>
            </div>
          ) : filteredBlogs?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="flex-shrink-0 bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between relative"
                >
                  {/* Status Badge */}
                  {!blog.isApproved && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Pending Approval
                      </span>
                    </div>
                  )}
                  {blog.isApproved && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-1 text-xs bg-green-500 text-white  rounded-full">
                        Approved
                      </span>
                    </div>
                  )}

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
                            <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full cursor-pointer">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </div>
                          </DeleteDialog>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Blog Thumbnail */}
                  <div className="relative">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${
                        blog.thumbnail || ""
                      }`}
                      alt="Blog Thumbnail"
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Blog Content */}
                  <div className="p-4 flex flex-col gap-4 flex-grow">
                    <h3 className="text-base font-bold text-gray-800">
                      {blog.title}
                    </h3>
                    <p
                      className="text-sm text-[#74767C] line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: blog.description
                          ? blog.description.split(" ").slice(0, 10).join(" ") +
                            (blog.description.split(" ").length > 10
                              ? "..."
                              : "")
                          : "",
                      }}
                    ></p>
                  </div>

                  {/* Status and Date */}
                  <div className="px-4 pb-4 pt-0">
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
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">
                {activeTab === "published"
                  ? "You don't have any published blogs yet"
                  : "You don't have any pending blogs"}
              </p>
              <CreateBlogDialog>
                <Button variant="default">Create New Blog</Button>
              </CreateBlogDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
