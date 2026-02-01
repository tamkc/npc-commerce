import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const defaultVariant = product.variants[0];
  const price = defaultVariant?.price ?? 0;
  const compareAtPrice = defaultVariant?.compareAtPrice;
  const isOnSale = compareAtPrice && compareAtPrice > price;

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">
            No image
          </div>
        )}
        {isOnSale && (
          <Badge variant="danger" className="absolute left-3 top-3">
            Sale
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-zinc-900 line-clamp-2 dark:text-white">
          {product.title}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-semibold text-zinc-900 dark:text-white">
            {formatPrice(price)}
          </span>
          {isOnSale && (
            <span className="text-sm text-zinc-400 line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
