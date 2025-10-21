"use client";

import {
  Mail,
  AlertCircle,
  CreditCard,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

export default function NotificationCard({ notification, onMarkAsRead }) {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "payment":
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case "class":
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case "exam":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      default:
        return <Mail className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border ${
        !notification.isRead
          ? "bg-blue-50 border-blue-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3
              className={`font-medium ${
                !notification.isRead ? "text-gray-900" : "text-gray-700"
              }`}
            >
              {notification.title}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </span>
              {!notification.isRead && (
                <button
                  onClick={() => onMarkAsRead(notification._id)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          {notification.relatedDetails && (
            <div className="mt-2 text-xs text-gray-500">
              {notification.relatedDetails.title && (
                <p>Exam: {notification.relatedDetails.title}</p>
              )}
              {notification.relatedDetails.scheduledDate && (
                <p>
                  Scheduled: {notification.relatedDetails.scheduledDate} at{" "}
                  {notification.relatedDetails.scheduledTime}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
