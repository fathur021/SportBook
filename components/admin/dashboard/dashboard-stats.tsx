import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  Hourglass,
  ReceiptText,
  Wallet,
} from "lucide-react";

import { formatRupiah } from "@/lib/format-rupiah";
import { dashboardStats, type DashboardStat } from "@/lib/mock-dashboard";
import { cn } from "@/lib/utils";

// Ikon dan warna per kartu ringkasan.
const STAT_STYLES: Record<
  DashboardStat["key"],
  { icon: typeof Wallet; iconClass: string }
> = {
  revenue: { icon: Wallet, iconClass: "bg-emerald-50 text-emerald-700" },
  paid: { icon: ReceiptText, iconClass: "bg-blue-50 text-blue-700" },
  pending: { icon: Hourglass, iconClass: "bg-amber-50 text-amber-700" },
  today: { icon: CalendarCheck, iconClass: "bg-slate-100 text-slate-600" },
};

function formatValue(stat: DashboardStat) {
  if (stat.key === "revenue") {
    return formatRupiah(stat.value);
  }
  return stat.value.toLocaleString("id-ID");
}

export function DashboardStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => {
        const style = STAT_STYLES[stat.key];
        const Icon = style.icon;
        const isUp = stat.trend?.direction === "up";

        return (
          <article
            key={stat.key}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  style.iconClass,
                )}
              >
                <Icon className="size-4" />
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {formatValue(stat)}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-xs text-slate-500">{stat.note}</p>
              {stat.trend ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-medium",
                    isUp ? "text-emerald-700" : "text-amber-700",
                  )}
                >
                  {isUp ? (
                    <ArrowUpRight className="size-3.5" />
                  ) : (
                    <ArrowDownRight className="size-3.5" />
                  )}
                  {stat.trend.label}
                </span>
              ) : null}
            </div>
          </article>
        );
      })}
    </section>
  );
}
