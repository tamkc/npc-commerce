"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api-client";
import { regionKeys } from "@/lib/query-key-factory";
import type {
  AdminRegion,
  AdminPaginatedResponse,
  CreateRegionPayload,
  UpdateRegionPayload,
} from "@/types";

export function useAdminRegions(params?: Record<string, string>) {
  return useQuery({
    queryKey: regionKeys.list(params),
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminRegion>>("/regions", params),
  });
}

export function useAdminRegion(id: string) {
  return useQuery({
    queryKey: regionKeys.detail(id),
    queryFn: () => adminApi.get<{ data: AdminRegion }>(`/regions/${id}`),
    enabled: !!id,
  });
}

export function useCreateRegion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRegionPayload) =>
      adminApi.post<{ data: AdminRegion }>("/regions", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: regionKeys.lists() });
      toast.success("Region created");
    },
    onError: () => {
      toast.error("Failed to create region");
    },
  });
}

export function useUpdateRegion(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRegionPayload) =>
      adminApi.put<{ data: AdminRegion }>(`/regions/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: regionKeys.lists() });
      qc.invalidateQueries({ queryKey: regionKeys.detail(id) });
      toast.success("Region updated");
    },
    onError: () => {
      toast.error("Failed to update region");
    },
  });
}

export function useDeleteRegion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/regions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: regionKeys.lists() });
      toast.success("Region deleted");
    },
    onError: () => {
      toast.error("Failed to delete region");
    },
  });
}
