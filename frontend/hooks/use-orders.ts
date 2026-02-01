import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Order, PaginatedResponse, ApiResponse } from "@/types";

export function useOrders(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () =>
      apiClient.get<PaginatedResponse<Order>>("/store/orders", {
        page: String(page),
        limit: String(limit),
      }),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => apiClient.get<ApiResponse<Order>>(`/store/orders/${id}`),
    enabled: !!id,
  });
}
