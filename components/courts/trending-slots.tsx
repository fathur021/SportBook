import { SlotCard } from "./slot-card";
import type { CourtSlots } from "@/lib/slot";

export function TrendingSlots({ courts }: { courts: CourtSlots[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">
            Live Booking Grid
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            Trending Prime-Time Slots Today
          </h2>
        </div>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-emerald-700" />
          Live slot availability refreshed 2m ago
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courts.map((court) => (
          <SlotCard key={court.id} court={court} />
        ))}
      </div>
    </section>
  );
}