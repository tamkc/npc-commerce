"use client";

import { useEffect, type ComponentPropsWithoutRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Drawer({ open, onClose, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />
      <div className="relative flex w-full max-w-lg flex-col bg-[var(--admin-bg-base)] shadow-xl animate-in slide-in-from-right duration-200">
        {children}
      </div>
    </div>
  );
}

function DrawerHeader({
  className,
  children,
  onClose,
  ...props
}: ComponentPropsWithoutRef<"div"> & { onClose?: () => void }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-[var(--admin-border-base)] px-6 py-4",
        className,
      )}
      {...props}
    >
      <div>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--admin-fg-muted)] transition-colors hover:bg-[var(--admin-bg-field-hover)] hover:text-[var(--admin-fg-base)]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function DrawerBody({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto px-6 py-4", className)}
      {...props}
    />
  );
}

function DrawerFooter({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t border-[var(--admin-border-base)] px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}

Drawer.Header = DrawerHeader;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;
