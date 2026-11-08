import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Dumbbell, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
import { formatRupiah } from "@/lib/format-rupiah";
import { EquipmentFormDialog } from "@/components/admin/Eqipment-form-dialod";
import { EquipmentRowActions } from "@/components/admin/Equipment-row-actions";
import { listEquipmentsByVenueSlugService } from "@/modules/equipment/equipment.service";
import { listAdminVenues } from "@/modules/venues/venue.service";

export default async function AdminVenueEquipmentsPage(
  props: PageProps<"/admin/equipments/[slug]">,
) {
  const { slug } = await props.params;

  // Cari venue dari database, lalu ambil equipment milik venue tersebut.
  const venues = await listAdminVenues();
  const venue = venues.find((item) => item.slug === slug);

  if (!venue) {
    notFound();
  }

  const equipment = await listEquipmentsByVenueSlugService(venue.slug);
  const sports = [...new Set(venue.courts.map((court) => court.sport))];

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-2"
          nativeButton={false}
          render={<Link href="/admin/equipments" />}
        >
          <ArrowLeft data-icon="inline-start" />
          Kembali
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {venue.name}
          </h1>
          <Badge variant="secondary">
            {sports.length > 0 ? sports.join(", ") : "-"}
          </Badge>
        </div>
        <p className="text-sm text-slate-500">{venue.address}</p>
      </div>

      <Card className="py-0">
        <CardHeader className="border-b py-4">
          <CardTitle>Peralatan</CardTitle>
          <CardDescription>
            Daftar peralatan yang bisa disewa di venue ini.
          </CardDescription>
          <CardAction>
            <EquipmentFormDialog
              trigger={
                <Button variant="brand" size="sm">
                  <Plus data-icon="inline-start" />
                  Tambah Item
                </Button>
              }
            />
          </CardAction>
        </CardHeader>

        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[220px] pl-4">
                  Nama Peralatan
                </TableHead>
                <TableHead className="min-w-[160px]">Kategori</TableHead>
                <TableHead className="w-[160px]">Harga</TableHead>
                <TableHead className="w-[100px]">Stok</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[180px] pr-4 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {equipment.length > 0 ? (
                equipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-4 font-semibold text-slate-900">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.category ?? "-"}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {formatRupiah(item.price)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.stock}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          item.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }
                      >
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <EquipmentRowActions item={item} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Dumbbell className="size-4" />
                      Belum ada peralatan untuk venue ini.
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
