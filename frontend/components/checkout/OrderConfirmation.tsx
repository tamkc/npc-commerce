import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

interface OrderConfirmationProps {
  orderId: string;
  total: number;
}

export function OrderConfirmation({ orderId, total }: OrderConfirmationProps) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <CheckCircle className="h-16 w-16 text-green-500" />

      <h2 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-white">
        Order Confirmed
      </h2>

      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        Thank you for your purchase. Your order has been placed successfully.
      </p>

      <dl className="mt-6 space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="text-zinc-500 dark:text-zinc-400">Order ID:</dt>
          <dd className="font-medium text-zinc-900 dark:text-white">
            {orderId}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-zinc-500 dark:text-zinc-400">Total:</dt>
          <dd className="font-medium text-zinc-900 dark:text-white">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex gap-4">
        <Button variant="outline">
          <Link href={`/account/orders`}>View Orders</Link>
        </Button>
        <Button>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
