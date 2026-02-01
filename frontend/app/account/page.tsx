"use client";

import Link from "next/link";
import { Package, Settings, MapPin } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          Please sign in to view your account.
        </p>
        <Button>
          <Link href="/auth/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Account" }]} />

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            My Account
          </h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            {user?.firstName} {user?.lastName} &middot; {user?.email}
          </p>
        </div>
        <Button variant="outline" onClick={logout}>
          Sign out
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/account/orders">
          <Card className="p-6 transition-shadow hover:shadow-md">
            <CardContent className="flex items-start gap-4 p-0">
              <Package className="h-6 w-6 text-zinc-500" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Orders
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  View your order history and track shipments.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/account/settings">
          <Card className="p-6 transition-shadow hover:shadow-md">
            <CardContent className="flex items-start gap-4 p-0">
              <Settings className="h-6 w-6 text-zinc-500" />
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Settings
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Update your password and preferences.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="p-6">
          <CardContent className="flex items-start gap-4 p-0">
            <MapPin className="h-6 w-6 text-zinc-500" />
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">
                Addresses
              </h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Manage your shipping and billing addresses.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
