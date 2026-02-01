"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/admin/api-client";
import type {
  AdminFulfillment,
  CreateFulfillmentPayload,
} from "@/types/admin";

export function useOrderFulfillments(orderId: string) {
  return useQuery({
    queryKey: ["admin-fulfillments", orderId],
    queryFn: () =>
      adminApi.get<{ data: AdminFulfillment[] }>(
        `/fulfillments/order/${orderId}`,
      ),
    enabled: !!orderId,
  });
}

export function useCreateFulfillment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFulfillmentPayload) =>
      adminApi.post<{ data: AdminFulfillment }>("/fulfillments", payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["admin-fulfillments", variables.orderId],
      });
      qc.invalidateQueries({
        queryKey: ["admin-order", variables.orderId],
      });
    },
  });
}

export function useShipFulfillment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      trackingNumber,
      trackingUrl,
    }: {
      id: string;
      trackingNumber?: string;
      trackingUrl?: string;
    }) => adminApi.post(`/fulfillments/${id}/ship`, { trackingNumber, trackingUrl }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-fulfillments"] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}

export function useDeliverFulfillment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.post(`/fulfillments/${id}/deliver`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-fulfillments"] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}

export function useCancelFulfillment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.post(`/fulfillments/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-fulfillments"] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });
}
