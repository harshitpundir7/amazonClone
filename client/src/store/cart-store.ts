import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import type { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  loading: boolean;
  error: string | null;

  // Server-synced actions
  fetchCart: () => Promise<void>;
  addItem: (productId: number, variantId?: number | null, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,

      fetchCart: async () => {
        set({ loading: true, error: null });
        try {
          const data = await api.get('/cart') as any;
          set({ items: data?.data?.items || [], loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false });
        }
      },

      addItem: async (productId, variantId = null, quantity = 1) => {
        set({ loading: true, error: null });
        try {
          const payload: Record<string, unknown> = { productId, quantity };
          if (variantId != null) payload.variantId = variantId;
          await api.post('/cart/items', payload);
          await get().fetchCart();
        } catch (err) {
          set({ error: (err as Error).message, loading: false });
          throw err;
        }
      },

      updateQuantity: async (cartItemId, quantity) => {
        set({ loading: true, error: null });
        try {
          await api.put(`/cart/items/${cartItemId}`, { quantity });
          await get().fetchCart();
        } catch (err) {
          set({ error: (err as Error).message, loading: false });
          throw err;
        }
      },

      removeItem: async (cartItemId) => {
        set({ loading: true, error: null });
        try {
          await api.delete(`/cart/items/${cartItemId}`);
          await get().fetchCart();
        } catch (err) {
          set({ error: (err as Error).message, loading: false });
          throw err;
        }
      },

      clearCart: async () => {
        set({ loading: true, error: null });
        try {
          await api.delete('/cart');
          set({ items: [], loading: false });
        } catch (err) {
          set({ error: (err as Error).message, loading: false });
        }
      },

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce((sum, item) => {
          const price = item.effectivePrice || item.product?.basePrice || 0;
          return sum + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'amazon-clone-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
