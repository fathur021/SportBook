"use client";

import { formatRupiah } from "@/lib/format-rupiah";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookingRowActions } from "@/components/admin/booking-row-actions";
import type { AdminBooking } from "@/lib/redux/admin-api";
import {
  CalendarDays,
  ClipboardList,
  Clock,
  MapPin,
  User,
} from "lucide-react";

export function BookingTable({ bookings }: { bookings: AdminBooking[] }) {
  return (
    <Table className="min-w-[1080px]">
      <TableHeader className="bg-white">
        <TableRow>
          <TableHead className="min-w-[140px] pl-4">Kode Order</TableHead>
          <TableHead className="min-w-[160px]">Pelanggan</TableHead>
          <TableHead className="min-w-[180px]">Venue & Court</TableHead>
          <TableHead className="min-w-[150px]">Tanggal & Waktu</TableHead>
          <TableHead className="w-[90px]">Durasi</TableHead>
          <TableHead className="w-[150px]">Total</TableHead>
          <TableHead className="w-[130px]">Status</TableHead>
          <TableHead className="w-[130px]">Pembayaran</TableHead>
          <TableHead className="w-[160px] pr-4 text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <TableRow
              key={booking.id}
              className="align-middle hover:bg-slate-50/70"
            >
              <TableCell className="py-3 pl-4">
                <span className="inline-flex rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-800">
                  {booking.orderCode}
                </span>
              </TableCell>

              <TableCell className="py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-700 ring-2 ring-white">
                    {getInitials(booking.user?.name ?? "-")}
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 truncate text-sm font-medium text-slate-900">
                      <User className="size-3.5 shrink-0 text-slate-400" />
                      {booking.user?.name ?? "-"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {booking.user?.email ?? "-"}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium text-slate-900">
                    <MapPin className="size-3.5 shrink-0 text-slate-400" />
                    {booking.court?.venue?.name ?? "-"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {booking.court?.name ?? "-"}
                  </p>
                </div>
              </TableCell>

              <TableCell className="py-3">
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-sm text-slate-700">
                    <CalendarDays className="size-3.5 text-slate-400" />
                    {formatDate(booking.playDate)}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="size-3 text-slate-400" />
                    {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              </TableCell>

              <TableCell className="py-3">
                <span className="text-sm font-medium text-slate-700">
                  {booking.durationHour} jam
                </span>
              </TableCell>

              <TableCell className="py-3">
                <span className="whitespace-nowrap font-semibold text-emerald-700">
                  {formatRupiah(booking.totalPrice)}
                </span>
              </TableCell>

              <TableCell className="py-3">
                <Badge
                  variant="secondary"
                  className={`gap-1.5 font-medium ${getStatusBadgeClass(booking.status)}`}
                >
                  <span
                    className={`size-1.5 rounded-full ${getStatusDotClass(booking.status)}`}
                  />
                  {getStatusLabel(booking.status)}
                </Badge>
              </TableCell>

              <TableCell className="py-3">
                {booking.payment ? (
                  <Badge
                    variant="secondary"
                    className={`gap-1.5 font-medium ${getPaymentBadgeClass(booking.payment.status)}`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${getPaymentDotClass(booking.payment.status)}`}
                    />
                    {getPaymentLabel(booking.payment.status)}
                  </Badge>
                ) : (
                  <span className="text-xs text-slate-400">Belum bayar</span>
                )}
              </TableCell>

              <TableCell className="py-3 pr-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <BookingRowActions booking={booking} />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={9}
              className="h-28 text-center text-muted-foreground"
            >
              <span className="inline-flex flex-col items-center gap-2">
                <ClipboardList className="size-5" />
                Tidak ada booking yang cocok dengan pencarian atau filter.
              </span>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "CONFIRMED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "COMPLETED":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "CANCELLED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getStatusDotClass(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-amber-500";
    case "CONFIRMED":
      return "bg-emerald-500";
    case "COMPLETED":
      return "bg-blue-500";
    case "CANCELLED":
      return "bg-rose-500";
    default:
      return "bg-slate-400";
  }
}

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

function getPaymentBadgeClass(status: string): string {
  switch (status) {
    case "PAID":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "FAILED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getPaymentDotClass(status: string): string {
  switch (status) {
    case "PAID":
      return "bg-emerald-500";
    case "PENDING":
      return "bg-amber-500";
    case "FAILED":
      return "bg-rose-500";
    default:
      return "bg-slate-400";
  }
}

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
