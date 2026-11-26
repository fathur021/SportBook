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
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Operasional
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Sewa Peralatan
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Pilih venue untuk mengelola peralatan yang bisa disewa pelanggan.
        </p>
      </header>

      <EquipmentVenueList venues={venues} equipmentCounts={counts} />
    </div>
  );
}
