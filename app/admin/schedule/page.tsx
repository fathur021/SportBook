"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Info,
  Loader2,
  RefreshCw,
  Settings2,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRupiah } from "@/lib/format-rupiah";
import {
  useGetAdminVenuesQuery,
  useGetAdminBookingsQuery,
  useUpdateBookingStatusMutation,
  type AdminBooking,
} from "@/lib/redux/admin-api";

// 16 slot waktu per jam operasional (07:00 - 23:00)
const OPERATING_HOURS = Array.from({ length: 16 }, (_, i) => {
  const startHour = i + 7;
  const endHour = startHour + 1;
  const startStr = `${String(startHour).padStart(2, "0")}:00`;
  const endStr = `${String(endHour).padStart(2, "0")}:00`;
  const label = `${String(startHour).padStart(2, "0")}.00`;
  return { startHour, endHour, startStr, endStr, label };
});

const DAYS_SHORT = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];
const FULL_DAYS = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
];
const FULL_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function formatDateToIso(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseIsoToDate(isoStr: string): Date {
  const [y, m, d] = isoStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatIndonesianDate(isoStr: string): string {
  const d = parseIsoToDate(isoStr);
  const dayName = FULL_DAYS[d.getDay()];
  const dayNum = d.getDate();
  const monthName = FULL_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

export default function AdminSchedulePage() {
  const todayStr = useMemo(() => formatDateToIso(new Date()), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [selectedVenueSlug, setSelectedVenueSlug] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [isOpHoursDialogOpen, setIsOpHoursDialogOpen] = useState<boolean>(false);

  // Ambil daftar venue admin
  const { data: venues, isLoading: isVenuesLoading, isError: isVenuesError } =
    useGetAdminVenuesQuery();

  // Venue aktif saat ini
  const activeVenue = useMemo(() => {
    if (!venues || venues.length === 0) return null;
    if (selectedVenueSlug) {
      const found = venues.find((v) => v.slug === selectedVenueSlug);
      if (found) return found;
    }
    return venues[0];
  }, [venues, selectedVenueSlug]);

  // Ambil booking untuk tanggal yang dipilih
  const {
    data: bookings,
    isLoading: isBookingsLoading,
    isFetching: isBookingsFetching,
    refetch: refetchBookings,
  } = useGetAdminBookingsQuery({ playDate: selectedDate });

  // Mutasi untuk memperbarui status booking
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateBookingStatusMutation();

  // Hitung deretan 7 hari untuk bar tanggal
  const calendarDays = useMemo(() => {
    const base = new Date();
    base.setDate(base.getDate() + weekOffset);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = formatDateToIso(d);
      return {
        iso,
        dayName: DAYS_SHORT[d.getDay()],
        dayNumber: String(d.getDate()).padStart(2, "0"),
        monthName: MONTHS_SHORT[d.getMonth()],
        isToday: iso === todayStr,
        isSelected: iso === selectedDate,
      };
    });
  }, [weekOffset, selectedDate, todayStr]);

  // Courts untuk venue aktif
  const courts = useMemo(() => {
    return activeVenue?.courts ?? [];
  }, [activeVenue]);

  // Hitung statistik slot hari ini
  const stats = useMemo(() => {
    if (!courts.length) return { totalSlots: 0, bookedSlots: 0, availableSlots: 0 };
    const totalSlots = courts.length * OPERATING_HOURS.length;
    let bookedSlots = 0;

    courts.forEach((court) => {
      OPERATING_HOURS.forEach(({ startStr, endStr }) => {
        const isBooked = bookings?.some((b) => {
          const matchCourt = b.courtId === court.id || b.court?.id === court.id;
          if (!matchCourt) return false;
          if (!["PENDING", "CONFIRMED", "COMPLETED"].includes(b.status)) return false;
          return startStr < b.endTime && endStr > b.startTime;
        });
        if (isBooked) bookedSlots++;
      });
    });

    return {
      totalSlots,
      bookedSlots,
      availableSlots: Math.max(0, totalSlots - bookedSlots),
    };
  }, [courts, bookings]);

  // Handle perubahan status booking dari modal detail
  const handleUpdateStatus = async (newStatus: "CONFIRMED" | "CANCELLED" | "COMPLETED") => {
    if (!selectedBooking) return;
    try {
      const updated = await updateStatus({
        bookingId: selectedBooking.id,
        status: newStatus,
      }).unwrap();
      setSelectedBooking(updated);
      refetchBookings();
    } catch (err) {
      console.error("Gagal mengubah status booking:", err);
      alert("Gagal memperbarui status booking. Silakan coba lagi.");
    }
  };

  if (isVenuesLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
          <p className="text-sm">Memuat data jadwal &amp; venue...</p>
        </div>
      </div>
    );
  }

  if (isVenuesError || !venues || venues.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <Info className="mx-auto size-10 text-slate-400" />
        <h3 className="mt-3 text-lg font-semibold text-slate-800">
          Belum Ada Venue
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Silakan buat venue dan tambahkan lapangan terlebih dahulu di menu Kelola Lapangan.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      {/* Header & Venue Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Jadwal &amp; Slot
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Pantau ketersediaan slot waktu riil dan status pemesanan tiap court.
          </p>
        </div>

        {/* Dropdown Venue */}
        <div className="w-full sm:w-72">
          <Select
            value={activeVenue?.slug ?? ""}
            onValueChange={(val) => {
              if (val) setSelectedVenueSlug(val);
            }}
          >
            <SelectTrigger className="h-11 w-full border-slate-200 bg-white px-3 shadow-sm hover:border-slate-300">
              <div className="flex items-center gap-2 truncate">
                <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
                <SelectValue placeholder="Pilih venue" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {venues.map((v) => (
                <SelectItem key={v.slug} value={v.slug}>
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-slate-800">{v.name}</span>
                    <span className="text-xs text-slate-400">{v.city} · {v.courts?.length ?? 0} Court</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Info Jam Operasional & Statistik */}
      <Card className="w-full max-w-full overflow-hidden p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <Clock3 className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Jam Operasional Venue ({activeVenue?.name})
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Senin–Minggu · 07.00–23.00 (16 slot @ 1 jam)
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Slot dibuat otomatis sesuai booking aktif di database.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
              {stats.availableSlots} slot tersedia
            </Badge>
            <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-700">
              {stats.bookedSlots} slot dipesan
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpHoursDialogOpen(true)}
              className="inline-flex items-center gap-1.5 text-slate-700"
            >
              <Settings2 className="size-4" />
              Info Operasional
            </Button>
          </div>
        </div>
      </Card>

      {/* Kontrol Kalender & Tabel Slot */}
      <Card className="w-full max-w-full overflow-hidden shadow-sm">
        {/* Header Ketersediaan & Date Picker Cepat */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Ketersediaan Court</h2>
            <p className="mt-1 text-sm text-slate-500">
              Klik tanggal untuk melihat jadwal slot lapangan pada hari tersebut.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Picker Native */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-xs">
              <CalendarDays className="size-4 text-emerald-700" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(e.target.value);
                  }
                }}
                className="bg-transparent text-sm font-semibold text-slate-800 outline-none"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedDate(todayStr);
                setWeekOffset(0);
              }}
              className="text-xs font-semibold text-emerald-700"
            >
              Hari Ini
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => refetchBookings()}
              title="Refresh Data Slot"
              disabled={isBookingsFetching}
            >
              <RefreshCw className={`size-4 text-slate-500 ${isBookingsFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* 7-Day Navigation Strip */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-4 sm:px-6">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Minggu sebelumnya"
            onClick={() => setWeekOffset((prev) => prev - 7)}
            className="size-9 rounded-lg shrink-0"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="grid flex-1 grid-cols-4 gap-2 sm:grid-cols-7">
            {calendarDays.map((day) => (
              <button
                key={day.iso}
                type="button"
                onClick={() => setSelectedDate(day.iso)}
                className={`flex flex-col items-center rounded-xl border px-2 py-2 transition-all ${
                  day.isSelected
                    ? "border-emerald-700 bg-emerald-700 text-white shadow-xs"
                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/40"
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wide ${day.isSelected ? "text-emerald-100" : "text-slate-400"}`}>
                  {day.dayName}
                </span>
                <span className="text-lg font-bold leading-6">{day.dayNumber}</span>
                <span className={`text-[10px] ${day.isSelected ? "text-emerald-100" : "text-slate-400"}`}>
                  {day.monthName}
                </span>
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Minggu berikutnya"
            onClick={() => setWeekOffset((prev) => prev + 7)}
            className="size-9 rounded-lg shrink-0"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* Bar Indikator Status & Tanggal Terpilih */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 px-5 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-700">
              {formatIndonesianDate(selectedDate)}
            </p>
            {isBookingsFetching && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Loader2 className="size-3 animate-spin" /> Memperbarui...
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
            <span className="text-slate-400 italic hidden lg:inline">
              Geser bagian jam ke samping untuk melihat slot berikutnya →
            </span>
            <span className="flex items-center gap-1.5">
              <i className="size-2.5 rounded-full bg-emerald-500" />
              Tersedia
            </span>
            <span className="flex items-center gap-1.5">
              <i className="size-2.5 rounded-full bg-slate-400" />
              Dipesan
            </span>
            <span className="flex items-center gap-1.5">
              <i className="size-2.5 rounded-full bg-amber-500" />
              Ditutup / Perbaikan
            </span>
          </div>
        </div>

        {/* Split Grid: Kolom Court Tetap di Kiri, HANYA Bagian Jam yang Scrollable */}
        {courts.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Venue ini belum memiliki court. Tambahkan court di menu Kelola Lapangan.
          </div>
        ) : (
          <div className="flex w-full max-w-full overflow-hidden border-t border-slate-200">
            {/* 1. Kolom Kiri: Info Lapangan (Fixed / Tidak ikut scroll) */}
            <div className="w-56 shrink-0 border-r border-slate-200 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] z-10 sm:w-64">
              {/* Header Kolom Lapangan */}
              <div className="flex h-12 items-center bg-slate-50 px-4 text-xs font-semibold text-slate-500 border-b border-slate-200 sm:px-6">
                Court / Lapangan
              </div>
              {/* Daftar Lapangan */}
              <div className="divide-y divide-slate-100">
                {courts.map((court) => (
                  <div
                    key={court.id}
                    className="flex h-20 flex-col justify-center px-4 bg-white sm:px-6"
                  >
                    <span className="truncate text-sm font-semibold text-slate-900" title={court.name}>
                      {court.name}
                    </span>
                    <span className="mt-0.5 truncate text-xs text-slate-500">
                      {court.sport} {court.isIndoor ? "· Indoor" : "· Outdoor"}
                    </span>
                    <div className="mt-0.5 flex items-center justify-between gap-1">
                      <span className="text-xs font-medium text-emerald-700">
                        {formatRupiah(court.pricePerHour)}/jam
                      </span>
                      {!court.isActive && (
                        <span className="rounded bg-amber-50 px-1.5 py-0.2 text-[10px] font-semibold text-amber-700">
                          Non-aktif
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Kolom Kanan: HANYA Jadwal Jam yang di-scroll horizontal */}
            <div className="flex-1 min-w-0 overflow-x-auto bg-white">
              <div className="w-max min-w-full">
                {/* Header Jam Operasional */}
                <div className="flex h-12 items-center bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                  {OPERATING_HOURS.map(({ label }) => (
                    <div
                      key={label}
                      className="w-28 shrink-0 text-center font-semibold text-slate-600 px-1"
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Baris Slot Waktu per Court */}
                <div className="divide-y divide-slate-100">
                  {courts.map((court) => (
                    <div key={court.id} className="flex h-20 items-center">
                      {OPERATING_HOURS.map(({ startStr, endStr }) => {
                        // Cek apakah ada booking aktif di slot ini
                        const matchingBooking = bookings?.find((b) => {
                          const isSameCourt =
                            b.courtId === court.id || b.court?.id === court.id;
                          if (!isSameCourt) return false;
                          const isActive = ["PENDING", "CONFIRMED", "COMPLETED"].includes(b.status);
                          if (!isActive) return false;
                          return startStr < b.endTime && endStr > b.startTime;
                        });

                        // 1. Kasus court non-aktif
                        if (!court.isActive) {
                          return (
                            <div key={startStr} className="w-28 shrink-0 px-1.5">
                              <div className="inline-flex h-14 w-full flex-col items-center justify-center rounded-lg border border-amber-200 bg-amber-50/80 px-1 py-1 text-[10px] font-semibold text-amber-800">
                                <span>Ditutup</span>
                                <span className="text-[9px] font-normal opacity-75">Perbaikan</span>
                              </div>
                            </div>
                          );
                        }

                        // 2. Kasus slot sudah dipesan
                        if (matchingBooking) {
                          const isPending = matchingBooking.status === "PENDING";
                          return (
                            <div key={startStr} className="w-28 shrink-0 px-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedBooking(matchingBooking)}
                                className={`inline-flex h-14 w-full flex-col items-center justify-center rounded-lg border px-1 py-1 text-[10px] font-semibold transition-all hover:scale-[1.02] hover:shadow-xs cursor-pointer ${
                                  isPending
                                    ? "border-amber-300 bg-amber-50 text-amber-900"
                                    : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200/80"
                                }`}
                                title="Klik untuk melihat rincian booking"
                              >
                                <span>{isPending ? "Pending" : "Dipesan"}</span>
                                <span className="max-w-[85px] truncate text-[9px] font-normal opacity-85">
                                  {matchingBooking.user?.name || matchingBooking.orderCode.slice(-6)}
                                </span>
                              </button>
                            </div>
                          );
                        }

                        // 3. Kasus slot tersedia
                        return (
                          <div key={startStr} className="w-28 shrink-0 px-1.5">
                            <div className="inline-flex h-14 w-full flex-col items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50/70 px-1 py-1 text-[10px] font-semibold text-emerald-800">
                              <span>Tersedia</span>
                              <span className="text-[9px] font-medium opacity-75">
                                {formatRupiah(court.pricePerHour)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Card */}
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-slate-500">
            Data slot disinkronkan langsung dengan pesanan pelanggan di database.
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpHoursDialogOpen(true)}
              className="text-xs"
            >
              Atur Jam &amp; Blokir
            </Button>
          </div>
        </div>
      </Card>

      {/* Dialog Rincian Booking */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={(open) => {
          if (!open) setSelectedBooking(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold">Rincian Booking</DialogTitle>
              {selectedBooking && (
                <Badge
                  className={
                    selectedBooking.status === "CONFIRMED"
                      ? "bg-emerald-600"
                      : selectedBooking.status === "PENDING"
                      ? "bg-amber-600"
                      : selectedBooking.status === "COMPLETED"
                      ? "bg-blue-600"
                      : "bg-rose-600"
                  }
                >
                  {selectedBooking.status}
                </Badge>
              )}
            </div>
            <DialogDescription className="text-xs">
              Kode Pesanan: <span className="font-mono font-bold text-slate-900">{selectedBooking?.orderCode}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-2 text-sm">
              {/* Info Pelanggan */}
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <User className="size-3.5" />
                  Informasi Pemesan
                </div>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {selectedBooking.user?.name ?? "Pelanggan Tanpa Nama"}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedBooking.user?.email ?? "-"}
                </p>
              </div>

              {/* Info Jadwal & Court */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-slate-100 p-2.5">
                  <span className="text-slate-400">Court / Lapangan</span>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedBooking.court?.name ?? "Court"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {selectedBooking.court?.sport ?? "-"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 p-2.5">
                  <span className="text-slate-400">Jadwal Main</span>
                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedBooking.playDate}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {selectedBooking.startTime} - {selectedBooking.endTime} ({selectedBooking.durationHour} jam)
                  </p>
                </div>
              </div>

              {/* Rincian Harga & Pembayaran */}
              <div className="rounded-lg border border-slate-100 p-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Tarif per jam</span>
                  <span>{formatRupiah(selectedBooking.pricePerHour)}</span>
                </div>
                <div className="mt-1 flex justify-between text-xs">
                  <span className="text-slate-500">Durasi</span>
                  <span>{selectedBooking.durationHour} Jam</span>
                </div>
                <div className="mt-2 flex justify-between border-t pt-2 font-bold text-slate-900">
                  <span>Total Harga</span>
                  <span className="text-emerald-700">{formatRupiah(selectedBooking.totalPrice)}</span>
                </div>
                {selectedBooking.payment && (
                  <div className="mt-2 rounded bg-slate-50 p-2 text-xs">
                    <span className="text-slate-500">Status Pembayaran: </span>
                    <span className="font-semibold text-slate-800">
                      {selectedBooking.payment.status} {selectedBooking.payment.method ? `(${selectedBooking.payment.method})` : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Catatan jika ada */}
              {selectedBooking.notes && (
                <div className="text-xs text-slate-600">
                  <span className="font-semibold">Catatan:</span> {selectedBooking.notes}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              {selectedBooking?.status === "PENDING" && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus("CONFIRMED")}
                  >
                    <ShieldCheck className="mr-1.5 size-4" />
                    Konfirmasi
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus("CANCELLED")}
                  >
                    <XCircle className="mr-1.5 size-4" />
                    Tolak / Batal
                  </Button>
                </>
              )}
              {selectedBooking?.status === "CONFIRMED" && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus("COMPLETED")}
                  >
                    Selesaikan Booking
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus("CANCELLED")}
                  >
                    Batalkan
                  </Button>
                </>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedBooking(null)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Info Operasional & Blokir */}
      <Dialog open={isOpHoursDialogOpen} onOpenChange={setIsOpHoursDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Informasi Jam Operasional &amp; Blokir</DialogTitle>
            <DialogDescription>
              Pengaturan jadwal dan status pemeliharaan lapangan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm text-slate-600">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">Jam Buka Sistem</p>
              <p className="mt-1 text-xs">
                Jam operasional saat ini aktif dari pukul <strong>07:00 hingga 23:00</strong> setiap hari (16 slot @ 1 jam).
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">Blokir Lapangan (Maintenance)</p>
              <p className="mt-1 text-xs">
                Untuk menutup lapangan sementara (perbaikan/renovasi), Anda dapat mengubah status lapangan menjadi <strong>Non-aktif</strong> di menu <strong>Kelola Lapangan</strong>. Lapangan yang dinonaktifkan akan otomatis tertutup di seluruh slot.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsOpHoursDialogOpen(false)}>
              Mengerti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
