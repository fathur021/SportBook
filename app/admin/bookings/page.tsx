"use client";

import { useState } from "react";

import { BookingSummary } from "@/components/admin/booking-summary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { INITIAL_BOOKINGS, type BookingItem } from "@/lib/mock-bookings";
import { formatRupiah } from "@/lib/format-rupiah";

const statusStyles: Record<BookingItem["status"], string> = {
  upcoming: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

const statusLabels: Record<BookingItem["status"], string> = {
  upcoming: "Akan datang",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export default function AdminBookingPage() {
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(
    INITIAL_BOOKINGS[0] ?? null,
  );

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Kelola Booking
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Pantau jadwal dan rincian booking venue.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
        <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">Daftar Booking</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {INITIAL_BOOKINGS.length} booking
              </p>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="min-w-[150px] pl-5">Booking</TableHead>
                <TableHead className="min-w-[220px]">Venue &amp; Jadwal</TableHead>
                <TableHead className="min-w-[130px]">Total</TableHead>
                <TableHead className="pr-5">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INITIAL_BOOKINGS.map((booking) => {
                const isSelected = selectedBooking?.id === booking.id;

                return (
                  <TableRow
                    key={booking.id}
                    aria-selected={isSelected}
                    onClick={() => setSelectedBooking(booking)}
                    className={`cursor-pointer ${isSelected ? "bg-emerald-50/70 hover:bg-emerald-50" : "hover:bg-slate-50/70"}`}
                  >
                    <TableCell className="py-4 pl-5">
                      <p className="font-semibold text-slate-900">
                        {booking.orderId}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        ID: {booking.id}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="font-medium text-slate-900">
                        {booking.venueName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {booking.courtLabel} · {booking.date}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {booking.timeSlot} · {booking.durationHours} jam
                      </p>
                    </TableCell>
                    <TableCell className="py-4 font-semibold text-slate-900">
                      {formatRupiah(booking.totalPrice)}
                    </TableCell>
                    <TableCell className="py-4 pr-5">
                      <Badge
                        variant="outline"
                        className={statusStyles[booking.status]}
                      >
                        {statusLabels[booking.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </section>

        <BookingSummary booking={selectedBooking} />
      </div>
    </main>
  );
}
