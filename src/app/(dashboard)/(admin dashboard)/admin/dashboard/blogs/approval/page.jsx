"use client";

import { useState } from "react";
import { Check, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import Image from "next/image";

import {
  useGetPendingBlogsQuery,
  useApproveBlogMutation,
} from "@/redux/features/Blog/Blog.api";
import { ViewBlogDialog } from "../_components/ViewDialog";
import PermissionError from "@/components/shared/PermissionError";

export default function ApprovalPage() {
  const { data: pendingBlogs, isLoading, refetch, error } = useGetPendingBlogsQuery();
  const [approveBlog] = useApproveBlogMutation();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const handleApproveBlog = async (blogId) => {
    setProcessingId(blogId);
    try {
      await approveBlog(blogId).unwrap();
      toast.success("Blog approved successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  const openPreview = (blog) => {
    setSelectedBlog(blog);
    setIsViewOpen(true);
  };

  if (error?.data?.message === "Insufficient module permissions") {
    return <PermissionError />;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-[#fff8e5] border rounded-t-lg">
          <h1 className="text-2xl font-bold text-[#141B34]">
            Blog Approval Queue
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {pendingBlogs?.length || 0} blogs waiting for approval
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : pendingBlogs?.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingBlogs.map((blog) => (
                  <TableRow key={blog._id} className="hover:bg-yellow-50">
                    <TableCell>
                      <div className="relative h-16 w-24">
                        <Image
                          src={
                            blog.thumbnail
                              ? `${process.env.NEXT_PUBLIC_API_URL}/${blog.thumbnail}`
                              : "/placeholder-thumbnail.jpg"
                          }
                          alt={blog.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {blog.title}
                    </TableCell>
                    <TableCell>
                      {blog.mentor?.fullName || "Unknown Author"}
                    </TableCell>
                    <TableCell>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openPreview(blog)}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApproveBlog(blog._id)}
                          disabled={processingId === blog._id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {processingId === blog._id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">No blogs waiting for approval</p>
          </div>
        )}
      </div>

      {/* Blog Preview Dialog */}
      <ViewBlogDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        blog={selectedBlog}
      />
    </div>
  );
}
