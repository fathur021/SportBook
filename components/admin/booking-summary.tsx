import { CalendarDays, Clock3, MapPin, ReceiptText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { BookingItem } from "@/lib/mock-bookings";
import { formatRupiah } from "@/lib/format-rupiah";

type BookingSummaryProps = {
  booking: BookingItem | null;
};

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

export function BookingSummary({ booking }: BookingSummaryProps) {
  return (
    <aside className="h-fit rounded-xl border border-slate-200 bg-white shadow-sm">
      {booking ? (
        <>
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Booking Summary
            </p>
            <div className="mt-2 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">{booking.orderId}</h2>
                <p className="mt-1 text-sm text-slate-500">ID: {booking.id}</p>
              </div>
              <Badge variant="outline" className={statusStyles[booking.status]}>
                {statusLabels[booking.status]}
              </Badge>
            </div>
          </div>

          <div className="space-y-5 p-5">
            <div className="space-y-3">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {booking.venueName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {booking.venueAddress}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <ReceiptText className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {booking.sportLabel}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {booking.courtLabel}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <p className="text-sm text-slate-700">{booking.date}</p>
              </div>
              <div className="flex gap-3">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-slate-400" />
                <p className="text-sm text-slate-700">
                  {booking.timeSlot} · {booking.durationHours} jam
                </p>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 pt-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Metode pembayaran</span>
                <span className="font-medium text-slate-900">
                  {booking.paymentMethod}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-lg font-bold text-emerald-700">
                  {formatRupiah(booking.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-sm text-slate-500">
          Belum ada booking untuk ditampilkan.
        </div>
      )}
    </aside>
  );
}
