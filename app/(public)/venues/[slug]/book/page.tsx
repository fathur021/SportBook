import { Container } from "@/components/layout/container";
import { VenueBreadcrumb } from "@/components/venues/venue-breadcrumb";
import { BookingHeader } from "@/components/booking/booking-header";
import { ReservationDatePicker } from "@/components/booking/reservation-date-picker";
import { getCourtAvailability } from "@/lib/availability";
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

      <ReservationDatePicker availability={availability} />
    </Container>
  );
};

export default BookPage;