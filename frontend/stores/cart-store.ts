import { create } from 'zustand';
import { api } from '@/lib/api-client';
import { CART_ID_KEY } from '@/lib/constants';
import type { Cart, AddCartItemRequest } from '@/types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  fetchCart: () => Promise<void>;
  addItem: (item: AddCartItemRequest) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => Promise<void>;
  clearCart: () => void;
}

function getCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_ID_KEY);
}

function setCartId(id: string) {
  localStorage.setItem(CART_ID_KEY, id);
}

function clearCartId() {
  localStorage.removeItem(CART_ID_KEY);
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  isOpen: false,

  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),

  fetchCart: async () => {
    const cartId = getCartId();
    if (!cartId) return;
    set({ isLoading: true });
    try {
      const cart = await api.get<Cart>(`/store/cart/${cartId}`);
      set({ cart });
    } catch {
      clearCartId();
      set({ cart: null });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item: AddCartItemRequest) => {
    set({ isLoading: true });
    try {
      let cartId = getCartId();
      if (!cartId) {
        const newCart = await api.post<Cart>('/store/cart', {});
        cartId = newCart.id;
        setCartId(cartId);
      }
      const cart = await api.post<Cart>(`/store/cart/${cartId}/items`, item);
      set({ cart, isOpen: true });
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (itemId: string, quantity: number) => {
    const cartId = getCartId();
    if (!cartId) return;
    set({ isLoading: true });
    try {
      const cart = await api.put<Cart>(`/store/cart/${cartId}/items/${itemId}`, {
        quantity,
      });
      set({ cart });
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId: string) => {
    const cartId = getCartId();
    if (!cartId) return;
    set({ isLoading: true });
    try {
      const cart = await api.delete<Cart>(
        `/store/cart/${cartId}/items/${itemId}`,
      );
      set({ cart });
    } finally {
      set({ isLoading: false });
    }
  },

  applyDiscount: async (code: string) => {
    const cartId = getCartId();
    if (!cartId) return;
    set({ isLoading: true });
    try {
      const cart = await api.post<Cart>(`/store/cart/${cartId}/discount`, {
        code,
      });
      set({ cart });
    } finally {
      set({ isLoading: false });
    }
  },

  removeDiscount: async () => {
    const cartId = getCartId();
    if (!cartId) return;
    set({ isLoading: true });
    try {
      const cart = await api.delete<Cart>(`/store/cart/${cartId}/discount`);
      set({ cart });
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: () => {
    clearCartId();
    set({ cart: null });
  },
}));
