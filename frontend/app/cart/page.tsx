"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Spinner } from "@/components/ui/Spinner";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem } = useCartStore();

  if (isLoading && !cart) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Cart" }]} />

      <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
        Shopping Cart
      </h1>

      {!cart || cart.items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-6 text-center">
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            Your cart is empty.
          </p>
          <Button variant="outline">
            <Link href="/products" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2">
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {cart.items.map((item) => (
                <li key={item.id} className="py-6">
                  <CartItem
                    item={item}
                    onUpdateQuantity={updateItem}
                    onRemove={removeItem}
                    disabled={isLoading}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <CartSummary cart={cart} />
        </div>
      )}
    </div>
  );
}
