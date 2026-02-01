import { AdminProviders } from "@/providers/admin-provider";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminTopbar } from "@/components/admin/layout/AdminTopbar";

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
