"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/format-rupiah";
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Headphones,
  Phone,
  HelpCircle,
  Dumbbell,
} from "lucide-react";

// Tipe data item sewa perlengkapan yang dipilih
export type SelectedEquipment = {
  name: string;
  qty: number;
  pricePerUnit: number;
};

// Props yang dibutuhkan oleh CheckoutSummary
export type CheckoutSummaryProps = {
  venueName: string;
  venueAddress: string;
  sportLabel: string;
  courtName: string;
  courtImage?: string;
  courtSpecs?: string[];
  maxPlayers?: number;
  date: string | null;
  time: string | null;
  endTime: string | null;
  durationHours: number;
  pricePerHour: number;
  equipmentList?: SelectedEquipment[];
  totalPrice: number;
};

// Helper: Format tanggal "2023-10-24" -> "Tuesday, 24 Oct 2023"
function formatFullDate(dateStr: string | null) {
  if (!dateStr) return "Tanggal belum dipilih";
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Helper: Format jam "19:00" + jam selesai "21:00" + durasi 2 jam
function formatTimeSlot(
  timeStr: string | null,
  endTimeStr: string | null,
  duration: number,
) {
  if (!timeStr || !endTimeStr) return "Jam belum dipilih";
  const [startHour] = timeStr.split(":").map(Number);
  const isPeak = startHour >= 17; // Contoh: jam 17:00 ke atas adalah peak slot

  return `${timeStr} - ${endTimeStr} (${duration} ${duration > 1 ? "Hours" : "Hour"}${isPeak ? ", Peak Slot" : ""})`;
}

export function CheckoutSummary({
  venueName,
  venueAddress,
  sportLabel,
  courtName,
  courtImage = "/hero.webp",
  courtSpecs = ["Turf Surface", "Outdoor Covered"],
  maxPlayers = 4,
  date,
  time,
  endTime,
  durationHours = 1,
  pricePerHour,
  equipmentList = [],
  totalPrice,
}: CheckoutSummaryProps) {
  // 1. Kalkulasi biaya
  const courtRentalTotal = pricePerHour * durationHours;

  return (
    <div className="flex flex-col gap-4">
      {/* KARTU UTAMA SUMMARY */}
      <Card className="p-6 shadow-sm border border-slate-200/80 rounded-2xl">
        {/* Header: Label & Nama Venue */}
        <div className="flex items-start justify-between gap-2 border-b pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Booking Summary
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">{venueName}</h2>
          </div>
          <Badge variant="secondary" className="bg-sky-50 text-sky-700 font-semibold border-sky-200">
            {sportLabel} {durationHours}h
          </Badge>
        </div>

        {/* Info Lapangan & Gambar */}
        <div className="mt-4 flex gap-3.5 items-start">
          <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
            <Image
              src={courtImage}
              alt={courtName}
              fill
              className="object-cover"
            />
            <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 py-0.5 text-[9px] font-medium text-white">
              Court
            </span>
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm leading-snug truncate">
              {courtName}
            </h3>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{venueAddress}</span>
            </div>

            {/* Badges / Fasilitas Lapangan */}
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                Max {maxPlayers} Players
              </span>
              {courtSpecs.map((spec, i) => (
                <span
                  key={i}
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Kotak Jadwal & Perlengkapan */}
        <div className="mt-4 rounded-xl bg-slate-50/80 p-3.5 space-y-2 border border-slate-100 text-xs text-slate-700">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium text-slate-900">{formatFullDate(date)}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{formatTimeSlot(time, endTime, durationHours)}</span>
          </div>
          {equipmentList.length > 0 && (
            <div className="flex items-start gap-2.5 pt-0.5">
              <Dumbbell className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                {equipmentList.map((eq, idx) => (
                  <span key={idx}>
                    {eq.qty}x {eq.name} Included
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rincian Harga (Cost Breakdown) */}
        <div className="mt-5 space-y-2 text-xs border-t pt-4">
          <div className="flex justify-between text-slate-600">
            <span>
              Court Rental ({durationHours} hrs × {formatRupiah(pricePerHour)})
            </span>
            <span className="font-medium text-slate-900">{formatRupiah(courtRentalTotal)}</span>
          </div>

          {equipmentList.map((eq, idx) => (
            <div key={idx} className="flex justify-between text-slate-600">
              <span>{eq.qty}× {eq.name}</span>
              <span className="font-medium text-slate-900">
                {formatRupiah(eq.qty * eq.pricePerUnit)}
              </span>
            </div>
          ))}
        </div>

        {/* Total Akhir */}
        <div className="mt-5 flex items-end justify-between border-t pt-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Amount
            </p>
            <p className="text-[11px] text-slate-400">All statutory taxes included</p>
          </div>
          <span className="text-2xl font-bold text-emerald-800">
            {formatRupiah(totalPrice)}
          </span>
        </div>

        {/* Free Cancellation Banner */}
        <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-sky-50/70 p-3 text-xs text-sky-950 border border-sky-100">
          <ShieldCheck className="h-4 w-4 shrink-0 text-sky-600 mt-0.5" />
          <div>
            <p className="font-medium leading-tight">
              Free cancellation until <span className="font-bold">Today at 07:00 AM</span> (12 hours before start).
            </p>
            <p className="text-[11px] text-sky-700 mt-0.5">100% wallet credit or bank refund.</p>
          </div>
        </div>
      </Card>

      {/* KARTU BANTUAN / CONCIERGE (Bawah) */}
      <Card className="p-4 shadow-sm border border-slate-200/80 rounded-2xl flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <Headphones className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">Need help with this booking?</p>
            <p className="text-[11px] text-slate-500">SportBook Concierge is live 24/7</p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t pt-2 text-xs text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            +62 811-987-654
          </span>
          <span className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer">
            <HelpCircle className="h-3.5 w-3.5" />
            Help Center
          </span>
        </div>
      </Card>
    </div>
  );
}
