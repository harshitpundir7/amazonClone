'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import Price from '@/components/ui/Price';
import type { Product } from '@/types';

export default function AmazonLiveSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    api.get('/products?categoryId=1&limit=8&sort=rating')
      .then((res: any) => {
        setProducts(res.data?.products || res.products || []);
      })
      .catch(() => {});
  }, []);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.6;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 400);
  };

  if (products.length === 0) return null;

  return (
    <div className="max-w-amzn-container mx-auto mb-4 bg-white rounded-amzn-md p-5">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-[#e43f5a] text-white text-[11px] font-bold px-2 py-0.5 rounded-amzn-xs">
          LIVE
        </span>
        <h2 className="text-[21px] font-extrabold text-amzn-text-primary">
          Amazon LIVE
        </h2>
      </div>

      <div className="flex gap-4">
        {/* Video thumbnail placeholder */}
        <div className="hidden md:block w-[280px] h-[200px] shrink-0 bg-amzn-dark-nav rounded-amzn-md relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
            alt="Amazon LIVE"
            className="w-full h-full object-cover opacity-60"
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-white transition-colors">
              <Play className="w-6 h-6 text-amzn-text-primary ml-1" fill="currentColor" />
            </div>
          </div>
          {/* LIVE badge on video */}
          <span className="absolute top-2 left-2 bg-[#e43f5a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-amzn-xs">
            LIVE
          </span>
        </div>

        {/* Scrollable product cards */}
        <div className="flex-1 relative group">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-16 bg-white/90 border border-amzn-border-primary flex items-center justify-center rounded-sm shadow-amzn-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex-shrink-0 min-w-[160px] max-w-[160px] border border-amzn-border-primary rounded-amzn-md p-3 hover:shadow-amzn-sm transition-shadow"
              >
                <div className="w-full h-[100px] flex items-center justify-center mb-2">
                  <img
                    src={product.images?.[0]?.imageUrl || `https://picsum.photos/seed/live${product.id}/140/100`}
                    alt={product.name}
                    className="max-h-[100px] max-w-full object-contain"
                  />
                </div>
                <p className="text-[13px] text-amzn-teal line-clamp-2 hover:text-amzn-teal-hover hover:underline leading-4">
                  {product.name}
                </p>
                <p className="text-[14px] font-bold text-[#B12704] mt-1">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(product.basePrice))}
                </p>
              </Link>
            ))}
          </div>
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-16 bg-white/90 border border-amzn-border-primary flex items-center justify-center rounded-sm shadow-amzn-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
