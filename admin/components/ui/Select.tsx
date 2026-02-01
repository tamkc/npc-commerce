"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  selectSize?: "sm" | "base";
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, hint, error, options, placeholder, selectSize = "base", id, ...props },
    ref,
  ) => {
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
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              "w-full appearance-none rounded-lg border bg-[var(--admin-bg-field)] pr-8 text-sm text-[var(--admin-fg-base)] transition-colors",
              "focus:outline-none focus:border-[var(--admin-border-interactive)] focus:ring-1 focus:ring-[var(--admin-border-interactive)]",
              "hover:bg-[var(--admin-bg-field-hover)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              selectSize === "sm" ? "h-7 px-2.5 text-xs" : "h-8 px-3",
              error
                ? "border-[var(--admin-border-error)]"
                : "border-[var(--admin-border-base)]",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--admin-fg-muted)]" />
        </div>
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

Select.displayName = "AdminSelect";
