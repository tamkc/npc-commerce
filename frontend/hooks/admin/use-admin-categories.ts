"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin/api-client";
import type {
  AdminCategory,
  AdminPaginatedResponse,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/admin";

export function useAdminCategories(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin-categories", params],
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminCategory>>(
        "/categories",
        params,
      ),
  });
}

export function useAdminCategory(id: string) {
  return useQuery({
    queryKey: ["admin-category", id],
    queryFn: () =>
      adminApi.get<{ data: AdminCategory }>(`/categories/${id}`),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      adminApi.post<{ data: AdminCategory }>("/categories", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });
}

export function useUpdateCategory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCategoryPayload) =>
      adminApi.put<{ data: AdminCategory }>(`/categories/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["admin-category", id] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });
}
