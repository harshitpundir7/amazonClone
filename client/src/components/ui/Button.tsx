"use client";

import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-amzn-cart-btn hover:bg-amzn-cart-btn-hover border border-amzn-cart-btn-border text-amzn-text-primary",
  secondary:
    "bg-amzn-buy-btn hover:bg-amzn-buy-btn-hover border border-amzn-buy-btn-border text-amzn-text-primary",
  ghost:
    "bg-transparent hover:bg-amzn-bg-tertiary border border-transparent text-amzn-text-primary",
  link: "bg-transparent border-none text-amzn-teal hover:text-amzn-teal-hover hover:underline p-0",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-[40px] text-[13px] px-3",
  md: "h-[44px] text-[14px] px-4",
  lg: "h-[48px] text-[16px] px-6",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-amzn-lg font-medium transition-colors duration-100",
        "focus-visible:shadow-[inset_0_0_0_2px_rgba(228,121,17,0.5)] focus-visible:outline-none",
        "active:brightness-95",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        variant !== "link" && "cursor-pointer",
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
