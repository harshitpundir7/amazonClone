'use client';

import React from 'react';
import Link from 'next/link';
import type { Category } from '@/types';

interface CategoryCardsProps {
  categories: Category[];
}

const CATEGORY_IMAGES: Record<string, string> = {
  electronics: 'https://picsum.photos/seed/cat-electronics/400/400',
  clothing: 'https://picsum.photos/seed/cat-clothing/400/400',
  'home-kitchen': 'https://picsum.photos/seed/cat-home/400/400',
  books: 'https://picsum.photos/seed/cat-books/400/400',
};

export default function CategoryCards({ categories }: CategoryCardsProps) {
  // Show only top-level categories
  const topCategories = categories.filter((c) => !c.parentId);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-amzn-container mx-auto px-4 -mt-8 relative z-10">
      {topCategories.map((category) => (
        <div
          key={category.id}
          className="bg-white p-5 rounded-amzn-md"
        >
          <h3 className="text-lg font-bold text-amzn-text-primary mb-3">
            {category.name}
          </h3>
          <Link href={`/category/${category.slug}`}>
            <img
              src={CATEGORY_IMAGES[category.slug] || `https://picsum.photos/seed/cat-${category.id}/400/400`}
              alt={category.name}
              className="w-full aspect-square object-cover mb-3"
            />
          </Link>
          <Link
            href={`/category/${category.slug}`}
            className="text-[13px] text-amzn-teal hover:text-amzn-teal-hover hover:underline"
          >
            See more
          </Link>
        </div>
      ))}
    </div>
  );
}
