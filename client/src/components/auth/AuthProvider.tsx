'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (token && !user) {
      fetchMe();
    } else if (!token) {
      useAuthStore.setState({ initializing: false });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
