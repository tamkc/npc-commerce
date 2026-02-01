"use client";

import { cn } from "@/lib/utils";

type BadgeColor = "neutral" | "purple" | "blue" | "green" | "orange" | "red";
type BadgeSize = "sm" | "base" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
}

const colorStyles: Record<BadgeColor, string> = {
  neutral:
    "bg-[var(--admin-tag-neutral-bg)] text-[var(--admin-tag-neutral-fg)]",
  purple:
    "bg-[var(--admin-tag-purple-bg)] text-[var(--admin-tag-purple-fg)]",
  blue: "bg-[var(--admin-tag-blue-bg)] text-[var(--admin-tag-blue-fg)]",
  green:
    "bg-[var(--admin-tag-green-bg)] text-[var(--admin-tag-green-fg)]",
  orange:
    "bg-[var(--admin-tag-orange-bg)] text-[var(--admin-tag-orange-fg)]",
  red: "bg-[var(--admin-tag-red-bg)] text-[var(--admin-tag-red-fg)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-[10px]",
  base: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-xs",
};

export function Badge({
  children,
  color = "neutral",
  size = "base",
  rounded = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium",
        rounded ? "rounded-full" : "rounded-md",
        colorStyles[color],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
