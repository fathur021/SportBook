import Image from "next/image";
import { BadgeCheck, CircleAlert, Users } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/format-rupiah";
import { cn } from "@/lib/utils";
import type { SportDiscipline, VenueDetail } from "@/lib/venue-detail";

type CourtTableProps = {
  courts: SportDiscipline["courts"];
  images: VenueDetail["images"];
  defaultPricePerHour?: number;
};

export function CourtTable({
  courts,
  images,
  defaultPricePerHour,
}: CourtTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[144px]">Foto</TableHead>
            <TableHead className="min-w-[160px]">Nama Court</TableHead>
            <TableHead className="min-w-[220px]">Detail</TableHead>
            <TableHead className="w-[110px]">Kapasitas</TableHead>
            <TableHead className="w-[130px]">Harga / Jam</TableHead>
            <TableHead className="w-[110px] text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {courts.length > 0 ? (
            courts.map((court) => {
              const imageSrc =
                court.image ?? images[court.imageIndex ?? 0]?.src;
              const pricePerHour = court.pricePerHour ?? defaultPricePerHour;
              // Sama seperti di halaman venue (available-court): court yang
              // statusnya belum diisi dianggap aktif.
              const isOperational = court.isOperational !== false;
              const hasDetail = Boolean(
                court.badge || court.specs?.length || court.features?.length,
              );

              return (
                <TableRow
                  key={court.id}
                  className="align-middle hover:bg-slate-50/70"
                >
                  <TableCell className="py-3">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={court.label}
                        width={128}
                        height={80}
                        className="h-20 w-32 rounded-lg border object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-32 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500">
                        Foto belum ada
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="whitespace-normal py-3">
                    <p className="font-semibold text-slate-900">
                      {court.label}
                    </p>
                  </TableCell>

                  <TableCell className="whitespace-normal py-3">
                    {hasDetail ? (
                      <div className="space-y-2">
                        {court.badge && (
                          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            {court.badge}
                          </span>
                        )}
                        {court.specs && court.specs.length > 0 && (
                          <p className="text-xs text-slate-500">
                            {court.specs.join(" • ")}
                          </p>
                        )}
                        {court.features && court.features.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {court.features.map((feature) => (
                              <span
                                key={feature}
                                className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">Belum diisi</p>
                    )}
                  </TableCell>

                  <TableCell className="py-3">
                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                      <Users className="size-4 text-slate-400" />
                      {court.maxPlayers != null
                        ? `${court.maxPlayers} pemain`
                        : "-"}
                    </span>
                  </TableCell>

                  <TableCell className="py-3">
                    {pricePerHour != null ? (
                      <p className="whitespace-nowrap font-semibold text-slate-900">
                        {formatRupiah(pricePerHour)}
                        <span className="ml-1 text-xs font-normal text-slate-500">
                          / jam
                        </span>
                      </p>
                    ) : (
                      <span className="text-sm text-slate-400">
                        Belum diatur
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="py-3 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        isOperational
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700",
                      )}
                    >
                      {isOperational ? (
                        <BadgeCheck className="size-3.5" />
                      ) : (
                        <CircleAlert className="size-3.5" />
                      )}
                      {isOperational ? "Aktif" : "Nonaktif"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-sm text-slate-500"
              >
                Belum ada court untuk cabang olahraga ini.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
