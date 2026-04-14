'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import SubNav from '@/components/layout/SubNav';
import Footer from '@/components/layout/Footer';
import HeroCarousel from '@/components/home/HeroCarousel';
import CategoryCards from '@/components/home/CategoryCards';
import ProductCarousel from '@/components/home/ProductCarousel';
import api from '@/lib/api';
import type { Product, Category } from '@/types';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, dealsRes, trendingRes, bestRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?sort=price_asc&limit=20'),
          api.get('/products?sort=newest&limit=20'),
          api.get('/products?sort=bestselling&limit=20'),
        ]);
        setCategories(catRes.data || []);
        setDeals(dealsRes.data?.data || []);
        setTrending(trendingRes.data?.data || []);
        setBestSellers(bestRes.data?.data || []);
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
      <SubNav categories={categories} />

      <main>
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Category Cards */}
        <CategoryCards categories={categories} />

        {/* Product Carousels */}
        <div className="pb-8">
          <ProductCarousel title="Deals of the Day" products={deals} loading={loading} />
          <ProductCarousel title="Trending Now" products={trending} loading={loading} />
          <ProductCarousel title="Best Sellers" products={bestSellers} loading={loading} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
