"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin/api-client";
import type {
  AdminRegion,
  AdminPaginatedResponse,
  CreateRegionPayload,
  UpdateRegionPayload,
} from "@/types/admin";

export function useAdminRegions(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin-regions", params],
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminRegion>>("/regions", params),
  });
}

export function useAdminRegion(id: string) {
  return useQuery({
    queryKey: ["admin-region", id],
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
      qc.invalidateQueries({ queryKey: ["admin-regions"] });
    },
  });
}

export function useUpdateRegion(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRegionPayload) =>
      adminApi.patch<{ data: AdminRegion }>(`/regions/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-regions"] });
      qc.invalidateQueries({ queryKey: ["admin-region", id] });
    },
  });
}

export function useDeleteRegion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/regions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-regions"] });
    },
  });
}
