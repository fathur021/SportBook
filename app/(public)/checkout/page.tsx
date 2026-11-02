import { ReservationTimer } from "@/components/checkout/reservation-timer";
import { CheckoutSummary, SelectedEquipment } from "@/components/checkout/checkout-summary";
import { Container } from "@/components/layout/container";
import { VenueBreadcrumb } from "@/components/venues/venue-breadcrumb";
import { getVenueDetail } from "@/lib/venue-detail";
import { getVenueEquipment } from "@/lib/equipment";
import { ContactDetailsCard } from "@/components/checkout/contact-details-card";
import { PaymentMethodCard } from "@/components/checkout/payment-method-card";
import { UserProfile } from "@/lib/user";
import Script from "next/script";
const HOLD_MS = 10 * 60 * 1000; // 10 menit

const firstParam = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : "";

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const sp = await searchParams;
  const venueSlug = firstParam(sp.venue);
  const courtId = firstParam(sp.court);
  const duration = parseFloat(firstParam(sp.duration)) || 1;
  const date = firstParam(sp.date);
  const time = firstParam(sp.time);
  const bookingId = firstParam(sp.bookingId);
  // Ambil detail data venue & lapangan
  const venue = getVenueDetail(venueSlug);
  const discipline = venue?.disciplines.find((d) =>
    d.courts.some((c) => c.id === courtId)
  );
  const court = discipline?.courts.find((c) => c.id === courtId);

  // Parse equipment dari searchParams (format: id:qty)
  const equipmentParam = sp.equipment;
  const rawEquipment = Array.isArray(equipmentParam)
    ? equipmentParam
    : equipmentParam ? [equipmentParam] : [];

  const venueEquipmentList = getVenueEquipment(venueSlug);
  const equipmentList: SelectedEquipment[] = rawEquipment.map((entry) => {
    const [id, qtyStr] = entry.split(":");
    const found = venueEquipmentList.find((e) => e.id === id);
    return {
      name: found?.name ?? id,
      qty: parseInt(qtyStr) || 1,
      pricePerUnit: found?.pricePerUnit ?? 0,
    };
  });

  const bookParams = new URLSearchParams();
  if (discipline) bookParams.set("sport", discipline.slug);
  if (courtId) bookParams.set("court", courtId);
  if (duration) bookParams.set("duration", duration.toString());
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

  const pricePerHour = court?.pricePerHour ?? 220000;
  const platformFee = 5000;
  const discountAmount = 0;
  const courtRentalTotal = pricePerHour * duration;
  const equipmentTotal = equipmentList.reduce(
    (sum, item) => sum + item.qty * item.pricePerUnit,
    0
  );
  const grandTotal = courtRentalTotal + equipmentTotal + platformFee - discountAmount;

  return (
    <>
      {/* Muat library Snap Midtrans agar window.snap tersedia di browser */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <Container className="flex flex-col gap-6 py-6 max-w-5xl">
      <VenueBreadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Reservation Timer & Form Identitas/Pembayaran */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Server component dirender ulang tiap request, jadi Date.now() di sini aman */}
          <ReservationTimer
            // eslint-disable-next-line react-hooks/purity
            expiresAt={Date.now() + HOLD_MS}
            totalMs={HOLD_MS}
          />

          <ContactDetailsCard user={UserProfile} />

          <PaymentMethodCard
          venueName={venue?.name ?? "Gelora Padel"}
          grandTotal={grandTotal}
          bookingId={bookingId}    // ← TAMBAH INI
/>
        </div>

        {/* Kolom Kanan: Checkout Summary (sejajar tepat di samping Reservation Timer) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6">
          <CheckoutSummary
            venueName={venue?.name ?? "Venue"}
            venueAddress={venue?.address ?? "Jakarta"}
            sportLabel={discipline?.label?.split(" ")[0] ?? "Padel"}
            courtName={court?.label ?? "Court"}
            courtImage={court?.image ?? (venue?.images?.[court?.imageIndex ?? 0]?.src ?? "/hero.webp")}
            courtSpecs={court?.specs}
            maxPlayers={court?.maxPlayers}
            date={date}
            time={time}
            durationHours={duration}
            pricePerHour={court?.pricePerHour ?? 220000}
            equipmentList={equipmentList}
          />
        </div>
      </div>
    </Container>
    </>
  );
}
