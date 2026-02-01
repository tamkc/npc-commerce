"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { User } from "@/types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: User | null;
}

export function MobileMenu({
  isOpen,
  onClose,
  isAuthenticated,
  user,
}: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-zinc-900 dark:text-white">
            Menu
          </span>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-4">
          <Link
            href="/products"
            onClick={onClose}
            className="text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Products
          </Link>
          <Link
            href="/search"
            onClick={onClose}
            className="text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Search
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            className="text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Cart
          </Link>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          {isAuthenticated ? (
            <>
              <span className="text-sm text-zinc-500">
                {user?.firstName} {user?.lastName}
              </span>
              <Link
                href="/account"
                onClick={onClose}
                className="text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                Account
              </Link>
              <Link
                href="/account/orders"
                onClick={onClose}
                className="text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                Orders
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={onClose}
                className="text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                onClick={onClose}
                className="text-base font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
