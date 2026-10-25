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
import type { BookingItem } from "@/lib/mock-bookings";

const statusLabels: Record<BookingItem["status"], string> = {
  upcoming: "Akan datang",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const statusStyles: Record<BookingItem["status"], string> = {
  upcoming: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

export function RecentTransactionsTable({
  bookings,
}: {
  bookings: BookingItem[];
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">Transaksi Terbaru</h2>
        <p className="mt-1 text-sm text-slate-500">
          Booking yang sesuai dengan filter periode dan venue.
        </p>
      </div>

      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="pl-5">ID Booking</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Metode</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead className="pr-5">Status Booking</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="pl-5 font-medium text-slate-900">
                  {booking.orderId}
                </TableCell>
                <TableCell className="text-slate-600">
                  {booking.date}
                </TableCell>
                <TableCell className="text-slate-600">
                  {booking.venueName}
                </TableCell>
                <TableCell className="text-slate-600">
                  {booking.paymentMethod}
                </TableCell>
                <TableCell className="font-semibold text-slate-900">
                  {formatRupiah(booking.totalPrice)}
                </TableCell>
                <TableCell className="pr-5">
                  <Badge
                    variant="outline"
                    className={statusStyles[booking.status]}
                  >
                    {statusLabels[booking.status]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                Tidak ada transaksi untuk filter ini.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
