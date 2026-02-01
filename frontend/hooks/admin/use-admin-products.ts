"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin/api-client";
import type {
  AdminProduct,
  AdminPaginatedResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/types/admin";

export function useAdminProducts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin-products", params],
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminProduct>>("/products", params),
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => adminApi.get<{ data: AdminProduct }>(`/products/${id}`),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      adminApi.post<{ data: AdminProduct }>("/products", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProductPayload) =>
      adminApi.put<{ data: AdminProduct }>(`/products/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["admin-product", id] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}
