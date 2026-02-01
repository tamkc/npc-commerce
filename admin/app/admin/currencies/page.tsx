"use client";

import { useState } from "react";
import {
  Heading, Subheading, Button, Table, Container, Modal, Input, ConfirmDialog,
} from "@/components/admin/ui";
import { useAdminCurrencies, useCreateCurrency, useDeleteCurrency } from "@/hooks/admin/use-admin-settings";
import { Plus, Trash2 } from "lucide-react";
import type { AdminCurrency } from "@/types/admin";

export default function CurrenciesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<AdminCurrency | null>(null);
  const [code, setCode] = useState(""); const [name, setName] = useState("");
  const [symbol, setSymbol] = useState(""); const [symbolNative, setSymbolNative] = useState("");
  const [decimals, setDecimals] = useState("2");

  const { data, isLoading } = useAdminCurrencies();
  const createCurrency = useCreateCurrency();
  const deleteCurrency = useDeleteCurrency();
  const currencies = data?.data ?? [];

  const columns = [
    { key: "code", header: "Code", render: (c: AdminCurrency) => <span className="font-mono font-medium text-[var(--admin-fg-base)]">{c.code}</span> },
    { key: "name", header: "Name", accessor: "name" as const },
    { key: "symbol", header: "Symbol", render: (c: AdminCurrency) => <span>{c.symbol} ({c.symbolNative})</span> },
    { key: "decimals", header: "Decimals", render: (c: AdminCurrency) => String(c.decimalDigits) },
    { key: "actions", header: "", className: "w-12", render: (c: AdminCurrency) => <button onClick={(e) => { e.stopPropagation(); setDeleteItem(c); }} className="rounded p-1 text-[var(--admin-fg-error)] hover:bg-[var(--admin-tag-red-bg)]"><Trash2 className="h-3.5 w-3.5" /></button> },
  ];

  const handleCreate = async () => {
    await createCurrency.mutateAsync({ code, name, symbol, symbolNative, decimalDigits: Number(decimals) });
    setCreateOpen(false); setCode(""); setName(""); setSymbol(""); setSymbolNative(""); setDecimals("2");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><Heading>Currencies</Heading><Subheading>Manage supported currencies</Subheading></div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" />Add Currency</Button>
      </div>
      <Container><Table columns={columns} data={currencies} isLoading={isLoading} emptyMessage="No currencies" /></Container>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Currency" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} isLoading={createCurrency.isPending}>Create</Button></>}>
        <div className="space-y-4">
          <Input label="Code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="EUR" required />
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Euro" required />
          <Input label="Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="€" required />
          <Input label="Native Symbol" value={symbolNative} onChange={(e) => setSymbolNative(e.target.value)} placeholder="€" required />
          <Input label="Decimal Digits" type="number" value={decimals} onChange={(e) => setDecimals(e.target.value)} />
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={async () => { if (deleteItem) await deleteCurrency.mutateAsync(deleteItem.code); setDeleteItem(null); }} title="Delete Currency" description={`Delete ${deleteItem?.code} (${deleteItem?.name})?`} isLoading={deleteCurrency.isPending} />
    </div>
  );
}
