"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useCommandPalette } from "@/providers/command-palette-provider";
import {
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  FolderTree,
  Tag,
  DollarSign,
  Globe,
  Settings,
  Plus,
  Search,
} from "lucide-react";

interface CommandItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  group: string;
  keywords?: string[];
}

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) setSearch("");
  }, [isOpen]);

  const navigate = (path: string) => {
    router.push(path);
    close();
  };

  const items: CommandItem[] = [
    // Navigation
    { label: "Go to Dashboard", icon: <Search className="h-4 w-4" />, action: () => navigate("/admin"), group: "Navigation", keywords: ["home"] },
    { label: "Go to Products", icon: <Package className="h-4 w-4" />, action: () => navigate("/admin/products"), group: "Navigation" },
    { label: "Go to Orders", icon: <ShoppingCart className="h-4 w-4" />, action: () => navigate("/admin/orders"), group: "Navigation" },
    { label: "Go to Customers", icon: <Users className="h-4 w-4" />, action: () => navigate("/admin/customers"), group: "Navigation" },
    { label: "Go to Inventory", icon: <Warehouse className="h-4 w-4" />, action: () => navigate("/admin/inventory"), group: "Navigation" },
    { label: "Go to Categories", icon: <FolderTree className="h-4 w-4" />, action: () => navigate("/admin/categories"), group: "Navigation" },
    { label: "Go to Promotions", icon: <Tag className="h-4 w-4" />, action: () => navigate("/admin/promotions"), group: "Navigation" },
    { label: "Go to Price Lists", icon: <DollarSign className="h-4 w-4" />, action: () => navigate("/admin/pricing"), group: "Navigation" },
    { label: "Go to Regions", icon: <Globe className="h-4 w-4" />, action: () => navigate("/admin/regions"), group: "Navigation" },
    { label: "Go to Settings", icon: <Settings className="h-4 w-4" />, action: () => navigate("/admin/settings"), group: "Navigation" },
    // Quick actions
    { label: "Create Product", icon: <Plus className="h-4 w-4" />, action: () => navigate("/admin/products/create"), group: "Actions", keywords: ["new", "add"] },
    { label: "Create Promotion", icon: <Plus className="h-4 w-4" />, action: () => navigate("/admin/promotions/create"), group: "Actions", keywords: ["new", "add", "discount"] },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <div className="relative w-full max-w-lg">
        <Command
          className="rounded-xl border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] shadow-2xl"
          loop
        >
          <div className="flex items-center border-b border-[var(--admin-border-base)] px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 text-[var(--admin-fg-muted)]" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex h-11 w-full bg-transparent text-sm text-[var(--admin-fg-base)] placeholder:text-[var(--admin-fg-muted)] outline-none"
            />
          </div>
          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="px-4 py-6 text-center text-xs text-[var(--admin-fg-muted)]">
              No results found.
            </Command.Empty>
            {["Navigation", "Actions"].map((group) => {
              const groupItems = items.filter((i) => i.group === group);
              if (groupItems.length === 0) return null;
              return (
                <Command.Group
                  key={group}
                  heading={group}
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-[var(--admin-fg-muted)]"
                >
                  {groupItems.map((item) => (
                    <Command.Item
                      key={item.label}
                      onSelect={item.action}
                      keywords={item.keywords}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] text-[var(--admin-fg-subtle)] transition-colors data-[selected=true]:bg-[var(--admin-bg-field-hover)] data-[selected=true]:text-[var(--admin-fg-base)]"
                    >
                      <span className="text-[var(--admin-fg-muted)]">
                        {item.icon}
                      </span>
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
