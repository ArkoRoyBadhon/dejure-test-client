"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { MessageInput } from "@/app/(main)/_components/conversation/MessageInput";
import { MessageBubble } from "@/app/(main)/_components/conversation/MessageBubble";
import { ConversationList } from "@/app/(main)/_components/conversation/ConversationList";
import { toast } from "sonner";
import {
  useAdminReplyMutation,
  useGetConversationMessagesDashboardQuery,
  useGetCourseConversationdashboardQuery,
  useGetCoursesWithConversationsQuery,
} from "@/redux/features/conversation/conversation.api";
import Image from "next/image";

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [mobileView, setMobileView] = useState("courses");
  const [isMobile, setIsMobile] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Add ref for scrolling
  const messagesEndRef = useRef(null);

  const {
    data: coursesData = [],
    isLoading: coursesLoading,
    isError: coursesError,
  } = useGetCoursesWithConversationsQuery();
  const {
    data: conversationData,
    isSuccess: conversationSuccess,
    isLoading: conversationLoading,
  } = useGetCourseConversationdashboardQuery(
    { courseId: selectedCourse?._id },
    { skip: !selectedCourse }
  );
  const {
    data: messagesData,
    isSuccess: messagesSuccess,
    isLoading: messagesLoading,
  } = useGetConversationMessagesDashboardQuery(
    { conversationId: selectedConversation?.id },
    { skip: !selectedConversation }
  );
  const [adminReply] = useAdminReplyMutation();

  // Smooth scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, []);

  useEffect(() => {
    const filtered = coursesData?.courses?.filter(
      (course) => course.hasConversations
    );
    setFilteredCourses(filtered);
    setSelectedCourse(filtered && filtered[0]);
  }, [coursesData]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768 && mobileView === "courses") {
        setSelectedCourse(null);
        setSelectedConversation(null);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileView]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messagesData, selectedConversation, scrollToBottom]);

  const selectCourse = (course) => {
    setSelectedCourse(course);
    setSelectedConversation(null);
    if (isMobile) setMobileView("conversations");
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) setMobileView("messages");
  };

  const goBack = () => {
    if (mobileView === "messages") {
      setMobileView("conversations");
    } else if (mobileView === "conversations") {
      setMobileView("courses");
    }
  };

  const handleSendMessage = async (messageText, files) => {
    if (!messageText.trim() && files.length === 0) {
      toast.warning("Message cannot be empty");
      return;
    }

    if (!selectedCourse?._id) {
      toast.warning("Please select a course first");
      return;
    }

    const formData = new FormData();
    formData.append("message", messageText);
    formData.append("sender", user?._id);
    files.forEach((file) => formData.append("images", file));

    try {
      await adminReply({
        conversationId: selectedConversation.id,
        formData,
      }).unwrap();

      toast.success("Message sent successfully");
      scrollToBottom();
    } catch (error) {
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  const formattedConversations =
    conversationData?.map((conv) => ({
      id: conv._id,
      name: conv.title,
      lastMessage: conv.lastMessage?.content?.text || "No messages yet",
      time: new Date(conv.updatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      unread:
        conv.unreadCounts?.find(
          (uc) =>
            uc.userId === user._id &&
            uc.model === (user.role === "mentor" ? "Mentor" : "Learner")
        )?.count || 0,
      avatar: conv.initiator?.image || "",
    })) || [];

  const showCourses = !isMobile || mobileView === "courses";
  const showConversations = !isMobile || mobileView === "conversations";
  const showMessages = !isMobile || mobileView === "messages";

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-y-auto no-scrollbar bg-gray-50 md:flex-row gap-4 pb-[-40px]">
      {/* Mobile header */}
      {isMobile && mobileView !== "courses" && (
        <div className="flex items-center p-4 border-b bg-white md:hidden">
          <Button variant="ghost" size="icon" className="mr-2" onClick={goBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            {mobileView === "conversations" ? (
              <h1 className="font-semibold">{selectedCourse?.title}</h1>
            ) : (
              <>
                <h1 className="font-semibold">{selectedConversation?.title}</h1>
                <p className="text-sm text-gray-500">
                  {selectedCourse?.title} • {selectedCourse?.instructor}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Courses Panel */}
      <div
        className={`h-[calc(100vh-100px)]  ${
          showCourses ? "block" : "hidden"
        } md:block md:w-1/4 bg-white`}
      >
        <div className="p-4 border bg-gray2 rounded-t-[16px]">
          <h1 className="text-xl font-bold"> কোর্সসমূহ</h1>
        </div>
        <ScrollArea className="h-[calc(100vh-60px)] md:h-[calc(100vh-112px)]">
          <div className="p-2 space-y-2">
            {filteredCourses?.map((course) => (
              <Card
                key={course._id}
                className={`p-4 cursor-pointer hover:bg-main/10 rounded-[16px] shadow-none ${
                  selectedCourse?._id === course._id
                    ? "bg-main/10 outline hover:outline-main"
                    : ""
                }`}
                onClick={() => selectCourse(course)}
              >
                <CardHeader className="flex gap-4 px-0">
                  <Image
                    src={
                      course.thumbnail
                        ? `${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`
                        : "/assets/fallImg.jpg"
                    }
                    alt={course.title}
                    width={500}
                    height={500}
                    className="w-12 h-12 rounded-full"
                  />
                  <CardTitle className="text-sm">{course.title}</CardTitle>
                  {/* <p className="text-xs text-gray-500">{course.instructor}</p> */}
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Conversations Panel */}
      <div
        className={` h-[calc(100vh-100px)]  ${
          showConversations ? "block" : "hidden"
        } md:block md:w-1/4  bg-white`}
      >
        {selectedCourse ? (
          <>
            {!isMobile && (
              <div className="p-4 bg-gray2 rounded-t-[16px]">
                <h2 className="font-semibold">{selectedCourse.title}</h2>
                <p className="text-sm text-gray-500">
                  {selectedCourse.instructor}
                </p>
              </div>
            )}
            <ConversationList
              conversations={formattedConversations}
              selectedChat={selectedConversation}
              onSelectChat={selectConversation}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              {isMobile
                ? "কোন কোর্স সিলেক্ট করা হয়নি"
                : "একটি কোর্স সিলেক্ট করুন"}
            </p>
          </div>
        )}
      </div>

      {/* Messages Panel */}
      <div
        className={`h-[calc(100vh-100px)] ${
          showMessages ? "block" : "hidden"
        } md:flex flex-col flex-1 bg-white`}
      >
        {selectedConversation ? (
          <>
            {!isMobile && (
              <div className="p-4 bg-gray2 rounded-t-[16px]">
                <h2 className="font-semibold">{selectedConversation.title}</h2>
                <p className="text-sm text-gray-500">
                  {selectedCourse?.title} • {selectedCourse?.instructor}
                </p>
              </div>
            )}

            <ScrollArea className="flex-1 p-4 overflow-y-auto scrollbar-hide h-[calc(100vh-300px)] md:h-[calc(100vh-200px)] ">
              {messagesSuccess &&
                messagesData?.messages?.map((message) => (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isCurrentUser={message?.sender?._id === user?._id}
                    senderModel={message.senderModel}
                  />
                ))}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={messagesLoading}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              {isMobile
                ? "কোন কনভারসেশন সিলেক্ট করা হয়নি"
                : "একটি কনভারসেশন সিলেক্ট করুন"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
