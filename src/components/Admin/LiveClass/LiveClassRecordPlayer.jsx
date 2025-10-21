"use client";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function LiveClassRecordPlayer({ open, onClose, video }) {
  useEffect(() => {
    console.log("LiveClassRecordPlayer video:", video);
  }, [video]);
  console.log("LiveClassRecordPlayer open:", open);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="custom-dialog-width p-0 space-y-0 gap-0">
        {/* Header (Part 1) */}
        <div className="px-6 py-4 bg-[#F2F7FC] rounded-t-xl border-b flex justify-between items-center">
          <div className="grid grid-cols-3 w-full text-sm font-medium text-gray-600">
            <div className="flex items-center gap-1 col-span-3 justify-center">
              <span className="text-[#141B34] font-bold text-lg text-center">
                {video?.title || "রেকর্ডিং ভিডিও"}
              </span>
            </div>
          </div>
        </div>

        {/* Video Player (Part 2) */}
        <div className="bg-black">
          <div className="relative h-[600px] overflow-hidden rounded-b-xl">
            {video?.url ? (
              <iframe
                src={`https://player.vimeo.com/video/${video.url
                  .split("/")
                  .pop()}`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-white text-xl font-semibold">
                Please select a video to watch
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
