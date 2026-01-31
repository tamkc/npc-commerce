'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const { cart, isOpen, closeDrawer, updateItem, removeItem } = useCartStore();

  if (!isOpen) return null;

  const items = cart?.items ?? [];

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={closeDrawer}
      />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-4">
          <h2 className="text-lg font-semibold">Cart</h2>
          <button
            onClick={closeDrawer}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500">Your cart is empty</p>
            <Button variant="outline" onClick={closeDrawer} asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-4">
                {items.map((item) => {
                  const image = item.variant?.product?.images?.[0];
                  return (
                    <li key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={image.altText || item.variant.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              {item.variant?.product?.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.variant.title}
                            </p>
                          </div>
                          <p className="text-sm font-medium">
                            {formatPrice(item.total)}
                          </p>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={() =>
                              item.quantity <= 1
                                ? removeItem(item.id)
                                : updateItem(item.id, item.quantity - 1)
                            }
                            className="rounded border p-0.5 text-gray-500 hover:bg-gray-100"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateItem(item.id, item.quantity + 1)
                            }
                            className="rounded border p-0.5 text-gray-500 hover:bg-gray-100"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto text-xs text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t px-4 py-4">
              <div className="mb-3 flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  {formatPrice(cart?.subtotal ?? 0)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={closeDrawer}
                  asChild
                >
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button className="flex-1" onClick={closeDrawer} asChild>
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
