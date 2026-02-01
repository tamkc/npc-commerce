"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api-client";
import { settingsKeys, userKeys, apiKeyKeys, currencyKeys, taxRateKeys, salesChannelKeys, shippingKeys, stockLocationKeys } from "@/lib/query-key-factory";
import type {
  AdminUser,
  AdminApiKey,
  AdminCurrency,
  AdminTaxRate,
  AdminSalesChannel,
  AdminShippingMethod,
  AdminStockLocation,
  AdminPaginatedResponse,
  CreateUserPayload,
  UpdateUserPayload,
  CreateApiKeyPayload,
  CreateCurrencyPayload,
  UpdateCurrencyPayload,
  CreateTaxRatePayload,
  UpdateTaxRatePayload,
  CreateSalesChannelPayload,
  UpdateSalesChannelPayload,
  CreateShippingMethodPayload,
  UpdateShippingMethodPayload,
  CreateStockLocationPayload,
  UpdateStockLocationPayload,
} from "@/types";

// Users
export function useAdminUsers(params?: Record<string, string>) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminUser>>("/users", params),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) =>
      adminApi.post<{ data: AdminUser }>("/users", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("User created");
    },
    onError: () => {
      toast.error("Failed to create user");
    },
  });
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) =>
      adminApi.patch<{ data: AdminUser }>(`/users/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("User updated");
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/users/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("User deleted");
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });
}

// API Keys
export function useAdminApiKeys(params?: Record<string, string>) {
  return useQuery({
    queryKey: apiKeyKeys.list(params),
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminApiKey>>("/api-keys", params),
  });
}

export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateApiKeyPayload) =>
      adminApi.post<{ data: AdminApiKey & { rawKey: string } }>("/api-keys", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: apiKeyKeys.lists() });
      toast.success("API key created");
    },
    onError: () => {
      toast.error("Failed to create API key");
    },
  });
}

export function useRevokeApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.post(`/api-keys/${id}/revoke`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: apiKeyKeys.lists() });
      toast.success("API key revoked");
    },
    onError: () => {
      toast.error("Failed to revoke API key");
    },
  });
}

// Currencies
export function useAdminCurrencies(params?: Record<string, string>) {
  return useQuery({
    queryKey: currencyKeys.list(params),
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminCurrency>>("/currencies", params),
  });
}

export function useCreateCurrency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCurrencyPayload) =>
      adminApi.post<{ data: AdminCurrency }>("/currencies", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: currencyKeys.lists() });
      toast.success("Currency created");
    },
    onError: () => {
      toast.error("Failed to create currency");
    },
  });
}

export function useUpdateCurrency(code: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCurrencyPayload) =>
      adminApi.patch<{ data: AdminCurrency }>(`/currencies/${code}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: currencyKeys.lists() });
      toast.success("Currency updated");
    },
    onError: () => {
      toast.error("Failed to update currency");
    },
  });
}

// Tax Rates
export function useAdminTaxRates(params?: Record<string, string>) {
  return useQuery({
    queryKey: taxRateKeys.list(params),
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
      qc.invalidateQueries({ queryKey: taxRateKeys.lists() });
      toast.success("Tax rate created");
    },
    onError: () => {
      toast.error("Failed to create tax rate");
    },
  });
}

export function useUpdateTaxRate(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTaxRatePayload) =>
      adminApi.put<{ data: AdminTaxRate }>(`/tax-rates/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taxRateKeys.lists() });
      toast.success("Tax rate updated");
    },
    onError: () => {
      toast.error("Failed to update tax rate");
    },
  });
}

export function useDeleteTaxRate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/tax-rates/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taxRateKeys.lists() });
      toast.success("Tax rate deleted");
    },
    onError: () => {
      toast.error("Failed to delete tax rate");
    },
  });
}

// Sales Channels
export function useAdminSalesChannels(params?: Record<string, string>) {
  return useQuery({
    queryKey: salesChannelKeys.list(params),
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
      qc.invalidateQueries({ queryKey: salesChannelKeys.lists() });
      toast.success("Sales channel created");
    },
    onError: () => {
      toast.error("Failed to create sales channel");
    },
  });
}

export function useUpdateSalesChannel(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSalesChannelPayload) =>
      adminApi.put<{ data: AdminSalesChannel }>(
        `/sales-channels/${id}`,
        payload,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: salesChannelKeys.lists() });
      toast.success("Sales channel updated");
    },
    onError: () => {
      toast.error("Failed to update sales channel");
    },
  });
}

export function useDeleteSalesChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/sales-channels/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: salesChannelKeys.lists() });
      toast.success("Sales channel deleted");
    },
    onError: () => {
      toast.error("Failed to delete sales channel");
    },
  });
}

// Shipping Methods
export function useAdminShippingMethods(params?: Record<string, string>) {
  return useQuery({
    queryKey: shippingKeys.list(params),
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
      qc.invalidateQueries({ queryKey: shippingKeys.lists() });
      toast.success("Shipping method created");
    },
    onError: () => {
      toast.error("Failed to create shipping method");
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
      qc.invalidateQueries({ queryKey: shippingKeys.lists() });
      toast.success("Shipping method updated");
    },
    onError: () => {
      toast.error("Failed to update shipping method");
    },
  });
}

export function useDeleteShippingMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/shipping-methods/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: shippingKeys.lists() });
      toast.success("Shipping method deleted");
    },
    onError: () => {
      toast.error("Failed to delete shipping method");
    },
  });
}

// Stock Locations
export function useAdminStockLocations(params?: Record<string, string>) {
  return useQuery({
    queryKey: stockLocationKeys.list(params),
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
      adminApi.post<{ data: AdminStockLocation }>("/stock-locations", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockLocationKeys.lists() });
      toast.success("Stock location created");
    },
    onError: () => {
      toast.error("Failed to create stock location");
    },
  });
}

export function useUpdateStockLocation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateStockLocationPayload) =>
      adminApi.put<{ data: AdminStockLocation }>(
        `/stock-locations/${id}`,
        payload,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockLocationKeys.lists() });
      toast.success("Stock location updated");
    },
    onError: () => {
      toast.error("Failed to update stock location");
    },
  });
}

export function useDeleteStockLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.delete(`/stock-locations/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockLocationKeys.lists() });
      toast.success("Stock location deleted");
    },
    onError: () => {
      toast.error("Failed to delete stock location");
    },
  });
}
