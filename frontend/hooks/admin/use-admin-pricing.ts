"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin/api-client";
import type {
  AdminPriceList,
  AdminPaginatedResponse,
  CreatePriceListPayload,
  UpdatePriceListPayload,
} from "@/types/admin";

export function useAdminPriceLists(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin-price-lists", params],
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminPriceList>>(
        "/pricing/price-lists",
        params,
      ),
  });
}

export function useAdminPriceList(id: string) {
  return useQuery({
    queryKey: ["admin-price-list", id],
    queryFn: () =>
      adminApi.get<{ data: AdminPriceList }>(`/pricing/price-lists/${id}`),
    enabled: !!id,
  });
}

export function useCreatePriceList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePriceListPayload) =>
      adminApi.post<{ data: AdminPriceList }>("/pricing/price-lists", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-price-lists"] });
    },
  });
}

export function useUpdatePriceList(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePriceListPayload) =>
      adminApi.put<{ data: AdminPriceList }>(
        `/pricing/price-lists/${id}`,
        payload,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-price-lists"] });
      qc.invalidateQueries({ queryKey: ["admin-price-list", id] });
    },
  });
}

export function useDeletePriceList() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminApi.delete(`/pricing/price-lists/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-price-lists"] });
    },
  });
}

export function useAddPriceListPrices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      priceListId: string;
      prices: { variantId: string; currencyCode: string; amount: number; minQuantity?: number }[];
    }) => adminApi.post("/pricing/price-lists/prices", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-price-lists"] });
    },
  });
}
