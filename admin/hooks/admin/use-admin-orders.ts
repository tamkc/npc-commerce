"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin/api-client";
import type {
  AdminOrder,
  AdminOrderNote,
  AdminPaginatedResponse,
  OrderStatus,
} from "@/types/admin";

export function useAdminOrders(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminOrder>>("/orders", params),
  });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => adminApi.get<{ data: AdminOrder }>(`/orders/${id}`),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: OrderStatus) =>
      adminApi.put(`/orders/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["admin-order", id] });
    },
  });
}

export function useCancelOrder(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => adminApi.post(`/orders/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["admin-order", id] });
    },
  });
}

export function useAddOrderNote(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { content: string; isPrivate?: boolean }) =>
      adminApi.post<{ data: AdminOrderNote }>(`/orders/${id}/notes`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-order", id] });
    },
  });
}

export function useOrderNotes(id: string) {
  return useQuery({
    queryKey: ["admin-order-notes", id],
    queryFn: () =>
      adminApi.get<{ data: AdminOrderNote[] }>(`/orders/${id}/notes`),
    enabled: !!id,
  });
}
