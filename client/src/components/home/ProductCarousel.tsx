'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/types';
import Price from '@/components/ui/Price';
import StarRating from '@/components/ui/StarRating';

interface ProductCarouselProps {
  title: string;
  products: Product[];
  loading?: boolean;
}

export default function ProductCarousel({ title, products, loading }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 400);
  };

  if (loading) {
    return (
      <div className="bg-white p-5 rounded-amzn-md max-w-amzn-container mx-auto mb-4">
        <div className="h-6 w-48 bg-amzn-border-secondary animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-amzn-md max-w-amzn-container mx-auto mb-4 relative group">
      <h2 className="text-[21px] font-bold text-amzn-text-primary mb-4">
        {title}
      </h2>
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-20 bg-white/90 hover:bg-white border border-amzn-border-primary flex items-center justify-center rounded-sm shadow-amzn-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex-shrink-0 w-[166px] hover:text-amzn-teal-hover"
            >
              <div className="w-full h-[200px] flex items-center justify-center mb-2">
                <img
                  src={product.images?.[0]?.imageUrl || `https://picsum.photos/seed/p${product.id}/166/200`}
                  alt={product.name}
                  className="max-h-[200px] max-w-full object-contain"
                />
              </div>
              <p className="text-sm text-amzn-teal line-clamp-2 hover:text-amzn-teal-hover hover:underline leading-5">
                {product.name}
              </p>
              <div className="mt-1">
                <StarRating rating={product.avgRating} size="sm" count={product.reviewCount} showCount />
              </div>
              <div className="mt-1">
                <Price price={Number(product.basePrice)} mrp={Number(product.mrp)} size="sm" />
              </div>
            </Link>
          ))}
        </div>
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-20 bg-white/90 hover:bg-white border border-amzn-border-primary flex items-center justify-center rounded-sm shadow-amzn-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
