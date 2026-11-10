"use client"; // ← butuh state untuk filter

import { useState } from "react";
import { ArrowLeft, CalendarDays, ClipboardList } from "lucide-react"; // ← ikon
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // ← card layout
import { Button } from "@/components/ui/button"; // ← tombol
import { Badge } from "@/components/ui/badge"; // ← badge jumlah
import { BookingTable } from "@/components/admin/booking-table"; // ← tabel booking (bagian 2)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // ← dropdown filter status
import { Input } from "@/components/ui/input"; // ← input tanggal
import { useGetAdminBookingsQuery } from "@/lib/redux/admin-api"; // ← Redux query

export default function AdminBookingsPage() {
  // [+] State untuk filter
  const [playDate, setPlayDate] = useState(""); // ← tanggal main
  const [status, setStatus] = useState<string>(""); // ← status booking, tipe eksplisit

  // [+] Bangun parameter query hanya jika ada filter
  const queryParam =
    playDate || status
      ? { playDate: playDate || undefined, status: status || undefined }
      : undefined;

  // [+] Ambil data booking dari API via Redux
  const { data: bookings, isLoading, isError } =
    useGetAdminBookingsQuery(queryParam);

  // [+] Hitung jumlah booking per status (untuk badge)
  const pendingCount = bookings?.filter((b) => b.status === "PENDING").length ?? 0;
  const confirmedCount = bookings?.filter((b) => b.status === "CONFIRMED").length ?? 0;

  // [+] Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-2"
            nativeButton={false}
            render={<Link href="/admin/venues" />}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Kelola Booking
          </h1>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-sm text-slate-500">
              Memuat data booking...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // [+] Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-2"
            nativeButton={false}
            render={<Link href="/admin/venues" />}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Kelola Booking
          </h1>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-sm text-red-500">
              Gagal memuat data booking. Coba muat ulang halaman.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // [+] Main content
  return (
    <div className="space-y-6">
      {/* Header: Judul + Badge */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-2"
          nativeButton={false}
          render={<Link href="/admin/venues" />}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Kelola Booking
          </h1>
          {/* Badge: jumlah booking pending */}
          {pendingCount > 0 && (
            <Badge variant="secondary" className="bg-amber-50 text-amber-700">
              {pendingCount} Menunggu
            </Badge>
          )}
          {/* Badge: jumlah booking confirmed */}
          {confirmedCount > 0 && (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
              {confirmedCount} Dikonfirmasi
            </Badge>
          )}
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Kelola semua pemesanan lapangan dari semua venue.
        </p>
      </div>

      {/* Card: Filter + Tabel */}
      <Card className="py-0">
        <CardHeader className="border-b py-4">
          <CardTitle>Daftar Booking</CardTitle>
          <CardDescription>
            Semua pemesanan yang masuk ke sistem.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4">
          {/* Baris filter: Tanggal + Status */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Filter: Tanggal Main */}
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <Input
                  type="date"
                  value={playDate}
                  onChange={(e) => setPlayDate(e.target.value)}
                  placeholder="Filter tanggal"
                  className="w-40"
                />
              </div>

              {/* Filter: Status */}
              <Select value={status} onValueChange={(val) => setStatus(val ?? "")}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Semua status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua status</SelectItem>
                  <SelectItem value="PENDING">Menunggu</SelectItem>
                  <SelectItem value="CONFIRMED">Dikonfirmasi</SelectItem>
                  <SelectItem value="COMPLETED">Selesai</SelectItem>
                  <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tombol reset filter */}
            {(playDate || status) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPlayDate("");
                  setStatus("");
                }}
              >
                Reset Filter
              </Button>
            )}
          </div>

          {/* Tabel Booking */}
          <BookingTable bookings={bookings ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
