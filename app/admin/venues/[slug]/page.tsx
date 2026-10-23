import { Plus } from "lucide-react";
import { CourtTable } from "@/components/admin/court-table";
import { Button } from "@/components/ui/button";
import { getVenueDetail } from "@/lib/venue-detail";
import { notFound } from "next/navigation";
import CourtFormDialog from "@/components/admin/court-form-dialog";

export default async function AdminVenueDetailPage(
  props: PageProps<"/admin/venues/[slug]">
) {
  const { slug } = await props.params;
  const venue = getVenueDetail(slug);

  if (!venue) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{venue.name}</h1>

      {venue.disciplines.map((cabangOlahraga) => (
        <section key={cabangOlahraga.slug} className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold">
              {cabangOlahraga.label}
            </h2>

            <CourtFormDialog
              defaultPricePerHour={venue.pricePerHour}
              disciplineLabel={cabangOlahraga.label}
              trigger={
                <Button className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Court
                </Button>
              }
            />

          </div>

          <CourtTable
            courts={cabangOlahraga.courts}
            images={venue.images}
            defaultPricePerHour={venue.pricePerHour}
          />
        </section>
      ))}
    </div>
  );
}
