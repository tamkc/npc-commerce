"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SemanticSearchBar } from "@/components/ai/SemanticSearchBar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useProducts } from "@/hooks/use-products";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/Skeleton";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useProducts({
    search: debouncedQuery || undefined,
    limit: 12,
  });

  const products = data?.data ?? [];

  return (
    <>
      <div className="mt-6 max-w-xl">
        <SemanticSearchBar />
      </div>

      {/* Fallback text search */}
      <div className="mt-4 max-w-xl">
        <input
          type="text"
          placeholder="Or search by keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
        />
      </div>

      <div className="mt-8">
        {debouncedQuery ? (
          <ProductGrid products={products} isLoading={isLoading} />
        ) : (
          <p className="py-16 text-center text-zinc-500 dark:text-zinc-400">
            Use the search bar above to find products.
          </p>
        )}
      </div>
    </>
  );
}

function SearchFallback() {
  return (
    <>
      <div className="mt-6 max-w-xl">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="mt-4 max-w-xl">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Search" }]} />

      <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
        Search Products
      </h1>

      <Suspense fallback={<SearchFallback />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
