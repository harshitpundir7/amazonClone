"use client";

import React from "react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  count?: number;
  showCount?: boolean;
}

const sizeMap = {
  sm: 14,
  md: 18,
  lg: 24,
};

function Star({
  fill,
  size,
}: {
  fill: number; // 0 to 1
  size: number;
}) {
  const id = React.useId();
  const clipId = `star-clip-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block shrink-0"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={fill * 24} height="24" />
        </clipPath>
      </defs>
      {/* Empty star */}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
        fill="currentColor"
        className="text-amzn-star-empty"
      />
      {/* Filled portion */}
      {fill > 0 && (
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
          fill="currentColor"
          className="text-amzn-star"
          clipPath={`url(#${clipId})`}
        />
      )}
    </svg>
  );
}

function formatCount(count: number): string {
  return count.toLocaleString("en-IN");
}

export default function StarRating({
  rating,
  size = "md",
  count,
  showCount = false,
}: StarRatingProps) {
  const px = sizeMap[size];
  const clamped = Math.max(0, Math.min(5, rating));

  const stars = [];
  for (let i = 0; i < 5; i++) {
    const starFill = Math.min(1, Math.max(0, clamped - i));
    stars.push(<Star key={i} fill={starFill} size={px} />);
  }

  return (
    <span className="inline-flex items-center gap-0.5">
      {stars}
      {showCount && count !== undefined && (
        <span className="ml-1 text-[14px] text-amzn-teal">
          {formatCount(count)}
        </span>
      )}
    </span>
  );
}
