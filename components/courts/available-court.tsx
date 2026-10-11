// Daftar lapangan per disiplin olahraga beserta spesifikasi & harga.

import Image from "next/image";
import { BadgeCheck, CircleAlert, ImageIcon, Users } from "lucide-react";

import { formatRupiah } from "@/lib/format-rupiah";
import type { GalleryImage, SportDiscipline } from "@/lib/venue-detail";
import { cn } from "@/lib/utils";

interface AvailableCourtProps {
  disciplines: SportDiscipline[];
  basePricePerHour: number;
  images: GalleryImage[]; // galeri venue, dipakai untuk foto court via imageIndex
}

export function AvailableCourt({
  disciplines,
  basePricePerHour,
  images,
}: AvailableCourtProps) {
  return (
    <section className="space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          Direct booking selection
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Available Courts & Specifications
        </h2>
        <p className="text-sm text-slate-500">
          Semua lapangan di venue ini beserta spesifikasi dan harganya.
        </p>
      </div>

      <div className="space-y-8">
        {disciplines.map((discipline) => (
          <div key={discipline.slug} className="space-y-3">
            <h3 className="text-base font-bold text-slate-800">
              {discipline.label}
            </h3>

            <div className="space-y-3">
              {discipline.courts.map((court) => {
                const price = court.pricePerHour ?? basePricePerHour;
                const isClosed = court.isOperational === false;
                const courtImage =
                  court.image ??
                  images[court.imageIndex ?? 0]?.src ??
                  undefined;

                return (
                  <div
                    key={court.id}
                    className={cn(
                      "flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-stretch sm:justify-between sm:p-5",
                      isClosed && "opacity-70",
                    )}
                  >
                    <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-auto sm:w-40">
                      {courtImage ? (
                        <Image
                          src={courtImage}
                          alt={court.label}
                          fill
                          sizes="(max-width: 640px) 100vw, 160px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="size-6 text-slate-300" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-bold text-slate-900">
                          {court.label}
                        </p>
                        {court.badge && (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            {court.badge}
                          </span>
                        )}
                      </div>

                      {court.specs && court.specs.length > 0 && (
                        <p className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
                          {court.specs.map((spec, i) => (
                            <span
                              key={spec}
                              className="flex items-center gap-2"
                            >
                              {i > 0 && (
                                <span className="size-1 rounded-full bg-slate-300" />
                              )}
                              {spec}
                            </span>
                          ))}
                        </p>
                      )}

                      {court.features && court.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {court.features.map((feature) => (
                            <span
                              key={feature}
                              className="rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-3 sm:min-w-[170px] sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                      <div className="space-y-1.5 sm:text-right">
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                          <Users className="size-3" />
                          {court.maxPlayers ?? "-"} Players
                        </span>
                        <div>
                          <p className="text-[11px] text-slate-500">
                            Court Rate
                          </p>
                          <p className="text-lg font-extrabold text-slate-900">
                            {formatRupiah(price)}
                            <span className="ml-1 text-xs font-normal text-slate-500">
                              / hour
                            </span>
                          </p>
                        </div>
                      </div>

                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          isClosed
                            ? "bg-rose-50 text-rose-700"
                            : "bg-emerald-50 text-emerald-700",
                        )}
                      >
                        {isClosed ? (
                          <CircleAlert className="size-3.5" />
                        ) : (
                          <BadgeCheck className="size-3.5" />
                        )}
                        {isClosed ? "Unavailable" : "Operational"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}