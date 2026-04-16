'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import SubNav from '@/components/layout/SubNav';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/ui/Button';

export default function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleSignOut = () => {
    logout();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-amzn-bg-secondary">
        <Header />
        <SubNav />

        <div className="max-w-amzn-container mx-auto px-4 py-8">
          <h1 className="text-[28px] font-bold text-amzn-text-primary mb-6">Your Account</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Profile card */}
            <div className="bg-white rounded-amzn-md border border-amzn-border-primary p-6 md:col-span-3">
              <h2 className="text-[18px] font-bold text-amzn-text-primary mb-4">Profile</h2>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-[14px] text-amzn-text-secondary w-20">Name:</span>
                  <span className="text-[14px] text-amzn-text-primary font-medium">{user?.name || '—'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[14px] text-amzn-text-secondary w-20">Email:</span>
                  <span className="text-[14px] text-amzn-text-primary font-medium">{user?.email || '—'}</span>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <Link
              href="/orders"
              className="bg-white rounded-amzn-md border border-amzn-border-primary p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-[16px] font-bold text-amzn-text-primary mb-2">Your Orders</h3>
              <p className="text-[13px] text-amzn-text-secondary">Track, return, or buy things again</p>
            </Link>

            <Link
              href="/wishlist"
              className="bg-white rounded-amzn-md border border-amzn-border-primary p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-[16px] font-bold text-amzn-text-primary mb-2">Your Wishlist</h3>
              <p className="text-[13px] text-amzn-text-secondary">View saved items</p>
            </Link>

            <div className="bg-white rounded-amzn-md border border-amzn-border-primary p-6">
              <h3 className="text-[16px] font-bold text-amzn-text-primary mb-4">Sign Out</h3>
              <p className="text-[13px] text-amzn-text-secondary mb-3">Sign out of your account</p>
              <Button variant="secondary" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
