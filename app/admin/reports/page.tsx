"use client";

import { useState } from "react";

import { RecentTransactionsTable } from "@/components/admin/reports/recent-transactions-table";
import { ReportFilters } from "@/components/admin/reports/report-filters";
import { ReportSummaryCards } from "@/components/admin/reports/report-summary-cards";
import { VenueBookingTotals } from "@/components/admin/reports/venue-booking-totals";
import {
  useGetAdminReportQuery,
  useGetAdminVenuesQuery,
  type ReportPeriod,
} from "@/lib/redux/admin-api";

export default function AdminReportsPage() {
  // "all" berarti semua venue, selain itu berisi slug venue
  const [selectedVenue, setSelectedVenue] = useState("all");

  // Periode laporan: all, 30 hari, atau 90 hari
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>("all");

  // Kata kunci untuk tabel transaksi
  const [transactionQuery, setTransactionQuery] = useState("");

  // Daftar venue untuk pilihan filter
  const { data: venues } = useGetAdminVenuesQuery();

  // Data laporan diambil dari API setiap filter berubah.
  // RTK Query otomatis fetch ulang karena argumennya berubah.
  const { data: report, isLoading, isError } = useGetAdminReportQuery({
    venueSlug: selectedVenue === "all" ? undefined : selectedVenue,
    period: selectedPeriod,
  });

  const venueOptions = (venues ?? []).map((venue) => ({
    slug: venue.slug,
    name: venue.name,
  }));

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Laporan Keuangan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan pendapatan dari pembayaran yang sudah lunas.
          </p>
        </div>

        <ReportFilters
          selectedPeriod={selectedPeriod}
          selectedVenue={selectedVenue}
          venues={venueOptions}
          onPeriodChange={setSelectedPeriod}
          onVenueChange={setSelectedVenue}
        />
      </div>

      {/* Tampilkan loading saat data pertama kali diambil */}
      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-500">
          Memuat laporan keuangan...
        </div>
      ) : isError || !report ? (
        // Tampilkan error kalau API gagal atau data kosong
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-8 text-center text-sm text-rose-700">
          Gagal memuat laporan keuangan. Coba muat ulang halaman.
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Angka pendapatan hanya menghitung pembayaran berstatus lunas.
            Periode dihitung dari tanggal pembayaran, sedangkan booking
            dibatalkan dihitung dari tanggal main.
          </div>

          <ReportSummaryCards
            revenue={report.revenue}
            paidTransactionCount={report.paidTransactionCount}
            cancelledBookingCount={report.cancelledBookingCount}
          />

          <VenueBookingTotals venues={report.venues} />

          <RecentTransactionsTable
            transactions={report.transactions}
            query={transactionQuery}
            onQueryChange={setTransactionQuery}
          />
        </>
      )}
    </main>
  );
}