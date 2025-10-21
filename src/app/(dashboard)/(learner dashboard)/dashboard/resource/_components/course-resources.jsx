"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetResourcesByCourseQuery } from "@/redux/features/resource/resource.api";
import { Eye } from "lucide-react";

export default function CourseResources({ courseId, enrollments }) {
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [previewResource, setPreviewResource] = useState(null);

  const enrollment = enrollments.find((e) => e.course._id === courseId);
  const course = enrollment?.course;

  const { data: resourcesData, isLoading: resourcesLoading } =
    useGetResourcesByCourseQuery(courseId);
  const resources = resourcesData || [];

  const handlePreview = (resource) => {
    setPreviewResource(resource);
    setOpenPreviewDialog(true);
  };

  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
  };

  if (!course) return null;

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="border m-4 rounded-xl">
        {/* Table Header */}
        <div className="px-6 py-3 bg-[#F2F7FC] rounded-t-xl border-b grid grid-cols-3 text-sm font-medium text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-[#141B34] font-bold">শিরোনাম</span>
          </div>
          <div></div>
          <div className="text-[#141B34] font-bold text-center">একশন</div>
        </div>

        {/* Preview Dialog */}
        <Dialog open={openPreviewDialog} onOpenChange={setOpenPreviewDialog}>
          <DialogContent className="custom-dialog-width2 w-full h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{previewResource?.title || "Preview"}</DialogTitle>
            </DialogHeader>
            <div className="flex-1">
              {previewResource && (
                <iframe
                  src={`${getFileUrl(
                    previewResource.resource
                  )}#toolbar=0&navpanes=0&zoom=100`}
                  className="w-full h-full border rounded-md"
                  title="PDF Preview"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {resourcesLoading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No resources available for this course yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {resources.map((res) => (
              <div
                key={res._id}
                className="p-4 grid grid-cols-2 items-center hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {res.title || "Untitled Resource"}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(res)}
                    title="Preview"
                    className="text-gray-700 hover:bg-gray-200 border-gray-300"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    ভিউ করুন
                  </Button>

                  {/* <a
                    href={getFileUrl(res.resource)}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-700 hover:bg-gray-200 border-gray-300"
                    >
                      <Download className="mr-1 h-4 w-4" />
                      download করুন
                    </Button>
                  </a> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
