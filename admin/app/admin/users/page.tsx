"use client";

import { useState } from "react";
import {
  Heading, Subheading, Button, Table, Badge, Container, Modal, Input, Select, ConfirmDialog,
} from "@/components/admin/ui";
import { useAdminUsers, useCreateUser, useDeleteUser } from "@/hooks/admin/use-admin-settings";
import { formatDate } from "@/lib/admin/utils";
import { Plus, Trash2 } from "lucide-react";
import type { AdminUser, UserRole } from "@/types/admin";

export default function UsersPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(""); const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<UserRole>("ADMIN");

  const { data, isLoading } = useAdminUsers();
  const create = useCreateUser(); const del = useDeleteUser();
  const users = data?.data ?? [];

  const columns = [
    { key: "name", header: "User", render: (u: AdminUser) => (
      <div><p className="font-medium text-[var(--admin-fg-base)]">{u.firstName} {u.lastName}</p><p className="text-xs text-[var(--admin-fg-muted)]">{u.email}</p></div>
    )},
    { key: "role", header: "Role", render: (u: AdminUser) => <Badge color={u.role === "ADMIN" ? "purple" : "blue"}>{u.role}</Badge> },
    { key: "status", header: "Status", render: (u: AdminUser) => <Badge color={u.isActive ? "green" : "neutral"}>{u.isActive ? "Active" : "Inactive"}</Badge> },
    { key: "lastLogin", header: "Last Login", render: (u: AdminUser) => <span className="text-[var(--admin-fg-muted)]">{u.lastLoginAt ? formatDate(u.lastLoginAt) : "Never"}</span> },
    { key: "createdAt", header: "Created", render: (u: AdminUser) => <span className="text-[var(--admin-fg-muted)]">{formatDate(u.createdAt)}</span> },
    { key: "actions", header: "", className: "w-12", render: (u: AdminUser) => <button onClick={(e) => { e.stopPropagation(); setDeleteItem(u); }} className="rounded p-1 text-[var(--admin-fg-error)] hover:bg-[var(--admin-tag-red-bg)]"><Trash2 className="h-3.5 w-3.5" /></button> },
  ];

  const handleCreate = async () => {
    await create.mutateAsync({ email, password, firstName, lastName, role });
    setCreateOpen(false); setEmail(""); setPassword(""); setFirstName(""); setLastName("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><Heading>Users</Heading><Subheading>Manage admin users</Subheading></div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" />Add User</Button>
      </div>
      <Container><Table columns={columns} data={users} isLoading={isLoading} emptyMessage="No users" /></Container>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add User" footer={<><Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} isLoading={create.isPending}>Create</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Select label="Role" options={[{ value: "ADMIN", label: "Admin" }, { value: "CUSTOMER", label: "Customer" }]} value={role} onChange={(e) => setRole(e.target.value as UserRole)} />
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={async () => { if (deleteItem) await del.mutateAsync(deleteItem.id); setDeleteItem(null); }} title="Delete User" description={`Delete ${deleteItem?.firstName} ${deleteItem?.lastName} (${deleteItem?.email})?`} isLoading={del.isPending} />
    </div>
  );
}
