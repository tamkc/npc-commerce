"use client";

import { useState } from "react";
import {
  Heading, Subheading, Button, Table, Container, Modal, Input, Select, Switch, ConfirmDialog,
} from "@/components/admin/ui";
import { useAdminTaxRates, useCreateTaxRate, useDeleteTaxRate } from "@/hooks/admin/use-admin-settings";
import { useAdminRegions } from "@/hooks/admin/use-admin-regions";
import { Plus, Trash2 } from "lucide-react";
import type { AdminTaxRate } from "@/types/admin";
import { Badge } from "@/components/admin/ui";

export default function TaxRatesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<AdminTaxRate | null>(null);
  const [regionId, setRegionId] = useState(""); const [name, setName] = useState("");
  const [code, setCode] = useState(""); const [rate, setRate] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const { data, isLoading } = useAdminTaxRates();
  const { data: regionsData } = useAdminRegions();
  const createTaxRate = useCreateTaxRate();
  const deleteTaxRate = useDeleteTaxRate();
  const taxRates = data?.data ?? [];
  const regions = regionsData?.data ?? [];

  const columns = [
    { key: "name", header: "Name", render: (t: AdminTaxRate) => <span className="font-medium text-[var(--admin-fg-base)]">{t.name}</span> },
    { key: "code", header: "Code", render: (t: AdminTaxRate) => <span className="font-mono text-[var(--admin-fg-muted)]">{t.code || "—"}</span> },
    { key: "rate", header: "Rate", render: (t: AdminTaxRate) => `${(Number(t.rate) * 100).toFixed(2)}%` },
    { key: "default", header: "Default", render: (t: AdminTaxRate) => t.isDefault ? <Badge color="green">Default</Badge> : <span className="text-[var(--admin-fg-muted)]">—</span> },
    { key: "actions", header: "", className: "w-12", render: (t: AdminTaxRate) => <button onClick={(e) => { e.stopPropagation(); setDeleteItem(t); }} className="rounded p-1 text-[var(--admin-fg-error)] hover:bg-[var(--admin-tag-red-bg)]"><Trash2 className="h-3.5 w-3.5" /></button> },
  ];

  const handleCreate = async () => {
    await createTaxRate.mutateAsync({ regionId, name, code: code || undefined, rate: Number(rate) / 100, isDefault });
    setCreateOpen(false); setRegionId(""); setName(""); setCode(""); setRate(""); setIsDefault(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><Heading>Tax Rates</Heading><Subheading>Manage tax rates by region</Subheading></div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" />Add Tax Rate</Button>
      </div>
      <Container><Table columns={columns} data={taxRates} isLoading={isLoading} emptyMessage="No tax rates" /></Container>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Tax Rate" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} isLoading={createTaxRate.isPending}>Create</Button></>}>
        <div className="space-y-4">
          <Select label="Region" options={regions.map((r) => ({ value: r.id, label: r.name }))} value={regionId} onChange={(e) => setRegionId(e.target.value)} placeholder="Select region" />
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Standard Tax" required />
          <Input label="Code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="TAX_STANDARD" />
          <Input label="Rate (%)" type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="7.5" required />
          <Switch checked={isDefault} onChange={setIsDefault} label="Default tax rate" />
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={async () => { if (deleteItem) await deleteTaxRate.mutateAsync(deleteItem.id); setDeleteItem(null); }} title="Delete Tax Rate" description={`Delete "${deleteItem?.name}"?`} isLoading={deleteTaxRate.isPending} />
    </div>
  );
}
