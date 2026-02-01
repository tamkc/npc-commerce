"use client";

import { useState } from "react";
import {
  Heading,
  Subheading,
  Button,
  Table,
  Badge,
  Container,
  Modal,
  Input,
  Switch,
  ConfirmDialog,
} from "@/components/admin/ui";
import {
  useAdminRegions,
  useCreateRegion,
  useDeleteRegion,
} from "@/hooks/admin/use-admin-regions";
import { formatDate } from "@/lib/admin/utils";
import { Plus, Trash2, Edit } from "lucide-react";
import type { AdminRegion } from "@/types/admin";

export default function RegionsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<AdminRegion | null>(null);
  const [name, setName] = useState("");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [taxInclusive, setTaxInclusive] = useState(false);

  const { data, isLoading } = useAdminRegions();
  const createRegion = useCreateRegion();
  const deleteRegion = useDeleteRegion();
  const regions = data?.data ?? [];

  const columns = [
    { key: "name", header: "Region", render: (r: AdminRegion) => <span className="font-medium text-[var(--admin-fg-base)]">{r.name}</span> },
    { key: "currency", header: "Currency", render: (r: AdminRegion) => <Badge color="blue">{r.currencyCode}</Badge> },
    { key: "countries", header: "Countries", render: (r: AdminRegion) => <span className="text-[var(--admin-fg-subtle)]">{r.countries?.length ?? 0}</span> },
    { key: "taxRates", header: "Tax Rates", render: (r: AdminRegion) => <span className="text-[var(--admin-fg-subtle)]">{r.taxRates?.length ?? 0}</span> },
    { key: "taxInclusive", header: "Tax Inclusive", render: (r: AdminRegion) => <Badge color={r.taxInclusivePricing ? "green" : "neutral"}>{r.taxInclusivePricing ? "Yes" : "No"}</Badge> },
    { key: "createdAt", header: "Created", render: (r: AdminRegion) => <span className="text-[var(--admin-fg-muted)]">{formatDate(r.createdAt)}</span> },
    { key: "actions", header: "", className: "w-12", render: (r: AdminRegion) => <button onClick={(e) => { e.stopPropagation(); setDeleteItem(r); }} className="rounded p-1 text-[var(--admin-fg-error)] hover:bg-[var(--admin-tag-red-bg)]"><Trash2 className="h-3.5 w-3.5" /></button> },
  ];

  const handleCreate = async () => {
    await createRegion.mutateAsync({ name, currencyCode, taxInclusivePricing: taxInclusive });
    setCreateOpen(false);
    setName(""); setCurrencyCode("USD"); setTaxInclusive(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><Heading>Regions</Heading><Subheading>Configure shipping regions and currencies</Subheading></div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" />Add Region</Button>
      </div>
      <Container>
        <Table columns={columns} data={regions} isLoading={isLoading} emptyMessage="No regions configured" />
      </Container>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Region" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} isLoading={createRegion.isPending}>Create</Button></>}>
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="North America" required />
          <Input label="Currency Code" value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value.toUpperCase())} placeholder="USD" required />
          <Switch checked={taxInclusive} onChange={setTaxInclusive} label="Tax Inclusive Pricing" description="Prices include tax" />
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={async () => { if (deleteItem) await deleteRegion.mutateAsync(deleteItem.id); setDeleteItem(null); }} title="Delete Region" description={`Delete "${deleteItem?.name}"? All associated tax rates and shipping methods will be affected.`} isLoading={deleteRegion.isPending} />
    </div>
  );
}
