'use client';

import React, { useState, useRef, useCallback } from 'react';
import type { ProductImage } from '@/types';

interface ProductImageGalleryProps {
  images: ProductImage[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const mainImageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-amzn-bg-tertiary rounded-amzn-md">
        <div className="text-center text-amzn-text-tertiary">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 text-amzn-border-primary">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor" />
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
        <div className="flex flex-col gap-2 w-[50px] shrink-0 overflow-y-auto max-h-[560px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {images.map((img, idx) => (
            <button
              key={img.id}
              onMouseEnter={() => setSelectedIndex(idx)}
              onClick={() => setSelectedIndex(idx)}
              className={`
                w-[44px] h-[44px] shrink-0 rounded-amzn-xs overflow-hidden
                border-2 transition-colors p-0.5
                ${idx === selectedIndex
                  ? 'border-[#e77600] shadow-[0_0_3px_#e77600]'
                  : 'border-[#ddd] hover:border-[#888]'
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

        {/* Main image with zoom */}
        <div
          ref={mainImageRef}
          className="flex-1 flex items-center justify-center bg-amzn-bg-tertiary rounded-amzn-md min-h-[500px] max-h-[560px] overflow-hidden relative"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={currentImage.imageUrl}
            alt={currentImage.altText || 'Product image'}
            className="max-h-[560px] max-w-full object-contain transition-transform duration-100"
            style={isZooming ? {
              transform: 'scale(2.5)',
              transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
              cursor: 'crosshair',
            } : {
              cursor: 'zoom-in',
            }}
          />
        </div>

        {/* Zoom hint */}
        <p className="hidden md:block text-[12px] text-amzn-text-tertiary mt-1 text-center">
          Roll over image to zoom in
        </p>
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
