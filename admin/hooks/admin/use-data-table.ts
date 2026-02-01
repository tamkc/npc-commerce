"use client";

import { useQueryParams } from "./use-query-params";

interface UseDataTableOptions {
  defaultLimit?: number;
}

export function useDataTable(options?: UseDataTableOptions) {
  const queryParams = useQueryParams({
    defaults: { limit: options?.defaultLimit ?? 20 },
  });

  return {
    ...queryParams,
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      queryParams.setSearch(e.target.value);
    },
    onTabChange: (value: string) => {
      queryParams.setTab(value);
    },
    onPageChange: (page: number) => {
      queryParams.setPage(page);
    },
  };
}
