"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin/api-client";
import type {
  AdminCustomer,
  AdminCustomerGroup,
  AdminPaginatedResponse,
  UpdateCustomerPayload,
  CreateCustomerGroupPayload,
  UpdateCustomerGroupPayload,
} from "@/types/admin";

export function useAdminCustomers(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin-customers", params],
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminCustomer>>("/customers", params),
  });
}

export function useAdminCustomer(id: string) {
  return useQuery({
    queryKey: ["admin-customer", id],
    queryFn: () => adminApi.get<{ data: AdminCustomer }>(`/customers/${id}`),
    enabled: !!id,
  });
}

export function useUpdateCustomer(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCustomerPayload) =>
      adminApi.patch<{ data: AdminCustomer }>(`/customers/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-customers"] });
      qc.invalidateQueries({ queryKey: ["admin-customer", id] });
    },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/customers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-customers"] });
    },
  });
}

// Customer Groups

export function useAdminCustomerGroups(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin-customer-groups", params],
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminCustomerGroup>>(
        "/customer-groups",
        params,
      ),
  });
}

export function useCreateCustomerGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomerGroupPayload) =>
      adminApi.post<{ data: AdminCustomerGroup }>("/customer-groups", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-customer-groups"] });
    },
  });
}

export function useUpdateCustomerGroup(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCustomerGroupPayload) =>
      adminApi.patch<{ data: AdminCustomerGroup }>(
        `/customer-groups/${id}`,
        payload,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-customer-groups"] });
    },
  });
}

export function useDeleteCustomerGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/customer-groups/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-customer-groups"] });
    },
  });
}
