import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Product, PaginatedResponse, ApiResponse, ProductFilters } from "@/types";
import { PAGINATION } from "@/lib/constants";

export function useProducts(filters: ProductFilters = {}) {
  const params: Record<string, string> = {};

  if (filters.search) params.search = filters.search;
  if (filters.categoryId) params.categoryId = filters.categoryId;
  if (filters.minPrice !== undefined) params.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== undefined) params.maxPrice = String(filters.maxPrice);
  if (filters.sortBy) params.sortBy = filters.sortBy;
  params.page = String(filters.page ?? PAGINATION.DEFAULT_PAGE);
  params.limit = String(filters.limit ?? PAGINATION.DEFAULT_LIMIT);

  return useQuery({
    queryKey: ["products", params],
    queryFn: () =>
      apiClient.get<PaginatedResponse<Product>>("/store/products", params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      apiClient.get<ApiResponse<Product>>(`/store/products/${id}`),
    enabled: !!id,
  });
}
