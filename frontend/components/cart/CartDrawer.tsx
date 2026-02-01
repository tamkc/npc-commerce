"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { CartItem } from "./CartItem";

export function CartDrawer() {
  const { cart, isOpen, isLoading, setIsOpen, updateItem, removeItem } =
    useCartStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Cart ({cart?.itemCount ?? 0})
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading && !cart ? (
            <div className="flex h-full items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">
                Your cart is empty.
              </p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.items.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-zinc-100 pb-4 dark:border-zinc-800"
                >
                  <CartItem
                    item={item}
                    onUpdateQuantity={updateItem}
                    onRemove={removeItem}
                    disabled={isLoading}
                    compact
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <div className="mb-4 flex justify-between text-base font-semibold text-zinc-900 dark:text-white">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <Button className="w-full" onClick={() => setIsOpen(false)}>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
