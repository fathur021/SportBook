import { Container } from "@/components/layout/container";
import { VenueBreadcrumb } from "@/components/venues/venue-breadcrumb";
import { BookingHeader } from "@/components/booking/booking-header";
import { BookingForm } from "@/components/booking/booking-form";
import { getCourtAvailability } from "@/lib/availability";
import { toEquipmentItems } from "@/lib/equipment-mapper";
import { toVenueDetail } from "@/lib/venue-detail-mapper";
import { getPublicVenueBySlug } from "@/modules/venues/venue.service";
import { getSettingsService } from "@/modules/settings/settings.service";
import { notFound } from "next/navigation";
import { toTimeSlotOptions } from "@/lib/availability-slots";
import { getAvailabilityService } from "@/modules/bookings/booking.service";
import { listActiveEquipmentsByVenueSlugService } from "@/modules/equipment/equipment.service";

type BookPageProps = PageProps<"/venues/[slug]/book">;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const BookPage = async ({ params, searchParams }: BookPageProps) => {
  const { slug } = await params;
  const { sport, court: courtId, duration, date } = await searchParams;

  const dateParam = typeof date === "string" ? date : "";
  const initialDate = DATE_PATTERN.test(dateParam) ? dateParam : null;

  // Ambil venue dari database, lalu ubah ke bentuk VenueDetail.
  // Dengan begitu court.id yang dipilih di halaman detail tetap cocok.
  const data = await getPublicVenueBySlug(slug);
  if (!data) notFound();

  const settings = await getSettingsService();
  const venue = toVenueDetail(data, settings);

  const discipline =
    venue.disciplines.find((d) => d.slug === sport) ?? venue.disciplines[0];
  const court =
    discipline?.courts.find((c) => c.id === courtId) ?? discipline?.courts[0];
  if (!discipline || !court) notFound();

  const availability = await getCourtAvailability(court.id);

  // Slot hanya bisa dimuat kalau tanggal sudah dipilih.
  const timeSlots = initialDate
    ? toTimeSlotOptions(
        (await getAvailabilityService(court.id, initialDate)).slots,
      )
    : [];

  // Equipment publik diambil dari database (aktif dan masih ada stok).
  const equipmentItems = toEquipmentItems(
    await listActiveEquipmentsByVenueSlugService(slug),
  );

  const pricePerHour = court.pricePerHour ?? venue.pricePerHour;

  return (
    <Container className="flex flex-col gap-6 py-6">
      <VenueBreadcrumb
        items={[
          { label: "Venues", href: "/explore" },
          { label: venue.breadcrumb[1] ?? "" },
          { label: venue.name, href: `/venues/${slug}` },
          { label: "Book" },
        ]}
      />

      <BookingHeader
        venue={venue}
        sportLabel={discipline.label}
        court={court}
        duration={typeof duration === "string" ? duration : undefined}
      />

      <BookingForm
        availability={availability}
        timeSlots={timeSlots}
        initialDate={initialDate}
        equipmentItems={equipmentItems}
        pricePerHour={pricePerHour}
        duration={typeof duration === "string" ? duration : undefined}
        venueName={venue.name}
        courtId={court.id}
        courtLabel={court.label}
      />
    </Container>
  );
};

export default BookPage;