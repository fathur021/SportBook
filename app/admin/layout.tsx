import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { auth } from "@/lib/auth";
import { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login?next=/admin");
  }
  if (session.user.role !== "ADMIN") {
    // bukan admin → juga diarahkan ke login (sesuai permintaan)
    redirect("/login?next=/admin");
  }
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <header
          className="sticky top-0 z-30 flex h-16 items-center justify-between
        border-b border-slate-200 bg-white px-6"
        >
          <h2 className="text-sm font-semibold text-slate-700">
            Dashboard Panel
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
              Halo {session.user.name}{" "}
              {/* [UBAH] — dari hardcoded "Halo Admin" */}
            </span>
            <div
              className="h-8 w-8 rounded-full bg-emerald-600
            text-white flex items-center justify-center
             font-bold text-xs"
            >
              {/* [ herbsNama initials, opsional ubah — biarkan "AD" kalau malas */}
              {session.user.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
