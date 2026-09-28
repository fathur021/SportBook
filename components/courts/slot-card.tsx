"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { CourtSlots, TagTone } from "@/lib/slot";
import { formatRupiah } from "@/lib/format-rupiah";
import { cn } from "@/lib/utils";

const toneClass: Record<TagTone, string> = {
  emerald: "bg-emerald-100 text-emerald-800",
  sky: "bg-sky-100 text-sky-800",
  indigo: "bg-indigo-100 text-indigo-800",
};

export function SlotCard({ court }: { court: CourtSlots }) {
  const [selected, setSelected] = useState(court.defaultSlot);

  return (
    <Card className="gap-0 py-0">
      <CardContent className="flex flex-col gap-4 p-5">
        {/* Tag + Instant */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "rounded px-2 py-1 text-[11px] font-medium",
              toneClass[court.tagTone]
            )}
          >
            {court.tag}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="size-3 text-emerald-700" />
            Instant
          </span>
        </div>

        {/* Judul */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{court.name}</h3>
          <p className="text-xs text-muted-foreground">{court.description}</p>
        </div>

        {/* Pilihan jam */}
        <div className="grid grid-cols-3 gap-2">
          {court.slots.map((slot) => {
            const isSelected = slot.time === selected;

            return (
              <button
                key={slot.time}
                type="button"
                disabled={slot.booked}
                aria-pressed={isSelected}
                onClick={() => setSelected(slot.time)}
                className={cn(
                  "flex flex-col items-center rounded-md px-2 py-2 text-center transition",
                  slot.booked && "cursor-not-allowed bg-slate-100 text-slate-400",
                  !slot.booked && !isSelected && "bg-sky-50 hover:bg-sky-100",
                  isSelected && "bg-emerald-700 text-white"
                )}
              >
                <span
                  className={cn(
                    "text-xs font-medium",
                    slot.booked && "line-through"
                  )}
                >
                  {slot.time}
                </span>
                <span className="text-[10px]">
                  {slot.booked ? "Booked" : formatRupiah(slot.price)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Available Tonight</span>
          <Link
            href={`/courts/${court.id}?slot=${encodeURIComponent(selected)}`}
            className="inline-flex items-center gap-0.5 font-semibold text-emerald-700 hover:underline"
          >
            Reserve {court.courtLabel}
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}