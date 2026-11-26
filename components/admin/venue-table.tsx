"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  Eye,
  LayoutGrid,
  MapPin,
  Star,
} from "lucide-react";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { VenueRowActions } from "@/components/admin/Venue-row-actions";
import {
  AdminStatCards,
  type AdminStatItem,
} from "@/components/admin/admin-stat-cards";
import { SearchInput } from "@/components/admin/search-input";
import { useGetAdminVenuesQuery } from "@/lib/redux/admin-api";

export function VenueTable() {
  const { data: venues, isLoading, isError } = useGetAdminVenuesQuery();
  const [query, setQuery] = useState("");

  const allVenues = venues ?? [];

  const filteredVenues = allVenues.filter((venue) => {
    const teks = [
      venue.name,
      venue.address,
      venue.city,
      ...(venue.courts ?? []).map((court) => `${court.name} ${court.sport}`),
    ]
      .join(" ")
      .toLowerCase();

    return teks.includes(query.trim().toLowerCase());
  });

  const totalCourts = allVenues.reduce(
    (total, venue) => total + (venue.courts?.length ?? 0),
    0,
  );
  const activeVenues = allVenues.filter((venue) => venue.isActive).length;
  const popularVenues = allVenues.filter((venue) => venue.isPopular).length;

  const stats: AdminStatItem[] = [
    {
      label: "Total Venue",
      value: allVenues.length,
      note: "Seluruh venue terdaftar",
      icon: Building2,
      tone: "slate",
    },
    {
      label: "Venue Aktif",
      value: activeVenues,
      note: "Siap menerima booking",
      icon: CheckCircle2,
      tone: "emerald",
    },
    {
      label: "Total Lapangan",
      value: totalCourts,
      note: "Court di semua venue",
      icon: LayoutGrid,
      tone: "blue",
    },
    {
      label: "Venue Populer",
      value: popularVenues,
      note: "Ditampilkan di beranda",
      icon: Star,
      tone: "amber",
    },
  ];

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        Memuat data venue...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-700">
        Gagal memuat data venue. Coba muat ulang halaman.
      </div>
    );
  }

  if (allVenues.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <Building2 className="mx-auto size-10 text-slate-300" />
        <p className="mt-3 text-sm font-semibold text-slate-800">
          Belum ada venue
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Klik &quot;Tambah Venue Baru&quot; untuk memulai.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdminStatCards items={stats} />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Daftar Venue
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Menampilkan {filteredVenues.length} dari {allVenues.length} venue
            </p>
          </div>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Cari venue, kota, atau lapangan..."
          />
        </div>

        <Table className="min-w-[980px]">
          <TableHeader className="bg-white">
            <TableRow>
              <TableHead className="w-[300px] pl-5">Venue & Lokasi</TableHead>
              <TableHead>Cabang Olahraga</TableHead>
              <TableHead>Spesifikasi</TableHead>
              <TableHead>Harga Sewa / Jam</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[220px] pr-5 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredVenues.length > 0 ? (
              filteredVenues.map((venue) => {
                const activeCourts =
                  venue.courts?.filter((court) => court.isActive) ?? [];
                const primaryCourt = activeCourts[0] ?? null;

                return (
                  <TableRow
                    key={venue.id}
                    className="align-middle hover:bg-slate-50/70"
                  >
                    <TableCell className="py-3 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ring-2 ring-white">
                          {venue.coverImage ? (
                            <Image
                              src={venue.coverImage}
                              alt={venue.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                              <Building2 className="size-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {venue.name}
                            </p>
                            {venue.isPopular && (
                              <Badge
                                variant="secondary"
                                className="border-amber-200 bg-amber-50 px-1.5 py-0 text-[10px] font-semibold text-amber-700"
                              >
                                <Star className="size-3 fill-current" />
                                Populer
                              </Badge>
                            )}
                          </div>
                          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                            <MapPin className="size-3 shrink-0 text-slate-400" />
                            {venue.address}, {venue.city}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className="border-emerald-200 bg-emerald-50 font-medium text-emerald-700">
                        {primaryCourt?.sport ?? "-"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-slate-600">
                      {primaryCourt?.name ?? "-"}
                    </TableCell>

                    <TableCell className="font-semibold text-slate-900">
                      {primaryCourt
                        ? formatRupiah(primaryCourt.pricePerHour)
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                        <Star className="size-4 fill-amber-400 text-amber-400" />
                        <span>-</span>
                        <span className="text-xs text-slate-400">(-)</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "gap-1.5 font-medium",
                          venue.isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700",
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            venue.isActive ? "bg-emerald-500" : "bg-rose-500",
                          )}
                        />
                        {venue.isActive ? "Aktif" : "Non-aktif"}
                      </Badge>
                    </TableCell>

                    <TableCell className="pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/venues/${venue.slug}`}
                          target="_blank"
                          className={cn(
                            buttonVariants({ variant: "outline", size: "icon" }),
                            "size-8 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                          )}
                          title="Lihat di Web"
                        >
                          <Eye className="size-4" />
                          <span className="sr-only">Lihat di web</span>
                        </Link>
                        <Link
                          href={`/admin/venues/${venue.slug}`}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "icon" }),
                            "size-8 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700",
                          )}
                          title="Kelola Lapangan"
                        >
                          <LayoutGrid className="size-4" />
                          <span className="sr-only">Kelola lapangan</span>
                        </Link>
                        <VenueRowActions item={venue} />
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
                  <span className="inline-flex flex-col items-center gap-2">
                    <ClipboardList className="size-5" />
                    Venue tidak ditemukan.
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
