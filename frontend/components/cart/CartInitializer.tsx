'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/stores/cart-store';

export function CartInitializer() {
  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return null;
}
