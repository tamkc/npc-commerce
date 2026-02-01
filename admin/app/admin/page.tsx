"use client";

import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  Container,
  ContainerHeader,
  ContainerBody,
  Heading,
  StatusBadge,
  Skeleton,
} from "@/components/admin/ui";
import { useAdminOrders } from "@/hooks/admin/use-admin-orders";
import { useAdminLowStock } from "@/hooks/admin/use-admin-inventory";
import { formatCurrency, formatRelativeTime } from "@/lib/admin/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  href: string;
}

function StatCard({ label, value, icon, trend, href }: StatCardProps) {
  return (
    <Link href={href}>
      <Container className="transition-shadow hover:shadow-md">
        <ContainerBody className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--admin-fg-muted)]">
              {label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-[var(--admin-fg-base)]">
              {value}
            </p>
            {trend && (
              <p className="mt-1 flex items-center gap-1 text-xs text-[var(--admin-tag-green-fg)]">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <div className="rounded-lg bg-[var(--admin-bg-subtle)] p-2.5 text-[var(--admin-fg-muted)]">
            {icon}
          </div>
        </ContainerBody>
      </Container>
    </Link>
  );
}

export default function AdminDashboard() {
  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders({
    limit: "5",
    page: "1",
  });
  const { data: lowStockData, isLoading: lowStockLoading } = useAdminLowStock();

  const orders = ordersData?.data ?? [];
  const totalOrders = ordersData?.total ?? 0;
  const lowStockItems = lowStockData?.data ?? [];

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="space-y-6">
      <Heading>Dashboard</Heading>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={ordersLoading ? "..." : String(totalOrders)}
          icon={<ShoppingCart className="h-5 w-5" />}
          href="/admin/orders"
        />
        <StatCard
          label="Revenue"
          value={ordersLoading ? "..." : formatCurrency(totalRevenue)}
          icon={<DollarSign className="h-5 w-5" />}
          href="/admin/orders"
        />
        <StatCard
          label="Low Stock Items"
          value={lowStockLoading ? "..." : String(lowStockItems.length)}
          icon={<AlertTriangle className="h-5 w-5" />}
          href="/admin/inventory"
        />
        <StatCard
          label="Products"
          value="—"
          icon={<Package className="h-5 w-5" />}
          href="/admin/products"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Container>
          <ContainerHeader>
            <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs font-medium text-[var(--admin-fg-interactive)] hover:text-[var(--admin-fg-interactive-hover)]"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </ContainerHeader>
          <ContainerBody className="p-0">
            {ordersLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <p className="p-6 text-center text-sm text-[var(--admin-fg-muted)]">
                No orders yet
              </p>
            ) : (
              <div className="divide-y divide-[var(--admin-border-base)]">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-[var(--admin-bg-field-hover)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[var(--admin-fg-base)]">
                        #{order.displayId}
                      </span>
                      <span className="text-xs text-[var(--admin-fg-muted)]">
                        {order.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <span className="text-sm font-medium text-[var(--admin-fg-base)]">
                        {formatCurrency(Number(order.total))}
                      </span>
                      <span className="text-xs text-[var(--admin-fg-muted)]">
                        {formatRelativeTime(order.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </ContainerBody>
        </Container>

        {/* Low Stock Alerts */}
        <Container>
          <ContainerHeader>
            <h2 className="text-sm font-semibold text-[var(--admin-fg-base)]">
              Low Stock Alerts
            </h2>
            <Link
              href="/admin/inventory"
              className="flex items-center gap-1 text-xs font-medium text-[var(--admin-fg-interactive)] hover:text-[var(--admin-fg-interactive-hover)]"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </ContainerHeader>
          <ContainerBody className="p-0">
            {lowStockLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : lowStockItems.length === 0 ? (
              <p className="p-6 text-center text-sm text-[var(--admin-fg-muted)]">
                No low stock alerts
              </p>
            ) : (
              <div className="divide-y divide-[var(--admin-border-base)]">
                {lowStockItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div>
                      <span className="text-sm text-[var(--admin-fg-base)]">
                        {item.variant?.title ?? item.variantId}
                      </span>
                      <span className="ml-2 text-xs text-[var(--admin-fg-muted)]">
                        {item.stockLocation?.name ?? ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--admin-fg-error)]">
                        {item.available} left
                      </span>
                      {item.lowStockThreshold && (
                        <span className="text-xs text-[var(--admin-fg-muted)]">
                          (threshold: {item.lowStockThreshold})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ContainerBody>
        </Container>
      </div>
    </div>
  );
}
