"use client";

import { useState } from "react";
import {
  Heading, Subheading, Button, Table, Badge, Container, Modal, Input, Switch, ConfirmDialog,
} from "@/components/admin/ui";
import { useAdminStockLocations, useCreateStockLocation, useDeleteStockLocation } from "@/hooks/admin/use-admin-settings";
import { Plus, Trash2 } from "lucide-react";
import type { AdminStockLocation } from "@/types/admin";

export default function StockLocationsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<AdminStockLocation | null>(null);
  const [name, setName] = useState(""); const [code, setCode] = useState("");
  const [address, setAddress] = useState(""); const [city, setCity] = useState("");
  const [state, setState] = useState(""); const [postalCode, setPostalCode] = useState("");
  const [countryCode, setCountryCode] = useState(""); const [isActive, setIsActive] = useState(true);

  const { data, isLoading } = useAdminStockLocations();
  const create = useCreateStockLocation(); const del = useDeleteStockLocation();
  const locations = data?.data ?? [];

  const columns = [
    { key: "name", header: "Name", render: (l: AdminStockLocation) => <span className="font-medium text-[var(--admin-fg-base)]">{l.name}</span> },
    { key: "code", header: "Code", render: (l: AdminStockLocation) => <span className="font-mono text-[var(--admin-fg-muted)]">{l.code}</span> },
    { key: "address", header: "Address", render: (l: AdminStockLocation) => <span className="text-[var(--admin-fg-subtle)]">{[l.city, l.state, l.countryCode].filter(Boolean).join(", ") || "—"}</span> },
    { key: "status", header: "Status", render: (l: AdminStockLocation) => <Badge color={l.isActive ? "green" : "neutral"}>{l.isActive ? "Active" : "Inactive"}</Badge> },
    { key: "actions", header: "", className: "w-12", render: (l: AdminStockLocation) => <button onClick={(e) => { e.stopPropagation(); setDeleteItem(l); }} className="rounded p-1 text-[var(--admin-fg-error)] hover:bg-[var(--admin-tag-red-bg)]"><Trash2 className="h-3.5 w-3.5" /></button> },
  ];

  const resetForm = () => { setName(""); setCode(""); setAddress(""); setCity(""); setState(""); setPostalCode(""); setCountryCode(""); setIsActive(true); };

  const handleCreate = async () => {
    await create.mutateAsync({ name, code, addressLine1: address || undefined, city: city || undefined, state: state || undefined, postalCode: postalCode || undefined, countryCode: countryCode || undefined, isActive });
    setCreateOpen(false); resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><Heading>Stock Locations</Heading><Subheading>Manage warehouses and fulfillment locations</Subheading></div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" />Add Location</Button>
      </div>
      <Container><Table columns={columns} data={locations} isLoading={isLoading} emptyMessage="No stock locations" /></Container>
      <Modal open={createOpen} onClose={() => { setCreateOpen(false); resetForm(); }} title="Add Stock Location" footer={<><Button variant="secondary" onClick={() => { setCreateOpen(false); resetForm(); }}>Cancel</Button><Button onClick={handleCreate} isLoading={create.isPending}>Create</Button></>}>
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Main Warehouse" required />
          <Input label="Code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="WH-001" required />
          <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Warehouse St" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input label="State" value={state} onChange={(e) => setState(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            <Input label="Country Code" value={countryCode} onChange={(e) => setCountryCode(e.target.value.toUpperCase())} placeholder="US" />
          </div>
          <Switch checked={isActive} onChange={setIsActive} label="Active" />
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={async () => { if (deleteItem) await del.mutateAsync(deleteItem.id); setDeleteItem(null); }} title="Delete Location" description={`Delete "${deleteItem?.name}"?`} isLoading={del.isPending} />
    </div>
  );
}
