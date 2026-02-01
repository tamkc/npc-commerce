"use client";

import { useAuth } from "@/providers/auth-provider";
import { DropdownMenu } from "@/components/admin/ui";
import { getInitials } from "@/lib/admin/utils";
import { Bell, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminTopbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-end gap-3 border-b border-[var(--admin-border-base)] bg-[var(--admin-bg-base)]/80 px-6 backdrop-blur-sm">
      {/* Notifications */}
      <button className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--admin-fg-muted)] transition-colors hover:bg-[var(--admin-bg-field-hover)] hover:text-[var(--admin-fg-base)]">
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--admin-fg-error)]" />
      </button>

      {/* User menu */}
      <DropdownMenu
        trigger={
          <button className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-[var(--admin-bg-field-hover)]">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--admin-tag-purple-bg)] text-[11px] font-semibold text-[var(--admin-tag-purple-fg)]">
              {user
                ? getInitials(user.firstName || "A", user.lastName || "D")
                : "AD"}
            </div>
            <span className="text-xs font-medium text-[var(--admin-fg-base)]">
              {user ? `${user.firstName} ${user.lastName}` : "Admin"}
            </span>
          </button>
        }
        items={[
          {
            label: "Profile",
            onClick: () => router.push("/admin/settings"),
            icon: <User className="h-3.5 w-3.5" />,
          },
          {
            label: "Sign out",
            onClick: () => {
              logout();
              router.push("/admin/login");
            },
            icon: <LogOut className="h-3.5 w-3.5" />,
            variant: "danger",
          },
        ]}
      />
    </header>
  );
}
