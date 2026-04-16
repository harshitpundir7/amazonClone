'use client';

import React from 'react';
import type { ProductReview } from '@/types';
import StarRating from '@/components/ui/StarRating';

interface ReviewSectionProps {
  reviews: ProductReview[];
  avgRating: number;
  reviewCount: number;
  productId: number;
}

function computeDistribution(reviews: ProductReview[]): { star: number; count: number }[] {
  const counts = [0, 0, 0, 0, 0]; // index 0 = 1 star, index 4 = 5 stars
  for (const review of reviews) {
    const idx = Math.max(0, Math.min(4, Math.round(review.rating) - 1));
    counts[idx]++;
  }
  return [5, 4, 3, 2, 1].map((star, i) => ({
    star,
    count: counts[4 - i],
  }));
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function ReviewSection({
  reviews,
  avgRating,
  reviewCount,
  productId,
}: ReviewSectionProps) {
  const distribution = computeDistribution(reviews);
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <section id="reviews" className="py-6">
      {/* Heading */}
      <h2 className="text-[18px] font-bold text-amzn-text-primary mb-4">
        Customer reviews
      </h2>

      {/* Overall rating summary */}
      <div className="flex items-center gap-2 mb-5">
        <StarRating rating={Number(avgRating || 0)} size="lg" />
        <span className="text-[14px] text-amzn-text-primary">
          {Number(avgRating || 0).toFixed(1)} out of 5
        </span>
        <span className="text-[14px] text-amzn-text-secondary">
          {reviewCount.toLocaleString('en-IN')} global ratings
        </span>
      </div>

      {/* Rating distribution bar chart */}
      <div className="mb-6 w-full max-w-[400px]">
        {distribution.map(({ star, count }) => {
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 mb-1.5">
              <span className="text-[13px] text-amzn-teal hover:text-amzn-teal-hover cursor-pointer whitespace-nowrap min-w-[48px]">
                {star} star
              </span>
              <div className="flex-1 h-[18px] bg-gray-200 rounded-amzn-xs overflow-hidden">
                <div
                  className="h-full bg-amzn-star rounded-amzn-xs transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-[13px] text-amzn-text-secondary min-w-[32px] text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Individual reviews */}
      <div className="divide-y divide-amzn-border-secondary">
        {reviews.map((review) => (
          <div key={review.id} className="py-4">
            {/* Star rating + title */}
            <div className="flex items-center gap-2 mb-1">
              <StarRating rating={review.rating} size="sm" />
              {review.title && (
                <span className="text-[16px] font-bold text-amzn-text-primary">
                  {review.title}
                </span>
              )}
            </div>

            {/* By line */}
            <div className="text-[13px] text-amzn-text-secondary mb-2">
              By {review.user?.name || 'Anonymous'} on {formatDate(review.createdAt)}
            </div>

            {/* Verified Purchase badge */}
            {review.isVerified && (
              <div className="flex items-center gap-1 mb-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-amzn-success"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-[13px] text-amzn-success font-medium">
                  Verified Purchase
                </span>
              </div>
            )}

            {/* Review body */}
            {review.body && (
              <p className="text-[14px] text-amzn-text-primary leading-5">
                {review.body}
              </p>
            )}
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="py-8 text-center text-[14px] text-amzn-text-secondary">
            No reviews yet. Be the first to review this product.
          </div>
        )}
      </div>
    </section>
  );
}
