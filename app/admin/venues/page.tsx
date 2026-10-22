import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { venueListings } from "@/lib/listings";
import { VenueTable } from "@/components/admin/venue-table";




export default function AdminVenuePage() {
    return (
        <div className="space-y-6">

            <div className="flex flex-col gap-4 sm:flex-row
             sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Kelola Lapangan</h1>
                    <p className="text-sm text-slate-500">
                        Daftar Seluruh Venue Olah Raga Yang Aktif</p>
                </div>

                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Venue Baru
        </Button>
            </div>

            <VenueTable venues={venueListings} />
        </div>
    )
}