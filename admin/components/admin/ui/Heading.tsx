"use client";

import { cn } from "@/lib/admin/utils";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function Heading({ children, className }: HeadingProps) {
  return (
    <h1
      className={cn(
        "text-xl font-semibold text-[var(--admin-fg-base)]",
        className,
      )}
    >
      {children}
    </h1>
  );
}

interface SubheadingProps {
  children: React.ReactNode;
  className?: string;
}

export function Subheading({ children, className }: SubheadingProps) {
  return (
    <p
      className={cn("text-sm text-[var(--admin-fg-muted)]", className)}
    >
      {children}
    </p>
  );
}
