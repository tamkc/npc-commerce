"use client";

import { useState } from "react";
import {
  Heading,
  Subheading,
  Button,
  Table,
  Tabs,
  SearchInput,
  Pagination,
  Badge,
  Container,
  Modal,
  Input,
  Select,
} from "@/components/admin/ui";
import {
  useAdminInventory,
  useAdminLowStock,
  useCreateInventory,
  useUpdateInventory,
} from "@/hooks/admin/use-admin-inventory";
import { useAdminStockLocations } from "@/hooks/admin/use-admin-settings";
import { Plus } from "lucide-react";
import type { AdminInventoryLevel } from "@/types/admin";

export default function InventoryPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminInventoryLevel | null>(null);

  // Form state
  const [variantId, setVariantId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [onHand, setOnHand] = useState("");
  const [threshold, setThreshold] = useState("");

  const params: Record<string, string> = { page: String(page), limit: "20" };
  if (search) params.search = search;

  const { data: inventoryData, isLoading } =
    tab === "low-stock"
      ? { data: undefined, isLoading: false }
      : useAdminInventory(params);
  const { data: lowStockData, isLoading: lowStockLoading } = useAdminLowStock();
  const { data: locationsData } = useAdminStockLocations();
  const createInventory = useCreateInventory();
  const updateInventory = useUpdateInventory(editItem?.id ?? "");

  const isLowStock = tab === "low-stock";
  const items = isLowStock
    ? (lowStockData?.data ?? [])
    : (inventoryData?.data ?? []);
  const totalPages = isLowStock ? 1 : (inventoryData?.totalPages ?? 1);
  const locations = locationsData?.data ?? [];

  const columns = [
    {
      key: "variant",
      header: "Variant",
      render: (item: AdminInventoryLevel) => (
        <span className="font-medium text-[var(--admin-fg-base)]">
          {item.variant?.title ?? item.variantId}
        </span>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (item: AdminInventoryLevel) => (
        <span className="text-[var(--admin-fg-subtle)]">
          {item.stockLocation?.name ?? item.stockLocationId}
        </span>
      ),
    },
    {
      key: "onHand",
      header: "On Hand",
      render: (item: AdminInventoryLevel) => String(item.onHand),
    },
    {
      key: "reserved",
      header: "Reserved",
      render: (item: AdminInventoryLevel) => String(item.reserved),
    },
    {
      key: "available",
      header: "Available",
      render: (item: AdminInventoryLevel) => (
        <span
          className={
            item.lowStockThreshold && item.available <= item.lowStockThreshold
              ? "font-medium text-[var(--admin-fg-error)]"
              : ""
          }
        >
          {item.available}
        </span>
      ),
    },
    {
      key: "threshold",
      header: "Threshold",
      render: (item: AdminInventoryLevel) => (
        <span className="text-[var(--admin-fg-muted)]">
          {item.lowStockThreshold ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: AdminInventoryLevel) => {
        if (item.available <= 0)
          return <Badge color="red">Out of Stock</Badge>;
        if (
          item.lowStockThreshold &&
          item.available <= item.lowStockThreshold
        )
          return <Badge color="orange">Low Stock</Badge>;
        return <Badge color="green">In Stock</Badge>;
      },
    },
  ];

  const handleCreate = async () => {
    await createInventory.mutateAsync({
      variantId,
      stockLocationId: locationId,
      onHand: Number(onHand),
      lowStockThreshold: threshold ? Number(threshold) : undefined,
    });
    setCreateOpen(false);
    resetForm();
  };

  const handleUpdate = async () => {
    if (!editItem) return;
    await updateInventory.mutateAsync({
      onHand: Number(onHand),
      lowStockThreshold: threshold ? Number(threshold) : undefined,
    });
    setEditItem(null);
    resetForm();
  };

  const resetForm = () => {
    setVariantId("");
    setLocationId("");
    setOnHand("");
    setThreshold("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Inventory</Heading>
          <Subheading>Track and manage stock levels</Subheading>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Inventory
        </Button>
      </div>

      <Container>
        <div className="p-4">
          <SearchInput
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
        </div>
        <Tabs
          tabs={[
            { value: "all", label: "All" },
            {
              value: "low-stock",
              label: "Low Stock",
              count: lowStockData?.data?.length,
            },
          ]}
          value={tab}
          onChange={(v) => {
            setTab(v);
            setPage(1);
          }}
        />
        <Table
          columns={columns}
          data={items}
          isLoading={isLowStock ? lowStockLoading : isLoading}
          onRowClick={(item) => {
            setEditItem(item);
            setOnHand(String(item.onHand));
            setThreshold(item.lowStockThreshold ? String(item.lowStockThreshold) : "");
          }}
          emptyMessage="No inventory records"
        />
        {!isLowStock && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </Container>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          resetForm();
        }}
        title="Add Inventory"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setCreateOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} isLoading={createInventory.isPending}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Variant ID"
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            placeholder="Enter variant ID"
            required
          />
          <Select
            label="Stock Location"
            options={locations.map((l) => ({ value: l.id, label: l.name }))}
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            placeholder="Select location"
          />
          <Input
            label="On Hand"
            type="number"
            value={onHand}
            onChange={(e) => setOnHand(e.target.value)}
            placeholder="0"
            required
          />
          <Input
            label="Low Stock Threshold"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="Optional"
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editItem}
        onClose={() => {
          setEditItem(null);
          resetForm();
        }}
        title="Update Inventory"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setEditItem(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} isLoading={updateInventory.isPending}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="On Hand"
            type="number"
            value={onHand}
            onChange={(e) => setOnHand(e.target.value)}
          />
          <Input
            label="Low Stock Threshold"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="Optional"
          />
        </div>
      </Modal>
    </div>
  );
}
