"use client";

import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useCartStore } from "@/stores/cart-store";
import { apiClient } from "@/lib/api-client";
import { getStripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";
import { ShippingForm, type ShippingFormData } from "./ShippingForm";
import { PaymentForm } from "./PaymentForm";
import { OrderConfirmation } from "./OrderConfirmation";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "@/components/ui/Toast";

type CheckoutStep = "shipping" | "payment" | "confirmation";

interface CheckoutSession {
  clientSecret: string;
  orderId: string;
}

export function CheckoutForm() {
  const { cart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(
    null,
  );
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">Your cart is empty.</p>
      </div>
    );
  }

  const handleShippingSubmit = async (data: ShippingFormData) => {
    setShippingData(data);
    setIsLoading(true);

    try {
      const response = await apiClient.post<{ data: CheckoutSession }>(
        "/store/checkout",
        {
          cartId: cart.id,
          shippingAddress: data,
        },
      );
      setSession(response.data);
      setStep("payment");
    } catch {
      toast("Failed to start checkout. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      await apiClient.post("/store/checkout/confirm", {
        orderId: session?.orderId,
        paymentIntentId,
      });
      setConfirmedOrderId(session?.orderId ?? "");
      setStep("confirmation");
    } catch {
      toast("Payment received but order confirmation failed.", "error");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Form Column */}
      <div className="lg:col-span-2">
        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-2 text-sm">
          {(["shipping", "payment", "confirmation"] as const).map(
            (s, i) => (
              <span key={s} className="flex items-center gap-2">
                {i > 0 && (
                  <span className="text-zinc-300 dark:text-zinc-700">
                    /
                  </span>
                )}
                <span
                  className={
                    step === s
                      ? "font-semibold text-zinc-900 dark:text-white"
                      : "text-zinc-400 dark:text-zinc-500"
                  }
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              </span>
            ),
          )}
        </div>

        {step === "shipping" && (
          <ShippingForm
            onSubmit={handleShippingSubmit}
            defaultValues={shippingData ?? undefined}
            isLoading={isLoading}
          />
        )}

        {step === "payment" && session?.clientSecret && (
          <Elements
            stripe={getStripe()}
            options={{ clientSecret: session.clientSecret }}
          >
            <PaymentForm
              onSuccess={handlePaymentSuccess}
              onBack={() => setStep("shipping")}
            />
          </Elements>
        )}

        {step === "payment" && !session?.clientSecret && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {step === "confirmation" && confirmedOrderId && (
          <OrderConfirmation orderId={confirmedOrderId} total={cart.total} />
        )}
      </div>

      {/* Order Summary Sidebar */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="font-semibold text-zinc-900 dark:text-white">
          Order Summary
        </h3>

        <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
          {cart.items.map((item) => (
            <li key={item.id} className="flex justify-between py-3 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">
                {item.title} x {item.quantity}
              </span>
              <span className="font-medium text-zinc-900 dark:text-white">
                {formatPrice(item.totalPrice)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <div className="flex justify-between text-sm">
            <dt className="text-zinc-600 dark:text-zinc-400">Subtotal</dt>
            <dd className="text-zinc-900 dark:text-white">
              {formatPrice(cart.subtotal)}
            </dd>
          </div>
          {cart.discountTotal > 0 && (
            <div className="flex justify-between text-sm">
              <dt className="text-zinc-600 dark:text-zinc-400">Discount</dt>
              <dd className="text-green-600">
                -{formatPrice(cart.discountTotal)}
              </dd>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <dt className="text-zinc-600 dark:text-zinc-400">Tax</dt>
            <dd className="text-zinc-900 dark:text-white">
              {formatPrice(cart.taxTotal)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-semibold dark:border-zinc-800">
            <dt className="text-zinc-900 dark:text-white">Total</dt>
            <dd className="text-zinc-900 dark:text-white">
              {formatPrice(cart.total)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
