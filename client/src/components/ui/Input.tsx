"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className,
  id,
  ...rest
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-bold text-amzn-text-primary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "h-[34px] w-full rounded-amzn-sm border px-3 text-[14px] text-amzn-text-primary outline-none transition-all duration-100",
          "bg-white border-amzn-input-border",
          "focus:border-amzn-input-focus focus:shadow-amzn-form-focus",
          "placeholder:text-amzn-text-tertiary",
          error && "border-amzn-error",
          className
        )}
        {...rest}
      />
      {error && (
        <span className="text-[12px] text-amzn-error">{error}</span>
      )}
    </div>
  );
}
