"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin/api-client";
import type {
  AdminInventoryLevel,
  AdminPaginatedResponse,
  CreateInventoryPayload,
  UpdateInventoryPayload,
} from "@/types/admin";

export function useAdminInventory(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin-inventory", params],
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminInventoryLevel>>(
        "/inventory",
        params,
      ),
  });
}

export function useAdminLowStock() {
  return useQuery({
    queryKey: ["admin-low-stock"],
    queryFn: () =>
      adminApi.get<{ data: AdminInventoryLevel[] }>("/inventory/low-stock"),
  });
}

export function useAdminInventoryItem(id: string) {
  return useQuery({
    queryKey: ["admin-inventory-item", id],
    queryFn: () =>
      adminApi.get<{ data: AdminInventoryLevel }>(`/inventory/${id}`),
    enabled: !!id,
  });
}

export function useCreateInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInventoryPayload) =>
      adminApi.post<{ data: AdminInventoryLevel }>("/inventory", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inventory"] });
    },
  });
}

export function useUpdateInventory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateInventoryPayload) =>
      adminApi.put<{ data: AdminInventoryLevel }>(`/inventory/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inventory"] });
      qc.invalidateQueries({ queryKey: ["admin-inventory-item", id] });
      qc.invalidateQueries({ queryKey: ["admin-low-stock"] });
    },
  });
}

export function useDeleteInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/inventory/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-inventory"] });
      qc.invalidateQueries({ queryKey: ["admin-low-stock"] });
    },
  });
}
