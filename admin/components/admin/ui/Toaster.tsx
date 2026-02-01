"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        className: "admin-toast",
        style: {
          background: "var(--admin-bg-base)",
          border: "1px solid var(--admin-border-base)",
          color: "var(--admin-fg-base)",
          fontSize: "13px",
        },
      }}
      closeButton
      richColors
    />
  );
}
