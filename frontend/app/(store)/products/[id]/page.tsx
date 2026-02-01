"use client";

import { use, useState } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGallery } from "@/components/products/ProductGallery";
import { VariantSelector } from "@/components/products/VariantSelector";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProduct } from "@/hooks/use-products";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { toast } from "@/components/ui/Toast";
import { ProductReviews } from "@/components/products/ProductReviews";
import { RecommendationCarousel } from "@/components/ai/RecommendationCarousel";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useProduct(id);
  const product = data?.data;

  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { addItem, isLoading: cartLoading } = useCartStore();

  const selectedVariant =
    product?.variants.find((v) => v.id === selectedVariantId) ??
    product?.variants[0];

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    try {
      await addItem(selectedVariant.id, quantity);
      toast("Added to cart", "success");
    } catch {
      toast("Failed to add to cart", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-4 h-5 w-48" />
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg text-zinc-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Products", href: "/products" },
          { label: product.title },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <ProductGallery images={product.images} />

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {product.title}
          </h1>

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">
              {formatPrice(selectedVariant?.price ?? 0)}
            </span>
            {selectedVariant?.compareAtPrice &&
              selectedVariant.compareAtPrice > selectedVariant.price && (
                <span className="text-lg text-zinc-400 line-through">
                  {formatPrice(selectedVariant.compareAtPrice)}
                </span>
              )}
          </div>

          {/* Stock */}
          <div className="mt-3">
            {selectedVariant && selectedVariant.inventoryQuantity > 0 ? (
              <Badge variant="success">In stock</Badge>
            ) : (
              <Badge variant="danger">Out of stock</Badge>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 text-zinc-600 dark:text-zinc-400">
            {product.description}
          </p>

          {/* Variant Selector */}
          <div className="mt-6">
            <VariantSelector
              variants={product.variants}
              selectedVariantId={
                selectedVariantId || product.variants[0]?.id || ""
              }
              onSelect={setSelectedVariantId}
            />
          </div>

          {/* Quantity & Add to Cart */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[40px] text-center text-sm font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              onClick={handleAddToCart}
              isLoading={cartLoading}
              disabled={
                !selectedVariant || selectedVariant.inventoryQuantity <= 0
              }
              className="flex-1"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag.id}>{tag.name}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <ProductReviews productId={id} />
      </div>

      {/* Recommendations */}
      <div className="mt-16">
        <RecommendationCarousel
          productId={id}
          title="You Might Also Like"
        />
      </div>
    </div>
  );
}
