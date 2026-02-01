"use client";

import { Badge } from "./Badge";
import { getStatusColor } from "@/lib/admin/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge color={getStatusColor(status)} rounded className={className}>
      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {formatStatus(status)}
    </Badge>
  );
}
