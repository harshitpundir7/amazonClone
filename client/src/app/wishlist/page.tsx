'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import SubNav from '@/components/layout/SubNav';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import type { WishlistItem, Product } from '@/types';
import Price from '@/components/ui/Price';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useCartStore } from '@/store/cart-store';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist') as any;
        setItems(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      await addItem(productId, null, 1);
      await fetchCart();
      toast.success('Added to Cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove');
    }
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-amzn-bg-secondary">
      <Header />
      <SubNav />

      <div className="max-w-amzn-container mx-auto px-6 py-8">
        <h1 className="text-[28px] font-bold text-amzn-text-primary mb-6">Your Wishlist</h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="card" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-amzn-md p-12 text-center">
            <p className="text-xl font-bold text-amzn-text-primary mb-2">Your wishlist is empty</p>
            <p className="text-sm text-amzn-text-secondary mb-4">
              Save items you love for later.
            </p>
            <Link href="/" className="text-amzn-teal hover:text-amzn-teal-hover hover:underline">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-amzn-md">
            {items.map((item) => {
              const product = item.product as unknown as Product;
              return (
                <div key={item.id} className="flex items-center gap-4 p-5 border-b border-amzn-border-primary last:border-0">
                  <Link href={`/product/${item.productId}`} className="flex-shrink-0">
                    <img
                      src={product?.images?.[0]?.imageUrl || `https://picsum.photos/seed/w${item.productId}/180/180`}
                      alt={product?.name || 'Product'}
                      className="w-[180px] h-[180px] object-contain"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.productId}`}
                      className="text-base text-amzn-teal hover:text-amzn-teal-hover hover:underline line-clamp-2"
                    >
                      {product?.name || 'Product'}
                    </Link>
                    <div className="mt-1">
                      <StarRating
                        rating={product?.avgRating || 0}
                        size="sm"
                        count={product?.reviewCount || 0}
                        showCount
                      />
                    </div>
                    <div className="mt-2">
                      <Price
                        price={Number(product?.basePrice || 0)}
                        mrp={Number(product?.mrp || 0)}
                        size="sm"
                      />
                    </div>
                    <div className="flex gap-3 mt-3">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddToCart(item.productId)}
                      >
                        Add to Cart
                      </Button>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        className="text-amzn-teal hover:text-amzn-teal-hover hover:underline text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
    </ProtectedRoute>
  );
}
