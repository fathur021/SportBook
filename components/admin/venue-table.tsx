"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil, Trash2, Star } from "lucide-react";
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
import { useGetAdminVenuesQuery } from "@/lib/redux/admin-api";

export function VenueTable() {
  const { data: venues, isLoading, isError } = useGetAdminVenuesQuery();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-8 text-center text-sm text-slate-500">
          Memuat data venue...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-8 text-center text-sm text-red-500">
          Gagal memuat data venue. Coba muat ulang halaman.
        </div>
      </div>
    );
  }
  if (!venues || venues.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-8 text-center text-sm text-slate-500">
          Belum ada venue. Klik "Tambah Venue Baru" untuk memulai.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[300px]">Venue & Lokasi</TableHead>
            <TableHead>Cabang Olahraga</TableHead>
            <TableHead>Spesifikasi</TableHead>
            <TableHead>Harga Sewa / Jam</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="text-right w-[140px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {venues.map((venue) => {
            // Ambil court pertama yang aktif untuk menampilkan info
            const activeCourts = venue.courts?.filter((c) => c.isActive) ?? [];
            const primaryCourt = activeCourts[0] ?? null;

            return (
            <TableRow key={venue.id} className="hover:bg-slate-50/70">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                    {venue.coverImage ? (
                      <Image
                        src={venue.coverImage}
                        alt={venue.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-xs">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {venue.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-[200px]">
                      {venue.address}, {venue.city}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
                >
                  {primaryCourt?.sport ?? "-"}
                </Badge>
              </TableCell>

              <TableCell className="text-sm text-slate-600">
                {primaryCourt?.name ?? "-"}
              </TableCell>

              <TableCell className="font-semibold text-slate-900">
                {primaryCourt ? formatRupiah(primaryCourt.pricePerHour) : "-"}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>-</span>
                  <span className="text-xs text-slate-400">(-)</span>
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    href={`/venues/${venue.slug}`}
                    target="_blank"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                      "h-8 w-8 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    )}
                    title="Lihat di Web"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/venues/${venue.slug}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                      "h-8 w-8 border-slate-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200",
                    )}
                    title="Kelola Lapangan / Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-slate-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
