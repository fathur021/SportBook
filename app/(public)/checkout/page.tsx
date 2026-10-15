import { ReservationTimer } from "@/components/checkout/reservation-timer";
import { Container } from "@/components/layout/container";
import { VenueBreadcrumb } from "@/components/venues/venue-breadcrumb";
import { getVenueDetail } from "@/lib/venue-detail";

const HOLD_MS = 10 * 60 * 1000; // 10 menit

// searchParams bisa berupa string, string[], atau undefined
const firstParam = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : "";

const page = async ({ searchParams }: PageProps<"/checkout">) => {
  const sp = await searchParams;
  const venueSlug = firstParam(sp.venue);
  const courtId = firstParam(sp.court);
  const duration = firstParam(sp.duration);

  // Data venue dipakai untuk menyusun jejak breadcrumb
  const venue = getVenueDetail(venueSlug);

  // Disiplin dicari dari court yang dipilih agar link "Book" kembali ke konteks yang benar
  const discipline = venue?.disciplines.find((d) =>
    d.courts.some((c) => c.id === courtId),
  );
  const bookParams = new URLSearchParams();
  if (discipline) bookParams.set("sport", discipline.slug);
  if (courtId) bookParams.set("court", courtId);
  if (duration) bookParams.set("duration", duration);
  const bookQuery = bookParams.toString();

  const breadcrumbItems = [
    { label: "Venues", href: "/venues" },
    ...(venue
      ? [
          { label: venue.breadcrumb[1] ?? "" },
          { label: venue.name, href: `/venues/${venue.slug}` },
          {
            label: "Book",
            href: `/venues/${venue.slug}/book${bookQuery ? `?${bookQuery}` : ""}`,
          },
        ]
      : []),
    { label: "Checkout" },
  ];

  // Batas waktu slot. Dihitung sekali saat halaman dirender.
  const expiresAt = Date.now() + HOLD_MS;

  return (
    <Container className="flex flex-col gap-6 py-6">
      <VenueBreadcrumb items={breadcrumbItems} />
      <ReservationTimer expiresAt={expiresAt} totalMs={HOLD_MS}/>
      <div>page</div>
    </Container>
  );
};

export default page;
