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
import { getVenueEquipment } from "@/lib/equipment";
import { formatRupiah } from "@/lib/format-rupiah";
import { venueListings } from "@/lib/listings";
import { EquipmentFormDialog } from "@/components/admin/Eqipment-form-dialod";

export default async function AdminVenueEquipmentsPage(
  props: PageProps<"/admin/equipments/[slug]">,
) {
  const { slug } = await props.params;
  const venue = venueListings.find((item) => item.slug === slug);

  if (!venue) {
    notFound();
  }

  const equipment = getVenueEquipment(venue.slug);

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
          <Badge variant="secondary">{venue.sportTag}</Badge>
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
                <TableHead className="min-w-[240px]">Deskripsi</TableHead>
                <TableHead className="w-[160px]">Harga</TableHead>
                <TableHead className="w-[180px] pr-4">Satuan</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {equipment.length > 0 ? (
                equipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="pl-4 font-semibold text-slate-900">
                      {item.name}
                    </TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground">
                      {item.description ?? "-"}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {formatRupiah(item.pricePerUnit)}
                    </TableCell>
                    <TableCell className="pr-4 text-muted-foreground">
                      {item.unit ?? "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
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
