"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  Tag,
  DollarSign,
  Truck,
  Globe,
  CreditCard,
  Store,
  MapPin,
  Key,
  FolderTree,
  Receipt,
  UserCog,
  Settings,
  ChevronDown,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useCommandPalette } from "@/providers/command-palette-provider";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: <Package className="h-4 w-4" />,
      },
      {
        label: "Categories",
        href: "/admin/categories",
        icon: <FolderTree className="h-4 w-4" />,
      },
      {
        label: "Inventory",
        href: "/admin/inventory",
        icon: <Warehouse className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Sales",
    items: [
      {
        label: "Orders",
        href: "/admin/orders",
        icon: <ShoppingCart className="h-4 w-4" />,
      },
      {
        label: "Customers",
        href: "/admin/customers",
        icon: <Users className="h-4 w-4" />,
      },
      {
        label: "Promotions",
        href: "/admin/promotions",
        icon: <Tag className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Pricing",
    items: [
      {
        label: "Price Lists",
        href: "/admin/pricing",
        icon: <DollarSign className="h-4 w-4" />,
      },
      {
        label: "Currencies",
        href: "/admin/currencies",
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        label: "Tax Rates",
        href: "/admin/tax-rates",
        icon: <Receipt className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Fulfillment",
    items: [
      {
        label: "Shipping",
        href: "/admin/shipping",
        icon: <Truck className="h-4 w-4" />,
      },
      {
        label: "Stock Locations",
        href: "/admin/stock-locations",
        icon: <MapPin className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        label: "Regions",
        href: "/admin/regions",
        icon: <Globe className="h-4 w-4" />,
      },
      {
        label: "Sales Channels",
        href: "/admin/sales-channels",
        icon: <Store className="h-4 w-4" />,
      },
      {
        label: "Users",
        href: "/admin/users",
        icon: <UserCog className="h-4 w-4" />,
      },
      {
        label: "API Keys",
        href: "/admin/api-keys",
        icon: <Key className="h-4 w-4" />,
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { open: openCommandPalette } = useCommandPalette();
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(),
  );

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[220px] flex-col border-r border-[var(--admin-border-base)] bg-[var(--admin-bg-base)]">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-[var(--admin-border-base)] px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--admin-bg-interactive)]">
          <span className="text-xs font-bold text-white">N</span>
        </div>
        <span className="text-sm font-semibold text-[var(--admin-fg-base)]">
          NPC Admin
        </span>
      </div>

      {/* Search shortcut */}
      <div className="px-3 pt-3">
        <button
          onClick={openCommandPalette}
          className="flex w-full items-center gap-2 rounded-lg border border-[var(--admin-border-base)] bg-[var(--admin-bg-field)] px-2.5 py-1.5 text-xs text-[var(--admin-fg-muted)] transition-colors hover:bg-[var(--admin-bg-field-hover)]"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="rounded bg-[var(--admin-bg-base)] px-1 py-0.5 text-[10px] font-mono border border-[var(--admin-border-base)]">
            {"\u2318"}K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {navGroups.map((group) => (
          <div key={group.title || "main"} className="mb-3">
            {group.title && (
              <button
                onClick={() => toggleGroup(group.title)}
                className="mb-1 flex w-full items-center justify-between px-2 py-1"
              >
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--admin-fg-muted)]">
                  {group.title}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 text-[var(--admin-fg-muted)] transition-transform",
                    collapsedGroups.has(group.title) && "-rotate-90",
                  )}
                />
              </button>
            )}
            {!collapsedGroups.has(group.title) && (
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-[var(--admin-bg-field-hover)] text-[var(--admin-fg-base)]"
                        : "text-[var(--admin-fg-subtle)] hover:bg-[var(--admin-bg-field-hover)] hover:text-[var(--admin-fg-base)]",
                    )}
                  >
                    <span
                      className={cn(
                        isActive(item.href)
                          ? "text-[var(--admin-fg-interactive)]"
                          : "text-[var(--admin-fg-muted)]",
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[var(--admin-border-base)] p-3">
        <Link
          href="/admin/settings"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-[var(--admin-fg-subtle)] transition-colors hover:bg-[var(--admin-bg-field-hover)] hover:text-[var(--admin-fg-base)]"
        >
          <Settings className="h-4 w-4 text-[var(--admin-fg-muted)]" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
