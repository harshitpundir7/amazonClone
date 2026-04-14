'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      router.push('/');
    } catch (err) {
      setError((err as Error).message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-8">
      <Link href="/" className="mb-4">
        <span className="text-3xl font-bold text-amzn-dark-nav">
          amazon<span className="text-amzn-orange">.in</span>
        </span>
      </Link>

      <div className="w-full max-w-[350px] border border-amzn-border-primary rounded-amzn-md p-5">
        <h1 className="text-[28px] font-normal text-amzn-text-primary mb-3">Sign in</h1>

        {error && (
          <div className="mb-3 p-3 border border-amzn-error rounded-sm bg-red-50 text-sm text-amzn-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Sign in
          </Button>
        </form>

        <p className="text-xs text-amzn-text-secondary mt-4 leading-4">
          By continuing, you agree to Amazon&apos;s Conditions of Use and Privacy Notice.
        </p>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-amzn-border-primary" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-amzn-text-secondary">New to Amazon?</span>
          </div>
        </div>

        <Link href="/register">
          <Button variant="ghost" fullWidth className="text-xs">
            Create your Amazon account
          </Button>
        </Link>
      </div>
    </div>
  );
}
