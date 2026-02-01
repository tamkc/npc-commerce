"use client";

import { AdminProviders } from "@/providers/admin-provider";
import { KeybindProvider } from "@/providers/keybind-provider";
import { CommandPaletteProvider } from "@/providers/command-palette-provider";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { KeyboardShortcutsHelp } from "@/components/layout/KeyboardShortcutsHelp";
import { AdminKeyboardShortcuts } from "@/components/layout/AdminKeyboardShortcuts";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <KeybindProvider>
        <CommandPaletteProvider>
          <div className="min-h-screen bg-[var(--admin-bg-subtle)]">
            <AdminSidebar />
            <div className="pl-[220px]">
              <AdminTopbar />
              <main className="p-6">{children}</main>
            </div>
          </div>
          <CommandPalette />
          <KeyboardShortcutsHelp />
          <AdminKeyboardShortcuts />
        </CommandPaletteProvider>
      </KeybindProvider>
    </AdminProviders>
  );
}
