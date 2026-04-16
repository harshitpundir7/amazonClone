'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/types';
import Price from '@/components/ui/Price';
import StarRating from '@/components/ui/StarRating';
import { calculateDiscount } from '@/lib/utils';

interface ProductCarouselProps {
  title: string;
  products: Product[];
  loading?: boolean;
  seeAllHref?: string;
}

export default function ProductCarousel({ title, products, loading, seeAllHref }: ProductCarouselProps) {
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
      <div className="bg-white p-5 pb-7 rounded-amzn-md max-w-amzn-container mx-auto mb-4">
        <div className="h-6 w-48 bg-amzn-border-secondary animate-pulse rounded mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 min-w-[210px] max-w-[210px]">
              <div className="w-full h-[200px] bg-amzn-border-secondary animate-pulse rounded mb-2" />
              <div className="h-4 w-16 bg-amzn-border-secondary animate-pulse rounded mb-1" />
              <div className="h-4 w-full bg-amzn-border-secondary animate-pulse rounded mb-1" />
              <div className="h-3 w-20 bg-amzn-border-secondary animate-pulse rounded mb-1" />
              <div className="h-4 w-24 bg-amzn-border-secondary animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white p-5 pb-7 rounded-amzn-md max-w-amzn-container mx-auto mb-4 relative group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[21px] font-extrabold text-amzn-text-primary">
          {title}
        </h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="text-[14px] text-amzn-teal hover:text-amzn-teal-hover hover:underline"
          >
            See all offers
          </Link>
        )}
      </div>
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 w-[45px] h-[100px] bg-white hover:bg-gray-50 border border-amzn-border-primary flex items-center justify-center rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.3)] opacity-0 group-hover:opacity-100 transition-opacity"
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
          {products.map((product) => {
            const discount = calculateDiscount(Number(product.mrp), Number(product.basePrice));
            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex-shrink-0 min-w-[210px] max-w-[210px] hover:text-amzn-teal-hover"
              >
                <div className="w-full h-[200px] flex items-center justify-center mb-2 bg-amzn-bg-tertiary rounded">
                  <img
                    src={product.images?.[0]?.imageUrl || `https://picsum.photos/seed/p${product.id}/200/200`}
                    alt={product.name}
                    className="max-h-[200px] max-w-full object-contain"
                  />
                </div>
                {discount > 0 && (
                  <span className="inline-block bg-[#CC0C39] text-white text-[12px] font-bold px-1.5 py-0.5 rounded-amzn-xs mb-1">
                    -{discount}% off
                  </span>
                )}
                <p className="text-[14px] text-amzn-teal line-clamp-2 hover:text-amzn-teal-hover hover:underline leading-5">
                  {product.name}
                </p>
                <div className="mt-1">
                  <StarRating rating={Number(product.avgRating || 0)} size="sm" count={Number(product.reviewCount || 0)} showCount />
                </div>
                <div className="mt-1">
                  <Price price={Number(product.basePrice)} mrp={Number(product.mrp)} size="sm" />
                </div>
              </Link>
            );
          })}
        </div>
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 w-[45px] h-[100px] bg-white hover:bg-gray-50 border border-amzn-border-primary flex items-center justify-center rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.3)] opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
