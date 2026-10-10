import type { SportDiscipline, VenueDetail } from "@/lib/venue-detail";

import Image from "next/image";
import {
  CheckCircle2,
  MapPin,
  Star,
  CircleDot,
} from "lucide-react";

import { formatRupiah } from "@/lib/format-rupiah";

interface BookingHeaderProps {
  venue: VenueDetail;
  sportLabel: string;
  court: SportDiscipline["courts"][number];
  duration?: string;
}

export function BookingHeader({
  venue,
  sportLabel,
  court,
  duration,
}: BookingHeaderProps) {
  const courtImage =
    court.image ??
    venue.images[court.imageIndex ?? 0]?.src;

  const pricePerHour =
    court.pricePerHour ?? venue.pricePerHour;

  return (
    <section className="border-y border-slate-200 bg-[#f1f5ff]">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
        {/* =========================
            COURT IMAGE
        ========================= */}
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {courtImage ? (
            <Image
              src={courtImage}
              alt={court.label}
              fill
              sizes="72px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              No Image
            </div>
          )}

          {/* Court ID */}
          <div className="absolute bottom-1 right-1 rounded bg-emerald-700 px-1.5 py-0.5 text-[9px] font-bold text-white shadow">
            {court.id.replace("court-", "C-")}
          </div>
        </div>

        {/* =========================
            COURT INFORMATION
        ========================= */}
        <div className="min-w-0 flex-1">
          {/* Court name + badge */}
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-950">
              {court.label}
            </h1>

            {court.badge && (
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                {court.badge}
              </span>
            )}
          </div>

          {/* Court specification */}
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            {court.specs?.[0] && (
              <span className="flex items-center gap-1">
                <CircleDot className="h-3.5 w-3.5 text-emerald-600" />
                {court.specs[0]}
              </span>
            )}

            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              {venue.address}
            </span>

            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-800">
                {venue.rating}
              </span>

              <span>
                ({venue.reviewCount} reviews)
              </span>
            </span>
          </div>

          {/* Venue + Sport */}
          <div className="mt-1 text-[11px] text-slate-500">
            {venue.name} <span className="mx-1">•</span>{" "}
            {sportLabel}

            {duration && (
              <>
                <span className="mx-1">•</span>
                {duration}
              </>
            )}
          </div>
        </div>

        {/* =========================
            PRICE
        ========================= */}
        <div className="hidden shrink-0 text-right sm:block">
          <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500">
            Base Rate
          </p>

          <div className="mt-0.5">
            <span className="text-2xl font-bold tracking-tight text-emerald-700">
              {formatRupiah(pricePerHour)}
            </span>

            <span className="ml-1 text-xs text-slate-500">
              / hour
            </span>
          </div>
        </div>

        {/* =========================
            SURFACE / STATUS
        ========================= */}
        <div className="hidden shrink-0 sm:block">
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center shadow-sm">
            <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500">
              Surface
            </p>

            <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Optimal
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}