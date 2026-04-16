'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import Header from '@/components/layout/Header';
import SubNav from '@/components/layout/SubNav';
import Footer from '@/components/layout/Footer';
import Skeleton from '@/components/ui/Skeleton';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const initializing = useAuthStore((s) => s.initializing);

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      router.replace('/login');
    }
  }, [initializing, isAuthenticated, router]);

  if (initializing) {
    return (
      <div className="min-h-screen bg-amzn-bg-secondary">
        <Header />
        <SubNav />
        <div className="max-w-amzn-container mx-auto p-8">
          <Skeleton variant="text" className="h-8 w-48 mb-4" />
          <Skeleton variant="text" className="h-5 w-full mb-2" />
          <Skeleton variant="text" className="h-5 w-3/4" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
