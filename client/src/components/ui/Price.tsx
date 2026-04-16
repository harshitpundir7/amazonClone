"use client";

import React from "react";
import { formatPrice, formatMrp, calculateDiscount } from "@/lib/utils";

interface PriceProps {
  price: number | string;
  mrp?: number | string | null;
  size?: "sm" | "lg";
}

export default function Price({ price, mrp, size = "sm" }: PriceProps) {
  const numPrice = Number(price || 0);
  const numMrp = mrp != null ? Number(mrp) : 0;
  const { whole, fraction } = formatPrice(numPrice);
  const discount = numMrp && numMrp > numPrice ? calculateDiscount(numMrp, numPrice) : 0;

  return (
    <div className="flex flex-wrap items-baseline gap-1">
      <span className="align-baseline leading-none">
        <span
          className={
            size === "lg"
              ? "text-[13px] text-amzn-text-primary"
              : "text-[11px] text-amzn-text-primary"
          }
        >
          ₹
        </span>
        <span
          className={
            size === "lg"
              ? "text-[28px] font-bold text-amzn-text-primary"
              : "text-[24px] font-bold text-amzn-text-primary"
          }
        >
          {whole}
        </span>
        <span
          className={
            size === "lg"
              ? "text-[15px] font-bold align-super text-amzn-text-primary"
              : "text-[13px] font-bold align-super text-amzn-text-primary"
          }
        >
          {fraction}
        </span>
      </span>

      {numMrp > numPrice && (
        <>
          <span className="text-[14px] text-amzn-text-secondary line-through">
            {formatMrp(numMrp)}
          </span>
          {discount > 0 && (
            <span className="text-[14px] font-medium text-amzn-success">
              ({discount}% off)
            </span>
          )}
        </>
      )}
    </div>
  );
}
