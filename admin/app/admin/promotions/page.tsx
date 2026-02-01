"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heading,
  Subheading,
  Button,
  Table,
  SearchInput,
  Pagination,
  Badge,
  StatusBadge,
  Container,
} from "@/components/admin/ui";
import { useAdminPromotions } from "@/hooks/admin/use-admin-promotions";
import { formatCurrency, formatDate } from "@/lib/admin/utils";
import { Plus } from "lucide-react";
import type { AdminPromotion } from "@/types/admin";

export default function PromotionsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const params: Record<string, string> = { page: String(page), limit: "20" };
  if (search) params.search = search;

  const { data, isLoading } = useAdminPromotions(params);
  const promotions = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    {
      key: "name",
      header: "Promotion",
      render: (p: AdminPromotion) => (
        <div>
          <p className="font-medium text-[var(--admin-fg-base)]">{p.name}</p>
          {p.code && (
            <p className="font-mono text-xs text-[var(--admin-fg-muted)]">
              {p.code}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (p: AdminPromotion) => (
        <Badge color="purple">{p.type.replace(/_/g, " ")}</Badge>
      ),
    },
    {
      key: "value",
      header: "Value",
      render: (p: AdminPromotion) =>
        p.type === "PERCENTAGE"
          ? `${p.value}%`
          : p.type === "FREE_SHIPPING"
            ? "Free shipping"
            : formatCurrency(Number(p.value)),
    },
    {
      key: "status",
      header: "Status",
      render: (p: AdminPromotion) => (
        <Badge color={p.isActive ? "green" : "neutral"}>
          {p.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "usage",
      header: "Usage",
      render: (p: AdminPromotion) => (
        <span className="text-[var(--admin-fg-subtle)]">
          {p.usageCount} / {p.usageLimit || "∞"}
        </span>
      ),
    },
    {
      key: "dates",
      header: "Period",
      render: (p: AdminPromotion) => (
        <span className="text-xs text-[var(--admin-fg-muted)]">
          {p.startsAt ? formatDate(p.startsAt) : "—"} →{" "}
          {p.endsAt ? formatDate(p.endsAt) : "No end"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Promotions</Heading>
          <Subheading>Manage discount codes and promotions</Subheading>
        </div>
        <Button onClick={() => router.push("/admin/promotions/create")}>
          <Plus className="h-4 w-4" />
          Add Promotion
        </Button>
      </div>

      <Container>
        <div className="p-4">
          <SearchInput
            placeholder="Search promotions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
        </div>
        <Table
          columns={columns}
          data={promotions}
          isLoading={isLoading}
          onRowClick={(p) => router.push(`/admin/promotions/${p.id}`)}
          emptyMessage="No promotions found"
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Container>
    </div>
  );
}
