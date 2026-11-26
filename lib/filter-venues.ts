// ---------------------------------------------------------------------------
// Modul Logika Penyaringan Venue (filterVenues)
//
// Modul ini bertugas menyaring array data mentah venue (venueListings) di sisi server
// berdasarkan kriteria query string yang diterima dari URL (searchParams).
//
// Alur kerja:
// 1. Ekstraksi parameter URL (olahraga, tanggal, waktu, harga, lantai, fasilitas, instant).
// 2. Normalisasi teks pencarian dan pencocokan kata kunci (synonyms/keywords).
// 3. Evaluasi setiap venue: jika ada satu saja kriteria yang tidak cocok, venue diabaikan.
// ---------------------------------------------------------------------------

import type { VenueListing } from "@/lib/listings";

// Tipe parameter pencarian yang diterima dari URL / Next.js Page searchParams
export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

// ---------------------------------------------------------------------------
// Helper Ekstraksi Query Param
// ---------------------------------------------------------------------------

// Mengubah query param yang dipisah koma menjadi array string
// Contoh: "padel,futsal" -> ["padel", "futsal"]
const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v)?.split(",").filter(Boolean) ?? [];

// Mengambil satu nilai string pertama jika berupa array
const one = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

// ---------------------------------------------------------------------------
// Helper Normalisasi & Pencocokan String
// ---------------------------------------------------------------------------

// Membersihkan teks: huruf kecil, ubah tanda "&" jadi "and", hapus simbol selain alfanumerik
const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Mengecek apakah suatu teks mengandung salah satu kata kunci dari daftar
const includesAny = (value: string, keywords: string[]) => {
  const normalizedValue = normalize(value);
  return keywords.some((keyword) => normalizedValue.includes(normalize(keyword)));
};

// ---------------------------------------------------------------------------
// Kamus Kata Kunci (Keywords & Sinonim untuk Pencarian Toleran)
// ---------------------------------------------------------------------------

// Pemetaan slug olahraga ke kata kunci pencarian
const sportKeywords: Record<string, string[]> = {
  padel: ["padel"],
  badminton: ["badminton"],
  futsal: ["futsal"],
  tennis: ["tennis"],
  basketball: ["basketball"],
  volleyball: ["volleyball"],
};

// Pemetaan jenis lantai ke sinonim/istilah teknis lantai
const flooringKeywords: Record<string, string[]> = {
  "Taraflex / Vinyl": ["taraflex", "vinyl", "gerflor"],
  "Synthetic Turf": ["synthetic turf", "turf"],
  "Hard Court": ["hard court", "acrylic"],
  "Wood Parquet": ["wood", "wooden", "maple", "parquet"],
  "Interlock Polymer": ["interlock", "polymer"],
};

// Pemetaan fasilitas ke sinonim kata kunci yang mungkin tercantum di spesifikasi venue
const amenityKeywords: Record<string, string[]> = {
  ac: ["ac", "air cooled", "air conditioned", "air circulation", "indoor"],
  showers: ["shower", "changing", "spa"],
  parking: ["parking", "valet"],
  rental: ["rental", "pro shop", "ball boy", "shoe rental"],
  canteen: ["cafe", "canteen", "hydration", "lounge", "kiosk", "bar", "beverage"],
};

// ---------------------------------------------------------------------------
// Helper Ekstraksi Informasi Venue
// ---------------------------------------------------------------------------

// Menggabungkan seluruh teks informasi venue (kategori, tag verifikasi, spesifikasi, dan fasilitas)
// menjadi satu string gabungan besar untuk memudahkan pencarian teks
const searchableVenueText = (venue: VenueListing) =>
  [
    venue.sportTag,
    venue.verifiedTag,
    venue.specs.join(" "),
    venue.facilities.join(" "),
  ].join(" ");

// Teks untuk pencarian bebas: nama, alamat, slug, cabang, specs, dan fasilitas.
const searchableKeywordText = (venue: VenueListing) =>
  [
    venue.name,
    venue.address,
    venue.slug,
    venue.sportTag,
    venue.specs.join(" "),
    venue.facilities.join(" "),
  ].join(" ");

// Menentukan slot waktu (morning / afternoon / evening) berdasarkan jam ketersediaan terdekat
// Contoh: "Today, 18:00" -> jam 18 -> "evening"
const timeSlotFromNextAvailable = (venue: VenueListing) => {
  const hour = Number(venue.nextAvailable.match(/\b(\d{1,2}):/)?.[1]);

  if (Number.isNaN(hour)) return [];
  if (hour < 12) return ["morning"];      // 00:00 - 11:59
  if (hour < 17) return ["afternoon"];    // 12:00 - 16:59
  return ["evening"];                     // 17:00 ke atas
};

// ---------------------------------------------------------------------------
// Fungsi Utama: filterVenues
// ---------------------------------------------------------------------------
export function filterVenues(venues: VenueListing[], sp: SearchParams) {
  // 1. Urai semua nilai dari searchParams URL
  const sports = list(sp.sport);
  const times = list(sp.time);
  const floors = list(sp.floor);
  const amenities = list(sp.amenity);
  const date = one(sp.date);
  const min = Number(one(sp.min) ?? 0);
  const max = Number(one(sp.max) ?? Infinity);
  const instant = one(sp.instant) === "1";
  const keyword = normalize(one(sp.q) ?? "");

  // 2. Evaluasi setiap venue dalam array
  return venues.filter((v) => {
    const venueText = searchableVenueText(v);

    // Kriteria 0: Kata kunci bebas dari search bar (?q=...)
    if (keyword && !normalize(searchableKeywordText(v)).includes(keyword)) {
      return false;
    }

    // Kriteria 1: Instant Book
    // Jika filter instant aktif, venue harus memiliki slot 'nextAvailable' yang terdaftar
    if (instant && !v.nextAvailable) return false;

    // Kriteria 2: Cabang Olahraga (OR: cocok jika memenuhi salah satu cabang terpilih)
    if (sports.length && !sports.some((sport) => includesAny(v.sportTag, sportKeywords[sport] ?? [sport]))) {
      return false;
    }

    // Kriteria 3: Rentang Harga per Jam
    // Harga sewa harus berada di antara nilai minimum dan maksimum
    if (v.pricePerHour < min || v.pricePerHour > max) return false;

    // Kriteria 4: Tanggal Main (Today / Tomorrow)
    // Mencocokkan awalan teks ketersediaan terdekat venue
    if (date === "today" && !normalize(v.nextAvailable).startsWith("today")) {
      return false;
    }
    if (date === "tomorrow" && !normalize(v.nextAvailable).startsWith("tomorrow")) {
      return false;
    }

    // Kriteria 5: Jenis Lantai (OR: cocok jika salah satu jenis lantai ada di venueText)
    if (floors.length && !floors.some((floor) => includesAny(venueText, flooringKeywords[floor] ?? [floor]))) {
      return false;
    }

    // Kriteria 6: Slot Waktu (OR: jam ketersediaan terdekat cocok dengan pilihan waktu)
    if (times.length && !times.some((time) => timeSlotFromNextAvailable(v).includes(time))) {
      return false;
    }

    // Kriteria 7: Fasilitas (AND: venue HARUS memiliki SEMUA fasilitas yang dicentang user)
    if (amenities.length && !amenities.every((amenity) => includesAny(venueText, amenityKeywords[amenity] ?? [amenity])))
      return false;

    // Jika lolos seluruh kriteria di atas, venue dimasukkan ke hasil pencarian
    return true;
  });
}
