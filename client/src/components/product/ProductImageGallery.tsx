'use client';

import React, { useState } from 'react';
import type { ProductImage } from '@/types';

interface ProductImageGalleryProps {
  images: ProductImage[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-amzn-bg-tertiary rounded-amzn-md">
        <div className="text-center text-amzn-text-tertiary">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-2 text-amzn-border-primary"
          >
            <path
              d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
              fill="currentColor"
            />
          </svg>
          <p className="text-[14px]">No image available</p>
        </div>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  return (
    <>
      {/* Desktop layout: thumbnails on left, main image on right */}
      <div className="hidden md:flex gap-3">
        {/* Thumbnail strip */}
        <div className="flex flex-col gap-2 w-[40px] shrink-0 overflow-y-auto max-h-[500px]">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={`
                w-[36px] h-[36px] shrink-0 rounded-amzn-xs overflow-hidden
                border-2 transition-colors
                ${idx === selectedIndex
                  ? 'border-amzn-teal'
                  : 'border-transparent hover:border-amzn-teal-hover'
                }
              `}
            >
              <img
                src={img.imageUrl}
                alt={img.altText || `Thumbnail ${idx + 1}`}
                className="w-full h-full object-contain bg-amzn-bg-tertiary"
              />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className="flex-1 flex items-center justify-center bg-amzn-bg-tertiary rounded-amzn-md min-h-[500px] max-h-[500px] overflow-hidden">
          <img
            src={currentImage.imageUrl}
            alt={currentImage.altText || 'Product image'}
            className="max-h-[500px] max-w-full object-contain cursor-zoom-in"
          />
        </div>
      </div>

      {/* Mobile layout: horizontal carousel with dot indicators */}
      <div className="md:hidden">
        <div className="relative overflow-hidden rounded-amzn-md bg-amzn-bg-tertiary">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
          >
            {images.map((img) => (
              <div
                key={img.id}
                className="min-w-full flex items-center justify-center h-[350px]"
              >
                <img
                  src={img.imageUrl}
                  alt={img.altText || 'Product image'}
                  className="max-h-[350px] max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  idx === selectedIndex
                    ? 'bg-amzn-text-primary'
                    : 'bg-amzn-border-primary'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
