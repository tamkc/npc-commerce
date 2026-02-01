"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/admin/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[var(--admin-fg-subtle)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-8 w-full rounded-lg border bg-[var(--admin-bg-field)] px-3 text-sm text-[var(--admin-fg-base)] placeholder:text-[var(--admin-fg-muted)] transition-colors",
            "focus:outline-none focus:border-[var(--admin-border-interactive)] focus:ring-1 focus:ring-[var(--admin-border-interactive)]",
            "hover:bg-[var(--admin-bg-field-hover)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-[var(--admin-border-error)]"
              : "border-[var(--admin-border-base)]",
            className,
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-[var(--admin-fg-muted)]">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-[var(--admin-fg-error)]">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "AdminInput";
