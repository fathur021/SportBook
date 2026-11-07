// ---------------------------------------------------------------------------
// Penghubung antara data venue dari database dan bentuk VenueListing
// yang dipakai kartu di halaman Explore.
// ---------------------------------------------------------------------------

import type { VenueListing } from "@/lib/listings";
import type { listPublicVenues } from "@/modules/venues/venue.service";

// Tipe satu buah venue hasil query listPublicVenues()
type PublicVenue = Awaited<ReturnType<typeof listPublicVenues>>[number];

export function toVenueListing(venue: PublicVenue): VenueListing {
  // Harga per jam = harga lapangan termurah milik venue.
  // Model Venue tidak punya kolom harga, harga ada di masing-masing Court.
  const prices = venue.courts.map((court) => court.pricePerHour);
  const pricePerHour = prices.length > 0 ? Math.min(...prices) : 0;

  // Kumpulkan cabang olahraga unik dari semua lapangan.
  const sports = [...new Set(venue.courts.map((court) => court.sport))];

  // Jenis permukaan lapangan yang unik (buang yang null).
  const surfaces = [
    ...new Set(
      venue.courts
        .map((court) => court.surface)
        .filter((surface): surface is string => surface !== null),
    ),
  ];

  // Baris spesifikasi ringkas yang tampil di kartu.
  const specs = [
    venue.courts.length > 0
      ? `${venue.courts.length} Courts`
      : "Belum ada lapangan",
    ...surfaces,
    venue.courts.some((court) => court.isIndoor) ? "Indoor" : "Outdoor",
  ];

  return {
    slug: venue.slug,
    name: venue.name,
    address: `${venue.address}, ${venue.city}`,

    // Data ini belum ada di database, jadi diisi sementara.
    distanceKm: 0,
    rating: 0,
    reviewCount: 0,
    nextAvailable: "Today, check schedule",

    // Kalau coverImage kosong, pakai gambar cadangan agar tidak error.
    image: venue.coverImage ?? "/hero.webp",

    sportTag: sports.length > 0 ? sports.join(" • ") : "Sports",
    verifiedTag: venue.isVerified ? "Verified Venue" : "Partner Venue",

    specs,
    facilities: venue.facilities,
    pricePerHour,
  };
}
