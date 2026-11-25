// "use client" wajib karena komponen ini memakai hook Redux.
"use client";

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
import {
  useGetAdminBookingsQuery,
  type AdminBooking,
} from "@/lib/redux/admin-api";
import { formatRupiah } from "@/lib/format-rupiah";

const statusStyles: Record<AdminBooking["status"], string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-emerald-50 text-emerald-700",
  COMPLETED: "bg-blue-50 text-blue-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const statusLabels: Record<AdminBooking["status"], string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

// Ubah "2026-11-17" jadi "17 Nov 2026" sesuai tampilan Indonesia.
function formatPlayDate(dateKey: string) {
  return new Date(`${dateKey}T00:00:00+07:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

export function RecentBookingsTable() {
  // Ambil data asli dari endpoint booking admin.
  const { data, isLoading, isError } = useGetAdminBookingsQuery();

  // Urutkan dari yang paling baru dibuat, lalu ambil lima saja.
  // Salin dulu dengan [...data] supaya array asli dari Redux tidak diubah.
  const latestBookings = [...(data ?? [])]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  // Selama memuat, tampilkan kotak abu-abu berdenyut.
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-5 space-y-3">
          {[0, 1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-8 animate-pulse rounded bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  // Kalau gagal, beri pesan tanpa membuat halaman rusak.
  if (isError || !data) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
        Gagal memuat booking terbaru.
      </div>
    );
  }

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

      {latestBookings.length === 0 ? (
        <p className="px-5 py-6 text-sm text-slate-500">
          Belum ada booking masuk.
        </p>
      ) : (
        <Table className="min-w-[720px]">
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
            {latestBookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-slate-50/70">
                <TableCell className="py-3 pl-5 font-mono text-sm font-semibold text-slate-900">
                  {booking.orderCode}
                </TableCell>
                <TableCell className="py-3 text-sm text-slate-700">
                  {booking.user?.name ?? "-"}
                </TableCell>
                <TableCell className="py-3">
                  <p className="text-sm text-slate-700">
                    {booking.court.venue?.name ?? "-"}
                  </p>
                  <p className="text-xs text-slate-500">{booking.court.name}</p>
                </TableCell>
                <TableCell className="py-3">
                  <p className="text-sm text-slate-700">
                    {formatPlayDate(booking.playDate)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {booking.startTime} - {booking.endTime}
                  </p>
                </TableCell>
                <TableCell className="py-3 whitespace-nowrap font-semibold text-slate-900">
                  {formatRupiah(booking.totalPrice)}
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
      )}
    </section>
  );
}
