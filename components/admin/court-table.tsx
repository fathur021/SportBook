"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Users } from "lucide-react";
import { formatRupiah } from "@/lib/format-rupiah";
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
import { CourtRowActions } from "./Court-row-actions";
import { SearchInput } from "@/components/admin/search-input";

interface CourtTableProps {
  slug: string;
}

export function CourtTable({ slug }: CourtTableProps) {
  const { data: courts, isLoading, isError } = useGetVenueCourtsQuery(slug);
  const [query, setQuery] = useState("");

  const filteredCourts = (courts ?? []).filter((court) => {
    const teks = [
      court.name,
      court.sport,
      court.surface ?? "",
      court.isIndoor ? "Indoor" : "Outdoor",
    ]
      .join(" ")
      .toLowerCase();

    return teks.includes(query.trim().toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Memuat data court...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-sm text-red-500">
        Gagal memuat data court. Coba muat ulang halaman.
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-slate-100 p-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari nama, cabang, atau permukaan..."
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px] pl-4">Foto</TableHead>
            <TableHead className="min-w-[180px]">Nama Court</TableHead>
            <TableHead className="min-w-[200px]">Detail</TableHead>
            <TableHead className="w-[120px]">Kapasitas</TableHead>
            <TableHead className="w-[160px]">Harga / Jam</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[180px] pr-4 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCourts.length > 0 ? (
            filteredCourts.map((court) => {
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
                  <TableCell className="py-3 pl-4">
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
                        <MapPin className="mr-1 h-4 w-4" />
                        Tanpa foto
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="whitespace-normal py-3">
                    <p className="font-semibold text-slate-900">{court.name}</p>
                  </TableCell>

                  <TableCell className="whitespace-normal py-3">
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
                  </TableCell>

                  <TableCell className="py-3">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-700">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      {court.maxPlayers ? `${court.maxPlayers}` : "-"}
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

                  <TableCell className="py-3">
                    <Badge
                      variant="secondary"
                      className={
                        court.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }
                    >
                      {court.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <CourtRowActions item={court} slug={slug} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground"
              >
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4" />
                  {courts && courts.length > 0
                    ? "Lapangan tidak ditemukan."
                    : "Belum ada lapangan untuk venue ini."}
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
