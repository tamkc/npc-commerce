"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heading,
  Button,
  Input,
  Textarea,
  Select,
  Switch,
  Container,
  ContainerHeader,
  ContainerBody,
} from "@/components/admin/ui";
import { useCreateProduct } from "@/hooks/admin/use-admin-products";
import { slugify } from "@/lib/admin/utils";
import { ArrowLeft } from "lucide-react";
import type { ProductStatus } from "@/types/admin";

export default function CreateProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState<ProductStatus>("DRAFT");
  const [isGiftCard, setIsGiftCard] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (autoSlug) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createProduct.mutateAsync({
        title,
        slug,
        description: description || undefined,
        handle: handle || undefined,
        status,
        isGiftCard,
      });
      router.push(`/admin/products/${result.data.id}`);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-1.5 text-[var(--admin-fg-muted)] transition-colors hover:bg-[var(--admin-bg-field-hover)]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Heading>Create Product</Heading>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Container>
          <ContainerHeader>
            <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
              General Information
            </h2>
          </ContainerHeader>
          <ContainerBody className="space-y-4">
            <Input
              label="Title"
              placeholder="Winter Jacket"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
            <Input
              label="Slug"
              placeholder="winter-jacket"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setAutoSlug(false);
              }}
              hint="URL-friendly identifier"
              required
            />
            <Input
              label="Handle"
              placeholder="winter-jacket-2024"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              hint="Optional unique handle"
            />
            <Textarea
              label="Description"
              placeholder="Describe this product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </ContainerBody>
        </Container>

        <Container>
          <ContainerHeader>
            <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
              Organization
            </h2>
          </ContainerHeader>
          <ContainerBody className="space-y-4">
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
            <Switch
              checked={isGiftCard}
              onChange={setIsGiftCard}
              label="Gift Card"
              description="This product is a gift card"
            />
          </ContainerBody>
        </Container>

        <div className="flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            type="button"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={createProduct.isPending}>
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}
