"use client";

import React from "react";
import { cn } from "@/lib/utils";

type SkeletonVariant = "image" | "text" | "card";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

const variantStyles: Record<SkeletonVariant, string> = {
  image: "h-[220px] w-[220px]",
  text: "h-4 w-3/4",
  card: "h-[340px] w-full",
};

export default function Skeleton({ variant = "text", className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse-slow rounded-amzn-sm bg-amzn-border-secondary",
        variantStyles[variant],
        className
      )}
    />
  );
}
