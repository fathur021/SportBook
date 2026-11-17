import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats";
import { OperationalHighlightsCard } from "@/components/admin/dashboard/operational-highlights-card";
import { RecentBookingsTable } from "@/components/admin/dashboard/recent-bookings-table";
import { RevenueTrendChart } from "@/components/admin/dashboard/revenue-trend-chart";
import { TodayScheduleCard } from "@/components/admin/dashboard/today-schedule-card";
import { VenueRevenueChart } from "@/components/admin/dashboard/venue-revenue-chart";
import { Badge } from "@/components/ui/badge";

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
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600">
              Data contoh
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan operasional dan pendapatan semua venue.
          </p>
        </div>
        <p className="text-xs font-medium text-slate-500">{today}</p>
      </header>

      <DashboardStats />

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <header className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Tren Pendapatan Harian
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Dua minggu terakhir, hanya pembayaran lunas.
            </p>
          </header>
          <div className="px-3 py-4 sm:px-5">
            <RevenueTrendChart />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Pendapatan per Venue
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Total lunas 30 hari terakhir.
            </p>
          </header>
          <div className="px-3 py-4 sm:px-5">
            <VenueRevenueChart />
          </div>
        </section>
      </div>

      <TodayScheduleCard />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentBookingsTable />
        </div>
        <OperationalHighlightsCard />
      </div>
    </div>
  );
}
