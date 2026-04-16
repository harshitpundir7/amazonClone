import { create } from 'zustand';
import api from '@/lib/api';
import type { WishlistItem, Product } from '@/types';

interface WishlistStore {
  items: WishlistItem[];
  loading: boolean;

  fetchWishlist: () => Promise<void>;
  addItem: (productId: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  items: [],
  loading: false,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const data = await api.get('/wishlist') as any;
      const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      set({ items, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addItem: async (productId) => {
    try {
      await api.post(`/wishlist/${productId}`);
      await get().fetchWishlist();
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
    }
  },

  removeItem: async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      await get().fetchWishlist();
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item.productId === productId);
  },
}));
