"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useOrders } from "@/hooks/use-orders";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Spinner } from "@/components/ui/Spinner";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

const statusVariant: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  PROCESSING: "info",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "danger",
  REFUNDED: "danger",
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useOrders();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg text-zinc-500">Please sign in to view orders.</p>
        <Button>
          <Link href="/auth/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  const orders = data?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[{ label: "Account", href: "/account" }, { label: "Orders" }]}
      />

      <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
        Order History
      </h1>

      {isLoading ? (
        <div className="mt-16 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            You haven&apos;t placed any orders yet.
          </p>
          <Button variant="outline" className="mt-4">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order: Order) => (
            <div
              key={order.id}
              className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-500">Order #{order.id}</p>
                  <p className="mt-1 font-semibold text-zinc-900 dark:text-white">
                    {formatPrice(order.total)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={statusVariant[order.status] ?? "default"}>
                    {order.status}
                  </Badge>
                  <span className="text-sm text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
