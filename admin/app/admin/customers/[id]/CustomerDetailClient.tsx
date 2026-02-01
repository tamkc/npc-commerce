"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heading,
  Button,
  Input,
  Select,
  Badge,
  Container,
  ContainerHeader,
  ContainerBody,
  ConfirmDialog,
} from "@/components/admin/ui";
import {
  useAdminCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useAdminCustomerGroups,
} from "@/hooks/admin/use-admin-customers";
import { formatDate, getInitials } from "@/lib/admin/utils";
import { ArrowLeft, Trash2, Edit } from "lucide-react";

export default function CustomerDetailClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useAdminCustomer(id);
  const updateCustomer = useUpdateCustomer(id);
  const deleteCustomer = useDeleteCustomer();
  const { data: groupsData } = useAdminCustomerGroups();

  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [groupId, setGroupId] = useState("");

  const customer = data?.data;
  const groups = groupsData?.data ?? [];

  const startEdit = () => {
    if (!customer) return;
    setPhone(customer.phone || "");
    setGroupId(customer.customerGroupId || "");
    setEditing(true);
  };

  const handleSave = async () => {
    await updateCustomer.mutateAsync({
      phone: phone || undefined,
      customerGroupId: groupId || null,
    });
    setEditing(false);
  };

  if (isLoading) {
    return (
      <div className="h-64 animate-pulse rounded-xl bg-[var(--admin-bg-field-hover)]" />
    );
  }

  if (!customer) {
    return <p className="text-[var(--admin-fg-muted)]">Customer not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/customers")}
            className="rounded-lg p-1.5 text-[var(--admin-fg-muted)] transition-colors hover:bg-[var(--admin-bg-field-hover)]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--admin-tag-purple-bg)] text-sm font-semibold text-[var(--admin-tag-purple-fg)]">
              {getInitials(
                customer.user?.firstName || "C",
                customer.user?.lastName || "U",
              )}
            </div>
            <div>
              <Heading>
                {customer.user?.firstName} {customer.user?.lastName}
              </Heading>
              <p className="text-xs text-[var(--admin-fg-muted)]">
                {customer.user?.email} &middot; Joined{" "}
                {formatDate(customer.createdAt)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={startEdit}>
            <Edit className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Container>
          <ContainerHeader>
            <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
              Details
            </h2>
          </ContainerHeader>
          <ContainerBody>
            {editing ? (
              <div className="space-y-4">
                <Input
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                />
                <Select
                  label="Customer Group"
                  options={[
                    { value: "", label: "No group" },
                    ...groups.map((g) => ({ value: g.id, label: g.name })),
                  ]}
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    isLoading={updateCustomer.isPending}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[var(--admin-fg-muted)]">Phone</p>
                  <p className="text-sm">{customer.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--admin-fg-muted)]">Group</p>
                  {customer.customerGroup ? (
                    <Badge color="purple">
                      {customer.customerGroup.name}
                    </Badge>
                  ) : (
                    <p className="text-sm text-[var(--admin-fg-muted)]">
                      No group
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-[var(--admin-fg-muted)]">
                    Account Status
                  </p>
                  <Badge
                    color={customer.user?.isActive ? "green" : "red"}
                  >
                    {customer.user?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            )}
          </ContainerBody>
        </Container>

        <Container>
          <ContainerHeader>
            <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
              Addresses ({customer.addresses.length})
            </h2>
          </ContainerHeader>
          <ContainerBody>
            {customer.addresses.length === 0 ? (
              <p className="text-sm text-[var(--admin-fg-muted)]">
                No addresses
              </p>
            ) : (
              <div className="space-y-3">
                {customer.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="rounded-lg border border-[var(--admin-border-base)] p-3"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[var(--admin-fg-base)]">
                        {addr.label}
                      </p>
                      {addr.isDefault && (
                        <Badge color="blue" size="sm">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[var(--admin-fg-subtle)]">
                      {addr.firstName} {addr.lastName}
                    </p>
                    <p className="text-xs text-[var(--admin-fg-muted)]">
                      {addr.addressLine1}, {addr.city}, {addr.state}{" "}
                      {addr.postalCode}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ContainerBody>
        </Container>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await deleteCustomer.mutateAsync(id);
          router.push("/admin/customers");
        }}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This will remove all their data."
        confirmLabel="Delete"
        isLoading={deleteCustomer.isPending}
      />
    </div>
  );
}
