"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api-client";
import { categoryKeys } from "@/lib/query-key-factory";
import type {
  AdminCategory,
  AdminPaginatedResponse,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types";

export function useAdminCategories(params?: Record<string, string>) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminCategory>>(
        "/categories",
        params,
      ),
  });
}

export function useAdminCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => adminApi.get<{ data: AdminCategory }>(`/categories/${id}`),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      adminApi.post<{ data: AdminCategory }>("/categories", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Category created");
    },
    onError: () => {
      toast.error("Failed to create category");
    },
  });
}

export function useUpdateCategory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCategoryPayload) =>
      adminApi.put<{ data: AdminCategory }>(`/categories/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.lists() });
      qc.invalidateQueries({ queryKey: categoryKeys.detail(id) });
      toast.success("Category updated");
    },
    onError: () => {
      toast.error("Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("Category deleted");
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });
}
