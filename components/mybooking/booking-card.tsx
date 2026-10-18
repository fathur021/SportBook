import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/format-rupiah";
import { Calendar, Clock, QrCode, RotateCw } from "lucide-react";
import type { BookingItem } from "@/lib/mock-bookings";

interface BookingCardProps {
  booking: BookingItem;
}

export function BookingCard({ booking }: BookingCardProps) {
  const isUpcoming = booking.status === "upcoming";

  return (
    <Card className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5">
      {/* Sisi Kiri: Foto Venue & Informasi Jadwal */}
      <div className="flex items-start gap-4">
        {/* Gambar Venue */}
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
          <Image
            src={booking.venueImage}
            alt={booking.venueName}
            fill
            className="object-cover"
          />
          <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white">
            {booking.sportLabel}
          </span>
        </div>

        {/* Detail Info */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-slate-500">
              {booking.orderId}
            </span>
            <Badge
              variant="secondary"
              className={`text-[10px] font-bold capitalize ${
                isUpcoming
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : booking.status === "completed"
                  ? "bg-slate-100 text-slate-600"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {isUpcoming ? "Confirmed / Paid" : booking.status}
            </Badge>
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {booking.venueName}
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            {booking.courtLabel}
          </p>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1 font-medium text-slate-800">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              {booking.date}
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-800">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              {booking.timeSlot} ({booking.durationHours}h)
            </span>
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Harga & Tombol Aksi */}
      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 gap-3 shrink-0">
        <div className="text-left md:text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Paid
          </span>
          <p className="text-base font-extrabold text-slate-900">
            {formatRupiah(booking.totalPrice)}
          </p>
        </div>

        <div>
          {isUpcoming ? (
            <Link
              href={`/checkout/success?order_id=${booking.orderId}&venue=${booking.venueSlug}`}
              className="flex items-center gap-1.5 rounded-xl bg-[#03624c] hover:bg-[#02523f] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition"
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>View Pass</span>
            </Link>
          ) : (
            <Link
              href={`/venues/${booking.venueSlug}`}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>Book Again</span>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
