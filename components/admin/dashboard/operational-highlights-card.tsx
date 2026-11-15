import { operationalHighlights } from "@/lib/mock-dashboard";
import { cn } from "@/lib/utils";

const toneStyles = {
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  slate: "bg-slate-100 text-slate-600",
} as const;

export function OperationalHighlightsCard() {
  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">Sorotan Operasional</h2>
        <p className="mt-1 text-xs text-slate-500">
          Kondisi venue, lapangan, peralatan, dan user.
        </p>
      </header>

      <ul className="flex-1 divide-y divide-slate-100">
        {operationalHighlights.map((item) => (
          <li
            key={item.key}
            className="flex items-center justify-between gap-3 px-5 py-3.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">{item.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{item.note}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-md px-2 py-1 text-xs font-semibold",
                toneStyles[item.tone],
              )}
            >
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
