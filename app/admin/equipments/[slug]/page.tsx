import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";

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

      <EquipmentItemList
        equipment={equipment}
        action={
          <EquipmentFormDialog
            trigger={
              <Button variant="brand" size="sm">
                <Plus data-icon="inline-start" />
                Tambah Item
              </Button>
            }
          />
        }
      />
    </div>
  );
}
