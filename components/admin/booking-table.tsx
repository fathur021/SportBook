"use client";

import { formatRupiah } from "@/lib/format-rupiah"; // ← format harga ke Rupiah
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // ← komponen tabel
import { Badge } from "@/components/ui/badge"; // ← badge status
import { BookingRowActions } from "@/components/admin/booking-row-actions"; // ← bagian 3
import type { AdminBooking } from "@/lib/redux/admin-api"; // ← tipe data booking
import { CalendarDays, Clock, User, MapPin, ClipboardList } from "lucide-react"; // ← ikon

export function BookingTable({ bookings }: { bookings: AdminBooking[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[120px] pl-4">Kode Order</TableHead>
          <TableHead className="min-w-[140px]">Pelanggan</TableHead>
          <TableHead className="min-w-[160px]">Venue & Court</TableHead>
          <TableHead className="min-w-[140px]">Tanggal & Waktu</TableHead>
          <TableHead className="w-[80px]">Durasi</TableHead>
          <TableHead className="w-[140px]">Total</TableHead>
          <TableHead className="w-[120px]">Status</TableHead>
          <TableHead className="w-[120px]">Pembayaran</TableHead>
          <TableHead className="w-[160px] pr-4 text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {bookings && bookings.length > 0 ? (
          // ← jika ada data, tampilkan baris
          bookings.map((booking) => (
            <TableRow
              key={booking.id}
              className="align-middle hover:bg-slate-50/70"
            >
              {/* Kolom 1: Kode Order */}
              <TableCell className="py-3 pl-4">
                <span className="font-mono text-sm font-semibold text-slate-900">
                  {booking.orderCode}
                </span>
              </TableCell>

              {/* Kolom 2: Pelanggan */}
              <TableCell className="py-3">
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    {booking.user?.name ?? "-"} {/* ← ?. karena user bisa undefined */}
                  </p>
                  <p className="text-xs text-slate-500">
                    {booking.user?.email ?? "-"}
                  </p>
                </div>
              </TableCell>

              {/* Kolom 3: Venue & Court */}
              <TableCell className="py-3">
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {booking.court?.venue?.name ?? "-"} {/* ← nested, ?. wajib */}
                  </p>
                  <p className="text-xs text-slate-500">
                    {booking.court?.name ?? "-"}
                  </p>
                </div>
              </TableCell>

              {/* Kolom 4: Tanggal & Waktu */}
              <TableCell className="py-3">
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-sm text-slate-700">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    {formatDate(booking.playDate)}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              </TableCell>

              {/* Kolom 5: Durasi */}
              <TableCell className="py-3">
                <span className="text-sm font-medium text-slate-700">
                  {booking.durationHour} jam
                </span>
              </TableCell>

              {/* Kolom 6: Total Harga */}
              <TableCell className="py-3">
                <span className="whitespace-nowrap font-semibold text-slate-900">
                  {formatRupiah(booking.totalPrice)}
                </span>
              </TableCell>

              {/* Kolom 7: Status Booking */}
              <TableCell className="py-3">
                <Badge
                  variant="secondary"
                  className={getStatusBadgeClass(booking.status)}
                >
                  {getStatusLabel(booking.status)}
                </Badge>
              </TableCell>

              {/* Kolom 8: Status Pembayaran */}
              <TableCell className="py-3">
                {booking.payment ? (
                  <Badge
                    variant="secondary"
                    className={getPaymentBadgeClass(booking.payment.status)}
                  >
                    {getPaymentLabel(booking.payment.status)}
                  </Badge>
                ) : (
                  <span className="text-xs text-slate-400">Belum bayar</span>
                )}
              </TableCell>

              {/* Kolom 9: Aksi */}
              <TableCell className="py-3 pr-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <BookingRowActions booking={booking} />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          // ← jika tidak ada data, tampilkan empty state
          <TableRow>
            <TableCell
              colSpan={9}
              className="h-24 text-center text-muted-foreground"
            >
              <span className="inline-flex items-center gap-2">
                <ClipboardList className="size-4" />
                Belum ada booking yang terdaftar.
              </span>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

// ============================================================================
// FUNGSI HELPER
// ============================================================================

// Format tanggal dari string "YYYY-MM-DD" ke format Indonesia
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00"); // ← tambah waktu agar tidak UTC shift
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Warna badge berdasarkan status booking
function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700";
    case "CONFIRMED":
      return "bg-emerald-50 text-emerald-700";
    case "COMPLETED":
      return "bg-blue-50 text-blue-700";
    case "CANCELLED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-50 text-slate-700";
  }
}

// Label status booking dalam bahasa Indonesia
function getStatusLabel(status: string): string {
  switch (status) {
    case "PENDING":
      return "Menunggu";
    case "CONFIRMED":
      return "Dikonfirmasi";
    case "COMPLETED":
      return "Selesai";
    case "CANCELLED":
      return "Dibatalkan";
    default:
      return status;
  }
}

// Warna badge berdasarkan status pembayaran
function getPaymentBadgeClass(status: string): string {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700";
    case "PENDING":
      return "bg-amber-50 text-amber-700";
    case "FAILED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-50 text-slate-700";
  }
}

// Label status pembayaran dalam bahasa Indonesia
function getPaymentLabel(status: string): string {
  switch (status) {
    case "PAID":
      return "Lunas";
    case "PENDING":
      return "Menunggu";
    case "FAILED":
      return "Gagal";
    default:
      return status;
  }
}