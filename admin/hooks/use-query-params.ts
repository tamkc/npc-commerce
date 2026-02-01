"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PAGINATION } from "@/lib/constants";

interface UseQueryParamsOptions {
  defaults?: {
    limit?: number;
  };
}

export function useQueryParams(options?: UseQueryParamsOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultLimit = options?.defaults?.limit ?? PAGINATION.DEFAULT_LIMIT;

  const page = Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE;
  const search = searchParams.get("q") ?? "";
  const tab = searchParams.get("tab") ?? "";
  const limit = Number(searchParams.get("limit")) || defaultLimit;

  const filters = useMemo(() => {
    const f: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (!["page", "q", "tab", "limit"].includes(key)) {
        f[key] = value;
      }
    });
    return f;
  }, [searchParams]);

  const setParams = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const setPage = useCallback(
    (p: number) => setParams({ page: p <= 1 ? null : p }),
    [setParams],
  );

  const setSearch = useCallback(
    (q: string) => setParams({ q: q || null, page: null }),
    [setParams],
  );

  const setTab = useCallback(
    (t: string) => setParams({ tab: t || null, page: null }),
    [setParams],
  );

  const setFilter = useCallback(
    (key: string, value: string | null) => setParams({ [key]: value, page: null }),
    [setParams],
  );

  const queryRecord = useMemo((): Record<string, string> => {
    const record: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (search) record.q = search;
    if (tab) record.status = tab;
    Object.assign(record, filters);
    return record;
  }, [page, limit, search, tab, filters]);

  return {
    page,
    search,
    tab,
    limit,
    filters,
    queryRecord,
    setPage,
    setSearch,
    setTab,
    setFilter,
    setParams,
  };
}
