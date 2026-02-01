"use client";

import { useState } from "react";
import {
  Heading, Subheading, Button, Table, Badge, Container, Modal, Input, Textarea, Select, Switch, ConfirmDialog,
} from "@/components/admin/ui";
import { useAdminSalesChannels, useCreateSalesChannel, useDeleteSalesChannel } from "@/hooks/admin/use-admin-settings";
import { formatDate } from "@/lib/admin/utils";
import { Plus, Trash2 } from "lucide-react";
import type { AdminSalesChannel, SalesChannelType } from "@/types/admin";

export default function SalesChannelsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<AdminSalesChannel | null>(null);
  const [name, setName] = useState(""); const [description, setDescription] = useState("");
  const [type, setType] = useState<SalesChannelType>("WEB"); const [isActive, setIsActive] = useState(true);

  const { data, isLoading } = useAdminSalesChannels();
  const create = useCreateSalesChannel(); const del = useDeleteSalesChannel();
  const channels = data?.data ?? [];

  const columns = [
    { key: "name", header: "Name", render: (c: AdminSalesChannel) => <span className="font-medium text-[var(--admin-fg-base)]">{c.name}</span> },
    { key: "type", header: "Type", render: (c: AdminSalesChannel) => <Badge color="blue">{c.type}</Badge> },
    { key: "status", header: "Status", render: (c: AdminSalesChannel) => <Badge color={c.isActive ? "green" : "neutral"}>{c.isActive ? "Active" : "Inactive"}</Badge> },
    { key: "description", header: "Description", render: (c: AdminSalesChannel) => <span className="text-[var(--admin-fg-muted)]">{c.description || "—"}</span> },
    { key: "createdAt", header: "Created", render: (c: AdminSalesChannel) => <span className="text-[var(--admin-fg-muted)]">{formatDate(c.createdAt)}</span> },
    { key: "actions", header: "", className: "w-12", render: (c: AdminSalesChannel) => <button onClick={(e) => { e.stopPropagation(); setDeleteItem(c); }} className="rounded p-1 text-[var(--admin-fg-error)] hover:bg-[var(--admin-tag-red-bg)]"><Trash2 className="h-3.5 w-3.5" /></button> },
  ];

  const handleCreate = async () => {
    await create.mutateAsync({ name, description, type, isActive });
    setCreateOpen(false); setName(""); setDescription("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><Heading>Sales Channels</Heading><Subheading>Manage your selling channels</Subheading></div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" />Add Channel</Button>
      </div>
      <Container><Table columns={columns} data={channels} isLoading={isLoading} emptyMessage="No sales channels" /></Container>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Sales Channel" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} isLoading={create.isPending}>Create</Button></>}>
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Select label="Type" options={[{ value: "WEB", label: "Web" }, { value: "MOBILE", label: "Mobile" }, { value: "POS", label: "Point of Sale" }]} value={type} onChange={(e) => setType(e.target.value as SalesChannelType)} />
          <Switch checked={isActive} onChange={setIsActive} label="Active" />
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={async () => { if (deleteItem) await del.mutateAsync(deleteItem.id); setDeleteItem(null); }} title="Delete Channel" description={`Delete "${deleteItem?.name}"?`} isLoading={del.isPending} />
    </div>
  );
}
