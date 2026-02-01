"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api-client";
import { promotionKeys } from "@/lib/query-key-factory";
import type {
  AdminPromotion,
  AdminPaginatedResponse,
  CreatePromotionPayload,
  UpdatePromotionPayload,
} from "@/types";

export function useAdminPromotions(params?: Record<string, string>) {
  return useQuery({
    queryKey: promotionKeys.list(params),
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminPromotion>>(
        "/promotions",
        params,
      ),
  });
}

export function useAdminPromotion(id: string) {
  return useQuery({
    queryKey: promotionKeys.detail(id),
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
      qc.invalidateQueries({ queryKey: promotionKeys.lists() });
      toast.success("Promotion created");
    },
    onError: () => {
      toast.error("Failed to create promotion");
    },
  });
}

export function useUpdatePromotion(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePromotionPayload) =>
      adminApi.put<{ data: AdminPromotion }>(`/promotions/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: promotionKeys.lists() });
      qc.invalidateQueries({ queryKey: promotionKeys.detail(id) });
      toast.success("Promotion updated");
    },
    onError: () => {
      toast.error("Failed to update promotion");
    },
  });
}

export function useDeletePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/promotions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: promotionKeys.lists() });
      toast.success("Promotion deleted");
    },
    onError: () => {
      toast.error("Failed to delete promotion");
    },
  });
}
