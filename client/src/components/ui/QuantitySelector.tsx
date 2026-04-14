"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  className?: string;
}

export default function QuantitySelector({
  value,
  onChange,
  max = 10,
  className,
}: QuantitySelectorProps) {
  const options = [];
  for (let i = 1; i <= max; i++) {
    options.push(i);
  }

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="text-[14px] text-amzn-text-primary">Qty:</span>
      <select
        value={value > max ? "10+" : value}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "10+") {
            onChange(10);
          } else {
            onChange(parseInt(val, 10));
          }
        }}
        className="h-[32px] w-[78px] rounded-amzn-lg border border-amzn-input-border bg-amzn-input-bg px-2 text-[14px] text-amzn-text-primary outline-none cursor-pointer focus:border-amzn-input-focus focus:shadow-amzn-form-focus"
      >
        {options.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
        <option value="10+">10+</option>
      </select>
    </div>
  );
}
