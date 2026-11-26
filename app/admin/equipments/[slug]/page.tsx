import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EquipmentFormDialog } from "@/components/admin/Eqipment-form-dialod";
import { EquipmentItemList } from "@/components/admin/equipment-item-list";
import { listEquipmentsByVenueSlugService } from "@/modules/equipment/equipment.service";
import { listAdminVenues } from "@/modules/venues/venue.service";

export default async function AdminVenueEquipmentsPage(
  props: PageProps<"/admin/equipments/[slug]">,
) {
  const { slug } = await props.params;

  const venues = await listAdminVenues();
  const venue = venues.find((item) => item.slug === slug);

  if (!venue) {
    notFound();
  }

  const equipment = await listEquipmentsByVenueSlugService(venue.slug);
  const sports = [...new Set(venue.courts.map((court) => court.sport))];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-3"
            nativeButton={false}
            render={<Link href="/admin/equipments" />}
          >
            <ArrowLeft data-icon="inline-start" />
            Kembali
          </Button>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Sewa Peralatan
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {venue.name}
            </h1>
            <Badge className="border-emerald-200 bg-emerald-50 font-medium text-emerald-700">
              {sports.length > 0 ? sports.join(", ") : "-"}
            </Badge>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="size-4 text-slate-400" />
            {venue.address}
          </p>
        </div>

        <EquipmentFormDialog
          trigger={
            <Button variant="brand" size="sm" className="shadow-sm">
              <Plus data-icon="inline-start" />
              Tambah Item
            </Button>
          }
        />
      </header>

      <EquipmentItemList equipment={equipment} />
    </div>
  );
}
