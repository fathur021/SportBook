// ============================================================================
// PANDUAN: HALAMAN KELOLA BOOKING (Admin)
// ============================================================================
// File ini berisi panduan lengkap untuk membuat halaman kelola booking.
// Setiap bagian memiliki penjelasan di atas, lalu kode lengkap di bawahnya.
// Nanti Anda yang ketik sendiri agar lebih paham!
//
// Penanda yang digunakan:
// [+] = Kode yang ditambahkan (baru)
// [~] = Kode yang diedit (diubah)
// [-] = Kode yang dihapus
// ← = Penjelasan singkat di sebelah kode
// ============================================================================

// ============================================================================
// BAGIAN 1: HALAMAN ADMIN BOOKING
// ============================================================================
// File: app/admin/bookings/page.tsx
//
// PENJELASAN:
// Halaman ini adalah pintu masuk untuk admin melihat semua booking.
// Mirip dengan halaman equipment dan court yang sudah kita buat.
//
// Struktur halaman:
// 1. Header — tombol Kembali + judul + badge jumlah booking
// 2. Card — berisi filter (tanggal & status) + tabel booking
//
// Data diambil dari Redux query: useGetAdminBookingsQuery
// Filter bisa berdasarkan tanggal main (playDate) dan status booking.
//
// Analogi:
// Bayangkan halaman ini seperti dashboard kasir restoran —
// bisa melihat semua pesanan, filter berdasarkan tanggal atau status
// (masih menunggu, sudah dimasak, sudah selesai).

// [+] FILE BARU — Buat file ini di folder app/admin/bookings/

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
  const [status, setStatus] = useState(""); // ← status booking

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
              <Select value={status} onValueChange={setStatus}>
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

// ============================================================================
// BAGIAN 2: TABEL BOOKING
// ============================================================================
// File: components/admin/booking-table.tsx
//
// PENJELASAN:
// Komponen ini menampilkan tabel booking dengan 9 kolom:
// 1. Kode Order — kode unik booking
// 2. Pelanggan — nama dan email user
// 3. Venue & Court — nama venue dan lapangan
// 4. Tanggal & Waktu — tanggal main + jam
// 5. Durasi — lama booking dalam jam
// 6. Total Harga — harga total
// 7. Status — badge warna sesuai status
// 8. Pembayaran — status pembayaran
// 9. Aksi — dropdown ubah status
//
// Analogi:
// Seperti tabel pesanan di restoran — setiap baris adalah satu pesanan
// dengan info pelanggan, menu, waktu, dan status.

// [+] FILE BARU — Buat file ini di folder components/admin/

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

// ============================================
// HELPER FUNCTIONS
// ============================================

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
      return "bg-amber-50 text-amber-700"; // ← kuning
    case "CONFIRMED":
      return "bg-blue-50 text-blue-700"; // ← biru
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700"; // ← hijau
    case "CANCELLED":
      return "bg-red-50 text-red-700"; // ← merah
    default:
      return "bg-slate-100 text-slate-500";
  }
}

// Label status booking dalam Bahasa Indonesia
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
      return "bg-emerald-50 text-emerald-700"; // ← hijau
    case "PENDING":
      return "bg-amber-50 text-amber-700"; // ← kuning
    case "FAILED":
      return "bg-red-50 text-red-700"; // ← merah
    default:
      return "bg-slate-100 text-slate-500";
  }
}

// Label status pembayaran dalam Bahasa Indonesia
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

// ============================================================================
// BAGIAN 3: ROW ACTIONS — DROPDOWN UBAH STATUS
// ============================================================================
// File: components/admin/booking-row-actions.tsx
//
// PENJELASAN:
// Komponen ini berisi dropdown untuk mengubah status booking.
// Menggunakan Select dari @base-ui/react (bukan Radix UI).
//
// Alur kerja:
// 1. Admin klik dropdown → pilih status baru
// 2. Kirim PATCH request ke API via Redux mutation
// 3. Jika berhasil → tabel otomatis refresh (invalidatesTags)
// 4. Jika gagal → tampilkan alert error
//
// Status yang bisa dipilih:
// - PENDING → CONFIRMED (konfirmasi booking)
// - CONFIRMED → COMPLETED (tandai selesai)
// - PENDING/CONFIRMED → CANCELLED (batalkan booking)
//
// Analogi:
// Seperti tombol di kasir restoran — bisa mengubah status pesanan
// dari "menunggu" ke "diproses" ke "selesai".

// [+] FILE BARU — Buat file ini di folder components/admin/

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // ← dropdown
import type { AdminBooking } from "@/lib/redux/admin-api";
import { useUpdateBookingStatusMutation } from "@/lib/redux/admin-api"; // ← Redux mutation

