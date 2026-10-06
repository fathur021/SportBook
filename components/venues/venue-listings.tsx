// ---------------------------------------------------------------------------
// Komponen Daftar Venue (VenueListings)
//
// Komponen wrapper untuk merender daftar kartu venue di halaman Explore:
// • Menerima daftar venue hasil pemfilteran (prop `venues`)
// • Melakukan iterasi dan menampilkan komponen `VenueListingCard` untuk setiap item
// • Menggunakan slug venue sebagai kunci unik (`key={venue.slug}`) untuk performa rendering React
// ---------------------------------------------------------------------------

import { VenueListingCard } from "@/components/venues/venue-listing-card";
import type { VenueListing } from "@/lib/listings";

// ---------------------------------------------------------------------------
// Tipe Props untuk komponen VenueListings
// ---------------------------------------------------------------------------
type VenueListingsProps = {
  venues: VenueListing[]; // Array daftar data venue yang akan ditampilkan
};

export function VenueListings({ venues }: VenueListingsProps) {
  return (
    // Kontainer pembungkus daftar kartu dengan susunan vertikal dan jarak antar kartu
    <div className="flex flex-col gap-4">
      {/* Render setiap kartu venue berdasarkan data array */}
      {venues.map((venue) => (
        <VenueListingCard key={venue.slug} venue={venue} />
      ))}
    </div>
  );
}