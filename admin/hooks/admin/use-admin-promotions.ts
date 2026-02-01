"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin/api-client";
import type {
  AdminPromotion,
  AdminPaginatedResponse,
  CreatePromotionPayload,
  UpdatePromotionPayload,
} from "@/types/admin";

export function useAdminPromotions(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin-promotions", params],
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminPromotion>>(
        "/promotions",
        params,
      ),
  });
}

export function useAdminPromotion(id: string) {
  return useQuery({
    queryKey: ["admin-promotion", id],
    queryFn: () => adminApi.get<{ data: AdminPromotion }>(`/promotions/${id}`),
    enabled: !!id,
  });
}

export function useCreatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePromotionPayload) =>
      adminApi.post<{ data: AdminPromotion }>("/promotions", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-promotions"] });
    },
  });
}

export function useUpdatePromotion(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePromotionPayload) =>
      adminApi.put<{ data: AdminPromotion }>(`/promotions/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-promotions"] });
      qc.invalidateQueries({ queryKey: ["admin-promotion", id] });
    },
  });
}

export function useDeletePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/promotions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-promotions"] });
    },
  });
}
