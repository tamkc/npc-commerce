import { AdminProviders } from "@/providers/admin-provider";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminTopbar } from "@/components/admin/layout/AdminTopbar";
import type { Metadata } from "next";
import "./admin-globals.css";

export const metadata: Metadata = {
  title: {
    default: "NPC Admin",
    template: "%s | NPC Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <div className="min-h-screen bg-[var(--admin-bg-subtle)]">
        <AdminSidebar />
        <div className="pl-[220px]">
          <AdminTopbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AdminProviders>
  );
}
