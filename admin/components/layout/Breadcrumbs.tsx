"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const LABEL_MAP: Record<string, string> = {
  admin: "Dashboard",
  products: "Products",
  orders: "Orders",
  customers: "Customers",
  inventory: "Inventory",
  categories: "Categories",
  promotions: "Promotions",
  pricing: "Price Lists",
  regions: "Regions",
  currencies: "Currencies",
  "tax-rates": "Tax Rates",
  "sales-channels": "Sales Channels",
  shipping: "Shipping",
  "stock-locations": "Stock Locations",
  users: "Users",
  "api-keys": "API Keys",
  settings: "Settings",
  create: "Create",
  edit: "Edit",
  login: "Login",
};

function getLabel(segment: string): string {
  return LABEL_MAP[segment] ?? segment;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Don't show breadcrumbs on dashboard root
  if (segments.length <= 1) return null;

  const crumbs = segments.map((segment, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;
    return { label: getLabel(segment), href, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && (
            <ChevronRight className="h-3 w-3 text-[var(--admin-fg-muted)]" />
          )}
          {crumb.isLast ? (
            <span className="font-medium text-[var(--admin-fg-base)]">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-[var(--admin-fg-muted)] transition-colors hover:text-[var(--admin-fg-base)]"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
