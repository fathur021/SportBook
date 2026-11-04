"use client";

import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { CourtTable } from "@/components/admin/court-table";
import { Button } from "@/components/ui/button";
import CourtFormDialog from "@/components/admin/court-form-dialog";
import { useGetAdminVenuesQuery, useGetVenueCourtsQuery } from "@/lib/redux/admin-api";

export default function AdminVenueDetailPage() {
  const { slug } = useParams();
  const slugStr = typeof slug === "string" ? slug : "";

  // Ambil semua venue untuk mendapatkan nama venue dari slug
  const { data: allVenues } = useGetAdminVenuesQuery();
  const venueName = allVenues?.find((v) => v.slug === slugStr)?.name ?? slugStr;

  // Ambil data court dari API untuk venue ini
  const { data: courts, isLoading, isError } = useGetVenueCourtsQuery(slugStr);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{venueName}</h1>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-8 text-center text-sm text-slate-500">
            Memuat data court...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{venueName}</h1>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-8 text-center text-sm text-red-500">
            Gagal memuat data court. Coba muat ulang halaman.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{venueName}</h1>

      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Daftar Court</h2>

          <CourtFormDialog
            slug={slugStr}
            trigger={
              <Button className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Court
              </Button>
            }
          />
        </div>

        <CourtTable slug={slugStr} />
      </section>
    </div>
  );
}
