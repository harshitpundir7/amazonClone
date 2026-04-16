'use client';

import React from 'react';
import Link from 'next/link';
import type { Category } from '@/types';

interface CategoryCardsProps {
  categories: Category[];
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1526170375885-91d2cf1d1a6d?w=400';

export default function CategoryCards({ categories }: CategoryCardsProps) {
  // Show only top-level categories
  const topCategories = categories.filter((c) => !c.parentId);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 max-w-amzn-container mx-auto px-4 -mt-8 relative z-10">
      {topCategories.map((category) => {
        const hasChildren = category.children && category.children.length > 0;
        const imageSrc = category.imageUrl || FALLBACK_IMAGE;

        return (
          <div
            key={category.id}
            className="bg-white p-5 rounded-amzn-md min-h-[420px] flex flex-col"
          >
            <h3 className="text-lg font-bold text-amzn-text-primary mb-3">
              {category.name}
            </h3>

            {hasChildren && category.children!.length >= 4 ? (
              /* Quad layout: 2x2 grid of sub-category images */
              <div className="grid grid-cols-2 gap-3 flex-1">
                {category.children!.slice(0, 4).map((child) => (
                  <Link
                    key={child.id}
                    href={`/category/${child.slug}`}
                    className="flex flex-col items-center text-center"
                  >
                    <img
                      src={child.imageUrl || FALLBACK_IMAGE}
                      alt={child.name}
                      className="w-full h-[110px] object-cover"
                    />
                    <span className="text-[12px] text-amzn-text-primary mt-1 line-clamp-2">
                      {child.name}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              /* Single image layout */
              <Link href={`/category/${category.slug}`} className="flex-1 flex flex-col">
                <img
                  src={imageSrc}
                  alt={category.name}
                  className="w-full aspect-square object-cover mb-3"
                />
              </Link>
            )}

            <Link
              href={`/category/${category.slug}`}
              className="text-[13px] text-amzn-teal hover:text-amzn-teal-hover hover:underline mt-auto"
            >
              See more
            </Link>
          </div>
        );
      })}
    </div>
  );
}
