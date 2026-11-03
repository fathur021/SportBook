"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Building2,
  Clock,
  Dumbbell,
  BarChart3,
  Settings,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const MENU_GROUPS = [
  {
    groupLabel: "OPERASIONAL",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Kelola Booking", href: "/admin/bookings", icon: CalendarCheck },
      { label: "Jadwal & Slot", href: "/admin/schedule", icon: Clock },
      { label: "Data Lapangan", href: "/admin/venues", icon: Building2 },
      { label: "Sewa Peralatan", href: "/admin/equipments", icon: Dumbbell },
    ],
  },
  {
    groupLabel: "ANALITIK & SISTEM",
    items: [
      { label: "Laporan Keuangan", href: "/admin/reports", icon: BarChart3 },
      { label: "Pengaturan", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathName = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // Hapus sesi di server + cookie, lalu keluar dari halaman admin
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/admin" className="text-lg font-bold tracking-tight text-slate-900">
          SportBook
        </Link>
        <Badge
          variant="secondary"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold text-[10px]"
        >
          Admin
        </Badge>
      </div>

      <Separator />

      {/* Navigasi Menu Berkelompok */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {MENU_GROUPS.map((group) => (
          <div key={group.groupLabel} className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {group.groupLabel}
            </p>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathName === "/admin"
                    : pathName.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full justify-start gap-3 h-9 px-3 text-xs font-semibold",
                      isActive
                        ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        isActive ? "text-emerald-700" : "text-slate-400"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <Separator />

      {/* Tombol Kembali ke Website Publik & Logout */}
      <div className="p-3 space-y-1">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-full justify-start gap-2 text-xs text-slate-500 hover:text-slate-900"
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
          <span>Ke Website Customer</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-full justify-start gap-2 text-xs text-slate-500 hover:text-red-600"
          )}
        >
          <LogOut className="h-3.5 w-3.5 text-slate-400 hover:text-red-600" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}