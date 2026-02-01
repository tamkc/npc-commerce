"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--admin-fg-muted)]" />
        <input
          ref={ref}
          type="search"
          className="h-8 w-full rounded-lg border border-[var(--admin-border-base)] bg-[var(--admin-bg-field)] pl-8 pr-3 text-sm text-[var(--admin-fg-base)] placeholder:text-[var(--admin-fg-muted)] transition-colors focus:outline-none focus:border-[var(--admin-border-interactive)] focus:ring-1 focus:ring-[var(--admin-border-interactive)] hover:bg-[var(--admin-bg-field-hover)]"
          {...props}
        />
      </div>
    );
  },
);

SearchInput.displayName = "AdminSearchInput";
