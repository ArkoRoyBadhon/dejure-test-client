"use client";

import { Bell } from "lucide-react";
import NotificationCard from "./NotificationCard";

export default function NotificationsList({
  notifications,
  isLoading,
  onMarkAsRead,
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Bell className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
        <p className="text-gray-500">You don't have any notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification._id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
}