export function BookingRowActions({ booking }: { booking: AdminBooking }) {
  // [+] Redux mutation untuk update status
  const [updateStatus, { isLoading }] = useUpdateBookingStatusMutation();

  // Fungsi saat admin pilih status baru dari dropdown
  async function handleStatusChange(newStatus: string) {
    // Kirim PATCH request ke API
    updateStatus({ bookingId: booking.id, status: newStatus })
      .unwrap()
      .then(() => {
        // Jika berhasil, Redux otomatis refresh data (invalidatesTags)
        // Tidak perlu reload halaman!
      })
      .catch((error) => {
        // Jika gagal, tampilkan pesan error
        alert(error.error || "Gagal mengubah status booking");
      });
  }

  // [+] Tentukan status mana yang bisa dipilih
  // Berdasarkan aturan perpindahan status:
  // PENDING → CONFIRMED atau CANCELLED
  // CONFIRMED → COMPLETED atau CANCELLED
  // COMPLETED → tidak bisa diubah
  // CANCELLED → tidak bisa diubah
  const availableStatuses = getAvailableStatuses(booking.status);

  // Jika status sudah final, tampilkan teks saja
  if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
    return null; // ← tidak perlu dropdown
  }

  return (
    <Select
      value={booking.status}
      onValueChange={handleStatusChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Ubah status" />
      </SelectTrigger>
      <SelectContent>
        {/* Status saat ini */}
        <SelectItem value={booking.status}>
          {getStatusLabel(booking.status)} (saat ini)
        </SelectItem>

        {/* Status yang bisa dipilih */}
        {availableStatuses.map((status) => (
          <SelectItem key={status} value={status}>
            {getStatusLabel(status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Tentukan status mana yang bisa dipilih berdasarkan status saat ini
function getAvailableStatuses(currentStatus: string): string[] {
  switch (currentStatus) {
    case "PENDING":
      return ["CONFIRMED", "CANCELLED"]; // ← bisa konfirmasi atau batalkan
    case "CONFIRMED":
      return ["COMPLETED", "CANCELLED"]; // ← bisa selesai atau batalkan
    case "COMPLETED":
      return []; // ← sudah final, tidak bisa diubah
    case "CANCELLED":
      return []; // ← sudah final, tidak bisa diubah
    default:
      return [];
  }
}

// Label status dalam Bahasa Indonesia
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

// ============================================================================
// BAGIAN 4: API ROUTE UNTUK UPDATE STATUS (SUDAH ADA)
// ============================================================================
//
// PENJELASAN:
// API route untuk update status booking SUDAH ADA dan tidak perlu dibuat ulang!
//
// File yang sudah ada:
// 1. app/api/admin/booking/[bookingId]/status/route.ts ← API route
// 2. modules/bookings/booking.controller.ts ← updateBookingStatusController
// 3. modules/bookings/booking.service.ts ← updateBookingStatusService
// 4. lib/redux/admin-api.ts ← updateBookingStatus mutation
//
// Alur kerja:
// Frontend → Redux mutation → PATCH /api/admin/booking/{id}/status
// → Controller → Service → Repository → Database
//
// Tidak perlu membuat apa-apa di backend untuk fitur ini! ✅

// ============================================================================
// BAGIAN 5: REDUX API (SUDAH ADA)
// ============================================================================
//
// PENJELASAN:
// Redux API untuk booking SUDAH LENGKAP! Tidak perlu menambahkan apa-apa.
//
// Yang sudah ada di lib/redux/admin-api.ts:
//
// 1. Interface AdminBooking (baris 15-52)
//    - id, orderCode, playDate, startTime, endTime
//    - durationHour, pricePerHour, totalPrice, status
//    - court (nested: venue, name, sport)
//    - user (nested: name, email)
//    - payment (nested: status, method, paidAt)
//
// 2. Query: getAdminBookings (baris 211-224)
//    - GET /api/admin/booking?playDate=&status=
//    - Filter opsional: playDate dan/atau status
//    - providesTags: ["AdminBooking"]
//
// 3. Mutation: updateBookingStatus (baris 226-237)
//    - PATCH /api/admin/booking/{bookingId}/status
//    - Body: { status: string }
//    - invalidatesTags: ["AdminBooking"] ← auto refresh!
//
// 4. Export hooks (baris 252-253)
//    - useGetAdminBookingsQuery
//    - useUpdateBookingStatusMutation
//
// Tidak perlu mengubah apa-apa di Redux API! ✅

// ============================================================================
// ALUR KERJA LENGKAP
// ============================================================================
//
// 1. Admin buka halaman /admin/bookings
// 2. Halaman memuat semua booking via Redux query
// 3. Admin bisa filter berdasarkan tanggal dan/atau status
// 4. Tabel menampilkan semua booking dengan info lengkap
// 5. Admin klik dropdown di kolom Aksi
// 6. Admin pilih status baru (Misal: Menunggu → Dikonfirmasi)
// 7. Redux mutation kirim PATCH ke API
// 8. API validasi → update database
// 9. Redux invalidatesTags → data otomatis refresh
// 10. Tabel menampilkan status baru tanpa reload halaman
//
// Analogi:
// Seperti dashboard admin e-commerce — admin bisa melihat semua
// pesanan, filter berdasarkan tanggal atau status, dan mengubah
// status pesanan dari "menunggu" ke "dikirim" ke "selesai".

// ============================================================================
// PERBEDAAN DENGAN EQUIPMENT & COURT
// ============================================================================
//
// | Aspek          | Equipment       | Court           | Booking         |
// |----------------|-----------------|-----------------|-----------------|
// | Data source    | fetch() + router| Redux RTK Query | Redux RTK Query |
// | Refresh        | router.refresh()| invalidatesTags | invalidatesTags |
// | Aksi utama     | Edit + Toggle   | Edit + Toggle   | Ubah Status     |
// | Delete         | Hard delete     | Hard delete     | Tidak ada       |
// | Filter         | Tidak ada       | Tidak ada       | Tanggal + Status|
// | Nested data    | Tidak ada       | Tidak ada       | Court, User, Payment |
//
// Catatan:
// - Booking tidak punya fitur delete — hanya ubah status ke CANCELLED
// - Booking punya nested data (court, user, payment) yang perlu diakses
//   dengan optional chaining (booking.court?.venue?.name)
// - Filter menggunakan Redux query parameters, bukan state lokal

// ============================================================================
// CATATAN PENTING
// ============================================================================
//
// 1. @base-ui/react tidak mendukung asChild
//    - SelectTrigger sudah membuat elemen sendiri
//    - Tidak perlu membungkus dengan Button
//
// 2. Optional chaining (?.) WAJIB digunakan
//    - booking.user?.name ← user bisa undefined
//    - booking.court?.venue?.name ← nested, bisa undefined
//    - booking.payment?.status ← payment bisa null
//
// 3. Status transition rules
//    - PENDING → CONFIRMED atau CANCELLED
//    - CONFIRMED → COMPLETED atau CANCELLED
//    - COMPLETED → tidak bisa diubah (final)
//    - CANCELLED → tidak bisa diubah (final)
//    - Backend sudah validasi, frontend hanya menyembunyikan opsi
//
// 4. Tanggal format
//    - playDate disimpan sebagai string "YYYY-MM-DD"
//    - Gunakan new Date(dateStr + "T00:00:00") agar tidak UTC shift
//    - Format ke Bahasa Indonesia: toLocaleDateString("id-ID")

// ============================================================================
// RINGKASAN LANGKAH
// ============================================================================
//
// Langkah 1: Buat file app/admin/bookings/page.tsx
//   - Copy kode dari BAGIAN 1
//   - Ini adalah halaman utama admin booking
//
// Langkah 2: Buat file components/admin/booking-table.tsx
//   - Copy kode dari BAGIAN 2
//   - Ini adalah komponen tabel booking
//
// Langkah 3: Buat file components/admin/booking-row-actions.tsx
//   - Copy kode dari BAGIAN 3
//   - Ini adalah dropdown ubah status
//
// Langkah 4: Backend sudah lengkap! ✅
//   - API route, controller, service, repository sudah ada
//   - Redux API sudah ada
//   - Tidak perlu membuat apa-apa lagi
//
// Langkah 5: Test
//   - Buka /admin/bookings
//   - Coba filter berdasarkan tanggal
//   - Coba filter berdasarkan status
//   - Coba ubah status booking
//   - Pastikan tabel auto-refresh tanpa reload

// ============================================================================
// TIPS MENULIS KODE
// ============================================================================
//
// 1. Ketik per baris, jangan copy-paste seluruh blok
//    - Baca komentarnya dulu ←
//    - Pahami apa yang dilakukan baris tersebut
//    - Baru ketik kodenya
//
// 2. Perhatikan optional chaining (?.)
//    - booking.user?.name ← BUKAN booking.user.name
//    - Karena user bisa undefined, tanpa ? akan error
//
// 3. Gunakan formatRupiah untuk harga
//    - formatRupiah(booking.totalPrice) ← bukan booking.totalPrice langsung
//    - Agar tampil "Rp 150.000" bukan "150000"
//
// 4. Badge warna sesuai status
//    - PENDING = kuning (amber)
//    - CONFIRMED = biru (blue)
//    - COMPLETED = hijau (emerald)
//    - CANCELLED = merah (red)
//
// 5. Empty state
//    - Jika bookings.length === 0 → tampilkan pesan
//    - colSpan={9} ← sesuai jumlah kolom tabel

// ============================================================================
// SELESAI! 🎉
// ============================================================================
// Setelah ketiga file dibuat, halaman kelola booking sudah siap digunakan.
// Backend sudah lengkap, tinggal implementasi frontend saja.
// Selamat mencoba! 🚀
