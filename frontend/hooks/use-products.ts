import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Product, ProductQueryParams, PaginatedResponse } from '@/types';

export function useProducts(params: ProductQueryParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.categoryId) query.set('categoryId', params.categoryId);
  if (params.tag) query.set('tag', params.tag);

  const qs = query.toString();
  const path = `/store/products${qs ? `?${qs}` : ''}`;

  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.get<PaginatedResponse<Product>>(path),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get<Product>(`/store/products/${slug}`),
    enabled: !!slug,
  });
}
