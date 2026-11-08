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
import { countEquipmentsByVenueIdsService } from "@/modules/equipment/equipment.service";
import { listAdminVenues } from "@/modules/venues/venue.service";

export default async function AdminEquipmentsPage() {
  // Ambil venue dan jumlah equipment langsung dari database.
  const venues = await listAdminVenues();
  const equipmentCounts = await countEquipmentsByVenueIdsService(
    venues.map((venue) => venue.id),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Sewa Peralatan
        </h1>
        <p className="text-sm text-slate-500">
          Pilih venue untuk mengelola daftar peralatan yang bisa disewa.
        </p>
      </div>

      <Card className="py-0">
        <CardHeader className="border-b py-4">
          <CardTitle>Daftar Venue</CardTitle>
          <CardDescription>
            Peralatan dikelola per venue, bukan dalam satu daftar global.
          </CardDescription>
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
              ) : (
                venues.map((venue) => {
                  const equipmentCount =
                    equipmentCounts.get(venue.id) ?? 0;
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
    </div>
  );
}
