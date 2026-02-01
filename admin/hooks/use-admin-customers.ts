"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api-client";
import { customerKeys, customerGroupKeys } from "@/lib/query-key-factory";
import type {
  AdminCustomer,
  AdminCustomerGroup,
  AdminPaginatedResponse,
  UpdateCustomerPayload,
  CreateCustomerGroupPayload,
  UpdateCustomerGroupPayload,
} from "@/types";

export function useAdminCustomers(params?: Record<string, string>) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminCustomer>>("/customers", params),
  });
}

export function useAdminCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
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
      qc.invalidateQueries({ queryKey: customerKeys.lists() });
      qc.invalidateQueries({ queryKey: customerKeys.detail(id) });
      toast.success("Customer updated");
    },
    onError: () => {
      toast.error("Failed to update customer");
    },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/customers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success("Customer deleted");
    },
    onError: () => {
      toast.error("Failed to delete customer");
    },
  });
}

export function useAdminCustomerGroups(params?: Record<string, string>) {
  return useQuery({
    queryKey: customerGroupKeys.list(params),
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
      qc.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      toast.success("Customer group created");
    },
    onError: () => {
      toast.error("Failed to create customer group");
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
      qc.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      toast.success("Customer group updated");
    },
    onError: () => {
      toast.error("Failed to update customer group");
    },
  });
}

export function useDeleteCustomerGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/customer-groups/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerGroupKeys.lists() });
      toast.success("Customer group deleted");
    },
    onError: () => {
      toast.error("Failed to delete customer group");
    },
  });
}
