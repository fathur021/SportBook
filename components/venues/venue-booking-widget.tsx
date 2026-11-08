// Widget booking di sidebar halaman venue: pilih disiplin, lapangan, tanggal,
// lalu arahkan ke halaman /book. Slot jam yang sebenarnya hanya dimuat di
// halaman /book supaya selalu sesuai jadwal terbaru dari database.

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle, Shield, Star, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRupiah } from "@/lib/format-rupiah";
import type { SportDiscipline } from "@/lib/venue-detail";
import { cn } from "@/lib/utils";

// Data tombol tanggal, ditaruh di luar komponen agar tidak dibuat ulang
// setiap render.
function buildNextDays(count = 4) {
  const days = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`;

    days.push({
      iso,
      label:
        i === 0
          ? "TODAY"
          : date
              .toLocaleDateString("en-us", { weekday: "short" })
              .toUpperCase(),
      day: String(date.getDate()).padStart(2, "0"),
      display: `${i === 0 ? "Today, " : ""}${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`,
    });
  }
  return days;
}

interface VenueBookingWidgetProps {
  rating: number;
  reviewCount: number;
  basePricePerHour: number;
  disciplines: SportDiscipline[];
  sessionDurations: string[];
  facilityFeeNote: string;
  conciergeName: string;
  venueSlug: string;
}

export function VenueBookingWidget({
  rating,
  reviewCount,
  basePricePerHour,
  disciplines,
  sessionDurations,
  facilityFeeNote,
  conciergeName,
  venueSlug,
}: VenueBookingWidgetProps) {
  const days = useMemo(() => buildNextDays(), []);

  const [sportSlug, setSportSlug] = useState(disciplines[0]?.slug ?? "");

  const activeSport =
    disciplines.find((d) => d.slug === sportSlug) ?? disciplines[0];

  const [courtId, setCourtId] = useState(activeSport?.courts[0]?.id ?? "");
  const [dateIndex, setDateIndex] = useState(0);

  const [duration, setDuration] = useState(sessionDurations[0] ?? "1 Hour");

  const activeCourt =
    activeSport?.courts.find((c) => c.id === courtId) ?? activeSport?.courts[0];
  const hourlyPrice = activeCourt?.pricePerHour ?? basePricePerHour;

  // "1.5 Hours" -> 1.5 ("|| 1" untuk nilai NaN dianggap 1 jam)
  const durationHours = parseFloat(duration) || 1;
  const sessionPrice = useMemo(
    () => Math.round(hourlyPrice * durationHours),
    [hourlyPrice, durationHours],
  );

  if (!activeSport || activeSport.courts.length === 0) return null;

  const handleSportChange = (slug: string) => {
    setSportSlug(slug);
    const nextSport = disciplines.find((d) => d.slug === slug);
    const firstCourt = nextSport?.courts[0];
    if (firstCourt) setCourtId(firstCourt.id);
  };

  return (
    <aside className="flex w-full flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
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
        {reviewCount > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-sm font-semibold">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
            <span className="font-normal text-muted-foreground">
              ({reviewCount})
            </span>
          </span>
        )}
      </div>

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
                sportSlug === d.slug
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100",
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold">Court Selection</p>
        <Select value={courtId} onValueChange={(v) => setCourtId(v ?? "")}>
          <SelectTrigger className="h-10 w-full bg-slate-50 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {activeSport.courts.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                <span className="flex items-center justify-between gap-3">
                  <span>{c.label}</span>
                  <span className="shrink-0 text-emerald-700">
                    {formatRupiah(c.pricePerHour ?? basePricePerHour)}/jam
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold">Select Session Date</p>
          <span className="text-[11px] text-emerald-700">
            {days[dateIndex].display}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {days.map((d, i) => {
            const isSelected = i === dateIndex;
            return (
              <button
                key={d.label}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setDateIndex(i)}
                className={cn(
                  "flex flex-col items-center rounded-lg py-2 text-xs font-medium",
                  isSelected
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100",
                )}
              >
                <span>{d.label}</span>
                <span className="text-sm font-bold">{d.day}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold">Session Duration</p>
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

      <p className="rounded-lg bg-sky-50 px-3 py-2 text-[11px] text-sky-800">
        Jam yang tersedia akan dimuat langsung di halaman booking sesuai jadwal
        terbaru.
      </p>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Current Court Rate</span>
        <span className="font-semibold text-emerald-700">
          {formatRupiah(hourlyPrice)} / hour
        </span>
      </div>

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

      <Button
        nativeButton={false}
        render={
          <Link
            href={`/venues/${venueSlug}/book?sport=${sportSlug}&court=${courtId}&date=${days[dateIndex].iso}&duration=${encodeURIComponent(duration)}`}
            className="h-11 w-full gap-1.5 bg-emerald-700 font-medium hover:bg-emerald-800"
          >
            <Zap className="size-4" />
            Check Real-time Slot Availability
          </Link>
        }
      />

      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Shield className="size-3.5" />
          Instant Confirmation
        </span>
        <span>12h Free Cancellation</span>
      </div>

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
