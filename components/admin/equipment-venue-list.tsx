"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  MapPin,
  Package,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AdminStatCards,
  type AdminStatItem,
} from "@/components/admin/admin-stat-cards";
import { SearchInput } from "@/components/admin/search-input";

type VenueRow = {
  id: string;
  slug: string;
  name: string;
  address: string;
  coverImage?: string | null;
  courts: { sport: string }[];
};

type EquipmentVenueListProps = {
  venues: VenueRow[];
  equipmentCounts: Record<string, number>;
};

export function EquipmentVenueList({
  venues,
  equipmentCounts,
}: EquipmentVenueListProps) {
  const [query, setQuery] = useState("");

  const filtered = venues.filter((venue) => {
    const teks = [
      venue.name,
      venue.address,
      ...venue.courts.map((court) => court.sport),
    ]
      .join(" ")
      .toLowerCase();

    return teks.includes(query.trim().toLowerCase());
  });

  const totalItems = venues.reduce(
    (total, venue) => total + (equipmentCounts[venue.id] ?? 0),
    0,
  );
  const venuesWithItems = venues.filter(
    (venue) => (equipmentCounts[venue.id] ?? 0) > 0,
  ).length;

  const stats: AdminStatItem[] = [
    {
      label: "Total Venue",
      value: venues.length,
      note: "Tempat sewa peralatan",
      icon: Building2,
      tone: "slate",
    },
    {
      label: "Total Item",
      value: totalItems,
      note: "Peralatan di semua venue",
      icon: Package,
      tone: "emerald",
    },
    {
      label: "Venue Terisi",
      value: venuesWithItems,
      note: "Sudah punya peralatan",
      icon: CheckCircle2,
      tone: "blue",
    },
    {
      label: "Belum Ada Item",
      value: venues.length - venuesWithItems,
      note: "Perlu ditambahkan",
      icon: AlertCircle,
      tone: "amber",
    },
  ];

  return (
    <div className="space-y-4">
      <AdminStatCards items={stats} />

      <Card className="py-0">
        <CardHeader className="border-b py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Daftar Venue</CardTitle>
              <CardDescription>
                Menampilkan {filtered.length} dari {venues.length} venue.
                Peralatan dikelola per venue.
              </CardDescription>
            </div>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Cari venue atau cabang..."
            />
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto px-0">
          <Table className="min-w-[820px]">
            <TableHeader className="bg-white">
              <TableRow>
                <TableHead className="pl-5">Venue</TableHead>
                <TableHead>Cabang Olahraga</TableHead>
                <TableHead>Peralatan</TableHead>
                <TableHead className="w-[140px] pr-5 text-right">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {venues.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-28 text-center text-muted-foreground"
                  >
                    <span className="inline-flex flex-col items-center gap-2">
                      <Building2 className="size-5" />
                      Belum ada venue di database.
                    </span>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-28 text-center text-muted-foreground"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Package className="size-4" />
                      Venue tidak ditemukan.
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((venue) => {
                  const equipmentCount = equipmentCounts[venue.id] ?? 0;
                  const sports = [
                    ...new Set(venue.courts.map((court) => court.sport)),
                  ];

                  return (
                    <TableRow
                      key={venue.id}
                      className="hover:bg-slate-50/70"
                    >
                      <TableCell className="py-3 pl-5">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ring-2 ring-white">
                            <Image
                              src={venue.coverImage ?? "/hero.webp"}
                              alt={venue.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {venue.name}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                              <MapPin className="size-3 shrink-0 text-slate-400" />
                              {venue.address}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className="border-emerald-200 bg-emerald-50 font-medium text-emerald-700">
                          {sports.length > 0 ? sports.join(", ") : "-"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold ${
                            equipmentCount > 0
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Dumbbell className="size-3.5" />
                          {equipmentCount > 0
                            ? `${equipmentCount} item`
                            : "Belum ada"}
                        </span>
                      </TableCell>

                      <TableCell className="pr-5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="shadow-sm"
                          nativeButton={false}
                          render={
                            <Link
                              href={`/admin/equipments/${venue.slug}`}
                              aria-label={`Kelola peralatan ${venue.name}`}
                            />
                          }
                        >
                          Kelola
                          <ChevronRight data-icon="inline-end" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
