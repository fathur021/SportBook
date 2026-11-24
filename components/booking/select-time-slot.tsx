"use client";

import { Card } from "@/components/ui/card";
import { minutesToTime, timeToMinutes } from "@/lib/datetime";
import { formatRupiah } from "@/lib/format-rupiah";
import { getTimeSlotBands, type TimeSlotOption } from "@/lib/time-slots";
import { cn } from "@/lib/utils";

type SelectTimeSlotProps = {
  slots: TimeSlotOption[];
  pricePerHour: number;
  value: string | null;
  onValueChange: (time: string) => void;
  durationHours?: number; // [TAMBAH]
  loading?: boolean; // [TAMBAH]
  error?: string; // [TAMBAH]
  emptyMessage?: string;
};

// [TAMBAH] Cek apakah mulai di slot ini muat untuk seluruh durasi.
// Contoh durasi 2 jam: slot 09:00 butuh 09:00 dan 10:00 sama-sama kosong.
function isRangeAvailable(
  slotTime: string,
  durationHours: number,
  slots: TimeSlotOption[],
) {
  const startTime = slotTime.split(" - ")[0] ?? "";
  const startMinutes = timeToMinutes(startTime);
  if (Number.isNaN(startMinutes)) return false;

  for (let i = 0; i < durationHours; i++) {
    const neededTime = minutesToTime(startMinutes + i * 60);
    const nextSlot = slots.find(
      (slot) => (slot.time.split(" - ")[0] ?? "") === neededTime,
    );

    if (!nextSlot || nextSlot.booked) return false;
  }
  return true;
}

export function SelectTimeSlot({
  slots,
  pricePerHour,
  value,
  onValueChange,
  durationHours = 1, // [TAMBAH]
  loading = false, // [TAMBAH]
  error, // [TAMBAH]
  emptyMessage = "Slot jam belum tersedia untuk venue ini, silakan hubungi venue.",
}: SelectTimeSlotProps) {
  const bands = getTimeSlotBands(slots);
  // [TAMBAH] Pastikan durasi minimal 1 jam dan bilangan bulat.
  const safeDuration = Math.max(1, Math.round(durationHours));

  return (
    <Card className="p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
        Step 2
      </p>
      <h2 className="text-2xl font-bold tracking-tight">Select Time Slot</h2>

      {/* [GANTI] Urutan tampilan: loading, error, kosong, lalu daftar slot. */}
      {loading ? (
        <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-muted-foreground">
          Memuat slot untuk tanggal ini...
        </p>
      ) : error ? (
        <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : bands.length === 0 ? (
        <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {bands.map((band) => (
            <div key={band.id}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold">{band.label}</h3>
                <span className="text-xs text-muted-foreground">
                  {band.range}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {band.slots.map((slot) => {
                  const selected = value === slot.time;
                  // [TAMBAH] Slot tidak bisa dipilih kalau sudah dibooked
                  // atau sisa jamnya tidak cukup untuk durasi yang dipilih.
                  const unavailable =
                    slot.booked ||
                    !isRangeAvailable(slot.time, safeDuration, slots);

                  
                  const startTime = slot.time.split(" - ")[0] ?? "";
                  const startMinutes = timeToMinutes(startTime);
                  const endTime = Number.isNaN(startMinutes)
                    ? ""
                    : minutesToTime(startMinutes + safeDuration * 60);
                  const slotLabel = endTime
                    ? `${startTime} - ${endTime}`
                    : startTime;

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={unavailable}
                      aria-pressed={selected}
                      onClick={() => onValueChange(slot.time)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl border px-3 py-3 transition",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
                        selected
                          ? "border-emerald-800 bg-emerald-800 text-white shadow-lg"
                          : unavailable
                            ? "border-slate-100 bg-slate-50 opacity-60"
                            : "border-blue-100 bg-blue-50 hover:bg-blue-100",
                        unavailable && "cursor-not-allowed",
                      )}
                    >
                      <span className="text-sm font-semibold">{slotLabel}</span>

                      <span
                        className={cn(
                          "text-sm font-bold",
                          selected
                            ? "text-white"
                            : unavailable
                              ? "text-slate-400"
                              : "text-emerald-700",
                        )}
                      >
                        {formatRupiah(pricePerHour * safeDuration)}
                      </span>

                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                          unavailable
                            ? "bg-rose-100 text-rose-600"
                            : selected
                              ? "bg-emerald-950/40 text-white"
                              : "bg-emerald-100 text-emerald-700",
                        )}
                      >
                        {slot.booked
                          ? "Booked"
                          : unavailable
                            ? "Unavailable"
                            : "Available"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
