import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Order, PaginatedResponse } from '@/types';

export function useOrders(params: { page?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  const path = `/store/orders${qs ? `?${qs}` : ''}`;

  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => api.get<PaginatedResponse<Order>>(path),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get<Order>(`/store/orders/${id}`),
    enabled: !!id,
  });
}
