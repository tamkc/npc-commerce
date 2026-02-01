"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-[var(--admin-border-base)] px-4 py-3",
        className,
      )}
    >
      <p className="text-xs text-[var(--admin-fg-muted)]">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--admin-border-base)] text-[var(--admin-fg-subtle)] transition-colors hover:bg-[var(--admin-bg-field-hover)] disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--admin-border-base)] text-[var(--admin-fg-subtle)] transition-colors hover:bg-[var(--admin-bg-field-hover)] disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
