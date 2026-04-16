"use client";

import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "prime" | "amazonChoice" | "discount" | "stock" | "success" | "warning";

interface BadgeProps {
  variant: BadgeVariant;
  text?: string;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  prime: "text-amzn-prime",
  amazonChoice:
    "bg-amzn-text-primary text-white rounded-full px-2.5 py-0.5 text-[12px] font-medium",
  discount: "text-amzn-success text-[14px] font-medium",
  stock: "", // dynamically set below
  success: "text-amzn-success text-[14px] font-medium",
  warning: "text-amzn-warning text-[14px] font-medium",
};

function PrimeIcon() {
  return (
    <svg
      width="46"
      height="14"
      viewBox="0 0 46 14"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      <path
        d="M2.5 10.5L0 1h2.2l1.4 6.3L5.2 1h2l1.6 6.4L10.2 1h2.2L9.9 10.5H7.7L6.2 4.8 4.7 10.5H2.5z"
        fill="#00a8e1"
      />
      <path
        d="M15.5 3.2c-2.1 0-3.5 1.5-3.5 3.7 0 2.3 1.4 3.7 3.5 3.7s3.5-1.5 3.5-3.7c0-2.2-1.4-3.7-3.5-3.7zm0 5.6c-1 0-1.6-.8-1.6-1.9s.6-1.9 1.6-1.9 1.6.8 1.6 1.9-.6 1.9-1.6 1.9z"
        fill="#00a8e1"
      />
      <path
        d="M20.5.5h2v10h-2z"
        fill="#00a8e1"
      />
      <path
        d="M28.5 3.4v1.2c-.4-.6-1.1-1-2-1-1.8 0-3 1.5-3 3.6s1.2 3.6 3 3.6c.9 0 1.6-.4 2-1.1v1h2v-7.3h-2zm-1.5 5.5c-1 0-1.6-.8-1.6-1.8s.6-1.8 1.6-1.8 1.6.8 1.6 1.8-.6 1.8-1.6 1.8z"
        fill="#00a8e1"
      />
      <path
        d="M36 3.4v1.2c-.4-.6-1.1-1-2-1-1.8 0-3 1.5-3 3.6s1.2 3.6 3 3.6c.9 0 1.6-.4 2-1.1v1h2v-7.3h-2zm-1.5 5.5c-1 0-1.6-.8-1.6-1.8s.6-1.8 1.6-1.8 1.6.8 1.6 1.8-.6 1.8-1.6 1.8z"
        fill="#00a8e1"
      />
      <path
        d="M42.5 5.5l2.5 5h-2.3l-1.3-3-1.3 3h-2.3l2.5-5L39 .5h2.3l1.2 2.8L43.7.5H46l-3.5 5z"
        fill="#00a8e1"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block mr-0.5"
    >
      <path
        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Badge({ variant, text, className }: BadgeProps) {
  if (variant === "prime") {
    return (
      <span className={cn("inline-flex items-center", variantStyles.prime, className)}>
        <CheckIcon />
        <PrimeIcon />
      </span>
    );
  }

  if (variant === "stock") {
    const isLowStock = text?.toLowerCase().includes("only");
    const isOutOfStock = text?.toLowerCase().includes("out of stock");
    const colorClass =
      isOutOfStock
        ? "text-amzn-error"
        : isLowStock
          ? "text-amzn-warning"
          : "text-amzn-success";

    return (
      <span className={cn("text-[14px] font-medium", colorClass, className)}>
        {text || "In Stock"}
      </span>
    );
  }

  return (
    <span className={cn(variantStyles[variant], className)}>
      {text}
    </span>
  );
}
