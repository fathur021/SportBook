// PERBAIKAN: import dipindah ke atas file. Sebelumnya ada di baris 74, setelah
// deklarasi popularVenues. Tetap jalan karena import di-hoist, tapi tidak sesuai
// konvensi repo (lihat app/(public)/explore/page.tsx).
import { venueListings } from "@/lib/listings"

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

// TODO: ganti image di bawah dengan /venues/<slug>.webp begitu foto aslinya
// ditaruh di public/venues/ — sekarang masih pakai placeholder /hero.webp
export const popularVenues: Venue[] = [
  {
    slug: "gelora-padel-club",
    name: "Gelora Padel Club",
    location: "Kebayoran Baru, Jakarta",
    image: "/hero.webp",
    tag: "Padel • Tennis",
    rating: 4.9,
    reviewCount: 184,
    facilities: ["ac-lounge", "showers", "pro-shop"],
    pricePerHour: 180000,
  },
  {
    slug: "champion-futsal-arena",
    name: "Champion Futsal Arena",
    location: "Kuningan, Jakarta",
    image: "/hero.webp",
    tag: "Futsal Interlock",
    rating: 4.8,
    reviewCount: 310,
    facilities: ["free-parking", "scoreboard", "canteen"],
    pricePerHour: 150000,
  },
  {
    slug: "smashzone-badminton-hub",
    name: "SmashZone Badminton Hub",
    location: "BSD City, Tangerang",
    image: "/hero.webp",
    tag: "Badminton • 8 Courts",
    rating: 4.9,
    reviewCount: 95,
    facilities: ["racket-stringing", "lockers"],
    pricePerHour: 65000,
  },
  {
    slug: "apex-basketball-center",
    name: "Apex Basketball Center",
    location: "Senayan, Jakarta",
    image: "/hero.webp",
    tag: "Basketball Hardwood",
    rating: 4.7,
    reviewCount: 142,
    facilities: ["ball-rental", "sound-system"],
    pricePerHour: 250000,
  },
];

// PERBAIKAN: nama fungsi sebelumnya "getVenueByslug" (kecil 's' di "slug").
// Sekaligus path import "./listings" diganti alias "@/lib/listings" agar
// konsisten dengan explore/page.tsx dan venue-listing-card.tsx.
//
// Sisa isi fungsi tidak diubah.
export function getVenueBySlug(slug: string) {
  return (
    venueListings.find((v) => v.slug === slug) ??
    popularVenues.find((v) => v.slug === slug)
  )
}
