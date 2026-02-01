"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function SettingsPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg text-zinc-500">
          Please sign in to view settings.
        </p>
        <Button>
          <Link href="/auth/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Account", href: "/account" },
          { label: "Settings" },
        ]}
      />

      <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
        Account Settings
      </h1>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          Account settings coming soon.
        </p>
        <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
          Password change, preferences, and notification settings will be added
          in a future update.
        </p>
      </div>
    </div>
  );
}
