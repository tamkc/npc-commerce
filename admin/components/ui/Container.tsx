"use client";

import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--admin-border-base)] bg-[var(--admin-bg-component)] shadow-[var(--admin-shadow-elevation-card)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ContainerHeader({
  children,
  className,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-[var(--admin-border-base)] px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ContainerBody({
  children,
  className,
}: ContainerProps) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}
