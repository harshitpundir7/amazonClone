"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import StarRating from "@/components/ui/StarRating";
import Price from "@/components/ui/Price";
import Badge from "@/components/ui/Badge";

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

  return (
    <Link
      href={`/product/${product.id}`}
      className="block p-3 bg-white hover:no-underline group"
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

      {/* Rating */}
      <div className="mb-1">
        <StarRating
          rating={product.avgRating}
          size="sm"
          count={product.reviewCount}
          showCount
        />
      </div>

      {/* Price */}
      <div className="mb-1">
        <Price price={product.basePrice} mrp={product.mrp} size="sm" />
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
  );
}
