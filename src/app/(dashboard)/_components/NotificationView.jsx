"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "@/redux/features/notifications/notification.Api";
import { useSocketContext } from "@/providers/SocketContextProvider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import CreateNoticeDialog from "./CreateNoticeDialog";
import NotificationsList from "./NotificationsList";
import NoticesList from "./NoticesList";
import { useGetAllLearnersQuery } from "@/redux/features/auth/learner.api";
import { useGetAllMentorsQuery } from "@/redux/features/auth/mentor.api";
import {
  useCreateNoticeMutation,
  useGetAllNoticesQuery,
} from "@/redux/features/notifications/notice.Api";
import PermissionError from "@/components/shared/PermissionError";

export default function NotificationView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("notifications");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch notifications
  const {
    data: notificationData,
    isLoading: isNotificationsLoading,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery();

  // Fetch notices
  const {
    data: noticesData,
    isLoading: isNoticesLoading,
    refetch: refetchNotices,
    error: noticesError,
  } = useGetAllNoticesQuery();
  const [createNotice] = useCreateNoticeMutation();

  // Fetch learners
  const { data: allLearnersData, isLoading: isLearnersLoading } =
    useGetAllLearnersQuery();
  const { data: allMentorsData, isLoading: isMentorsLoading } =
    useGetAllMentorsQuery();

  const [markAsRead] = useMarkAsReadMutation();
  const { socket } = useSocketContext();
  const { user } = useSelector((state) => state.auth);

  // Transform learners data
  const learners =
    allLearnersData?.learners?.map((learner) => ({
      id: learner._id,
      name: learner.fullName,
    })) || [];

  // Transform mentors data
  const mentors =
    allMentorsData?.map((mentor) => ({
      id: mentor._id,
      name: mentor.fullName,
    })) || [];

  // Mark a single notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId).unwrap();
      toast.success("Notification marked as read");
      refetchNotifications();
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!notificationData) return;

    try {
      const unreadNotifications = notificationData.filter((n) => !n.isRead);
      await Promise.all(
        unreadNotifications.map((notification) =>
          markAsRead(notification._id).unwrap()
        )
      );
      toast.success("All notifications marked as read");
      refetchNotifications();
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    }
  };

  // Handle notice creation
  const onSubmit = useCallback(
    async (values) => {
      try {
        const formData = {
          title: values.title,
          description: values.description,
          isImportant: values.isImportant,
          mentors: values.mentors,
          learners: values.learners,
          notificationTypes: values.notificationTypes,
        };

        await createNotice(formData).unwrap();
        toast.success("Notice created successfully");
        refetchNotices();
        setIsDialogOpen(false);
      } catch (error) {
        toast.error("Failed to create notice");
      }
    },
    [createNotice, refetchNotices]
  );

  // Handle socket notifications
  useEffect(() => {
    if (socket) {
      const handleNotice = () => refetchNotices();
      socket.on("notice", handleNotice);

      return () => {
        socket.off("notice", handleNotice);
      };
    }
  }, [socket, refetchNotices]);

  // Count unread notifications
  const unreadCount = notificationData?.filter((n) => !n.isRead).length || 0;

  if (noticesError?.data?.message === "Insufficient module permissions")
    return <PermissionError />;

  return (
    <div className="mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">নোটিশ বোর্ড</h1>
        </div>
        {activeTab === "notifications" && unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="notifications" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <NotificationsList
            notifications={notificationData}
            isLoading={isNotificationsLoading}
            onMarkAsRead={handleMarkAsRead}
          />
        </TabsContent>

        <TabsContent value="notices">
          <div
            className={`flex justify-end mb-4 ${
              user?.role === "learner" || user?.role === "mentor"
                ? "hidden"
                : "block"
            }`}
          >
            <CreateNoticeDialog
              learners={learners}
              mentors={mentors}
              onSubmit={onSubmit}
              isOpen={isDialogOpen}
              setIsOpen={setIsDialogOpen}
            />
          </div>
          <NoticesList
            notices={noticesData?.data || []}
            isLoading={isNoticesLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
