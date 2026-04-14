import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const data = await api.post('/auth/login', { email, password });
          const { token, user } = data.data;
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
          }
          set({ user, token, isAuthenticated: true, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false });
          throw err;
        }
      },

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const data = await api.post('/auth/register', { name, email, password });
          const { token, user } = data.data;
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
          }
          set({ user, token, isAuthenticated: true, loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false });
          throw err;
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      fetchMe: async () => {
        if (!get().token) return;
        try {
          const data = await api.get('/auth/me');
          set({ user: data.data, isAuthenticated: true });
        } catch {
          get().logout();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'amazon-clone-auth',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
