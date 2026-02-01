"use client";

import { useState } from "react";
import {
  Heading, Subheading, Button, Table, Badge, Container, Modal, Input, Select, Switch, ConfirmDialog,
} from "@/components/admin/ui";
import { useAdminShippingMethods, useCreateShippingMethod, useDeleteShippingMethod } from "@/hooks/admin/use-admin-settings";
import { useAdminRegions } from "@/hooks/admin/use-admin-regions";
import { formatCurrency } from "@/lib/admin/utils";
import { Plus, Trash2 } from "lucide-react";
import type { AdminShippingMethod } from "@/types/admin";

export default function ShippingPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<AdminShippingMethod | null>(null);
  const [regionId, setRegionId] = useState(""); const [name, setName] = useState("");
  const [price, setPrice] = useState(""); const [isActive, setIsActive] = useState(true);

  const { data, isLoading } = useAdminShippingMethods();
  const { data: regionsData } = useAdminRegions();
  const create = useCreateShippingMethod(); const del = useDeleteShippingMethod();
  const methods = data?.data ?? [];
  const regions = regionsData?.data ?? [];

  const columns = [
    { key: "name", header: "Method", render: (m: AdminShippingMethod) => <span className="font-medium text-[var(--admin-fg-base)]">{m.name}</span> },
    { key: "price", header: "Price", render: (m: AdminShippingMethod) => formatCurrency(Number(m.price)) },
    { key: "status", header: "Status", render: (m: AdminShippingMethod) => <Badge color={m.isActive ? "green" : "neutral"}>{m.isActive ? "Active" : "Inactive"}</Badge> },
    { key: "minOrder", header: "Min Order", render: (m: AdminShippingMethod) => m.minOrderAmount ? formatCurrency(Number(m.minOrderAmount)) : "—" },
    { key: "maxOrder", header: "Max Order", render: (m: AdminShippingMethod) => m.maxOrderAmount ? formatCurrency(Number(m.maxOrderAmount)) : "—" },
    { key: "actions", header: "", className: "w-12", render: (m: AdminShippingMethod) => <button onClick={(e) => { e.stopPropagation(); setDeleteItem(m); }} className="rounded p-1 text-[var(--admin-fg-error)] hover:bg-[var(--admin-tag-red-bg)]"><Trash2 className="h-3.5 w-3.5" /></button> },
  ];

  const handleCreate = async () => {
    await create.mutateAsync({ regionId, name, price: Number(price), isActive });
    setCreateOpen(false); setRegionId(""); setName(""); setPrice("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><Heading>Shipping Methods</Heading><Subheading>Configure shipping options</Subheading></div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" />Add Method</Button>
      </div>
      <Container><Table columns={columns} data={methods} isLoading={isLoading} emptyMessage="No shipping methods" /></Container>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Shipping Method" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} isLoading={create.isPending}>Create</Button></>}>
        <div className="space-y-4">
          <Select label="Region" options={regions.map((r) => ({ value: r.id, label: r.name }))} value={regionId} onChange={(e) => setRegionId(e.target.value)} placeholder="Select region" />
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Standard Shipping" required />
          <Input label="Price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="5.99" required />
          <Switch checked={isActive} onChange={setIsActive} label="Active" />
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={async () => { if (deleteItem) await del.mutateAsync(deleteItem.id); setDeleteItem(null); }} title="Delete Method" description={`Delete "${deleteItem?.name}"?`} isLoading={del.isPending} />
    </div>
  );
}
