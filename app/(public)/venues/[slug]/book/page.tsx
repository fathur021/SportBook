import { Container } from "@/components/layout/container";
import { VenueBreadcrumb } from "@/components/venues/venue-breadcrumb";
import { BookingHeader } from "@/components/booking/booking-header";
import { BookingForm } from "@/components/booking/booking-form";
import { getCourtAvailability } from "@/lib/availability";
import { getVenueEquipment } from "@/lib/equipment";
import { getTimeSlots } from "@/lib/time-slots";
import { getVenueDetail } from "@/lib/venue-detail";
import { notFound } from "next/navigation";

type BookPageProps = PageProps<"/venues/[slug]/book">;

const BookPage = async ({ params, searchParams }: BookPageProps) => {
  const { slug } = await params;
  const { sport, court: courtId, duration } = await searchParams;

  const venue = getVenueDetail(slug);
  if (!venue) notFound();

  const discipline =
    venue.disciplines.find((d) => d.slug === sport) ?? venue.disciplines[0];
  const court =
    discipline?.courts.find((c) => c.id === courtId) ?? discipline?.courts[0];
  if (!discipline || !court) notFound();

  const availability = await getCourtAvailability(court.id);
  const pricePerHour = court.pricePerHour ?? venue.pricePerHour;

  return (
    <Container className="flex flex-col gap-6 py-6">
      <VenueBreadcrumb
        items={[
          { label: "Venues", href: "/venues" },
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
        timeSlots={getTimeSlots(venue.slug)}
        equipmentItems={getVenueEquipment(venue.slug)}
        pricePerHour={pricePerHour}
        duration={typeof duration === "string" ? duration : undefined}
        venueName={venue.name}
        courtLabel={court.label}
      />
    </Container>
  );
};

export default BookPage;