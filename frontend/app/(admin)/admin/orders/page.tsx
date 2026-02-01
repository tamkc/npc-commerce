"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heading,
  Subheading,
  Table,
  Tabs,
  SearchInput,
  Pagination,
  StatusBadge,
  Container,
} from "@/components/admin/ui";
import { useAdminOrders } from "@/hooks/admin/use-admin-orders";
import { formatCurrency, formatDate } from "@/lib/admin/utils";
import type { AdminOrder } from "@/types/admin";

const statusTabs = [
  { value: "all", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function OrdersPage() {
  const router = useRouter();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const params: Record<string, string> = {
    page: String(page),
    limit: "20",
  };
  if (search) params.search = search;
  if (tab !== "all") params.status = tab;

  const { data, isLoading } = useAdminOrders(params);
  const orders = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    {
      key: "displayId",
      header: "Order",
      render: (o: AdminOrder) => (
        <span className="font-medium text-[var(--admin-fg-base)]">
          #{o.displayId}
        </span>
      ),
    },
    {
      key: "email",
      header: "Customer",
      render: (o: AdminOrder) => (
        <div>
          <p className="text-sm text-[var(--admin-fg-base)]">{o.email}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (o: AdminOrder) => <StatusBadge status={o.status} />,
    },
    {
      key: "paymentStatus",
      header: "Payment",
      render: (o: AdminOrder) => <StatusBadge status={o.paymentStatus} />,
    },
    {
      key: "fulfillmentStatus",
      header: "Fulfillment",
      render: (o: AdminOrder) => <StatusBadge status={o.fulfillmentStatus} />,
    },
    {
      key: "total",
      header: "Total",
      render: (o: AdminOrder) => (
        <span className="font-medium">
          {formatCurrency(Number(o.total), o.currencyCode)}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (o: AdminOrder) => (
        <span className="text-[var(--admin-fg-muted)]">
          {formatDate(o.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Heading>Orders</Heading>
        <Subheading>View and manage customer orders</Subheading>
      </div>

      <Container>
        <div className="p-4">
          <SearchInput
            placeholder="Search orders..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
        </div>
        <Tabs
          tabs={statusTabs}
          value={tab}
          onChange={(v) => {
            setTab(v);
            setPage(1);
          }}
        />
        <Table
          columns={columns}
          data={orders}
          isLoading={isLoading}
          onRowClick={(o) => router.push(`/admin/orders/${o.id}`)}
          emptyMessage="No orders found"
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Container>
    </div>
  );
}
