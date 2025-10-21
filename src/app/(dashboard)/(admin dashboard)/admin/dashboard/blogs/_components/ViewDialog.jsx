"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";

export function ViewBlogDialog({ open, onOpenChange, blog }) {
  if (!blog) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="custom-dialog-width2 h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{blog.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Thumbnail and Meta */}
          <div className="md:col-span-1 space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={
                  blog.thumbnail
                    ? `${process.env.NEXT_PUBLIC_API_URL}/${blog.thumbnail}`
                    : "/placeholder-blog.jpg"
                }
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{blog.mentor?.fullName || "Unknown Author"}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                {!blog.isApproved && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending Approval
                  </span>
                )}
                {blog.isFeatured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Featured
                  </span>
                )}
                {blog.ishighlighted && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Highlighted
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="md:col-span-2 space-y-4">
            <div className="prose max-w-none">
              <div className="prose-quill max-w-none">
                <div dangerouslySetInnerHTML={{ __html: blog.description }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {/* {!blog.isApproved && (
            <>
              <Button variant="destructive">
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button variant="default">
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </>
          )} */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
