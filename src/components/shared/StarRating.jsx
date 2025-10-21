"use client";

import { Star } from "lucide-react";

const StarRating = ({
  starCount = 0,
  totalRatings = 0,
  totalReviews = 0,
  showCounts = true,
  size = "sm",
  className = "",
}) => {
  // Ensure starCount is between 0 and 5
  const normalizedStarCount = Math.max(0, Math.min(5, starCount));

  // Calculate filled and empty stars
  const filledStars = Math.floor(normalizedStarCount);
  const hasHalfStar = normalizedStarCount % 1 !== 0;

  // Size configurations
  const sizeConfig = {
    xs: { icon: "w-3 h-3", text: "text-xs" },
    sm: { icon: "w-4 h-4", text: "text-sm" },
    md: { icon: "w-5 h-5", text: "text-base" },
    lg: { icon: "w-6 h-6", text: "text-lg" },
  };

  const config = sizeConfig[size] || sizeConfig.sm;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Star Display */}
      <div className="flex items-center gap-0.5">
        {/* Filled Stars */}
        {Array.from({ length: filledStars }).map((_, index) => (
          <Star
            key={`filled-${index}`}
            className={`${config.icon} text-yellow-500 fill-yellow-500`}
          />
        ))}

        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${config.icon} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star
                className={`${config.icon} text-yellow-500 fill-yellow-500`}
              />
            </div>
          </div>
        )}

        {/* Empty Stars */}
        {Array.from({ length: 5 - filledStars - (hasHalfStar ? 1 : 0) }).map(
          (_, index) => (
            <Star
              key={`empty-${index}`}
              className={`${config.icon} text-gray-300`}
            />
          )
        )}
      </div>

      {/* Rating Counts */}
      {showCounts && (totalRatings > 0 || totalReviews > 0) && (
        <span className={`${config.text} text-gray-600 ml-1`}>
          ({totalRatings} Ratings | {totalReviews} Reviews)
        </span>
      )}
    </div>
  );
};

export default StarRating;
