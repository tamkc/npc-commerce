"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useProducts } from "@/hooks/use-products";
import { useDebounce } from "@/hooks/use-debounce";
import type { ProductFilters as ProductFiltersType } from "@/types";

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFiltersType>({
    page: 1,
    limit: 12,
    sortBy: "newest",
  });

  const debouncedSearch = useDebounce(filters.search, 300);
  const queryFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading } = useProducts(queryFilters);
  const products = data?.data ?? [];
  const meta = data?.meta;

  const handleFilterChange = (partial: Partial<ProductFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Products" }]} />

      <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
        Products
      </h1>

      <div className="mt-6">
        <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>

      <div className="mt-8">
        <ProductGrid products={products} isLoading={isLoading} />
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={(page) => handleFilterChange({ page })}
          />
        </div>
      )}
    </div>
  );
}
