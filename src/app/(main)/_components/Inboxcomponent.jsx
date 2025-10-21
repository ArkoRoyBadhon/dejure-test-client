"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, Menu, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { ChatHeader } from "./conversation/ChatHeader";
import { MessageBubble } from "./conversation/MessageBubble";
import { MessageInput } from "./conversation/MessageInput";
import { useGetEnrollmentsByUserQuery } from "@/redux/features/enroll/enroll.api";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import {
  useGetConversationMessagesQuery,
  useGetCourseConversationQuery,
  useGetMentorConversationsQuery,
  useCreateStudentMessageMutation,
  useMentorReplyMutation,
  useGetMentorCoursesQuery,
  useGetConversationMessagesMentorQuery,
} from "@/redux/features/conversation/conversation.api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocketContext } from "@/providers/SocketContextProvider";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
// import {Sheet}
import { useMediaQuery } from "./conversation/MediaQuery";

const InboxComponent = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;
  const userRole = user?.role;
  const { socket } = useSocketContext();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Refs for scroll management
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // RTK Query hooks
  const {
    data: enrollmentsData = [],
    isLoading: enrollmentsLoading,
    isError: enrollmentsError,
  } = useGetEnrollmentsByUserQuery(userId, {
    skip: userRole !== "learner",
  });

  const {
    data: mentorCoursesData = [],
    isLoading: mentorCoursesLoading,
    isError: mentorCoursesError,
  } = useGetMentorCoursesQuery(undefined, {
    skip: userRole !== "mentor",
  });

  // Course conversation query (for learners)
  const {
    data: courseConversation,
    refetch: refetchGroupConversation,
    isLoading: groupConversationLoading,
  } = useGetCourseConversationQuery(
    { courseId: selectedCourse?._id },
    { skip: !selectedCourse?._id || userRole !== "learner" }
  );

  // Mentor conversations query
  const {
    data: mentorConversations = [],
    refetch: refetchMentorConversations,
    isLoading: mentorConversationsLoading,
  } = useGetMentorConversationsQuery(
    { courseId: selectedCourse?._id },
    { skip: !selectedCourse?._id || userRole !== "mentor" }
  );

  // Messages queries (separate for learners and mentors)
  const {
    data: learnerMessages = { messages: [] },
    refetch: refetchLearnerMessages,
    isLoading: learnerMessagesLoading,
  } = useGetConversationMessagesQuery(
    { conversationId: selectedConversation?._id },
    { skip: !selectedConversation?._id || userRole !== "learner" }
  );

  const {
    data: mentorMessages = { messages: [] },
    refetch: refetchMentorMessages,
    isLoading: mentorMessagesLoading,
  } = useGetConversationMessagesMentorQuery(
    { conversationId: selectedConversation?._id },
    { skip: !selectedConversation?._id || userRole !== "mentor" }
  );

  const [createStudentMessage] = useCreateStudentMessageMutation();
  const [mentorReply] = useMentorReplyMutation();

  // Smooth scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, []);

  // Get available courses based on user role
  const availableCourses =
    userRole === "mentor"
      ? Array.isArray(mentorCoursesData.courses)
        ? mentorCoursesData.courses
        : []
      : Array.isArray(enrollmentsData)
      ? enrollmentsData.map((enrollment) => enrollment?.course).filter(Boolean)
      : [];

  // Get current messages based on user role
  const currentMessages =
    userRole === "mentor" ? mentorMessages.messages : learnerMessages.messages;
  const currentMessagesLoading =
    userRole === "mentor" ? mentorMessagesLoading : learnerMessagesLoading;

  const handleSendMessage = async (messageText, selectedFiles = []) => {
    if (!messageText.trim() && selectedFiles.length === 0) {
      toast.warning("Message cannot be empty");
      return;
    }

    if (!selectedCourse?._id) {
      toast.warning("Please select a course first");
      return;
    }

    const formData = new FormData();
    formData.append("message", messageText);
    selectedFiles.forEach((file) => formData.append("images", file));

    try {
      if (userRole === "learner") {
        await createStudentMessage({
          courseId: selectedCourse._id,
          formData,
        }).unwrap();

        toast.success("Message sent successfully");
        await refetchGroupConversation();
        await refetchLearnerMessages();
      } else if (userRole === "mentor") {
        if (!selectedConversation?._id) {
          toast.warning("Please select a conversation to reply to");
          return;
        }

        await mentorReply({
          conversationId: selectedConversation._id,
          formData,
        }).unwrap();

        toast.success("Reply sent successfully");
        await refetchMentorConversations();
        await refetchMentorMessages();
      }

      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedConversation(null);
    if (isMobile) setMobileSidebarOpen(false);
  };

  // Set initial selected course
  useEffect(() => {
    if (availableCourses.length > 0 && !selectedCourse) {
      setSelectedCourse(availableCourses[0]);
    }
  }, [availableCourses, selectedCourse]);

  // Set default conversation when course changes
  useEffect(() => {
    if (!selectedCourse) return;

    if (userRole === "mentor") {
      if (mentorConversations.length > 0) {
        setSelectedConversation(mentorConversations[0]);
      }
    } else {
      if (courseConversation) {
        setSelectedConversation(courseConversation);
      }
    }
  }, [selectedCourse, courseConversation, mentorConversations, userRole]);

  // Scroll to bottom when messages load or change
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, selectedConversation, scrollToBottom]);

  // Available conversations for current course
  const availableConversations =
    userRole === "mentor"
      ? [...mentorConversations].filter(Boolean)
      : courseConversation
      ? [courseConversation]
      : [];

  // Loading states
  const isLoadingInitialData = enrollmentsLoading || mentorCoursesLoading;
  const isLoadingConversations =
    userRole === "mentor"
      ? mentorConversationsLoading
      : groupConversationLoading;

  useEffect(() => {
    if (socket) {
      socket.on("conversation", async () => {
        if (userRole === "mentor") {
          await refetchMentorMessages();
        } else {
          await refetchLearnerMessages();
        }
      });
    }
  }, [socket]);

  if (isLoadingInitialData) {
    return (
      <div className="flex h-[calc(100vh-80px)] gap-4 p-4">
        <Skeleton className="w-80 h-full rounded-[16px] md:block hidden" />
        <Skeleton className="flex-1 h-full rounded-[16px]" />
      </div>
    );
  }

  if (enrollmentsError || mentorCoursesError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <p className="text-red-500">Error loading data. Please try again.</p>
      </div>
    );
  }

  const renderSidebar = () => (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col shadow2 rounded-[16px] overflow-hidden h-full mx-4">
      <div className="border-b">
        <div className="flex items-center gap-3 mb-4 bg-gray2 p-4">
          <Mail className="h-6 w-6" />
          <p className="font-bold text-[18px]">কোর্স ইনবক্স</p>
        </div>

        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto ${
          userRole !== "learner" && "max-h-[40vh]"
        }`}
      >
        <div className="p-2">
          {availableCourses.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No courses available
            </div>
          ) : (
            availableCourses.map((course) => (
              <div
                key={course._id}
                className={cn(
                  "p-3 rounded-[16px] mb-2 cursor-pointer transition-all border",
                  selectedCourse?._id === course._id
                    ? "bg-main text-white border-main"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                )}
                onClick={() => handleCourseSelect(course)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-[46px] h-[46px] bg-white rounded-[16px] overflow-hidden">
                    <Image
                      src={
                        course?.thumbnail
                          ? `${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`
                          : "/assets/image/course-placeholder.png"
                      }
                      alt={course?.title}
                      width={46}
                      height={46}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{course?.title}</h3>
                    <p className="text-xs truncate">
                      {course?.instructor?.name || "Instructor not specified"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {userRole === "mentor" && selectedCourse && (
        <div className="w-full md:w-80 h-[40vh] bg-white border-r border-gray-200 flex flex-col shadow2 rounded-[16px] overflow-hidden">
          <div className="p-4">
            <h3 className="font-normal">Messages</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoadingConversations ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-[16px]" />
                ))}
              </div>
            ) : availableConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations yet
              </div>
            ) : (
              availableConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  className={cn(
                    "p-3 cursor-pointer rounded-[16px] mb-2 transition-all border mx-2",
                    selectedConversation?._id === conversation._id
                      ? "bg-main/10 border-main "
                      : "hover:bg-gray-50"
                  )}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    if (isMobile) setMobileSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {conversation.isDirect ? (
                        <span className="text-sm">DM</span>
                      ) : (
                        <span className="text-sm">GC</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {conversation.isDirect
                          ? conversation.initiator?.fullName || "Student"
                          : "Group Chat"}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.lastMessage?.content?.text ||
                          "No messages"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-80px)] gap-4 py-4 relative">
      {/* Mobile sidebar toggle */}
      {/* Sidebar - Course List */}
      {isMobile ? (
        <Drawer open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <DrawerContent className="h-[90%] p-4">
            {renderSidebar()}
          </DrawerContent>
        </Drawer>
      ) : (
        <div className="hidden md:block">{renderSidebar()}</div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-[16px] shadow2 overflow-hidden w-full">
        {currentMessagesLoading ? (
          <div className="flex flex-col h-full">
            <Skeleton className="h-16 w-full" />
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
            </div>
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            {/* Always show ChatHeader when a course is selected */}
            {selectedCourse && (
              <ChatHeader
                title={
                  userRole !== "learner" && selectedConversation
                    ? selectedConversation.initiator?.fullName || "Student"
                    : selectedCourse?.title
                }
                avatar={
                  userRole !== "learner" && selectedConversation
                    ? selectedConversation.initiator?.image
                    : selectedCourse?.thumbnail
                }
                instructor={
                  selectedConversation?.isDirect
                    ? "Direct Message"
                    : selectedCourse?.instructor?.name
                }
                onMenuClick={() => setMobileSidebarOpen(true)}
                isMobile={isMobile}
              />
            )}

            {selectedConversation ? (
              <>
                <ScrollArea
                  ref={scrollAreaRef}
                  className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-hide h-[calc(100vh-300px)] md:h-[calc(100vh-200px)] "
                  // style={{ height: "calc(100vh - 200px)" }}
                >
                  {currentMessages?.length > 0 ? (
                    currentMessages.map((message) => (
                      <MessageBubble
                        key={message._id}
                        message={message}
                        isCurrentUser={
                          message.sender?._id === userId ||
                          (message.senderModel === "Mentor" &&
                            userRole === "mentor")
                        }
                        senderModel={message.senderModel}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <p>No messages yet</p>
                      <p className="text-sm">
                        {userRole === "learner"
                          ? "Start the conversation"
                          : "Student hasn't started conversation yet"}
                      </p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                {selectedCourse
                  ? userRole === "mentor"
                    ? "Select a conversation to reply"
                    : "No active conversation"
                  : "Select a course to view messages"}
              </div>
            )}

            {/* Always show MessageInput when a course is selected */}
            {selectedCourse && (
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={
                  currentMessagesLoading ||
                  (userRole === "mentor" && !selectedConversation?._id)
                }
                placeholder={
                  userRole === "mentor" && !selectedConversation?._id
                    ? "Select a conversation to reply"
                    : "Type your message..."
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InboxComponent;
