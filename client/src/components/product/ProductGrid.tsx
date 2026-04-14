"use client";

import React from "react";
import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import Skeleton from "@/components/ui/Skeleton";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

const SKELETON_COUNT = 8;

export default function ProductGrid({ products, loading = false }: ProductGridProps) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
        {loading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="p-3">
                <Skeleton variant="card" />
              </div>
            ))
          : products.map((product) => (
              <div key={product.id} className="border-b border-amzn-border-primary">
                <ProductCard product={product} />
              </div>
            ))}
      </div>
    </div>
  );
}
