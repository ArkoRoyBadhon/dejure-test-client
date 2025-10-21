"use client";

import { Megaphone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NoticeCard({ notice }) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        notice.isImportant
          ? "bg-red-50 border-red-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="mt-1">
          <Megaphone
            className={`h-5 w-5 ${
              notice.isImportant ? "text-red-500" : "text-gray-500"
            }`}
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3
              className={`font-medium ${
                notice.isImportant ? "text-gray-900" : "text-gray-700"
              }`}
            >
              {notice.title}
            </h3>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(notice.updatedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{notice.description}</p>
          {notice.isImportant && (
            <span className="inline-block mt-2 text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
              Important
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
