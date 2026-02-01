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
  Modal,
  Input,
  Textarea,
  Select,
  ConfirmDialog,
} from "@/components/admin/ui";
import {
  useAdminPriceLists,
  useCreatePriceList,
  useDeletePriceList,
} from "@/hooks/admin/use-admin-pricing";
import { formatDate } from "@/lib/admin/utils";
import { Plus } from "lucide-react";
import type { AdminPriceList, PriceListType, PriceListStatus } from "@/types/admin";

export default function PricingPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<AdminPriceList | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PriceListType>("SALE");
  const [status, setStatus] = useState<PriceListStatus>("DRAFT");

  const { data, isLoading } = useAdminPriceLists({ page: String(page), limit: "20" });
  const createPriceList = useCreatePriceList();
  const deletePriceList = useDeletePriceList();

  const priceLists = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    { key: "name", header: "Name", render: (p: AdminPriceList) => <span className="font-medium text-[var(--admin-fg-base)]">{p.name}</span> },
    { key: "type", header: "Type", render: (p: AdminPriceList) => <Badge color={p.type === "SALE" ? "orange" : "blue"}>{p.type}</Badge> },
    { key: "status", header: "Status", render: (p: AdminPriceList) => <StatusBadge status={p.status} /> },
    { key: "prices", header: "Prices", render: (p: AdminPriceList) => <span className="text-[var(--admin-fg-subtle)]">{p.prices?.length ?? 0}</span> },
    { key: "period", header: "Period", render: (p: AdminPriceList) => <span className="text-xs text-[var(--admin-fg-muted)]">{p.startsAt ? formatDate(p.startsAt) : "—"} → {p.endsAt ? formatDate(p.endsAt) : "No end"}</span> },
    { key: "createdAt", header: "Created", render: (p: AdminPriceList) => <span className="text-[var(--admin-fg-muted)]">{formatDate(p.createdAt)}</span> },
  ];

  const handleCreate = async () => {
    const result = await createPriceList.mutateAsync({ name, description, type, status });
    setCreateOpen(false);
    setName(""); setDescription("");
    router.push(`/admin/pricing/${result.data.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><Heading>Price Lists</Heading><Subheading>Manage pricing overrides and sales</Subheading></div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" />Add Price List</Button>
      </div>
      <Container>
        <Table columns={columns} data={priceLists} isLoading={isLoading} onRowClick={(p) => router.push(`/admin/pricing/${p.id}`)} emptyMessage="No price lists" />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Container>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Price List" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} isLoading={createPriceList.isPending}>Create</Button></>}>
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Select label="Type" options={[{ value: "SALE", label: "Sale" }, { value: "OVERRIDE", label: "Override" }]} value={type} onChange={(e) => setType(e.target.value as PriceListType)} />
          <Select label="Status" options={[{ value: "DRAFT", label: "Draft" }, { value: "ACTIVE", label: "Active" }]} value={status} onChange={(e) => setStatus(e.target.value as PriceListStatus)} />
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={async () => { if (deleteItem) await deletePriceList.mutateAsync(deleteItem.id); setDeleteItem(null); }} title="Delete Price List" description={`Delete "${deleteItem?.name}"?`} isLoading={deletePriceList.isPending} />
    </div>
  );
}
