"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api-client";
import { productKeys } from "@/lib/query-key-factory";
import type {
  AdminProduct,
  AdminPaginatedResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/types";

export function useAdminProducts(params?: Record<string, string>) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminProduct>>("/products", params),
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
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
      qc.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success("Product created");
    },
    onError: () => {
      toast.error("Failed to create product");
    },
  });
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProductPayload) =>
      adminApi.put<{ data: AdminProduct }>(`/products/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.lists() });
      qc.invalidateQueries({ queryKey: productKeys.detail(id) });
      toast.success("Product updated");
    },
    onError: () => {
      toast.error("Failed to update product");
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success("Product deleted");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });
}
