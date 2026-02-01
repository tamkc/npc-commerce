"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin/api-client";
import type {
  AdminUser,
  AdminCurrency,
  AdminTaxRate,
  AdminSalesChannel,
  AdminStockLocation,
  AdminShippingMethod,
  AdminApiKey,
  AdminPaginatedResponse,
  CreateUserPayload,
  UpdateUserPayload,
  CreateCurrencyPayload,
  UpdateCurrencyPayload,
  CreateTaxRatePayload,
  UpdateTaxRatePayload,
  CreateSalesChannelPayload,
  UpdateSalesChannelPayload,
  CreateStockLocationPayload,
  UpdateStockLocationPayload,
  CreateShippingMethodPayload,
  UpdateShippingMethodPayload,
  CreateApiKeyPayload,
} from "@/types/admin";

// ── Users ──

export function useAdminUsers(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminUser>>("/users", params),
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => adminApi.get<{ data: AdminUser }>(`/users/${id}`),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) =>
      adminApi.post<{ data: AdminUser }>("/users", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) =>
      adminApi.patch<{ data: AdminUser }>(`/users/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-user", id] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

// ── Currencies ──

export function useAdminCurrencies() {
  return useQuery({
    queryKey: ["admin-currencies"],
    queryFn: () =>
      adminApi.get<{ data: AdminCurrency[] }>("/currencies"),
  });
}

export function useCreateCurrency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCurrencyPayload) =>
      adminApi.post<{ data: AdminCurrency }>("/currencies", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-currencies"] });
    },
  });
}

export function useUpdateCurrency(code: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCurrencyPayload) =>
      adminApi.patch<{ data: AdminCurrency }>(`/currencies/${code}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-currencies"] });
    },
  });
}

export function useDeleteCurrency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => adminApi.delete(`/currencies/${code}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-currencies"] });
    },
  });
}

// ── Tax Rates ──

export function useAdminTaxRates(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin-tax-rates", params],
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminTaxRate>>("/tax-rates", params),
  });
}

export function useCreateTaxRate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaxRatePayload) =>
      adminApi.post<{ data: AdminTaxRate }>("/tax-rates", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tax-rates"] });
    },
  });
}

export function useUpdateTaxRate(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTaxRatePayload) =>
      adminApi.patch<{ data: AdminTaxRate }>(`/tax-rates/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tax-rates"] });
    },
  });
}

export function useDeleteTaxRate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/tax-rates/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tax-rates"] });
    },
  });
}

// ── Sales Channels ──

export function useAdminSalesChannels(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin-sales-channels", params],
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminSalesChannel>>(
        "/sales-channels",
        params,
      ),
  });
}

export function useCreateSalesChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSalesChannelPayload) =>
      adminApi.post<{ data: AdminSalesChannel }>("/sales-channels", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-sales-channels"] });
    },
  });
}

export function useUpdateSalesChannel(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSalesChannelPayload) =>
      adminApi.patch<{ data: AdminSalesChannel }>(
        `/sales-channels/${id}`,
        payload,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-sales-channels"] });
    },
  });
}

export function useDeleteSalesChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/sales-channels/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-sales-channels"] });
    },
  });
}

// ── Stock Locations ──

export function useAdminStockLocations(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin-stock-locations", params],
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminStockLocation>>(
        "/stock-locations",
        params,
      ),
  });
}

export function useCreateStockLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStockLocationPayload) =>
      adminApi.post<{ data: AdminStockLocation }>(
        "/stock-locations",
        payload,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-stock-locations"] });
    },
  });
}

export function useUpdateStockLocation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateStockLocationPayload) =>
      adminApi.patch<{ data: AdminStockLocation }>(
        `/stock-locations/${id}`,
        payload,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-stock-locations"] });
    },
  });
}

export function useDeleteStockLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/stock-locations/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-stock-locations"] });
    },
  });
}

// ── Shipping Methods ──

export function useAdminShippingMethods(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["admin-shipping-methods", params],
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminShippingMethod>>(
        "/shipping-methods",
        params,
      ),
  });
}

export function useCreateShippingMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateShippingMethodPayload) =>
      adminApi.post<{ data: AdminShippingMethod }>(
        "/shipping-methods",
        payload,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-shipping-methods"] });
    },
  });
}

export function useUpdateShippingMethod(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateShippingMethodPayload) =>
      adminApi.put<{ data: AdminShippingMethod }>(
        `/shipping-methods/${id}`,
        payload,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-shipping-methods"] });
    },
  });
}

export function useDeleteShippingMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/shipping-methods/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-shipping-methods"] });
    },
  });
}

// ── API Keys ──

export function useAdminApiKeys() {
  return useQuery({
    queryKey: ["admin-api-keys"],
    queryFn: () => adminApi.get<{ data: AdminApiKey[] }>("/api-keys"),
  });
}

export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateApiKeyPayload) =>
      adminApi.post<{ data: AdminApiKey & { rawKey: string } }>(
        "/api-keys",
        payload,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-api-keys"] });
    },
  });
}

export function useDeleteApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/api-keys/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-api-keys"] });
    },
  });
}
