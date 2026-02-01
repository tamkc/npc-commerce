import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Address, ApiResponse } from "@/types";

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () =>
      apiClient.get<ApiResponse<Address[]>>("/store/addresses"),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (address: Omit<Address, "id">) =>
      apiClient.post<ApiResponse<Address>>("/store/addresses", address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<void>(`/store/addresses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}
