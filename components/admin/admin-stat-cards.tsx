import type { LucideIcon } from "lucide-react";

type StatTone = "emerald" | "blue" | "amber" | "slate";

export type AdminStatItem = {
  label: string;
  value: string | number;
  note?: string;
  icon: LucideIcon;
  tone?: StatTone;
};

const toneStyles: Record<StatTone, string> = {
  emerald: "bg-emerald-50 text-emerald-700",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  slate: "bg-slate-100 text-slate-600",
};

export function AdminStatCards({ items }: { items: AdminStatItem[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const tone = item.tone ?? "slate";

        return (
          <article
            key={item.label}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">{item.label}</p>
              <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
                {item.value}
              </p>
              {item.note && (
                <p className="mt-1 truncate text-[11px] text-slate-400">
                  {item.note}
                </p>
              )}
            </div>
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${toneStyles[tone]}`}
            >
              <Icon className="size-5" />
            </div>
          </article>
        );
      })}
    </section>
  );
}
