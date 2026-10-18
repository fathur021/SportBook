import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/format-rupiah";
import { QrCode, RotateCw } from "lucide-react";
import type { BookingItem } from "@/lib/mock-bookings";

interface BookingTableProps {
  bookings: BookingItem[];
}

export function BookingTable({ bookings }: BookingTableProps) {
  return (
    <Card className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Header Tabel */}
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th className="py-3.5 px-4">Order ID</th>
              <th className="py-3.5 px-4">Venue & Court</th>
              <th className="py-3.5 px-4">Schedule</th>
              <th className="py-3.5 px-4">Total Paid</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>

          {/* Baris Data */}
          <tbody className="divide-y divide-slate-100">
            {bookings.map((booking) => {
              const isUpcoming = booking.status === "upcoming";

              return (
                <tr key={booking.id} className="hover:bg-slate-50/60 transition">
                  {/* Kolom 1: Order ID */}
                  <td className="py-4 px-4 font-mono font-bold text-slate-800">
                    {booking.orderId}
                  </td>

                  {/* Kolom 2: Venue & Lapangan */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900">{booking.venueName}</p>
                    <p className="text-slate-500 text-[11px]">{booking.courtLabel} ({booking.sportLabel})</p>
                  </td>

                  {/* Kolom 3: Jadwal */}
                  <td className="py-4 px-4">
                    <p className="font-semibold text-slate-800">{booking.date}</p>
                    <p className="text-slate-500 text-[11px]">{booking.timeSlot} • {booking.durationHours}h</p>
                  </td>

                  {/* Kolom 4: Total Harga */}
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {formatRupiah(booking.totalPrice)}
                    <span className="block text-[10px] font-normal text-slate-400">
                      {booking.paymentMethod}
                    </span>
                  </td>

                  {/* Kolom 5: Status Badge */}
                  <td className="py-4 px-4">
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
                      {isUpcoming ? "Paid" : booking.status}
                    </Badge>
                  </td>

                  {/* Kolom 6: Aksi */}
                  <td className="py-4 px-4 text-right">
                    {isUpcoming ? (
                      <Link
                        href={`/checkout/success?order_id=${booking.orderId}&venue=${booking.venueSlug}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#03624c] hover:bg-[#02523f] px-3 py-1.5 text-xs font-bold text-white transition shadow-2xs"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        <span>Pass</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/venues/${booking.venueSlug}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                        <span>Rebook</span>
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
