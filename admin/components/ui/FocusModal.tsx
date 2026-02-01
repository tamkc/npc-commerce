"use client";

import { useEffect, type ComponentPropsWithoutRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FocusModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function FocusModal({ open, onClose, children }: FocusModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--admin-bg-base)] animate-in fade-in duration-150">
      {children}
    </div>
  );
}

function FocusModalHeader({
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
      <div className="flex items-center gap-3">{children}</div>
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

function FocusModalBody({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto px-6 py-6", className)}
      {...props}
    />
  );
}

function FocusModalFooter({
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

FocusModal.Header = FocusModalHeader;
FocusModal.Body = FocusModalBody;
FocusModal.Footer = FocusModalFooter;
