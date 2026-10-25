"use client";

import { useMemo, useState } from "react";

import { RecentTransactionsTable } from "@/components/admin/reports/recent-transactions-table";
import { ReportFilters } from "@/components/admin/reports/report-filters";
import { ReportSummaryCards } from "@/components/admin/reports/report-summary-cards";
import { VenueBookingTotals } from "@/components/admin/reports/venue-booking-totals";
import { INITIAL_BOOKINGS } from "@/lib/mock-bookings";

const monthNumbers: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  Mei: 4,
  Jun: 5,
  Jul: 6,
  Agu: 7,
  Sep: 8,
  Okt: 9,
  Nov: 10,
  Des: 11,
};

function parseBookingDate(dateLabel: string): Date | null {
  const dateParts = dateLabel.split(", ").at(-1)?.split(" ");
  if (!dateParts || dateParts.length !== 3) return null;

  const [day, month, year] = dateParts;
  const monthNumber = monthNumbers[month];
  if (monthNumber === undefined) return null;

  return new Date(Number(year), monthNumber, Number(day));
}
    

export default function AdminReportsPage() {
  const [selectedVenue, setSelectedVenue] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const venueOptions = Array.from(
    new Map(
      INITIAL_BOOKINGS.map((booking) => [booking.venueSlug, booking.venueName]),
    ),
    ([slug, name]) => ({ slug, name }),
  );

  const filteredBookings = useMemo(() => {
    const cutoff =
      selectedPeriod === "all"
        ? null
        : new Date(Date.now() - Number(selectedPeriod) * 24 * 60 * 60 * 1000);

    return INITIAL_BOOKINGS.filter((booking) => {
      if (selectedVenue !== "all" && booking.venueSlug !== selectedVenue) {
        return false;
      }

      if (cutoff) {
        const bookingDate = parseBookingDate(booking.date);
        if (!bookingDate || bookingDate < cutoff) return false;
      }

      return true;
    });
  }, [selectedPeriod, selectedVenue]);

  const nonCancelledBookings = filteredBookings.filter(
    (booking) => booking.status !== "cancelled",
  );
  const bookingValue = nonCancelledBookings.reduce(
    (total, booking) => total + booking.totalPrice,
    0,
  );
  const cancelledCount = filteredBookings.length - nonCancelledBookings.length;

  const venueTotals = Array.from(
    nonCancelledBookings.reduce((totals, booking) => {
      totals.set(
        booking.venueName,
        (totals.get(booking.venueName) ?? 0) + booking.totalPrice,
      );
      return totals;
    }, new Map<string, number>()),
    ([venueName, total]) => ({ venueName, total }),
  ).sort((a, b) => b.total - a.total);

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Laporan Keuangan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan nilai booking dan transaksi per venue.
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

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Data mock belum memiliki status pembayaran. Nilai di bawah ini adalah
        total booking yang tidak dibatalkan, belum merupakan verifikasi uang
        yang sudah diterima.
      </div>

      <ReportSummaryCards
        bookingValue={bookingValue}
        bookingCount={nonCancelledBookings.length}
        cancelledCount={cancelledCount}
      />

      <VenueBookingTotals venues={venueTotals} />

      <RecentTransactionsTable bookings={filteredBookings} />
    </main>
  );
}
