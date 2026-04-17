'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import SubNav from '@/components/layout/SubNav';
import Footer from '@/components/layout/Footer';
import HeroCarousel from '@/components/home/HeroCarousel';
import CategoryCards from '@/components/home/CategoryCards';
import ProductCarousel from '@/components/home/ProductCarousel';
import AmazonLiveSection from '@/components/home/AmazonLiveSection';
import SignInCTA from '@/components/home/SignInCTA';
import api from '@/lib/api';
import type { Product, Category } from '@/types';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [electronics, setElectronics] = useState<Product[]>([]);
  const [homeKitchen, setHomeKitchen] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, dealsRes, trendingRes, bestRes, electronicsRes, homeRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?sort=price_asc&limit=20'),
          api.get('/products?sort=newest&limit=20'),
          api.get('/products?sort=bestselling&limit=20'),
          api.get('/products?categoryId=1&limit=20'),
          api.get('/products?categoryId=3&limit=20'),
        ]);
        setCategories((catRes as any)?.data?.categories || []);
        setDeals((dealsRes as any)?.data?.products || []);
        setTrending((trendingRes as any)?.data?.products || []);
        setBestSellers((bestRes as any)?.data?.products || []);
        setElectronics((electronicsRes as any)?.data?.products || []);
        setHomeKitchen((homeRes as any)?.data?.products || []);
      } catch (err) {
        console.error('Failed to fetch homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-amzn-bg-secondary">
      <Header />
      <SubNav />

      <main className="-mt-nav-total">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Category Cards */}
        <CategoryCards categories={categories} loading={loading} />

        {/* Product Carousels */}
        <div className="py-4 space-y-4">
          <ProductCarousel
            title="Deals of the Day"
            products={deals}
            loading={loading}
            seeAllHref="/search?sort=price_asc"
          />

          {/* Second row of cards + carousel */}
          <ProductCarousel
            title="Best Sellers"
            products={bestSellers}
            loading={loading}
            seeAllHref="/search?sort=bestselling"
          />

          <ProductCarousel
            title="Up to 40% off | Electronics & Gadgets"
            products={electronics}
            loading={loading}
            seeAllHref="/category/electronics"
          />

          <ProductCarousel
            title="Up to 60% off | Home & Kitchen essentials"
            products={homeKitchen}
            loading={loading}
            seeAllHref="/category/home-kitchen"
          />

          <ProductCarousel
            title="Trending Now"
            products={trending}
            loading={loading}
            seeAllHref="/search?sort=newest"
          />

          {/* Amazon LIVE Section */}
          <AmazonLiveSection />

          {/* Sign-in CTA */}
          <SignInCTA />
        </div>
      </main>

      <Footer />
    </div>
  );
}
