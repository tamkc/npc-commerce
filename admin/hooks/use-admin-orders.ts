"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api-client";
import { orderKeys } from "@/lib/query-key-factory";
import type {
  AdminOrder,
  AdminOrderNote,
  AdminPaginatedResponse,
  OrderStatus,
} from "@/types";

export function useAdminOrders(params?: Record<string, string>) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminOrder>>("/orders", params),
  });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
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
      qc.invalidateQueries({ queryKey: orderKeys.lists() });
      qc.invalidateQueries({ queryKey: orderKeys.detail(id) });
      toast.success("Order status updated");
    },
    onError: () => {
      toast.error("Failed to update order status");
    },
  });
}

export function useCancelOrder(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => adminApi.post(`/orders/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.lists() });
      qc.invalidateQueries({ queryKey: orderKeys.detail(id) });
      toast.success("Order cancelled");
    },
    onError: () => {
      toast.error("Failed to cancel order");
    },
  });
}

export function useAddOrderNote(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { content: string; isPrivate?: boolean }) =>
      adminApi.post<{ data: AdminOrderNote }>(`/orders/${id}/notes`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(id) });
      toast.success("Note added");
    },
    onError: () => {
      toast.error("Failed to add note");
    },
  });
}

export function useOrderNotes(id: string) {
  return useQuery({
    queryKey: [...orderKeys.detail(id), "notes"] as const,
    queryFn: () =>
      adminApi.get<{ data: AdminOrderNote[] }>(`/orders/${id}/notes`),
    enabled: !!id,
  });
}
