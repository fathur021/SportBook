// ---------------------------------------------------------------------------
// Tipe data untuk kartu venue.
// Data venue sekarang diambil dari database, bukan array statis.
// ---------------------------------------------------------------------------

// ----- Tipe utama untuk explore page (listing card) -----

export type VenueListing = {
  slug: string;
  name: string;
  address: string;
  distanceKm: number;
  image: string;
  sportTag: string;
  verifiedTag: string;
  rating: number;
  reviewCount: number;
  // detail teknis lapangan, misal "4 Panoramic Courts"
  specs: string[];
  facilities: string[];
  nextAvailable: string; // "Today, 18:00 (Court 2)"
  pricePerHour: number;
};

// ----- Tipe untuk homepage popular venues (card dengan icon) -----

export type FacilityKey =
  | "ac-lounge"
  | "showers"
  | "pro-shop"
  | "free-parking"
  | "scoreboard"
  | "canteen"
  | "racket-stringing"
  | "lockers"
  | "ball-rental"
  | "sound-system";

export type Venue = {
  slug: string;
  name: string;
  location: string;
  image: string;
  tag: string; // label di pojok kiri atas gambar
  rating: number;
  reviewCount: number;
  facilities: FacilityKey[];
  pricePerHour: number; // simpan angka mentah, format saat ditampilkan
};
