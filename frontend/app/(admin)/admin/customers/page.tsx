"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heading,
  Subheading,
  Table,
  SearchInput,
  Pagination,
  Badge,
  Container,
} from "@/components/admin/ui";
import { useAdminCustomers } from "@/hooks/admin/use-admin-customers";
import { formatDate } from "@/lib/admin/utils";
import type { AdminCustomer } from "@/types/admin";

export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const params: Record<string, string> = { page: String(page), limit: "20" };
  if (search) params.search = search;

  const { data, isLoading } = useAdminCustomers(params);
  const customers = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    {
      key: "name",
      header: "Customer",
      render: (c: AdminCustomer) => (
        <div>
          <p className="font-medium text-[var(--admin-fg-base)]">
            {c.user?.firstName} {c.user?.lastName}
          </p>
          <p className="text-xs text-[var(--admin-fg-muted)]">
            {c.user?.email}
          </p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (c: AdminCustomer) => (
        <span className="text-[var(--admin-fg-subtle)]">
          {c.phone || "—"}
        </span>
      ),
    },
    {
      key: "group",
      header: "Group",
      render: (c: AdminCustomer) =>
        c.customerGroup ? (
          <Badge color="purple">{c.customerGroup.name}</Badge>
        ) : (
          <span className="text-[var(--admin-fg-muted)]">—</span>
        ),
    },
    {
      key: "addresses",
      header: "Addresses",
      render: (c: AdminCustomer) => (
        <span className="text-[var(--admin-fg-subtle)]">
          {c.addresses?.length ?? 0}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (c: AdminCustomer) => (
        <span className="text-[var(--admin-fg-muted)]">
          {formatDate(c.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Heading>Customers</Heading>
        <Subheading>View and manage customer accounts</Subheading>
      </div>

      <Container>
        <div className="p-4">
          <SearchInput
            placeholder="Search customers..."
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
          data={customers}
          isLoading={isLoading}
          onRowClick={(c) => router.push(`/admin/customers/${c.id}`)}
          emptyMessage="No customers found"
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Container>
    </div>
  );
}
