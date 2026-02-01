"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api-client";
import { inventoryKeys } from "@/lib/query-key-factory";
import type {
  AdminInventoryLevel,
  AdminPaginatedResponse,
  CreateInventoryPayload,
  UpdateInventoryPayload,
} from "@/types";

export function useAdminInventory(params?: Record<string, string>) {
  return useQuery({
    queryKey: inventoryKeys.list(params),
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminInventoryLevel>>(
        "/inventory",
        params,
      ),
  });
}

export function useAdminLowStock() {
  return useQuery({
    queryKey: [...inventoryKeys.all, "low-stock"] as const,
    queryFn: () =>
      adminApi.get<{ data: AdminInventoryLevel[] }>("/inventory/low-stock"),
  });
}

export function useAdminInventoryItem(id: string) {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
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
      qc.invalidateQueries({ queryKey: inventoryKeys.lists() });
      toast.success("Inventory level created");
    },
    onError: () => {
      toast.error("Failed to create inventory level");
    },
  });
}

export function useUpdateInventory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateInventoryPayload) =>
      adminApi.put<{ data: AdminInventoryLevel }>(`/inventory/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.lists() });
      qc.invalidateQueries({ queryKey: inventoryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: [...inventoryKeys.all, "low-stock"] });
      toast.success("Inventory updated");
    },
    onError: () => {
      toast.error("Failed to update inventory");
    },
  });
}

export function useDeleteInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/inventory/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.lists() });
      qc.invalidateQueries({ queryKey: [...inventoryKeys.all, "low-stock"] });
      toast.success("Inventory level deleted");
    },
    onError: () => {
      toast.error("Failed to delete inventory level");
    },
  });
}
