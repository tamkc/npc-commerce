"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api-client";
import { fulfillmentKeys, orderKeys } from "@/lib/query-key-factory";
import type {
  AdminFulfillment,
  AdminPaginatedResponse,
  CreateFulfillmentPayload,
} from "@/types";

export function useAdminFulfillments(params?: Record<string, string>) {
  return useQuery({
    queryKey: fulfillmentKeys.list(params),
    queryFn: () =>
      adminApi.get<AdminPaginatedResponse<AdminFulfillment>>(
        "/fulfillments",
        params,
      ),
  });
}

export function useCreateFulfillment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFulfillmentPayload) =>
      adminApi.post<{ data: AdminFulfillment }>("/fulfillments", payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: fulfillmentKeys.lists() });
      qc.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      toast.success("Fulfillment created");
    },
    onError: () => {
      toast.error("Failed to create fulfillment");
    },
  });
}

export function useShipFulfillment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { trackingNumber?: string; trackingUrl?: string }) =>
      adminApi.post(`/fulfillments/${id}/ship`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fulfillmentKeys.lists() });
      toast.success("Fulfillment shipped");
    },
    onError: () => {
      toast.error("Failed to ship fulfillment");
    },
  });
}

export function useCancelFulfillment(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => adminApi.post(`/fulfillments/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fulfillmentKeys.lists() });
      toast.success("Fulfillment cancelled");
    },
    onError: () => {
      toast.error("Failed to cancel fulfillment");
    },
  });
}
