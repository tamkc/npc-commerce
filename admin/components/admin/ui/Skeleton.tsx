"use client";

import { cn } from "@/lib/admin/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--admin-bg-field-hover)]",
        className,
      )}
    />
  );
}
