"use client";

import { useState } from "react";
import {
  Heading,
  Subheading,
  Button,
  Table,
  SearchInput,
  Pagination,
  Badge,
  Container,
  Modal,
  Input,
  Textarea,
  Switch,
  ConfirmDialog,
} from "@/components/admin/ui";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/admin/use-admin-categories";
import { slugify, formatDate } from "@/lib/admin/utils";
import { Plus, Trash2, Edit } from "lucide-react";
import type { AdminCategory } from "@/types/admin";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminCategory | null>(null);
  const [deleteItem, setDeleteItem] = useState<AdminCategory | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const params: Record<string, string> = { page: String(page), limit: "20" };
  if (search) params.search = search;

  const { data, isLoading } = useAdminCategories(params);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(editItem?.id ?? "");
  const deleteCategory = useDeleteCategory();

  const categories = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setIsActive(true);
  };

  const openEdit = (cat: AdminCategory) => {
    setEditItem(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setIsActive(cat.isActive);
  };

  const handleCreate = async () => {
    await createCategory.mutateAsync({ name, slug, description, isActive });
    setCreateOpen(false);
    resetForm();
  };

  const handleUpdate = async () => {
    await updateCategory.mutateAsync({ name, slug, description, isActive });
    setEditItem(null);
    resetForm();
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (c: AdminCategory) => (
        <span className="font-medium text-[var(--admin-fg-base)]">
          {c.name}
        </span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (c: AdminCategory) => (
        <span className="text-[var(--admin-fg-muted)]">{c.slug}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (c: AdminCategory) => (
        <Badge color={c.isActive ? "green" : "neutral"}>
          {c.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "position",
      header: "Position",
      render: (c: AdminCategory) => String(c.position),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (c: AdminCategory) => (
        <span className="text-[var(--admin-fg-muted)]">
          {formatDate(c.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (c: AdminCategory) => (
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(c);
            }}
            className="rounded p-1 text-[var(--admin-fg-muted)] hover:bg-[var(--admin-bg-field-hover)]"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteItem(c);
            }}
            className="rounded p-1 text-[var(--admin-fg-error)] hover:bg-[var(--admin-tag-red-bg)]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Categories</Heading>
          <Subheading>Organize products into categories</Subheading>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Container>
        <div className="p-4">
          <SearchInput
            placeholder="Search categories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
        </div>
        <Table
          columns={columns}
          data={categories}
          isLoading={isLoading}
          emptyMessage="No categories found"
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Container>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          resetForm();
        }}
        title="Create Category"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setCreateOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreate} isLoading={createCategory.isPending}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(slugify(e.target.value));
            }}
            required
          />
          <Input
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Switch checked={isActive} onChange={setIsActive} label="Active" />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editItem}
        onClose={() => { setEditItem(null); resetForm(); }}
        title="Edit Category"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setEditItem(null); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} isLoading={updateCategory.isPending}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Switch checked={isActive} onChange={setIsActive} label="Active" />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={async () => {
          if (deleteItem) await deleteCategory.mutateAsync(deleteItem.id);
          setDeleteItem(null);
        }}
        title="Delete Category"
        description={`Delete "${deleteItem?.name}"? Products will be unlinked.`}
        confirmLabel="Delete"
        isLoading={deleteCategory.isPending}
      />
    </div>
  );
}
