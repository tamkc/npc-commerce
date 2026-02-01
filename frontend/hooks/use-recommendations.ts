import { useQuery } from "@tanstack/react-query";
import { aiClient } from "@/lib/ai";

export function useRecommendations(params?: {
  userId?: string;
  productId?: string;
}) {
  return useQuery({
    queryKey: ["recommendations", params],
    queryFn: () => aiClient.getRecommendations(params),
    staleTime: 5 * 60 * 1000,
  });
}
