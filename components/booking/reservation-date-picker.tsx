"use client";

import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  MAX_DAYS_AHEAD,
  toDateKey,
  type AvailabilityByDate,
} from "@/lib/booking-dates";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const addDays = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);

// Senin pada minggu yang memuat `date`
const startOfWeekMonday = (date: Date) => addDays(date, -((date.getDay() + 6) % 7));

type Props = {
  availability: AvailabilityByDate;
  selectedSlotsCount?: number;
  value: string | null; // "YYYY-MM-DD"
  onValueChange: (date: string) => void;
};

export function ReservationDatePicker({
  availability,
  selectedSlotsCount = 0,
  value,
  onValueChange,
}: Props) {
  const today = useMemo(() => addDays(new Date(), 0), []);
  const maxDate = addDays(today, MAX_DAYS_AHEAD);

  const [weekStart, setWeekStart] = useState(() => startOfWeekMonday(today));
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const canGoPrev = weekStart > startOfWeekMonday(today);
  const canGoNext = addDays(weekStart, 7) <= maxDate;

  return (
    <Card className="p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Step 1
          </p>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Select Reservation Date
          </h2>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="bg-blue-50 hover:bg-blue-100"
            disabled={!canGoPrev}
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            aria-label="Minggu sebelumnya"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-blue-50 hover:bg-blue-100"
            disabled={!canGoNext}
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            aria-label="Minggu berikutnya"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Daftar hari */}
      <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-3">
        {days.map((date) => {
          const key = toDateKey(date);
          const info = availability[key];
          const slots = info?.slots ?? 0;
          const outOfRange = date < today || date > maxDate;
          const disabled = outOfRange || !!info?.maintenance || slots === 0;
          const selected = value === key;
          const weekend = date.getDay() === 0 || date.getDay() === 6;

          const label = outOfRange
            ? "—"
            : info?.maintenance
              ? "Maintenance"
              : slots === 0
                ? "Full"
                : slots === 1
                  ? "1 slot left"
                  : `${slots} slots`;

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onValueChange(key)}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl px-1 py-3 text-center transition sm:px-2 sm:py-4",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
                selected
                  ? "bg-emerald-800 text-white shadow-lg"
                  : "bg-blue-50 hover:bg-blue-100",
                disabled && "cursor-not-allowed opacity-50 hover:bg-blue-50"
              )}
            >
              {selected && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full border bg-white px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                  Selected
                </span>
              )}

              <span
                className={cn(
                  "text-sm font-semibold",
                  !selected && weekend && "text-emerald-800"
                )}
              >
                {DAY_NAMES[date.getDay()]}
              </span>

              <span className="text-2xl font-bold">{date.getDate()}</span>

              <span
                className={cn(
                  "text-xs",
                  selected
                    ? "rounded bg-emerald-950/40 px-2 py-0.5 font-semibold"
                    : "text-muted-foreground",
                  !selected && slots === 1 && !disabled && "font-medium text-red-600"
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 rounded-lg bg-blue-50 px-4 py-3 text-xs font-medium">
        <span className="flex items-center gap-2">
          <span className="flex size-4 items-center justify-center rounded bg-emerald-800">
            <Check className="size-3 text-white" />
          </span>
          Selected ({selectedSlotsCount} slots)
        </span>
        <span className="flex items-center gap-2">
          <span className="size-4 rounded border bg-white" />
          Available
        </span>
        <span className="flex items-center gap-2 text-muted-foreground">
          <span className="size-4 rounded bg-blue-100" />
          <span className="line-through">Booked / Reserved</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="flex size-4 items-center justify-center rounded bg-blue-100">
            <Lock className="size-2.5 text-muted-foreground" />
          </span>
          Maintenance
        </span>
      </div>
    </Card>
  );
}