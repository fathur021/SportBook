import Link from "next/link";
import { AlarmClock, ArrowRight, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/format-rupiah";
import { actionNeeded } from "@/lib/mock-dashboard";
import { cn } from "@/lib/utils";

export function ActionNeededCard() {
  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            Perlu Tindakan
            <Badge
              variant="secondary"
              className="bg-amber-50 text-amber-700"
            >
              {actionNeeded.length}
            </Badge>
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Booking yang mendekati batas waktu pembayaran.
          </p>
        </div>

        <Link
          href="/admin/bookings"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800"
        >
          Lihat semua
          <ArrowRight className="size-3.5" />
        </Link>
      </header>

      <ul className="divide-y divide-slate-100">
        {actionNeeded.map((item) => {
          const urgent = item.minutesLeft <= 5;

          return (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold text-slate-900">
                  {item.orderCode}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {item.customer} · {item.playDate}, {item.startTime}–
                  {item.endTime}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="size-3" />
                  {item.venue} · {item.court}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-900">
                  {formatRupiah(item.totalPrice)}
                </span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "gap-1",
                    urgent
                      ? "bg-red-50 text-red-700"
                      : "bg-amber-50 text-amber-700",
                  )}
                >
                  <AlarmClock className="size-3" />
                  {item.minutesLeft} menit
                </Badge>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
