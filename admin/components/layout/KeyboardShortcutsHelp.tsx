"use client";

import { useKeybinds } from "@/providers/keybind-provider";
import { X } from "lucide-react";

export function KeyboardShortcutsHelp() {
  const { shortcuts, showHelp, setShowHelp } = useKeybinds();

  if (!showHelp) return null;

  const grouped = shortcuts.reduce<Record<string, typeof shortcuts>>(
    (acc, shortcut) => {
      const group = shortcut.group || "General";
      if (!acc[group]) acc[group] = [];
      acc[group].push(shortcut);
      return acc;
    },
    {},
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setShowHelp(false)}
      />
      <div className="relative w-full max-w-md rounded-xl border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--admin-border-base)] px-5 py-3">
          <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setShowHelp(false)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--admin-fg-muted)] transition-colors hover:bg-[var(--admin-bg-field-hover)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-5 py-3">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="mb-4 last:mb-0">
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--admin-fg-muted)]">
                {group}
              </h3>
              <div className="space-y-1">
                {items.map((shortcut) => (
                  <div
                    key={shortcut.keys}
                    className="flex items-center justify-between rounded-md px-2 py-1.5"
                  >
                    <span className="text-xs text-[var(--admin-fg-subtle)]">
                      {shortcut.label}
                    </span>
                    <kbd className="rounded bg-[var(--admin-bg-field)] px-1.5 py-0.5 text-[10px] font-mono font-medium text-[var(--admin-fg-muted)] border border-[var(--admin-border-base)]">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
