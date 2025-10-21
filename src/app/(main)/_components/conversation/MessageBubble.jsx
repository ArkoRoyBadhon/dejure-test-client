// MessageBubble.jsx
"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const MessageBubble = ({ message, isCurrentUser, senderModel }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return senderModel === "Mentor" ? "M" : "L";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsDialogOpen(true);
  };

  return (
    <div
      className={`flex gap-3 mb-4 ${isCurrentUser ? "flex-row-reverse" : ""}`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={message.sender?.image || "/assets/icons/avatar.png"}
          alt={message.sender?.fullName || senderModel}
        />
        <AvatarFallback>{getInitials(message.sender?.fullName)}</AvatarFallback>
      </Avatar>

      <div
        className={`flex flex-col max-w-[80%] ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        <span className="text-sm font-bold capitalize mb-1">
          {isCurrentUser ? "You" : message.sender?.fullName || senderModel}
        </span>
        <span className="text-xs font-medium text-deepGray mb-1">
          ID: {message.sender?._id.slice(0, 6)}
        </span>

        <div
          className={cn(
            "px-4 py-2 rounded-lg mt-2",
            !message.content.text && "hidden",
            isCurrentUser
              ? "bg-gray1 text-darkColor rounded-tr-none"
              : "bg-gray-100 text-gray-800 rounded-tl-none"
          )}
        >
          <div className="text-sm break-words">{message.content?.text}</div>

          <div
            className={`flex items-center gap-1 mt-1 ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            <span className="text-xs opacity-70">
              {new Date(
                message.createdAt || message.timestamp
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {message.content?.files?.length > 0 && (
          <div
            className={cn(
              "rounded-lg mt-2",
              isCurrentUser
                ? "bg-gray1 px-4 py-2 text-darkColor rounded-tr-none"
                : "text-gray-800 rounded-tl-none"
            )}
          >
            <div className="grid grid-cols-2 gap-2 mt-2">
              {message.content.files.map((file, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-md overflow-hidden h-[80px] w-[100px] bg-gray-200 cursor-pointer"
                  onClick={() =>
                    handleImageClick(
                      `${process.env.NEXT_PUBLIC_API_URL}${file}`
                    )
                  }
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${file}`}
                    alt={`Attachment ${index + 1}`}
                    height={80}
                    width={100}
                    className="object-cover h-[80px] w-[100px]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Preview Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none">
            {selectedImage && (
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage}
                  alt="Enlarged preview"
                  width={1200}
                  height={800}
                  className="object-contain w-full h-full max-h-[80vh]"
                />
                <button
                  className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2"
                  onClick={() => setIsDialogOpen(false)}
                >
                  ✕
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
