import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(d);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getStatusColor(
  status: string,
): "green" | "blue" | "orange" | "red" | "purple" | "neutral" {
  const map: Record<string, "green" | "blue" | "orange" | "red" | "purple" | "neutral"> = {
    PUBLISHED: "green",
    ACTIVE: "green",
    CONFIRMED: "green",
    DELIVERED: "green",
    CAPTURED: "green",
    FULFILLED: "green",
    SHIPPED: "blue",
    PROCESSING: "blue",
    AWAITING: "blue",
    REQUIRES_ACTION: "blue",
    PENDING: "orange",
    DRAFT: "neutral",
    NOT_PAID: "neutral",
    NOT_FULFILLED: "neutral",
    CANCELLED: "red",
    CANCELED: "red",
    FAILED: "red",
    REFUNDED: "purple",
    PARTIALLY_REFUNDED: "purple",
    PARTIALLY_FULFILLED: "orange",
    RETURNED: "orange",
    ARCHIVED: "neutral",
  };
  return map[status] ?? "neutral";
}
