"use client"; // wajib, karena komponen ini pakai useState (interaktif)

import { useMemo, useState } from "react";
import { Clock, MessageCircle, Shield, Star, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SportDiscipline, TimeSlotPrice } from "@/lib/venue-detail";
import { formatRupiah } from "@/lib/format-rupiah";
import { cn } from "@/lib/utils";

// Data 4 tombol tanggal, statis (tidak berubah), jadi ditaruh di luar
// komponen supaya tidak dibuat ulang tiap kali komponen ini render
const DATES = [
  { label: "TODAY", day: "24" },
  { label: "FRI", day: "25" },
  { label: "SAT", day: "26" },
  { label: "SUN", day: "27" },
];

// Bentuk props yang diterima komponen ini dari page.tsx
interface VenueBookingWidgetProps {
  rating: number;
  reviewCount: number;
  basePricePerHour: number;
  disciplines: SportDiscipline[];
  sessionDurations: string[];
  popularSlots: TimeSlotPrice[];
  facilityFeeNote: string;
  conciergeName: string;
}

export function VenueBookingWidget({
  rating,
  reviewCount,
  basePricePerHour,
  disciplines,
  sessionDurations,
  popularSlots,
  facilityFeeNote,
  conciergeName,
}: VenueBookingWidgetProps) {
  // ===== STATE =====

  // Olahraga yang sedang dipilih, default-nya olahraga pertama di data
  const [sportSlug, setSportSlug] = useState(disciplines[0].slug);

  // Cari data lengkap olahraga yang sedang aktif (bukan state, dihitung
  // ulang tiap render dari sportSlug)
  const activeSport =
    disciplines.find((d) => d.slug === sportSlug) ?? disciplines[0];

  const [courtId, setCourtId] = useState(activeSport.courts[0].id); // lapangan yang dipilih
  const [dateIndex, setDateIndex] = useState(0); // index tombol tanggal aktif, 0 = "TODAY"
  const [duration, setDuration] = useState(
    sessionDurations[1] ?? sessionDurations[0] // default durasi ke-2, fallback ke-1
  );
  const [selectedSlot, setSelectedSlot] = useState(
    popularSlots[1]?.time ?? popularSlots[0]?.time ?? "" // default slot ke-2
  );

  // ===== PERHITUNGAN HARGA =====

  // Ambil angka dari teks durasi, misal "1.5 Hours" -> 1.5
  // "|| 1" jaga-jaga kalau hasilnya NaN, dianggap 1 jam
  const durationHours = parseFloat(duration) || 1;

  // Hitung total harga sesi. useMemo "mengingat" hasilnya, cuma dihitung
  // ulang kalau basePricePerHour atau durationHours berubah
  const sessionPrice = useMemo(
    () => Math.round(basePricePerHour * durationHours),
    [basePricePerHour, durationHours]
  );

  // ===== HANDLER =====

  // Dipanggil saat tombol olahraga (Padel/Futsal) diklik
  function handleSportChange(slug: string) {
    setSportSlug(slug);
    // Reset pilihan lapangan ke lapangan pertama olahraga yang baru dipilih
    const nextSport = disciplines.find((d) => d.slug === slug);
    if (nextSport) {
      setCourtId(nextSport.courts[0].id);
    }
  }

  // ===== TAMPILAN =====
  return (
    <aside className="flex w-full flex-col gap-4 rounded-2xl border-2 border-emerald-600 bg-white p-5">
      {/* Harga mulai dari + rating */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Starting From
          </p>
          <p className="text-3xl font-bold text-emerald-700">
            {formatRupiah(basePricePerHour)}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / hour
            </span>
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-sm font-semibold">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          {rating.toFixed(1)}
          <span className="font-normal text-muted-foreground">
            ({reviewCount})
          </span>
        </span>
      </div>

      {/* Tab pilihan olahraga */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold">Sport Discipline</p>
        <div className="grid grid-cols-2 gap-2">
          {disciplines.map((d) => (
            <button
              key={d.slug}
              type="button"
              onClick={() => handleSportChange(d.slug)}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-medium transition",
                sportSlug === d.slug // highlight tombol yang aktif
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dropdown pilih lapangan, isinya ikut berubah sesuai olahraga aktif */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold">Court Selection</p>
        <Select value={courtId} onValueChange={(v) => setCourtId(v ?? "")}>
          <SelectTrigger className="h-10 w-full bg-slate-50 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {/* activeSport.courts, bukan semua lapangan */}
            {activeSport.courts.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 4 tombol tanggal */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold">Select Session Date</p>
          <span className="text-[11px] text-emerald-700">Today, Oct 24</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {DATES.map((d, i) => {
            const isSelected = i === dateIndex;
            return (
              <button
                key={d.label}
                type="button"
                onClick={() => setDateIndex(i)}
                className={cn(
                  "flex flex-col items-center rounded-lg py-2 text-xs font-medium",
                  isSelected
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                )}
              >
                <span>{d.label}</span>
                <span className="text-sm font-bold">{d.day}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dropdown durasi + info rentang waktu (masih statis) */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold">Session Window</p>
          <Select value={duration} onValueChange={(v) => setDuration(v ?? "")}>
            <SelectTrigger className="h-10 w-full bg-slate-50 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sessionDurations.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          {/* opacity-0: trik supaya tinggi kolom ini sama dengan kolom kiri */}
          <p className="text-xs font-semibold opacity-0">.</p>
          <div className="flex h-10 items-center gap-1.5 rounded-md bg-slate-50 px-3 text-sm text-muted-foreground">
            <Clock className="size-4 shrink-0" />
            <span className="truncate">Evening (17:00 - 23:00)</span>
          </div>
        </div>
      </div>

      {/* 3 tombol slot jam populer */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold">Popular Slots Tonight</p>
          <span className="text-[11px] text-muted-foreground">
            3 spots left
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {popularSlots.map((slot) => {
            const isSelected = slot.time === selectedSlot;
            return (
              <button
                key={slot.time}
                type="button"
                onClick={() => setSelectedSlot(slot.time)}
                className={cn(
                  "rounded-md px-2 py-2 text-xs font-medium transition",
                  isSelected
                    ? "bg-emerald-700 text-white"
                    : "bg-sky-50 hover:bg-sky-100"
                )}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rincian harga, otomatis berubah mengikuti "duration" */}
      <div className="space-y-1.5 border-t pt-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Court Session ({duration})
          </span>
          <span className="font-medium">{formatRupiah(sessionPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Facility &amp; Lighting Fee
          </span>
          <span className="font-medium text-emerald-700">
            {facilityFeeNote}
          </span>
        </div>
        <div className="flex justify-between border-t pt-1.5 text-base font-bold">
          <span>Total Payable</span>
          <span>{formatRupiah(sessionPrice)}</span>
        </div>
      </div>

      <Button className="h-11 gap-1.5 bg-emerald-700 hover:bg-emerald-800">
        <Zap className="size-4" />
        Check Real-time Slot Availability
      </Button>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Shield className="size-3.5" />
          Instant Confirmation
        </span>
        <span>12h Free Cancellation</span>
      </div>

      {/* Kotak concierge di paling bawah */}
      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5">
        <span className="flex items-center gap-2 text-xs">
          <MessageCircle className="size-4 text-emerald-700" />
          <span>
            Need a private clinic?
            <br />
            <span className="text-muted-foreground">
              Chat with {conciergeName}
            </span>
          </span>
        </span>
        <button
          type="button"
          className="shrink-0 text-xs font-semibold text-emerald-700 hover:underline"
        >
          Contact
        </button>
      </div>
    </aside>
  );
}