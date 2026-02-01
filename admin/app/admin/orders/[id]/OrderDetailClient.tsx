"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heading,
  Button,
  StatusBadge,
  Container,
  ContainerHeader,
  ContainerBody,
  Badge,
  Select,
  Textarea,
  ConfirmDialog,
} from "@/components/admin/ui";
import {
  useAdminOrder,
  useUpdateOrderStatus,
  useCancelOrder,
  useAddOrderNote,
} from "@/hooks/admin/use-admin-orders";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/admin/utils";
import { ArrowLeft, Send } from "lucide-react";
import type { OrderStatus } from "@/types/admin";

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
];

export default function OrderDetailClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useAdminOrder(id);
  const updateStatus = useUpdateOrderStatus(id);
  const cancelOrder = useCancelOrder(id);
  const addNote = useAddOrderNote(id);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-[var(--admin-bg-field-hover)]" />
        <div className="h-64 animate-pulse rounded-xl bg-[var(--admin-bg-field-hover)]" />
      </div>
    );
  }

  if (!order) {
    return <p className="text-[var(--admin-fg-muted)]">Order not found.</p>;
  }

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    await addNote.mutateAsync({ content: noteText, isPrivate: true });
    setNoteText("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/orders")}
            className="rounded-lg p-1.5 text-[var(--admin-fg-muted)] transition-colors hover:bg-[var(--admin-bg-field-hover)]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <Heading>Order #{order.displayId}</Heading>
            <p className="text-xs text-[var(--admin-fg-muted)]">
              {formatDateTime(order.createdAt)} &middot; {order.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setCancelOpen(true)}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Status row */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={order.status} />
        <StatusBadge status={order.paymentStatus} />
        <StatusBadge status={order.fulfillmentStatus} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Order Items + Summary */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <Container>
            <ContainerHeader>
              <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
                Items ({order.items.length})
              </h2>
            </ContainerHeader>
            <ContainerBody className="p-0">
              <div className="divide-y divide-[var(--admin-border-base)]">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-6 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--admin-fg-base)]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[var(--admin-fg-muted)]">
                        {item.variantTitle}
                        {item.sku && ` · ${item.sku}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--admin-fg-base)]">
                        {item.quantity} &times;{" "}
                        {formatCurrency(Number(item.unitPrice))}
                      </p>
                      <p className="text-sm font-medium text-[var(--admin-fg-base)]">
                        {formatCurrency(Number(item.total))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ContainerBody>
          </Container>

          {/* Summary */}
          <Container>
            <ContainerHeader>
              <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
                Summary
              </h2>
            </ContainerHeader>
            <ContainerBody>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--admin-fg-muted)]">Subtotal</span>
                  <span>{formatCurrency(Number(order.subtotal))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--admin-fg-muted)]">Shipping</span>
                  <span>{formatCurrency(Number(order.shippingTotal))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--admin-fg-muted)]">Tax</span>
                  <span>{formatCurrency(Number(order.taxTotal))}</span>
                </div>
                {Number(order.discountTotal) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--admin-fg-muted)]">
                      Discount
                    </span>
                    <span className="text-[var(--admin-tag-green-fg)]">
                      -{formatCurrency(Number(order.discountTotal))}
                    </span>
                  </div>
                )}
                <div className="border-t border-[var(--admin-border-base)] pt-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span>
                      {formatCurrency(Number(order.total), order.currencyCode)}
                    </span>
                  </div>
                </div>
              </div>
            </ContainerBody>
          </Container>

          {/* Notes */}
          <Container>
            <ContainerHeader>
              <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
                Notes
              </h2>
            </ContainerHeader>
            <ContainerBody className="space-y-4">
              {order.notes && order.notes.length > 0 && (
                <div className="space-y-3">
                  {order.notes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-lg bg-[var(--admin-bg-subtle)] p-3"
                    >
                      <p className="text-sm text-[var(--admin-fg-base)]">
                        {note.content}
                      </p>
                      <p className="mt-1 text-xs text-[var(--admin-fg-muted)]">
                        {formatDateTime(note.createdAt)}
                        {note.isPrivate && " · Private"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddNote}
                  isLoading={addNote.isPending}
                  disabled={!noteText.trim()}
                  className="self-end"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </ContainerBody>
          </Container>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Update Status */}
          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
            <Container>
              <ContainerHeader>
                <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
                  Update Status
                </h2>
              </ContainerHeader>
              <ContainerBody>
                <Select
                  options={statusOptions}
                  value={order.status}
                  onChange={(e) =>
                    updateStatus.mutate(e.target.value as OrderStatus)
                  }
                />
              </ContainerBody>
            </Container>
          )}

          {/* Shipping Address */}
          <Container>
            <ContainerHeader>
              <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
                Shipping Address
              </h2>
            </ContainerHeader>
            <ContainerBody>
              {order.shippingAddress ? (
                <div className="text-sm text-[var(--admin-fg-subtle)] space-y-0.5">
                  <p>
                    {(order.shippingAddress as Record<string, string>)
                      .firstName}{" "}
                    {(order.shippingAddress as Record<string, string>).lastName}
                  </p>
                  <p>
                    {
                      (order.shippingAddress as Record<string, string>)
                        .addressLine1
                    }
                  </p>
                  <p>
                    {(order.shippingAddress as Record<string, string>).city},{" "}
                    {(order.shippingAddress as Record<string, string>).state}{" "}
                    {
                      (order.shippingAddress as Record<string, string>)
                        .postalCode
                    }
                  </p>
                  <p>
                    {
                      (order.shippingAddress as Record<string, string>)
                        .countryCode
                    }
                  </p>
                </div>
              ) : (
                <p className="text-sm text-[var(--admin-fg-muted)]">
                  No shipping address
                </p>
              )}
            </ContainerBody>
          </Container>

          {/* Payment */}
          <Container>
            <ContainerHeader>
              <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
                Payment
              </h2>
            </ContainerHeader>
            <ContainerBody>
              {order.payments && order.payments.length > 0 ? (
                <div className="space-y-2">
                  {order.payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm capitalize text-[var(--admin-fg-base)]">
                          {p.provider}
                        </p>
                        <p className="text-xs text-[var(--admin-fg-muted)]">
                          {p.externalId || "—"}
                        </p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--admin-fg-muted)]">
                  No payments
                </p>
              )}
            </ContainerBody>
          </Container>
        </div>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => {
          cancelOrder.mutate();
          setCancelOpen(false);
        }}
        title="Cancel Order"
        description="Are you sure you want to cancel this order? This action cannot be undone."
        confirmLabel="Cancel Order"
        isLoading={cancelOrder.isPending}
      />
    </div>
  );
}
