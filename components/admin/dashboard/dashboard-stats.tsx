"use client";

import {
  Banknote,
  CalendarCheck,
  Hourglass,
  ReceiptText,
  Wallet,
} from "lucide-react";

import { formatRupiah } from "@/lib/format-rupiah";
import { useGetAdminDashboardQuery } from "@/lib/redux/admin-api";
import { cn } from "@/lib/utils";

const STAT_STYLES = {
  total: { icon: Banknote, iconClass: "bg-emerald-600 text-white" },
  revenue: { icon: Wallet, iconClass: "bg-emerald-50 text-emerald-700" },
  paid: { icon: ReceiptText, iconClass: "bg-blue-50 text-blue-700" },
  pending: { icon: Hourglass, iconClass: "bg-amber-50 text-amber-700" },
  today: { icon: CalendarCheck, iconClass: "bg-slate-100 text-slate-600" },
} as const;

const GRID = "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";

export function DashboardStats() {
  const { data, isLoading, isError } = useGetAdminDashboardQuery();

  if (isLoading) {
    return (
      <section className={GRID} aria-label="Memuat ringkasan dashboard">
        {[0, 1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-[132px] animate-pulse rounded-xl border border-slate-200 bg-white"
          />
        ))}
      </section>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-6 text-center text-sm text-rose-700">
        Gagal memuat ringkasan dashboard. Coba muat ulang halaman.
      </div>
    );
  }

  const stats = [
    {
      key: "total" as const,
      label: "Total Pendapatan",
      value: formatRupiah(data.totalRevenue),
      note: "Semua pembayaran lunas",
    },
    {
      key: "revenue" as const,
      label: "Pendapatan Hari Ini",
      value: formatRupiah(data.revenueToday),
      note: `${data.paidBookingsToday} transaksi lunas hari ini`,
    },
    {
      key: "paid" as const,
      label: "Booking Lunas",
      value: data.paidBookingsToday.toLocaleString("id-ID"),
      note: "Pembayaran masuk hari ini",
    },
    {
      key: "pending" as const,
      label: "Menunggu Pembayaran",
      value: data.waitingPayments.toLocaleString("id-ID"),
      note: "Booking yang belum dibayar",
    },
    {
      key: "today" as const,
      label: "Booking Hari Ini",
      value: data.bookingsToday.toLocaleString("id-ID"),
      note: "Tidak termasuk yang dibatalkan",
    },
  ];

  return (
    <section className={GRID}>
      {stats.map((stat) => {
        const style = STAT_STYLES[stat.key];
        const Icon = style.icon;
        const isPrimary = stat.key === "total";

        return (
          <article
            key={stat.key}
            className={cn(
              "relative min-w-0 overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5",
              isPrimary
                ? "border-emerald-200 ring-1 ring-emerald-100"
                : "border-slate-200",
            )}
          >
            {isPrimary && (
              <span className="absolute inset-x-0 top-0 h-0.5 bg-emerald-500" />
            )}

            <div className="flex items-start justify-between gap-3">
              <p className="truncate text-xs font-medium text-slate-500">
                {stat.label}
              </p>
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  style.iconClass,
                )}
              >
                <Icon className="size-4" />
              </span>
            </div>

            <p
              className={cn(
                "mt-3 truncate font-bold tracking-tight text-slate-900",
                isPrimary ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
              )}
              title={stat.value}
            >
              {stat.value}
            </p>
            <p className="mt-1 truncate text-[11px] text-slate-500">
              {stat.note}
            </p>
          </article>
        );
      })}
    </section>
  );
}
