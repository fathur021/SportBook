"use client";

import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format-rupiah";
import { getTimeSlotBands, type TimeSlotOption } from "@/lib/time-slots";
import { cn } from "@/lib/utils";

type SelectTimeSlotProps = {
  slots: TimeSlotOption[];
  pricePerHour: number;
  value: string | null;
  onValueChange: (time: string) => void;
};

export function SelectTimeSlot({
  slots,
  pricePerHour,
  value,
  onValueChange,
}: SelectTimeSlotProps) {
  const bands = getTimeSlotBands(slots);

  return (
    <Card className="p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
        Step 2
      </p>
      <h2 className="text-2xl font-bold tracking-tight">Select Time Slot</h2>

      {bands.length === 0 ? (
        <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-muted-foreground">
          Slot jam belum tersedia untuk venue ini, silakan hubungi venue.
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
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={slot.booked}
                      aria-pressed={selected}
                      onClick={() => onValueChange(slot.time)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl border px-3 py-3 transition",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
                        selected
                          ? "border-emerald-800 bg-emerald-800 text-white shadow-lg"
                          : slot.booked
                            ? "border-slate-100 bg-slate-50 opacity-60"
                            : "border-blue-100 bg-blue-50 hover:bg-blue-100",
                        slot.booked && "cursor-not-allowed"
                      )}
                    >
                      <span className="text-sm font-semibold">{slot.time}</span>

                      <span
                        className={cn(
                          "text-sm font-bold",
                          selected ? "text-white" : "text-emerald-700"
                        )}
                      >
                        {formatRupiah(pricePerHour)}
                      </span>

                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                          slot.booked
                            ? "bg-rose-100 text-rose-600"
                            : selected
                              ? "bg-emerald-950/40 text-white"
                              : "bg-emerald-100 text-emerald-700"
                        )}
                      >
                        {slot.booked ? "Booked" : "Available"}
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