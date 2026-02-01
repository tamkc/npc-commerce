import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types";

interface Region {
  id: string;
  name: string;
  currency: string;
  taxRate: number;
  countries: string[];
}

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: () => apiClient.get<ApiResponse<Region[]>>("/store/regions"),
    staleTime: 5 * 60 * 1000,
  });
}
