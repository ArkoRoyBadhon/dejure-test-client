"use client";

import { useState, useMemo } from "react";
import { useGetTimelinesQuery } from "@/redux/features/timeline/timeline.api";

import Loader from "@/components/shared/Loader";
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

export default function TimeLineContents() {
  const { data: timelines, isLoading } = useGetTimelinesQuery();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter timelines by title
  const filteredTimelines = useMemo(() => {
    if (!timelines) return [];
    return timelines.filter((timeline) =>
      timeline.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [timelines, searchTerm]);

  return (
    <div className="p-6 max-w-[1200px] mx-auto mb-8">
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title"
          className="w-full max-w-md px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Video Grid */}
      {isLoading ? (
        <Loader />
      ) : filteredTimelines?.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {filteredTimelines.map((timeline) => (
            <div
              key={timeline._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <iframe
                className="w-full aspect-video"
                src={getYouTubeEmbedUrl(timeline.link)}
                allowFullScreen
              ></iframe>
              <div className="p-4">
                <h2 className="text-lg font-semibold">{timeline.title}</h2>
                <p className="text-gray-600 text-sm">{timeline.subTitle}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No videos found</p>
      )}
    </div>
  );
}
