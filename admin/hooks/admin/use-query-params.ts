"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

interface UseQueryParamsOptions {
  defaults?: {
    limit?: number;
  };
}

export function useQueryParams(options?: UseQueryParamsOptions) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const defaultLimit = options?.defaults?.limit ?? 20;

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const page = Number(searchParams.get("page") || "1");
  const search = searchParams.get("q") ?? "";
  const tab = searchParams.get("tab") ?? "all";
  const limit = Number(searchParams.get("limit") || String(defaultLimit));

  const setPage = useCallback(
    (p: number) => updateParams({ page: p === 1 ? null : String(p) }),
    [updateParams],
  );

  const setSearch = useCallback(
    (q: string) => updateParams({ q: q || null, page: null }),
    [updateParams],
  );

  const setTab = useCallback(
    (t: string) =>
      updateParams({ tab: t === "all" ? null : t, page: null }),
    [updateParams],
  );

  const params = useMemo(() => {
    const p: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };
    if (search) p.search = search;
    if (tab !== "all") p.status = tab;
    return p;
  }, [page, limit, search, tab]);

  return {
    page,
    setPage,
    search,
    setSearch,
    tab,
    setTab,
    limit,
    params,
    updateParams,
  };
}
