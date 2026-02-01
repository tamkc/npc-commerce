import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cart, CartItem } from "@/types";
import { apiClient } from "@/lib/api-client";
import { STORAGE_KEYS } from "@/lib/constants";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isOpen: boolean;

  setCart: (cart: Cart | null) => void;
  setIsOpen: (open: boolean) => void;
  toggleDrawer: () => void;

  fetchCart: () => Promise<void>;
  createCart: () => Promise<string>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => Promise<void>;
}

function getCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.CART_ID);
}

function setCartId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.CART_ID, id);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      isOpen: false,

      setCart: (cart) => set({ cart }),
      setIsOpen: (open) => set({ isOpen: open }),
      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

      fetchCart: async () => {
        const cartId = getCartId();
        if (!cartId) return;

        set({ isLoading: true });
        try {
          const response = await apiClient.get<{ data: Cart }>(
            `/store/cart/${cartId}`,
          );
          set({ cart: response.data });
        } catch {
          set({ cart: null });
        } finally {
          set({ isLoading: false });
        }
      },

      createCart: async () => {
        const response = await apiClient.post<{ data: Cart }>("/store/cart");
        setCartId(response.data.id);
        set({ cart: response.data });
        return response.data.id;
      },

      addItem: async (variantId, quantity) => {
        let cartId = getCartId();
        if (!cartId) {
          cartId = await get().createCart();
        }

        set({ isLoading: true });
        try {
          const response = await apiClient.post<{ data: Cart }>(
            `/store/cart/${cartId}/items`,
            { variantId, quantity },
          );
          set({ cart: response.data, isOpen: true });
        } finally {
          set({ isLoading: false });
        }
      },

      updateItem: async (itemId, quantity) => {
        const cartId = getCartId();
        if (!cartId) return;

        set({ isLoading: true });
        try {
          const response = await apiClient.put<{ data: Cart }>(
            `/store/cart/${cartId}/items/${itemId}`,
            { quantity },
          );
          set({ cart: response.data });
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (itemId) => {
        const cartId = getCartId();
        if (!cartId) return;

        set({ isLoading: true });
        try {
          const response = await apiClient.delete<{ data: Cart }>(
            `/store/cart/${cartId}/items/${itemId}`,
          );
          set({ cart: response.data });
        } finally {
          set({ isLoading: false });
        }
      },

      applyDiscount: async (code) => {
        const cartId = getCartId();
        if (!cartId) return;

        const response = await apiClient.post<{ data: Cart }>(
          `/store/cart/${cartId}/discount`,
          { code },
        );
        set({ cart: response.data });
      },

      removeDiscount: async () => {
        const cartId = getCartId();
        if (!cartId) return;

        const response = await apiClient.delete<{ data: Cart }>(
          `/store/cart/${cartId}/discount`,
        );
        set({ cart: response.data });
      },
    }),
    {
      name: "npc-cart",
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
);
