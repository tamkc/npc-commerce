"use client";

import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import type { ProductFilters as ProductFiltersType } from "@/types";

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFilterChange: (filters: Partial<ProductFiltersType>) => void;
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "title_asc", label: "Name: A-Z" },
  { value: "title_desc", label: "Name: Z-A" },
];

export function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="w-full sm:w-48">
        <Input
          label="Search"
          placeholder="Search products..."
          value={filters.search ?? ""}
          onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
        />
      </div>

      <div className="w-full sm:w-36">
        <Input
          label="Min Price"
          type="number"
          placeholder="0"
          min={0}
          value={filters.minPrice ?? ""}
          onChange={(e) =>
            onFilterChange({
              minPrice: e.target.value ? Number(e.target.value) : undefined,
              page: 1,
            })
          }
        />
      </div>

      <div className="w-full sm:w-36">
        <Input
          label="Max Price"
          type="number"
          placeholder="Any"
          min={0}
          value={filters.maxPrice ?? ""}
          onChange={(e) =>
            onFilterChange({
              maxPrice: e.target.value ? Number(e.target.value) : undefined,
              page: 1,
            })
          }
        />
      </div>

      <div className="w-full sm:w-48">
        <Select
          label="Sort By"
          options={sortOptions}
          value={filters.sortBy ?? "newest"}
          onChange={(e) =>
            onFilterChange({
              sortBy: e.target.value as ProductFiltersType["sortBy"],
            })
          }
        />
      </div>
    </div>
  );
}
