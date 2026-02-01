"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api-client";
import { pricingKeys } from "@/lib/query-key-factory";
import type {
  AdminPriceList,
  AdminPaginatedResponse,
  CreatePriceListPayload,
  UpdatePriceListPayload,
} from "@/types";

export function useAdminPriceLists(params?: Record<string, string>) {
  return useQuery({
    queryKey: pricingKeys.list(params),
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminPriceList>>(
        "/price-lists",
        params,
      ),
  });
}

export function useAdminPriceList(id: string) {
  return useQuery({
    queryKey: pricingKeys.detail(id),
    queryFn: () => adminApi.get<{ data: AdminPriceList }>(`/price-lists/${id}`),
    enabled: !!id,
  });
}

export function useCreatePriceList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePriceListPayload) =>
      adminApi.post<{ data: AdminPriceList }>("/price-lists", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.lists() });
      toast.success("Price list created");
    },
    onError: () => {
      toast.error("Failed to create price list");
    },
  });
}

export function useUpdatePriceList(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePriceListPayload) =>
      adminApi.put<{ data: AdminPriceList }>(`/price-lists/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.lists() });
      qc.invalidateQueries({ queryKey: pricingKeys.detail(id) });
      toast.success("Price list updated");
    },
    onError: () => {
      toast.error("Failed to update price list");
    },
  });
}

export function useDeletePriceList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/price-lists/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pricingKeys.lists() });
      toast.success("Price list deleted");
    },
    onError: () => {
      toast.error("Failed to delete price list");
    },
  });
}
