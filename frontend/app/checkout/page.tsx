"use client";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />

      <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
        Checkout
      </h1>

      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
