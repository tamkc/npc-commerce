"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useAuth } from "@/providers/auth-provider";
import { APP_NAME } from "@/lib/constants";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, toggleDrawer } = useCartStore();
  const { user, isAuthenticated } = useAuth();
  const itemCount = cart?.itemCount ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-bold text-zinc-900 dark:text-white"
          >
            {APP_NAME}
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/products"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Products
            </Link>
          </div>
        </div>

        {/* Right: Search, Cart, User */}
        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Search className="h-5 w-5" />
          </Link>

          <button
            onClick={toggleDrawer}
            className="relative rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white dark:bg-white dark:text-zinc-900">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <Link
              href="/account"
              className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <User className="h-5 w-5" />
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="hidden rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 md:block"
            >
              Sign in
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
      />
    </header>
  );
}
