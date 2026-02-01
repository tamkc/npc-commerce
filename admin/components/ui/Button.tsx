"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "transparent";
type ButtonSize = "sm" | "base" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--admin-button-inverted)] text-[var(--admin-contrast-fg-primary)] hover:bg-[var(--admin-button-inverted-hover)] active:bg-[var(--admin-button-inverted-pressed)]",
  secondary:
    "bg-transparent border border-[var(--admin-border-base)] text-[var(--admin-fg-base)] hover:bg-[var(--admin-bg-field-hover)]",
  danger:
    "bg-[var(--admin-tag-red-bg)] text-[var(--admin-tag-red-fg)] border border-transparent hover:bg-red-200 dark:hover:bg-red-900/40",
  ghost:
    "bg-transparent text-[var(--admin-fg-subtle)] hover:bg-[var(--admin-bg-field-hover)] hover:text-[var(--admin-fg-base)]",
  transparent:
    "bg-transparent text-[var(--admin-fg-interactive)] hover:text-[var(--admin-fg-interactive-hover)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-7 px-2.5 text-xs gap-1",
  base: "h-8 px-3 text-sm gap-1.5",
  lg: "h-10 px-4 text-sm gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "base",
      isLoading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-border-interactive)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "AdminButton";
