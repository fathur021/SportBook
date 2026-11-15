import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/format-rupiah";
import { recentBookings, type RecentBooking } from "@/lib/mock-dashboard";

const statusStyles: Record<RecentBooking["status"], string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-emerald-50 text-emerald-700",
  COMPLETED: "bg-blue-50 text-blue-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const statusLabels: Record<RecentBooking["status"], string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export function RecentBookingsTable() {
  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-900">Booking Terbaru</h2>
          <p className="mt-1 text-xs text-slate-500">
            Lima pemesanan terakhir yang masuk ke sistem.
          </p>
        </div>

        <Link
          href="/admin/bookings"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800"
        >
          Kelola booking
          <ArrowRight className="size-3.5" />
        </Link>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-5">Kode Order</TableHead>
            <TableHead>Pelanggan</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Jadwal</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="pr-5">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {recentBookings.map((booking) => (
            <TableRow key={booking.id} className="hover:bg-slate-50/70">
              <TableCell className="py-3 pl-5 font-mono text-sm font-semibold text-slate-900">
                {booking.orderCode}
              </TableCell>
              <TableCell className="py-3 text-sm text-slate-700">
                {booking.customer}
              </TableCell>
              <TableCell className="py-3">
                <p className="text-sm text-slate-700">{booking.venue}</p>
                <p className="text-xs text-slate-500">{booking.court}</p>
              </TableCell>
              <TableCell className="py-3">
                <p className="text-sm text-slate-700">{booking.playDate}</p>
                <p className="text-xs text-slate-500">{booking.time}</p>
              </TableCell>
              <TableCell className="py-3 whitespace-nowrap font-semibold text-slate-900">
                {formatRupiah(booking.amount)}
              </TableCell>
              <TableCell className="py-3 pr-5">
                <Badge
                  variant="secondary"
                  className={statusStyles[booking.status]}
                >
                  {statusLabels[booking.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
