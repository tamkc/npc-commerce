"use client";

import { cn } from "@/lib/admin/utils";
import { Inbox } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 rounded-lg bg-[var(--admin-bg-subtle)] p-3 text-[var(--admin-fg-muted)]">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="text-sm font-medium text-[var(--admin-fg-base)]">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-[var(--admin-fg-muted)]">
          {description}
        </p>
      )}
      {action && (
        <Button
          variant="secondary"
          size="sm"
          onClick={action.onClick}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
