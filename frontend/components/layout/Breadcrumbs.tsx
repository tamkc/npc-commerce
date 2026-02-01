import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
      <Link
        href="/"
        className="hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-zinc-900 dark:text-white">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
