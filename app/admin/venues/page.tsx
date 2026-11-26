import { Plus } from "lucide-react";

import { VenueFormDialog } from "@/components/admin/venue-form-dialog";
import { VenueTable } from "@/components/admin/venue-table";
import { Button } from "@/components/ui/button";

export default function AdminVenuePage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Operasional
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Data Lapangan
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Kelola venue, lapangan, dan status ketersediaannya dalam satu
            tempat.
          </p>
        </div>

        <VenueFormDialog
          trigger={
            <Button variant="brand" size="sm" className="shadow-sm">
              <Plus data-icon="inline-start" />
              Tambah Venue Baru
            </Button>
          }
        />
      </header>

      <VenueTable />
    </div>
  );
}
