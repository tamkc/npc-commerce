import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { Cart } from "@/types";

interface CartSummaryProps {
  cart: Cart;
  showCheckoutButton?: boolean;
}

export function CartSummary({ cart, showCheckoutButton = true }: CartSummaryProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Order Summary
      </h2>

      <dl className="mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <dt className="text-zinc-600 dark:text-zinc-400">Subtotal</dt>
          <dd className="font-medium text-zinc-900 dark:text-white">
            {formatPrice(cart.subtotal)}
          </dd>
        </div>
        {cart.discountTotal > 0 && (
          <div className="flex justify-between text-sm">
            <dt className="text-zinc-600 dark:text-zinc-400">Discount</dt>
            <dd className="font-medium text-green-600">
              -{formatPrice(cart.discountTotal)}
            </dd>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <dt className="text-zinc-600 dark:text-zinc-400">Tax</dt>
          <dd className="font-medium text-zinc-900 dark:text-white">
            {formatPrice(cart.taxTotal)}
          </dd>
        </div>
        <hr className="border-zinc-200 dark:border-zinc-800" />
        <div className="flex justify-between text-base font-semibold">
          <dt className="text-zinc-900 dark:text-white">Total</dt>
          <dd className="text-zinc-900 dark:text-white">
            {formatPrice(cart.total)}
          </dd>
        </div>
      </dl>

      {showCheckoutButton && (
        <Button className="mt-6 w-full">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      )}
    </div>
  );
}
