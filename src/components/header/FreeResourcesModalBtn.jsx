"use client";

import { ChevronDown } from "lucide-react";

export default function FreeResourcesModalBtn({ isOpen, toggleDrawer }) {
  return (
    <button
      onClick={toggleDrawer}
      aria-label="Free Resources"
      className=" text-gray-700 hover:text-gray-400 text-[16px] font-bold flex gap-2 items-center transition-colors duration-200"
      //   className={`text-darkColor hover:text-gray-900 text-[16px] flex gap-2 items-center border border-main rounded-[12px] px-4 py-2 bg-gray-100 font-bold`}
    >
      রিসোর্সেস
      <ChevronDown
        className={`ml-1 h-4 w-4 transition-transform duration-300 ease-in-out ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
      />
    </button>
  );
}
