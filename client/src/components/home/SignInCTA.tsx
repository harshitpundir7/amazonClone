'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';

export default function SignInCTA() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-amzn-container mx-auto mb-4">
      <div className="bg-white rounded-amzn-md p-6 text-center">
        {isAuthenticated ? (
          <>
            <h3 className="text-[18px] font-bold text-amzn-text-primary mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h3>
            <p className="text-[14px] text-amzn-text-secondary mb-3">
              Check out your personalized recommendations
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/orders"
                className="text-[14px] text-amzn-teal hover:text-amzn-teal-hover hover:underline"
              >
                Your Orders
              </Link>
              <Link
                href="/wishlist"
                className="text-[14px] text-amzn-teal hover:text-amzn-teal-hover hover:underline"
              >
                Your Wishlist
              </Link>
              <Link
                href="/search?sort=bestselling"
                className="text-[14px] text-amzn-teal hover:text-amzn-teal-hover hover:underline"
              >
                Best Sellers
              </Link>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-[18px] font-bold text-amzn-text-primary mb-2">
              See personalized recommendations
            </h3>
            <Link
              href="/login"
              className="inline-block bg-amzn-cart-btn hover:bg-amzn-cart-btn-hover border border-amzn-cart-btn-border rounded-amzn-lg px-8 py-2 text-[14px] font-bold text-amzn-text-primary shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] mb-2"
            >
              Sign in
            </Link>
            <p className="text-[13px] text-amzn-text-secondary">
              New customer?{' '}
              <Link href="/register" className="text-amzn-teal hover:text-amzn-teal-hover hover:underline">
                Start here.
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
