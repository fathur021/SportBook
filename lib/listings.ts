// ---------------------------------------------------------------------------
// Satu sumber data untuk semua venue di app.
//
// • venueListings   → explore page (card list + filter)
// • popularVenues   → homepage "Popular Venues Near You"
// • getVenueBySlug  → lookup venue berdasarkan slug
// ---------------------------------------------------------------------------

// ----- Tipe utama untuk explore page (listing card) ----- //

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

// ----- Tipe untuk homepage popular venues (card dengan icon) ----- //

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

// ---------------------------------------------------------------------------
// Data venue untuk explore page
// ---------------------------------------------------------------------------
// TODO: ganti image di bawah dengan /venues/<slug>.webp begitu foto aslinya
// ditaruh di public/venues/ — sekarang masih pakai placeholder /hero.webp
export const venueListings: VenueListing[] = [
  {
    slug: "smash-padel-club-kemang",
    name: "Smash Padel Club Kemang",
    address: "Jl. Kemang Timur No. 48, Bangka, Mampang Prapatan",
    distanceKm: 1.8,
    image: "/hero.webp",
    sportTag: "Padel",
    verifiedTag: "Verified Hub",
    rating: 4.9,
    reviewCount: 218,
    specs: ["4 Panoramic Courts", "Mondo Supercourt XN Turf", "Indoor AC Available"],
    facilities: ["Hot Shower", "Specialty Cafe", "Free Valet", "Wilson Pro Rental"],
    nextAvailable: "Today, 18:00 (Court 2)",
    pricePerHour: 260000,
  },
  {
    slug: "gelora-arena-hang-lekir",
    name: "Gelora Arena Hang Lekir",
    address: "Jl. Hang Lekir IX No. 3, Kebayoran Baru, Jakarta Selatan",
    distanceKm: 0.9,
    image: "/hero.webp",
    sportTag: "Futsal",
    verifiedTag: "FIFA Certified",
    rating: 4.8,
    reviewCount: 340,
    specs: ["3 Standard 5v5 Pitches", "Gerflor Taraflex Vinyl 7.5mm", "Full Air Circulation Exhaust"],
    facilities: ["Digital Lockers", "Hot Shower (12 stalls)", "Hydration Lounge", "VAR Video Recording"],
    nextAvailable: "Today, 19:00 (Pitch A)",
    pricePerHour: 175000,
  },
  {
    slug: "padel-arena-pik",
    name: "Padel Arena PIK",
    address: "Jl. Rayacourses No. 2, Pantai Indah Kapuk, Kelapa Gading",
    distanceKm: 6.2,
    image: "/hero.webp",
    sportTag: "Padel",
    verifiedTag: "Verified Hub",
    rating: 4.7,
    reviewCount: 142,
    specs: ["6 Covered Courts", "LED Floodlights", "Panoramic Glass Backdrop"],
    facilities: ["Free Valet", "Cafe & Juice Bar", "Racket Rental", "Changing Room"],
    nextAvailable: "Today, 17:30 (Court 4)",
    pricePerHour: 285000,
  },
  {
    slug: "smash-badminton-hub-kemang",
    name: "Smash Badminton Hub Kemang",
    address: "Jl. Kemang Raya No. 12, Jakarta Selatan",
    distanceKm: 2.4,
    image: "/hero.webp",
    sportTag: "Badminton",
    verifiedTag: "BWF Standard Turf",
    rating: 4.8,
    reviewCount: 264,
    specs: ["8 Air-Cooled Courts", "Tiger Turf Pro Series", "Wooden Floor Option"],
    facilities: ["Pro Shop", "Free Parking (60 slots)", "Canteen", "Hot Shower"],
    nextAvailable: "Today, 16:00 (Court 6)",
    pricePerHour: 95000,
  },
  {
    slug: "hoop-nusantara-basket-center",
    name: "Hoop Nusantara Basket Center",
    address: "Jl. Pintu Satu Senayan No. 3, Tanah Abang, Jakarta Pusat",
    distanceKm: 3.1,
    image: "/hero.webp",
    sportTag: "Basketball",
    verifiedTag: "FIBA Standard Maple",
    rating: 4.9,
    reviewCount: 187,
    specs: ["2 Full-Size Courts", "FIBA 28x15 Maple Floor", "Pro LED Scoreboard"],
    facilities: ["Streaming Station", "Digital Lockers", "Cafe", "Free Valet"],
    nextAvailable: "Today, 20:00 (Court A)",
    pricePerHour: 320000,
  },
  {
    slug: "smash-court-tennis-cipedak",
    name: "Smash Court Tennis Cipedak",
    address: "Jl. Raya Cipedak No. 55, Cipedak, Jakarta Selatan",
    distanceKm: 4.7,
    image: "/hero.webp",
    sportTag: "Tennis",
    verifiedTag: "ITF Pro Clay",
    rating: 4.6,
    reviewCount: 96,
    specs: ["3 Clay Courts", "ITF Certified Acrylic Topcoat", "Night Lighting"],
    facilities: ["Ball Boy Service", "Bench Seating", "Drinks Kiosk", "Racket Rental"],
    nextAvailable: "Tomorrow, 06:00 (Court 2)",
    pricePerHour: 180000,
  },
  {
    slug: "volley-arena-scbd",
    name: "Volley Arena SCBD",
    address: "Jl. Surya Sumantri No. 11, SCBD, Jakarta Selatan",
    distanceKm: 2.9,
    image: "/hero.webp",
    sportTag: "Volleyball",
    verifiedTag: "FIVB Indoor",
    rating: 4.7,
    reviewCount: 121,
    specs: ["2 Indoor Courts", "FIVB Air Pressure Flooring", "Telescopic Referee Stand"],
    facilities: ["Hydration Bar", "Digital Lockers", "Hot Shower", "Team Photo Booth"],
    nextAvailable: "Today, 19:00 (Court 1)",
    pricePerHour: 210000,
  },
  {
    slug: "smash-tt-lounge-sudirman",
    name: "Smash TT Lounge Sudirman",
    address: "Jl. Jend. Sudirman Kav. 52-53, Jakarta Pusat",
    distanceKm: 1.2,
    image: "/hero.webp",
    sportTag: "Table Tennis",
    verifiedTag: "ITTF Pro Table",
    rating: 4.5,
    reviewCount: 78,
    specs: ["12 Tables", "ITTF 25mm Tabletop", "Acoustic Partition"],
    facilities: ["Coaching Available", "Free Parking", "Air Conditioned", "Beverage Menu"],
    nextAvailable: "Today, 15:00 (Table 7)",
    pricePerHour: 65000,
  },
  {
    slug: "squash-junction-scbd",
    name: "Squash Junction SCBD",
    address: "Jl. Mayjen Sutoyo No. 8, SCBD, Jakarta Selatan",
    distanceKm: 2.6,
    image: "/hero.webp",
    sportTag: "Squash",
    verifiedTag: "Pro Glass Box",
    rating: 4.8,
    reviewCount: 134,
    specs: ["2 Pro Glass Courts", "Pro Kill Point Flooring", "Kinetic Wall System"],
    facilities: ["Shoe Rental", "Spa & Shower", "Smart Locker", "Health Bar"],
    nextAvailable: "Today, 18:30 (Court 2)",
    pricePerHour: 145000,
  },
  {
    slug: "futsal-kingdom-kelapa-gading",
    name: "Futsal Kingdom Kelapa Gading",
    address: "Jl. Boulevard Raya Blok QJ 1 No. 22, Kelapa Gading",
    distanceKm: 5.8,
    image: "/hero.webp",
    sportTag: "Futsal",
    verifiedTag: "FIFA Quality Turf",
    rating: 4.6,
    reviewCount: 203,
    specs: ["4 Standard 5v5 Pitches", "FIFA Quality Synthetic Turf", "Full Air Circulation"],
    facilities: ["Digital Scoreboard", "Free Valet", "Canteen", "Team Locker"],
    nextAvailable: "Today, 19:30 (Pitch 3)",
    pricePerHour: 165000,
  },
  {
    slug: "smash-padel-house-tebet",
    name: "Smash Padel House Tebet",
    address: "Jl. Tebet Barat Dalam No. 88, Tebet, Jakarta Selatan",
    distanceKm: 4.3,
    image: "/hero.webp",
    sportTag: "Padel",
    verifiedTag: "Verified Hub",
    rating: 4.7,
    reviewCount: 168,
    specs: ["5 Courts", "Mondo Supercourt Turf", "Retractable Roof"],
    facilities: ["Cafe & Lounge", "Hot Shower", "Racket Rental", "Free Parking"],
    nextAvailable: "Today, 17:00 (Court 1)",
    pricePerHour: 235000,
  },
  {
    slug: "futsal-court-cilandak",
    name: "Futsal Court Cilandak",
    address: "Jl. Raya Cilandak No. 45, Jakarta Selatan",
    distanceKm: 5.4,
    image: "/hero.webp",
    sportTag: "Futsal",
    verifiedTag: "Gerflor Taraflex",
    rating: 4.5,
    reviewCount: 112,
    specs: ["2 Indoor Pitches", "Gerflor Taraflex Vinyl 7.5mm", "Recirculating AC"],
    facilities: ["Hydration Lounge", "Digital Lockers", "Parking Area (40 slots)", "Hot Shower"],
    nextAvailable: "Tomorrow, 07:00 (Pitch B)",
    pricePerHour: 140000,
  },
];

// ---------------------------------------------------------------------------
// Data venue popular untuk homepage — tipe Venue (dengan FacilityKey + icon)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Helper: cari venue berdasarkan slug di kedua koleksi
// ---------------------------------------------------------------------------
export function getVenueBySlug(slug: string) {
  return (
    venueListings.find((v) => v.slug === slug) ??
    popularVenues.find((v) => v.slug === slug)
  );
}