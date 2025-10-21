"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const ConversationList = ({
  conversations,
  selectedChat,
  onSelectChat,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-2 py-2">
      {conversations.map((conversation, index) => (
        <motion.div
          key={conversation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`p-4 cursor-pointer hover:bg-main/10 rounded-[16px] ${
            selectedChat?.id === conversation.id
              ? "bg-main/10 outline hover:outline-main"
              : ""
          }`}
          onClick={() => onSelectChat(conversation)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={conversation.avatar || "/assets/icons/avatar.png"}
                />
                <AvatarFallback>
                  {conversation.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {conversation.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[14px] truncate">
                  {conversation.name}
                </h3>
                <span className="text-xs text-deepGray">
                  {conversation.time}
                </span>
              </div>
              <p className="text-xs text-deepGray truncate">
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.unread > 0 && (
              <Badge className="bg-yellow-500 text-black">
                {conversation.unread}
              </Badge>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
