import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";

import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats";
import { OperationalHighlightsCard } from "@/components/admin/dashboard/operational-highlights-card";
import { RecentBookingsTable } from "@/components/admin/dashboard/recent-bookings-table";
import { RevenueTrendChart } from "@/components/admin/dashboard/revenue-trend-chart";
import { TodayScheduleCard } from "@/components/admin/dashboard/today-schedule-card";
import { VenueRevenueChart } from "@/components/admin/dashboard/venue-revenue-chart";

// Tanggal hari ini dalam format Indonesia, dipakai di header.
const today = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Ringkasan SportBook
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Pantau pendapatan, booking, dan kondisi lapangan dalam satu tempat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium capitalize text-slate-600 shadow-sm">
            <CalendarDays className="size-4 text-slate-400" />
            {today}
          </span>
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
          >
            Lihat laporan
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </header>

      <DashboardStats />

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <header className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Tren Pendapatan Harian
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Dua minggu terakhir, hanya pembayaran lunas.
            </p>
          </header>
          <div className="flex-1 px-3 py-4 sm:px-5">
            <RevenueTrendChart />
          </div>
        </section>

        <section className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Pendapatan per Venue
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              6 venue tertinggi · 30 hari terakhir.
            </p>
          </header>
          <div className="flex-1 px-3 py-4 sm:px-5">
            <VenueRevenueChart />
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <TodayScheduleCard />
        </div>
        <OperationalHighlightsCard />
      </div>

      <RecentBookingsTable />
    </div>
  );
}
