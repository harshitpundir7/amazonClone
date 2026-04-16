"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import type { Product } from "@/types";
import StarRating from "@/components/ui/StarRating";
import Price from "@/components/ui/Price";
import Badge from "@/components/ui/Badge";
import { calculateDiscount } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist-store";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

function getPrimaryImage(product: Product): string {
  if (product.images && product.images.length > 0) {
    const primary = product.images.find((img) => img.isPrimary);
    return primary?.imageUrl || product.images[0].imageUrl;
  }
  return "/placeholder.png";
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getPrimaryImage(product);
  const discount = calculateDiscount(Number(product.mrp || 0), Number(product.basePrice || 0));
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const [heartLoading, setHeartLoading] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (heartLoading) return;
    setHeartLoading(true);
    try {
      if (inWishlist) {
        await removeItem(product.id);
        toast.success("Removed from Wishlist");
      } else {
        await addItem(product.id);
        toast.success("Added to Wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    } finally {
      setHeartLoading(false);
    }
  };

  return (
    <div className="relative group bg-white p-3">
      {/* Discount badge */}
      {discount > 0 && (
        <span className="absolute top-2 left-2 bg-[#CC0C39] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-amzn-xs z-[1]">
          -{discount}%
        </span>
      )}

      {/* Wishlist heart button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-amzn-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-[1] hover:bg-[#ffe4e4] hover:scale-110 border-0 cursor-pointer"
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className="w-4 h-4"
          fill={inWishlist ? "#e47911" : "none"}
          stroke={inWishlist ? "#e47911" : "#565959"}
        />
      </button>

      <Link
        href={`/product/${product.id}`}
        className="block hover:no-underline"
      >
        {/* Product image */}
        <div className="flex items-center justify-center h-[220px] mb-2">
          <Image
            src={imageUrl}
            alt={product.name}
            width={220}
            height={220}
            className="max-h-[220px] max-w-[220px] object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        {/* Title */}
        <h3 className="text-[14px] text-amzn-teal line-clamp-2 mb-1 group-hover:text-amzn-teal-hover group-hover:underline">
          {product.name}
        </h3>

        {/* Amazon's Choice badge */}
        {product.isFeatured && (
          <div className="mb-1">
            <Badge variant="amazonChoice" />
          </div>
        )}

        {/* Rating */}
        <div className="mb-1">
          <StarRating
            rating={Number(product.avgRating || 0)}
            size="sm"
            count={product.reviewCount}
            showCount
          />
        </div>

        {/* Price */}
        <div className="mb-1">
          <Price price={Number(product.basePrice || 0)} mrp={Number(product.mrp || 0)} size="sm" />
        </div>

        {/* Prime badge */}
        <div className="mb-1">
          <Badge variant="prime" />
        </div>

        {/* Free Delivery */}
        <span className="text-[14px] text-amzn-text-primary">
          FREE Delivery
        </span>
      </Link>
    </div>
  );
}
