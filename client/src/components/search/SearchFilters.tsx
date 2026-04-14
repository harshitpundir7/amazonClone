'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { PRICE_RANGES } from '@/lib/constants';
import type { Category, SearchFilters as FilterState } from '@/types';

interface SearchFiltersProps {
  categories: Category[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function SearchFilters({ categories, filters, onFilterChange }: SearchFiltersProps) {
  const [expandedCats, setExpandedCats] = useState<Set<number>>(new Set());

  const hasActiveFilters =
    filters.category !== undefined ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.rating !== undefined;

  const clearAll = () => {
    onFilterChange({
      ...filters,
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
    });
  };

  const handleCategorySelect = (slug: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === slug ? undefined : slug,
    });
  };

  const toggleCatExpand = (id: number) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePriceRange = (min: number, max: number | undefined) => {
    if (filters.minPrice === min && filters.maxPrice === max) {
      onFilterChange({ ...filters, minPrice: undefined, maxPrice: undefined });
    } else {
      onFilterChange({ ...filters, minPrice: min, maxPrice: max });
    }
  };

  const isPriceRangeActive = (min: number, max: number | undefined) =>
    filters.minPrice === min && filters.maxPrice === max;

  const handleRatingFilter = (rating: number) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? undefined : rating,
    });
  };

  const topCategories = categories.filter((c) => !c.parentId);

  return (
    <aside className="w-[220px] shrink-0 sticky top-[60px] self-start">
      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-[13px] text-amzn-teal hover:text-amzn-teal-hover hover:underline mb-3 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          Clear all
        </button>
      )}

      {/* Category Section */}
      <div className="border-b border-amzn-border-primary pb-3 mb-3">
        <h3 className="text-[16px] font-bold text-amzn-text-primary mb-2">Category</h3>
        <ul className="space-y-0.5">
          {topCategories.map((cat) => {
            const hasChildren = cat.children && cat.children.length > 0;
            const isExpanded = expandedCats.has(cat.id);
            const isActive = filters.category === cat.slug;

            return (
              <li key={cat.id}>
                <div className="flex items-center gap-1">
                  {hasChildren && (
                    <button
                      onClick={() => toggleCatExpand(cat.id)}
                      className="p-0 border-0 bg-transparent cursor-pointer text-amzn-text-secondary hover:text-amzn-text-primary"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                  {!hasChildren && <span className="w-3.5" />}

                  <button
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`text-[13px] text-left cursor-pointer bg-transparent border-0 p-0 hover:underline ${
                      isActive
                        ? 'text-amzn-input-focus font-bold'
                        : 'text-amzn-teal hover:text-amzn-teal-hover'
                    }`}
                  >
                    {cat.name}
                  </button>
                </div>

                {/* Children */}
                {hasChildren && isExpanded && (
                  <ul className="ml-5 mt-0.5 space-y-0.5">
                    {cat.children!.map((child) => {
                      const childActive = filters.category === child.slug;
                      return (
                        <li key={child.id}>
                          <button
                            onClick={() => handleCategorySelect(child.slug)}
                            className={`text-[13px] text-left cursor-pointer bg-transparent border-0 p-0 hover:underline ${
                              childActive
                                ? 'text-amzn-input-focus font-bold'
                                : 'text-amzn-teal hover:text-amzn-teal-hover'
                            }`}
                          >
                            {child.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price Range Section */}
      <div className="border-b border-amzn-border-primary pb-3 mb-3">
        <h3 className="text-[16px] font-bold text-amzn-text-primary mb-2">Price</h3>
        <ul className="space-y-1">
          {PRICE_RANGES.map((range, idx) => {
            const active = isPriceRangeActive(range.min, range.max);
            return (
              <li key={idx}>
                <label className="flex items-center gap-2 cursor-pointer text-[13px] text-amzn-text-primary">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => handlePriceRange(range.min, range.max)}
                    className="w-4 h-4 accent-amzn-input-focus rounded-sm cursor-pointer"
                  />
                  <span className={active ? 'font-bold' : ''}>{range.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Customer Review Section */}
      <div className="pb-3">
        <h3 className="text-[16px] font-bold text-amzn-text-primary mb-2">Customer Review</h3>
        <ul className="space-y-1">
          {[4, 3, 2, 1].map((stars) => {
            const active = filters.rating === stars;
            return (
              <li key={stars}>
                <button
                  onClick={() => handleRatingFilter(stars)}
                  className={`flex items-center gap-1.5 text-[13px] cursor-pointer bg-transparent border-0 p-0 hover:underline ${
                    active ? 'font-bold' : ''
                  }`}
                >
                  <span className="inline-flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        className="inline-block"
                      >
                        <path
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                          fill={i < stars ? '#de7921' : '#dddddd'}
                        />
                      </svg>
                    ))}
                  </span>
                  <span className={`${active ? 'text-amzn-input-focus' : 'text-amzn-teal'} hover:text-amzn-teal-hover`}>
                    &amp; Up
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
