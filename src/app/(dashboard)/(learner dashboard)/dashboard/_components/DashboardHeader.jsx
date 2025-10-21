"use client";

import { Bell, Menu, User, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/auth/learnerSlice";
import { toast } from "sonner";
import Link from "next/link";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "@/redux/features/notifications/notification.Api";
import { formatDistanceToNow } from "date-fns";
import { useSocketContext } from "@/providers/SocketContextProvider";
import { useEffect, useState } from "react";
import { useLearnerLogoutMutation } from "@/redux/features/auth/learner.api";

const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");

    return true;
  } catch (error) {
    return false;
  }
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export function DashboardHeader({ onMenuClick }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { data: notifications, refetch } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const { socket } = useSocketContext();
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [learnerLogout] = useLearnerLogoutMutation();

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const handleLogout = async () => {
    dispatch(logout());
    if (user?.role === "learner") {
      await learnerLogout(token).unwrap();
    }
    toast.success("Successfully logged out", {
      description: "You have been logged out successfully.",
    });
    router.push("/");
  };

  const handleNotificationVisit = () => {
    if (user.role === "learner") {
      router.push("/dashboard/notice");
    } else if (user.role === "admin") {
      router.push("/admin/dashboard/notice");
    } else if (user.role === "mentor") {
      router.push("/mentor/dashboard/notice");
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId).unwrap();
      refetch();
    } catch (error) {}
  };

  const getNotificationLink = (notification) => {
    if (!notification.relatedEntity) return null;

    switch (notification.relatedEntity.type) {
      case "LiveExam":
        return `/exams/${notification.relatedEntity.id}`;
      case "LiveClass":
        return `/classes/${notification.relatedEntity.id}`;
      case "Course":
        return `/courses/${notification.relatedEntity.id}`;
      default:
        return null;
    }
  };

  const setupPushNotifications = async () => {
    if (!("Notification" in window)) {
      return;
    }

    try {
      if (Notification.permission === "granted") {
        await registerServiceWorker();
        return;
      }

      if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          await registerServiceWorker();
        } else {
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    const pushSupported =
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window;

    setIsPushSupported(pushSupported);

    if (pushSupported) {
      setupPushNotifications();
    }

    if (socket) {
      const handleSocketNotification = (newNotification) => {
        refetch();

        if (isPushSupported && Notification.permission === "granted") {
          const notificationOptions = {
            body: newNotification.message,
            icon: "/assets/icons/user-sharing.png",
            data: {
              notificationId: newNotification._id,
              relatedEntity: newNotification.relatedEntity,
            },
          };

          new Notification(newNotification.title, notificationOptions);
        }
      };

      socket.on("notification", handleSocketNotification);

      return () => {
        socket.off("notification", handleSocketNotification);
      };
    }
  }, [socket, isPushSupported]);

  return (
    <div
      className="w-full mx-auto border-b px-4 sm:px-8 sticky top-0 z-40 bg-[#f5f5f5]"
      style={{
        backgroundImage: `
          linear-gradient(to right, #FFB8004D 0%, #FFB80000 40%),
          linear-gradient(#f2f2f2, #f2f2f2)
        `,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
    >
      <header className="max-w-[1536px] mx-auto border-b py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden mr-2"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Image
                  src="/assets/icons/DJA logo Transperant-01 2.png"
                  alt="De Jure Academy Logo"
                  width={89}
                  height={56}
                  className="h-[40px] w-[60px] sm:h-[56px] sm:w-[89px] object-contain cursor-pointer"
                />
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative cursor-pointer hover:bg-black/10 text-black">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative cursor-pointer hover:bg-black/10 text-black"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-72 md:w-80 max-h-[440px] overflow-y-auto"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notifications</span>
                  <span className="text-xs text-muted-foreground">
                    {unreadCount} unread
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications?.length > 0 ? (
                  notifications.slice(0, 3)?.map((notification) => (
                    <DropdownMenuItem
                      key={notification._id}
                      className={`py-3 px-4 h-[100px] ${
                        !notification.isRead ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        if (!notification.isRead) {
                          handleMarkAsRead(notification._id);
                        }
                        const link = getNotificationLink(notification);
                        if (link) {
                          router.push(link);
                        }
                      }}
                    >
                      <div className="flex flex-col w-full">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">
                            {notification.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        {notification.relatedDetails?.title && (
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.relatedDetails.title}
                          </p>
                        )}
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 self-end mt-1" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem className="py-3 px-4 text-center text-muted-foreground">
                    No notifications
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleNotificationVisit}
                  className="text-center justify-center text-main hover:text-main/90 cursor-pointer"
                >
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-3 cursor-pointer hover:bg-black/10 rounded-lg px-3 py-2 transition-colors">
                  <Avatar className="h-[36px] w-[36px] sm:h-[46px] sm:w-[46px] border-2 border-white/20">
                    <AvatarImage
                      src={
                        user?.image
                          ? `${process.env.NEXT_PUBLIC_API_URL}/${user?.image}`
                          : "/assets/icons/avatar.png"
                      }
                    />
                    <AvatarFallback className="bg-white text-amber-600 font-semibold">
                      {user?.fullName
                        ? user.fullName.charAt(0).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="sidebarText font-bold">
                      {user?.fullName?.slice(0, 15) ||
                        user?.name?.slice(0, 15) ||
                        "User  "}
                    </span>
                    {/* <span className="text-black/70 text-xs leading-tight">
                      ID: {user?.id || "000000"}
                    </span> */}
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.fullName || user?.name || "User  "}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || user?.phone}
                    </p>
                    {/* <p className="text-xs leading-none text-muted-foreground">
                      ID: {user?.id || "000000"}
                    </p> */}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      user.role === "learner" &&
                        router.push("/dashboard/profile");
                      user.role === "mentor" &&
                        router.push("/mentor/dashboard/profile");
                      (user.role === "admin" ||
                        user.role === "staff" ||
                        user.role === "superadmin") &&
                        router.push("/admin/dashboard/profile");
                    }}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </div>
  );
}
