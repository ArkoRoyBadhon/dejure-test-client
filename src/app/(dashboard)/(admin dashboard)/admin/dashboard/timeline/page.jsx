"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { MoreVerticalIcon, Pencil, Search } from "lucide-react";
import {
  useDeleteTimelineMutation,
  useGetTimelinesQuery,
} from "@/redux/features/timeline/timeline.api";
import { CreateTimelineDialog } from "./_components/timelineDialog";
import DeleteTimelineDialog from "./_components/DeleteTimelineDialog";

import Loader from "@/components/shared/Loader";
import PermissionError from "@/components/shared/PermissionError";
// Helper to safely convert YouTube URLs to embed format
function getYouTubeEmbedUrl(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
    }
    if (urlObj.hostname.includes("youtube.com")) {
      const v = urlObj.searchParams.get("v");
      return v ? `https://www.youtube.com/embed/${v}` : url;
    }
    return url; // fallback if not YouTube
  } catch {
    return url; // fallback if invalid URL
  }
}

export default function TimelineManagePage() {
  const { data: timelines, isLoading, error } = useGetTimelinesQuery();
  const [deleteTimeline] = useDeleteTimelineMutation();

  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const closeMenu = () => setActiveMenu(null);

  // Filter timelines by title
  const filteredTimelines = useMemo(() => {
    if (!timelines) return [];
    return timelines.filter((timeline) =>
      timeline.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [timelines, searchTerm]);

  if (error?.data?.message === "Insufficient module permissions")
    return <PermissionError />;

  return (
    <div className="p-5 mx-auto">
      {/* Header */}
      <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border flex justify-between items-center">
        <h1 className="text-[#141B34] font-bold text-xl">Manage Timelines</h1>
        <CreateTimelineDialog />
      </div>

      {/* Search */}
      <div className="p-4 bg-white border-b">
        <div className="relative flex-1 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title"
            className="pl-10 bg-yellow-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="p-6 bg-white rounded-b-xl">
        {isLoading ? (
          <Loader />
        ) : filteredTimelines?.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTimelines.map((timeline) => (
              <div
                key={timeline._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
              >
                {/* Video Player */}
                <iframe
                  className="w-full aspect-video"
                  src={getYouTubeEmbedUrl(timeline.link)}
                  allowFullScreen
                ></iframe>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold">{timeline.title}</h2>
                  <p className="text-gray-600 text-sm">{timeline.subTitle}</p>
                </div>

                {/* Menu */}
                <div className="absolute top-1 right-0">
                  <button
                    onClick={() =>
                      setActiveMenu(
                        activeMenu === timeline._id ? null : timeline._id
                      )
                    }
                    className=" rounded-md bg-yellow-50 border border-yellow-500"
                  >
                    <MoreVerticalIcon className="w-5 h-5" />
                  </button>

                  {activeMenu === timeline._id && (
                    <div className="absolute right-0 w-20 shadow-lg bg-white rounded-md z-20">
                      <CreateTimelineDialog
                        timeline={timeline}
                        onClose={closeMenu}
                      >
                        <div className="flex items-center justify-center px-4 py-2 hover:bg-gray-100 w-full cursor-pointer">
                          Edit
                        </div>
                      </CreateTimelineDialog>

                      <DeleteTimelineDialog
                        timeline={timeline}
                        onDelete={() => deleteTimeline(timeline._id)}
                        onClose={closeMenu}
                      >
                        <button
                          className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                          onClick={closeMenu}
                        >
                          Delete
                        </button>
                      </DeleteTimelineDialog>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No timelines found</p>
        )}
      </div>
    </div>
  );
}
