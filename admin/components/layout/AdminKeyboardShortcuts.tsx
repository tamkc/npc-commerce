"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKeybinds } from "@/providers/keybind-provider";
import { useCommandPalette } from "@/providers/command-palette-provider";

export function AdminKeyboardShortcuts() {
  const router = useRouter();
  const { register } = useKeybinds();
  const { toggle } = useCommandPalette();

  useEffect(() => {
    const unregisters = [
      register({
        keys: "Mod+K",
        label: "Open command palette",
        group: "General",
        handler: toggle,
      }),
      register({
        keys: "G then P",
        label: "Go to Products",
        group: "Navigation",
        handler: () => router.push("/admin/products"),
      }),
      register({
        keys: "G then O",
        label: "Go to Orders",
        group: "Navigation",
        handler: () => router.push("/admin/orders"),
      }),
      register({
        keys: "G then C",
        label: "Go to Customers",
        group: "Navigation",
        handler: () => router.push("/admin/customers"),
      }),
      register({
        keys: "G then I",
        label: "Go to Inventory",
        group: "Navigation",
        handler: () => router.push("/admin/inventory"),
      }),
      register({
        keys: "G then S",
        label: "Go to Settings",
        group: "Navigation",
        handler: () => router.push("/admin/settings"),
      }),
    ];

    return () => unregisters.forEach((fn) => fn());
  }, [register, router, toggle]);

  return null;
}
