"use client";

import { cn } from "@/lib/admin/utils";

interface Tab {
  value: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "flex gap-0 border-b border-[var(--admin-border-base)]",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "relative px-4 py-2 text-sm font-medium transition-colors",
            value === tab.value
              ? "text-[var(--admin-fg-base)]"
              : "text-[var(--admin-fg-muted)] hover:text-[var(--admin-fg-subtle)]",
          )}
        >
          <span className="flex items-center gap-1.5">
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                  value === tab.value
                    ? "bg-[var(--admin-tag-purple-bg)] text-[var(--admin-tag-purple-fg)]"
                    : "bg-[var(--admin-tag-neutral-bg)] text-[var(--admin-tag-neutral-fg)]",
                )}
              >
                {tab.count}
              </span>
            )}
          </span>
          {value === tab.value && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--admin-fg-base)]" />
          )}
        </button>
      ))}
    </div>
  );
}
