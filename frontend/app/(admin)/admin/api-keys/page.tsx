"use client";

import { useState } from "react";
import {
  Heading, Subheading, Button, Table, Badge, Container, Modal, Input, Select, ConfirmDialog,
} from "@/components/admin/ui";
import { useAdminApiKeys, useCreateApiKey, useDeleteApiKey } from "@/hooks/admin/use-admin-settings";
import { formatDate } from "@/lib/admin/utils";
import { Plus, Trash2, Copy, Check } from "lucide-react";
import type { AdminApiKey, ApiKeyType } from "@/types/admin";

export default function ApiKeysPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<AdminApiKey | null>(null);
  const [name, setName] = useState(""); const [type, setType] = useState<ApiKeyType>("STORE");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useAdminApiKeys();
  const create = useCreateApiKey(); const del = useDeleteApiKey();
  const keys = data?.data ?? [];

  const copyKey = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const columns = [
    { key: "name", header: "Name", render: (k: AdminApiKey) => <span className="font-medium text-[var(--admin-fg-base)]">{k.name}</span> },
    { key: "prefix", header: "Key", render: (k: AdminApiKey) => <span className="font-mono text-[var(--admin-fg-muted)]">{k.keyPrefix}...</span> },
    { key: "type", header: "Type", render: (k: AdminApiKey) => <Badge color={k.type === "ADMIN" ? "purple" : "blue"}>{k.type}</Badge> },
    { key: "status", header: "Status", render: (k: AdminApiKey) => k.revokedAt ? <Badge color="red">Revoked</Badge> : <Badge color="green">Active</Badge> },
    { key: "lastUsed", header: "Last Used", render: (k: AdminApiKey) => <span className="text-[var(--admin-fg-muted)]">{k.lastUsedAt ? formatDate(k.lastUsedAt) : "Never"}</span> },
    { key: "createdAt", header: "Created", render: (k: AdminApiKey) => <span className="text-[var(--admin-fg-muted)]">{formatDate(k.createdAt)}</span> },
    { key: "actions", header: "", className: "w-12", render: (k: AdminApiKey) => !k.revokedAt && <button onClick={(e) => { e.stopPropagation(); setDeleteItem(k); }} className="rounded p-1 text-[var(--admin-fg-error)] hover:bg-[var(--admin-tag-red-bg)]"><Trash2 className="h-3.5 w-3.5" /></button> },
  ];

  const handleCreate = async () => {
    const result = await create.mutateAsync({ name, type });
    setNewKey(result.data.rawKey);
    setCreateOpen(false); setName("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><Heading>API Keys</Heading><Subheading>Manage API access keys</Subheading></div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" />Create API Key</Button>
      </div>
      <Container><Table columns={columns} data={keys} isLoading={isLoading} emptyMessage="No API keys" /></Container>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create API Key" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} isLoading={create.isPending}>Create</Button></>}>
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My API Key" required />
          <Select label="Type" options={[{ value: "STORE", label: "Store" }, { value: "ADMIN", label: "Admin" }]} value={type} onChange={(e) => setType(e.target.value as ApiKeyType)} />
        </div>
      </Modal>

      {/* New key display */}
      <Modal open={!!newKey} onClose={() => setNewKey(null)} title="API Key Created" size="sm">
        <div className="space-y-3">
          <p className="text-sm text-[var(--admin-fg-subtle)]">Copy this key now. You won&apos;t be able to see it again.</p>
          <div className="flex items-center gap-2 rounded-lg bg-[var(--admin-bg-subtle)] p-3">
            <code className="flex-1 break-all font-mono text-xs text-[var(--admin-fg-base)]">{newKey}</code>
            <button onClick={copyKey} className="shrink-0 rounded p-1 text-[var(--admin-fg-muted)] hover:bg-[var(--admin-bg-field-hover)]">
              {copied ? <Check className="h-4 w-4 text-[var(--admin-tag-green-fg)]" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={async () => { if (deleteItem) await del.mutateAsync(deleteItem.id); setDeleteItem(null); }} title="Revoke API Key" description={`Revoke "${deleteItem?.name}"? This key will stop working immediately.`} confirmLabel="Revoke" isLoading={del.isPending} />
    </div>
  );
}
