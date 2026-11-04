"use client";

import Image from "next/image";
import { formatRupiah } from "@/lib/format-rupiah";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGetVenueCourtsQuery } from "@/lib/redux/admin-api";

interface CourtTableProps {
  slug: string;
}

export function CourtTable({ slug }: CourtTableProps) {
  const { data: courts, isLoading, isError } = useGetVenueCourtsQuery(slug);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-8 text-center text-sm text-slate-500">
          Memuat data court...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-8 text-center text-sm text-red-500">
          Gagal memuat data court. Coba muat ulang halaman.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="min-w-36">Foto</TableHead>
            <TableHead className="min-w-44">Nama Court</TableHead>
            <TableHead className="min-w-56">Detail</TableHead>
            <TableHead className="min-w-28">Kapasitas</TableHead>
            <TableHead className="min-w-32">Harga / Jam</TableHead>
            <TableHead className="min-w-28 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {courts && courts.length > 0 ? (
            courts.map((court) => {
              const detailParts: string[] = [];
              if (court.sport) detailParts.push(court.sport);
              if (court.surface) detailParts.push(court.surface);
              if (court.isIndoor) detailParts.push("Indoor");
              else detailParts.push("Outdoor");

              return (
                <TableRow
                  key={court.id}
                  className="align-middle hover:bg-slate-50/70"
                >
                  <TableCell className="py-3">
                    {court.image ? (
                      <div className="relative h-20 w-32 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={court.image}
                          alt={court.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-32 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-500">
                        Foto belum ada
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="whitespace-normal py-3">
                    <p className="font-semibold text-slate-900">
                      {court.name}
                    </p>
                  </TableCell>

                  <TableCell className="whitespace-normal py-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {detailParts.map((part) => (
                          <Badge
                            key={part}
                            variant="secondary"
                            className="bg-slate-100 text-slate-600 border-slate-200 font-medium"
                          >
                            {part}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    <span className="text-sm font-medium text-slate-700">
                      {court.maxPlayers ? `${court.maxPlayers} Orang` : "-"}
                    </span>
                  </TableCell>

                  <TableCell className="py-3">
                    <p className="whitespace-nowrap font-semibold text-slate-900">
                      {formatRupiah(court.pricePerHour)}
                      <span className="ml-1 text-xs font-normal text-slate-500">
                        / jam
                      </span>
                    </p>
                  </TableCell>

                  <TableCell className="py-3 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        "bg-emerald-50 text-emerald-700",
                      )}
                    >
                      Aktif
                    </span>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-sm text-slate-500"
              >
                Belum ada court yang terdaftar untuk venue ini.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
