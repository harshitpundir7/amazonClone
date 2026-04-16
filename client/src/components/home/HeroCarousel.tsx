'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import Link from 'next/link';

const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/landing/landing_1.jpg',
    alt: 'Great deals on Electronics',
    link: '/category/electronics',
  },
  {
    id: 2,
    image: '/images/landing/landing_2.png',
    alt: 'Shop Fashion essentials',
    link: '/category/clothing',
  },
  {
    id: 3,
    image: '/images/landing/landing_3.jpg',
    alt: 'Home & Kitchen deals',
    link: '/category/home-kitchen',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  return (
    <div
      className="relative w-full h-[200px] sm:h-[350px] md:h-[500px] overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-400 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {HERO_SLIDES.map((slide) => (
          <Link key={slide.id} href={slide.link} className="min-w-full h-full relative flex-shrink-0 block">
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </Link>
        ))}
      </div>

      {/* Bottom gradient fade to #eaeded */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-amzn-bg-secondary pointer-events-none" />

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-16 bg-white/70 hover:bg-white/90 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-amzn-text-primary" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-16 bg-white/70 hover:bg-white/90 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-amzn-text-primary" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === current ? 'bg-[#333]' : 'bg-[#999]'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
