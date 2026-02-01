"use client";

import { cn } from "@/lib/admin/utils";

interface TableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render?: (item: T) => React.ReactNode;
  accessor?: keyof T;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowKey?: (item: T, index: number) => string | number;
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--admin-bg-field-hover)]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function Table<T>({
  columns,
  data,
  onRowClick,
  isLoading,
  emptyMessage = "No data found",
  className,
  rowKey,
}: TableProps<T>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-[var(--admin-border-base)]",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--admin-border-base)] bg-[var(--admin-bg-subtle)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-2.5 text-xs font-medium text-[var(--admin-fg-muted)] uppercase tracking-wider",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border-base)]">
            {isLoading ? (
              <TableSkeleton columns={columns.length} />
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-[var(--admin-fg-muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={rowKey ? rowKey(item, index) : (item as Record<string, unknown>).id as string ?? index}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "bg-[var(--admin-bg-component)] transition-colors",
                    onRowClick &&
                      "cursor-pointer hover:bg-[var(--admin-bg-field-hover)]",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-sm text-[var(--admin-fg-base)]",
                        col.className,
                      )}
                    >
                      {col.render
                        ? col.render(item)
                        : col.accessor
                          ? String(item[col.accessor] ?? "")
                          : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
