import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Script from "next/script";

import { ReservationTimer } from "@/components/checkout/reservation-timer";
import {
  CheckoutSummary,
  type SelectedEquipment,
} from "@/components/checkout/checkout-summary";
import { Container } from "@/components/layout/container";
import { VenueBreadcrumb } from "@/components/venues/venue-breadcrumb";
import { ContactDetailsCard } from "@/components/checkout/contact-details-card";
import { PaymentMethodCard } from "@/components/checkout/payment-method-card";
import { auth } from "@/lib/auth";
import { getBookingReceiptService } from "@/modules/bookings/booking.service";

const HOLD_MS = 10 * 60 * 1000; // 10 menit

const firstParam = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : "";

export default async function CheckoutPage({
  searchParams,
}: PageProps<"/checkout">) {
  const sp = await searchParams;
  const bookingId = firstParam(sp.bookingId);

  // Checkout hanya bisa dibuka dari booking yang sudah dibuat.
  if (!bookingId) redirect("/mybooking");

  // Halaman ini membaca sesi dan booking asli dari database.
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect(`/login?next=/checkout?bookingId=${bookingId}`);
  }

  const booking = await getBookingReceiptService(
    { bookingId },
    session.user.id,
    session.user.role === "ADMIN",
  );
  if (!booking) notFound();

  const venue = booking.court.venue;

  const equipmentList: SelectedEquipment[] = booking.equipments.map((item) => ({
    name: item.name,
    qty: item.quantity,
    pricePerUnit: item.price,
  }));

  const courtSpecs = [
    booking.court.surface,
    booking.court.isIndoor ? "Indoor" : "Outdoor",
  ].filter((spec): spec is string => Boolean(spec));

  const expiresAt = new Date(booking.createdAt).getTime() + HOLD_MS;

  const contactUser = {
    id: session.user.id,
    fullName: session.user.name,
    email: session.user.email,
    phone: "-",
    defaultNote: booking.notes ?? "",
  };

  return (
    <>
      {/* Muat library Snap Midtrans agar window.snap tersedia di browser */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <Container className="flex flex-col gap-6 py-6 max-w-5xl">
        <VenueBreadcrumb
          items={[
            { label: "Venues", href: "/venues" },
            { label: venue.name, href: `/venues/${venue.slug}` },
            { label: "Checkout" },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Reservation Timer & Form Identitas/Pembayaran */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <ReservationTimer
              expiresAt={expiresAt}
              totalMs={HOLD_MS}
            />

            <ContactDetailsCard user={contactUser} />

            <PaymentMethodCard
              venueName={venue.name}
              grandTotal={booking.totalPrice}
              bookingId={booking.id}
            />
          </div>

          {/* Kolom Kanan: Checkout Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-6">
            <CheckoutSummary
              venueName={venue.name}
              venueAddress={venue.address}
              sportLabel={booking.court.sport}
              courtName={booking.court.name}
              courtImage={
                booking.court.image ?? venue.coverImage ?? "/hero.webp"
              }
              courtSpecs={courtSpecs.length > 0 ? courtSpecs : undefined}
              maxPlayers={booking.court.maxPlayers ?? undefined}
              date={booking.playDate}
              time={booking.startTime}
              endTime={booking.endTime}
              durationHours={booking.durationHour}
              pricePerHour={booking.pricePerHour}
              equipmentList={equipmentList}
              totalPrice={booking.totalPrice}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
