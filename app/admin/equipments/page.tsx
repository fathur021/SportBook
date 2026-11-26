import { EquipmentVenueList } from "@/components/admin/equipment-venue-list";
import { countEquipmentsByVenueIdsService } from "@/modules/equipment/equipment.service";
import { listAdminVenues } from "@/modules/venues/venue.service";

export default async function AdminEquipmentsPage() {
  const venues = await listAdminVenues();
  const equipmentCounts = await countEquipmentsByVenueIdsService(
    venues.map((venue) => venue.id),
  );

  // Map tidak bisa dikirim dari server ke client, jadi diubah ke objek biasa.
  const counts: Record<string, number> = {};
  equipmentCounts.forEach((count, id) => {
    counts[id] = count;
  });

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

      <EquipmentVenueList venues={venues} equipmentCounts={counts} />
    </div>
  );
}
