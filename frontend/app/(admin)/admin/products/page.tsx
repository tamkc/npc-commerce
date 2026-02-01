"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heading,
  Subheading,
  Button,
  Table,
  Tabs,
  SearchInput,
  Pagination,
  StatusBadge,
  Container,
} from "@/components/admin/ui";
import { useAdminProducts } from "@/hooks/admin/use-admin-products";
import { formatCurrency, formatDate } from "@/lib/admin/utils";
import { Plus } from "lucide-react";
import type { AdminProduct, ProductStatus } from "@/types/admin";

const statusTabs = [
  { value: "all", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export default function ProductsPage() {
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

  const { data, isLoading } = useAdminProducts(params);
  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    {
      key: "title",
      header: "Product",
      render: (item: AdminProduct) => (
        <div className="flex items-center gap-3">
          {item.images[0] ? (
            <img
              src={item.images[0].url}
              alt={item.title}
              className="h-8 w-8 rounded-md object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-md bg-[var(--admin-bg-subtle)]" />
          )}
          <div>
            <p className="font-medium text-[var(--admin-fg-base)]">
              {item.title}
            </p>
            <p className="text-xs text-[var(--admin-fg-muted)]">{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: AdminProduct) => <StatusBadge status={item.status} />,
    },
    {
      key: "variants",
      header: "Variants",
      render: (item: AdminProduct) => (
        <span className="text-[var(--admin-fg-subtle)]">
          {item.variants.length}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (item: AdminProduct) => {
        const prices = item.variants.map((v) => Number(v.price));
        if (prices.length === 0) return "—";
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max
          ? formatCurrency(min)
          : `${formatCurrency(min)} - ${formatCurrency(max)}`;
      },
    },
    {
      key: "createdAt",
      header: "Created",
      render: (item: AdminProduct) => (
        <span className="text-[var(--admin-fg-muted)]">
          {formatDate(item.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Products</Heading>
          <Subheading>Manage your product catalog</Subheading>
        </div>
        <Button onClick={() => router.push("/admin/products/create")}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Container>
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            <SearchInput
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-xs"
            />
          </div>
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
          data={products}
          isLoading={isLoading}
          onRowClick={(item) => router.push(`/admin/products/${item.id}`)}
          emptyMessage="No products found"
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Container>
    </div>
  );
}
