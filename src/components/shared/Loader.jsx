"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Loader({
  size = "default",
  text = "<Loader />",
  showText = true,
  className = "",
}) {
  const sizeClasses = {
    sm: "w-6 h-6",
    default: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-3 min-h-screen",
        className
      )}
    >
      {/* Animated Logo */}
      <div className="relative">
        <div
          className={cn(
            "animate-spin rounded-full border-4 border-gray-200 border-t-blue-600",
            sizeClasses[size]
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="De Jure Logo"
            width={
              size === "sm" ? 16 : size === "lg" ? 32 : size === "xl" ? 40 : 24
            }
            height={
              size === "sm" ? 16 : size === "lg" ? 32 : size === "xl" ? 40 : 24
            }
            className="animate-pulse"
            priority
          />
        </div>
      </div>

      {/* Loading Text */}
      {showText && (
        <div className="text-center">
          <p
            className={cn(
              "text-gray-600 font-medium animate-pulse",
              textSizeClasses[size]
            )}
          >
            {text}
          </p>
          {/* Animated dots */}
          <div className="flex justify-center space-x-1 mt-1">
            <div
              className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Loader for buttons and small spaces
export function InlineLoader({ size = "sm", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-gray-200 border-t-blue-600",
          sizeClasses[size]
        )}
      />
    </div>
  );
}

// Full Screen Loader
export function FullScreenLoader({ text = "<Loader />" }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border">
        <Loader size="xl" text={text} />
      </div>
    </div>
  );
}

// Card Loader
export function CardLoader({ className = "" }) {
  return (
    <div className={cn("p-6 bg-white rounded-lg border shadow-sm", className)}>
      <Loader size="lg" text="Loading content..." />
    </div>
  );
}
