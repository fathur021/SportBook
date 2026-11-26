"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { CourtTable } from "@/components/admin/court-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CourtFormDialog from "@/components/admin/court-form-dialog";
import { useGetAdminVenuesQuery, useGetVenueCourtsQuery } from "@/lib/redux/admin-api";

export default function AdminVenueDetailPage() {
  const { slug } = useParams();
  const slugStr = typeof slug === "string" ? slug : "";

  // Ambil semua venue untuk mendapatkan nama venue dari slug
  const { data: allVenues } = useGetAdminVenuesQuery();
  const venue = allVenues?.find((v) => v.slug === slugStr);
  const venueName = venue?.name ?? slugStr;
  const venueAddress = venue?.address;
  const sports = venue?.courts
    ? [...new Set(venue.courts.map((c) => c.sport))].join(", ")
    : "";

  // Ambil data court dari API untuk venue ini
  const { data: courts, isLoading, isError } = useGetVenueCourtsQuery(slugStr);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-2"
            nativeButton={false}
            render={<Link href="/admin/venues" />}
          >
            <ArrowLeft data-icon="inline-start" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {venueName}
          </h1>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-sm text-slate-500">
              Memuat data court...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-2"
            nativeButton={false}
            render={<Link href="/admin/venues" />}
          >
            <ArrowLeft data-icon="inline-start" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {venueName}
          </h1>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-sm text-red-500">
              Gagal memuat data court. Coba muat ulang halaman.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-3"
            nativeButton={false}
            render={<Link href="/admin/venues" />}
          >
            <ArrowLeft data-icon="inline-start" />
            Kembali
          </Button>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Data Lapangan
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {venueName}
            </h1>
            {sports && (
              <Badge className="border-emerald-200 bg-emerald-50 font-medium text-emerald-700">
                {sports}
              </Badge>
            )}
          </div>
          {venueAddress && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="size-4 text-slate-400" />
              {venueAddress}
            </p>
          )}
        </div>

        <CourtFormDialog
          slug={slugStr}
          trigger={
            <Button variant="brand" size="sm" className="shadow-sm">
              <Plus data-icon="inline-start" />
              Tambah Lapangan
            </Button>
          }
        />
      </header>

      <Card className="py-0">
        <CardHeader className="border-b py-4">
          <CardTitle>Daftar Lapangan</CardTitle>
          <CardDescription>
            Daftar lapangan yang tersedia di venue ini.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          <CourtTable slug={slugStr} />
        </CardContent>
      </Card>
    </div>
  );
}
