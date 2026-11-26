"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Dumbbell } from "lucide-react";

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

  return (
    <Card className="py-0">
      <CardHeader className="border-b py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Daftar Venue</CardTitle>
            <CardDescription>
              Peralatan dikelola per venue, bukan dalam satu daftar global.
            </CardDescription>
          </div>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Cari venue atau cabang..."
          />
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Venue</TableHead>
              <TableHead>Cabang Olahraga</TableHead>
              <TableHead>Peralatan</TableHead>
              <TableHead className="w-[120px] pr-4 text-right">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {venues.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  Belum ada venue di database.
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  Venue tidak ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((venue) => {
                const equipmentCount = equipmentCounts[venue.id] ?? 0;
                const sports = [
                  ...new Set(venue.courts.map((court) => court.sport)),
                ];

                return (
                  <TableRow key={venue.id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
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
                          <p className="max-w-[240px] truncate text-xs text-muted-foreground">
                            {venue.address}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">
                        {sports.length > 0 ? sports.join(", ") : "-"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-slate-700">
                        <Dumbbell className="size-4 text-muted-foreground" />
                        {equipmentCount > 0
                          ? `${equipmentCount} item`
                          : "Belum ada"}
                      </span>
                    </TableCell>

                    <TableCell className="pr-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
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
  );
}
