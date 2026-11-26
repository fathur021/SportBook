"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Home,
  LayoutGrid,
  MapPin,
  Users,
  Wallet,
} from "lucide-react";
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
import {
  AdminStatCards,
  type AdminStatItem,
} from "@/components/admin/admin-stat-cards";
import { SearchInput } from "@/components/admin/search-input";

interface CourtTableProps {
  slug: string;
}

export function CourtTable({ slug }: CourtTableProps) {
  const { data: courts, isLoading, isError } = useGetVenueCourtsQuery(slug);
  const [query, setQuery] = useState("");

  const allCourts = courts ?? [];

  const filteredCourts = allCourts.filter((court) => {
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

  const activeCourts = allCourts.filter((court) => court.isActive).length;
  const indoorCourts = allCourts.filter((court) => court.isIndoor).length;
  const averagePrice =
    allCourts.length > 0
      ? Math.round(
          allCourts.reduce((total, court) => total + court.pricePerHour, 0) /
            allCourts.length,
        )
      : 0;

  const stats: AdminStatItem[] = [
    {
      label: "Total Lapangan",
      value: allCourts.length,
      note: "Court di venue ini",
      icon: LayoutGrid,
      tone: "slate",
    },
    {
      label: "Lapangan Aktif",
      value: activeCourts,
      note: "Siap dipesan",
      icon: CheckCircle2,
      tone: "emerald",
    },
    {
      label: "Lapangan Indoor",
      value: indoorCourts,
      note: `${allCourts.length - indoorCourts} outdoor`,
      icon: Home,
      tone: "blue",
    },
    {
      label: "Rata-rata Harga",
      value: formatRupiah(averagePrice),
      note: "Tarif per jam",
      icon: Wallet,
      tone: "amber",
    },
  ];

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
    <div className="space-y-4 p-4 sm:p-5">
      <AdminStatCards items={stats} />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Daftar Lapangan
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Menampilkan {filteredCourts.length} dari {allCourts.length}{" "}
              lapangan
            </p>
          </div>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Cari nama, cabang, atau permukaan..."
          />
        </div>

        <Table className="min-w-[980px]">
          <TableHeader className="bg-white">
            <TableRow>
              <TableHead className="min-w-[200px] pl-4">Foto</TableHead>
              <TableHead className="min-w-[180px]">Nama Court</TableHead>
              <TableHead className="min-w-[220px]">Detail</TableHead>
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
                detailParts.push(court.isIndoor ? "Indoor" : "Outdoor");

                return (
                  <TableRow
                    key={court.id}
                    className="align-middle hover:bg-slate-50/70"
                  >
                    <TableCell className="py-3 pl-4">
                      {court.image ? (
                        <div className="relative h-20 w-32 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ring-2 ring-white">
                          <Image
                            src={court.image}
                            alt={court.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-20 w-32 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
                          <MapPin className="size-4" />
                          Tanpa foto
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="whitespace-normal py-3">
                      <p className="font-semibold text-slate-900">
                        {court.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {court.sport}
                      </p>
                    </TableCell>

                    <TableCell className="whitespace-normal py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {detailParts.map((part) => (
                          <Badge
                            key={part}
                            variant="secondary"
                            className="border-slate-200 bg-slate-50 font-medium text-slate-600"
                          >
                            {part}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="py-3">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-700">
                        <Users className="size-3.5 text-slate-400" />
                        {court.maxPlayers ?? "-"}
                      </span>
                    </TableCell>

                    <TableCell className="py-3">
                      <span className="whitespace-nowrap font-semibold text-emerald-700">
                        {formatRupiah(court.pricePerHour)}
                      </span>
                      <span className="ml-1 text-xs font-normal text-slate-500">
                        / jam
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          court.isActive
                            ? "gap-1.5 border-emerald-200 bg-emerald-50 font-medium text-emerald-700"
                            : "gap-1.5 border-slate-200 bg-slate-100 font-medium text-slate-500"
                        }
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            court.isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
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
                  className="h-28 text-center text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="size-4" />
                    {allCourts.length > 0
                      ? "Lapangan tidak ditemukan."
                      : "Belum ada lapangan untuk venue ini."}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
