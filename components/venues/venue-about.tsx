import type { VenueStat } from "@/lib/venue-detail";

interface VenueAboutProps {
  name: string;
  description: string;
  stats: VenueStat[];
}

export function VenueAbout({ name, description, stats }: VenueAboutProps) {
  return (
    <section className="rounded-lg border bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-600">
            Facility Standards
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            About {name}
          </h2>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-600" />
          Real-time court sensor active
        </span>
      </div>

      <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
        {description}
      </p>

      {/* Kartu statistik: angka besar di atas, label kecil di bawah */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-md bg-slate-50 px-4 py-3 text-center"
          >
            <p className="text-sm font-bold text-slate-900">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}