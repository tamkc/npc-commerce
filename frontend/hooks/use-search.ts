import { useQuery } from "@tanstack/react-query";
import { aiClient } from "@/lib/ai";
import { useDebounce } from "./use-debounce";

export function useSemanticSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ["semantic-search", debouncedQuery],
    queryFn: () => aiClient.semanticSearch(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 2 * 60 * 1000,
  });
}
