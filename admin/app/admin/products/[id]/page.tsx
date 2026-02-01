"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heading,
  Button,
  Input,
  Textarea,
  Select,
  Switch,
  StatusBadge,
  Container,
  ContainerHeader,
  ContainerBody,
  Table,
  ConfirmDialog,
  Badge,
  DropdownMenu,
} from "@/components/admin/ui";
import {
  useAdminProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/admin/use-admin-products";
import { formatCurrency, formatDate, slugify } from "@/lib/admin/utils";
import {
  ArrowLeft,
  MoreHorizontal,
  Trash2,
  Edit,
  Plus,
} from "lucide-react";
import type { AdminProductVariant, ProductStatus } from "@/types/admin";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useAdminProduct(id);
  const updateProduct = useUpdateProduct(id);
  const deleteProduct = useDeleteProduct();

  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProductStatus>("DRAFT");

  const product = data?.data;

  const startEditing = () => {
    if (!product) return;
    setTitle(product.title);
    setSlug(product.slug);
    setDescription(product.description || "");
    setStatus(product.status);
    setEditing(true);
  };

  const handleSave = async () => {
    await updateProduct.mutateAsync({ title, slug, description, status });
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteProduct.mutateAsync(id);
    router.push("/admin/products");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-[var(--admin-bg-field-hover)]" />
        <div className="h-64 animate-pulse rounded-xl bg-[var(--admin-bg-field-hover)]" />
      </div>
    );
  }

  if (!product) {
    return <p className="text-[var(--admin-fg-muted)]">Product not found.</p>;
  }

  const variantColumns = [
    {
      key: "title",
      header: "Variant",
      render: (v: AdminProductVariant) => (
        <span className="font-medium">{v.title}</span>
      ),
    },
    {
      key: "sku",
      header: "SKU",
      render: (v: AdminProductVariant) => (
        <span className="text-[var(--admin-fg-muted)]">{v.sku || "—"}</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (v: AdminProductVariant) => formatCurrency(Number(v.price)),
    },
    {
      key: "inventory",
      header: "Inventory",
      render: (v: AdminProductVariant) => (
        <Badge color={v.manageInventory ? "blue" : "neutral"}>
          {v.manageInventory ? "Tracked" : "Not tracked"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (v: AdminProductVariant) => (
        <span className="text-[var(--admin-fg-muted)]">
          {formatDate(v.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/products")}
            className="rounded-lg p-1.5 text-[var(--admin-fg-muted)] transition-colors hover:bg-[var(--admin-bg-field-hover)]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <Heading>{product.title}</Heading>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={product.status} />
              <span className="text-xs text-[var(--admin-fg-muted)]">
                Created {formatDate(product.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu
          trigger={
            <Button variant="secondary" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
          items={[
            {
              label: "Edit",
              onClick: startEditing,
              icon: <Edit className="h-3.5 w-3.5" />,
            },
            {
              label: "Delete",
              onClick: () => setDeleteOpen(true),
              icon: <Trash2 className="h-3.5 w-3.5" />,
              variant: "danger",
            },
          ]}
        />
      </div>

      {/* General Info */}
      <Container>
        <ContainerHeader>
          <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
            General Information
          </h2>
          {!editing && (
            <Button variant="ghost" size="sm" onClick={startEditing}>
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </ContainerHeader>
        <ContainerBody>
          {editing ? (
            <div className="space-y-4">
              <Input
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                label="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <Select
                label="Status"
                options={[
                  { value: "DRAFT", label: "Draft" },
                  { value: "PUBLISHED", label: "Published" },
                  { value: "ARCHIVED", label: "Archived" },
                ]}
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
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
                  isLoading={updateProduct.isPending}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--admin-fg-muted)]">Slug</p>
                <p className="text-sm text-[var(--admin-fg-base)]">
                  {product.slug}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--admin-fg-muted)]">Handle</p>
                <p className="text-sm text-[var(--admin-fg-base)]">
                  {product.handle || "—"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-[var(--admin-fg-muted)]">
                  Description
                </p>
                <p className="text-sm text-[var(--admin-fg-base)]">
                  {product.description || "No description"}
                </p>
              </div>
            </div>
          )}
        </ContainerBody>
      </Container>

      {/* Variants */}
      <Container>
        <ContainerHeader>
          <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
            Variants ({product.variants.length})
          </h2>
          <Button variant="secondary" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Add Variant
          </Button>
        </ContainerHeader>
        <Table
          columns={variantColumns}
          data={product.variants}
          emptyMessage="No variants"
        />
      </Container>

      {/* Categories & Tags */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Container>
          <ContainerHeader>
            <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
              Categories
            </h2>
          </ContainerHeader>
          <ContainerBody>
            {product.categories.length === 0 ? (
              <p className="text-sm text-[var(--admin-fg-muted)]">
                No categories assigned
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {product.categories.map((cat) => (
                  <Badge key={cat.id} color="blue">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            )}
          </ContainerBody>
        </Container>

        <Container>
          <ContainerHeader>
            <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
              Tags
            </h2>
          </ContainerHeader>
          <ContainerBody>
            {product.tags.length === 0 ? (
              <p className="text-sm text-[var(--admin-fg-muted)]">No tags</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <Badge key={tag.id} color="purple">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </ContainerBody>
        </Container>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
}
