"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Wallet,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingTable } from "@/components/admin/booking-table";
import { SearchInput } from "@/components/admin/search-input";
import {
  AdminStatCards,
  type AdminStatItem,
} from "@/components/admin/admin-stat-cards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  useGetAdminBookingsQuery,
} from "@/lib/redux/admin-api";
import { formatRupiah } from "@/lib/format-rupiah";

export default function AdminBookingsPage() {
  const [playDate, setPlayDate] = useState("");
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");

  // Data tanpa filter dipakai untuk kartu ringkasan.
  const { data: allBookings } = useGetAdminBookingsQuery();

  // Bangun parameter query hanya jika ada filter tanggal/status.
  const queryParam =
    playDate || status
      ? { playDate: playDate || undefined, status: status || undefined }
      : undefined;

  const { data: bookings, isLoading, isError } =
    useGetAdminBookingsQuery(queryParam);

  // Cari kode order, pelanggan, venue, court, dan status.
  const filteredBookings = (bookings ?? []).filter((booking) => {
    const teks = [
      booking.orderCode,
      booking.user?.name ?? "",
      booking.user?.email ?? "",
      booking.court?.venue?.name ?? "",
      booking.court?.name ?? "",
      booking.status,
      booking.payment?.status ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return teks.includes(search.trim().toLowerCase());
  });

  const source = allBookings ?? [];
  const pendingCount = source.filter((b) => b.status === "PENDING").length;
  const confirmedCount = source.filter((b) => b.status === "CONFIRMED").length;
  const cancelledCount = source.filter((b) => b.status === "CANCELLED").length;
  const paidRevenue = source
    .filter((b) => b.payment?.status === "PAID")
    .reduce((total, b) => total + b.totalPrice, 0);

  const stats: AdminStatItem[] = [
    {
      label: "Total Booking",
      value: source.length,
      note: "Seluruh pemesanan",
      icon: ClipboardList,
      tone: "slate",
    },
    {
      label: "Menunggu",
      value: pendingCount,
      note: "Perlu dikonfirmasi",
      icon: Clock3,
      tone: "amber",
    },
    {
      label: "Dikonfirmasi",
      value: confirmedCount,
      note: "Booking berjalan",
      icon: CheckCircle2,
      tone: "emerald",
    },
    {
      label: "Pendapatan Lunas",
      value: formatRupiah(paidRevenue),
      note: `${cancelledCount} booking dibatalkan`,
      icon: Wallet,
      tone: "blue",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Header />
        <Card>
          <CardContent className="p-8 text-center text-sm text-slate-500">
            Memuat data booking...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Header />
        <Card>
          <CardContent className="p-8 text-center text-sm text-rose-600">
            Gagal memuat data booking. Coba muat ulang halaman.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header pendingCount={pendingCount} confirmedCount={confirmedCount} />

      <AdminStatCards items={stats} />

      <Card className="py-0">
        <CardHeader className="border-b py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Daftar Booking</CardTitle>
              <CardDescription>
                Menampilkan {filteredBookings.length} dari{" "}
                {(bookings ?? []).length} booking sesuai filter.
              </CardDescription>
            </div>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari kode, pelanggan, atau venue..."
            />
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-slate-400" />
                <Input
                  type="date"
                  value={playDate}
                  onChange={(event) => setPlayDate(event.target.value)}
                  placeholder="Filter tanggal"
                  className="w-44"
                />
              </div>

              <Select value={status} onValueChange={(val) => setStatus(val ?? "")}>
                <SelectTrigger className="w-44">
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

            {(playDate || status || search) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPlayDate("");
                  setStatus("");
                  setSearch("");
                }}
              >
                <XCircle data-icon="inline-start" />
                Reset Filter
              </Button>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <BookingTable bookings={filteredBookings} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Header({
  pendingCount = 0,
  confirmedCount = 0,
}: {
  pendingCount?: number;
  confirmedCount?: number;
}) {
  return (
    <header>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 mb-3"
        nativeButton={false}
        render={<Link href="/admin/venues" />}
      >
        <ArrowLeft data-icon="inline-start" />
        Kembali
      </Button>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
        Operasional
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Kelola Booking
        </h1>
        {pendingCount > 0 && (
          <Badge className="border-amber-200 bg-amber-50 font-medium text-amber-700">
            {pendingCount} Menunggu
          </Badge>
        )}
        {confirmedCount > 0 && (
          <Badge className="border-emerald-200 bg-emerald-50 font-medium text-emerald-700">
            {confirmedCount} Dikonfirmasi
          </Badge>
        )}
      </div>
      <p className="mt-1.5 text-sm text-slate-500">
        Kelola semua pemesanan lapangan dari seluruh venue.
      </p>
    </header>
  );
}
