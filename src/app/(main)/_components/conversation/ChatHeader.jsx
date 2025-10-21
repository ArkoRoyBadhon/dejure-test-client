// ChatHeader.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const ChatHeader = ({ title, avatar, onMenuClick, isMobile }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-2 bg-gray2 border-b border-gray-200 flex items-center justify-between"
    >
      <div className="flex items-center">
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden "
          >
            <Menu className="!h-8 !w-8" />
          </Button>
        )}
        <div className="p-2 bg-main/10 rounded-[16px] mx-4 text-black">
          <div className="flex items-center gap-3 pr-4">
            <div className=" text-white rounded">
              <div className="w-[46px] h-[46px] bg-white rounded-[16px]">
                <Image
                  src={
                    avatar
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${avatar}`
                      : "/assets/image/instructor.png"
                  }
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="w-[46px] h-[46px] rounded-[16px] object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold truncate max-w-[150px] sm:max-w-none">
                {title}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
