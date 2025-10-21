"use client";

import { Megaphone } from "lucide-react";
import NoticeCard from "./NoticeCard";

export default function NoticesList({ notices }) {
  if (!notices || notices?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Megaphone className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No notices</h3>
        <p className="text-gray-500">There are no notices at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {notices?.map((notice) => (
        <NoticeCard key={notice.id} notice={notice} />
      ))}
    </div>
  );
}
