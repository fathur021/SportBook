// ---------------------------------------------------------------------------
// Semua opsi filter & search digabung di satu file.
//
// • sportFilterOptions, timeSlotOptions, dll → CourtFilter sidebar
// • sportOptions, cityOptions, timeOptions   → CourtSearchForm dropdown
// • MAX_PRICE, MIN_PRICE                     → Slider harga
// ---------------------------------------------------------------------------

// ----- Tipe ----- //

export type FilterOption = {
  slug: string;
  label: string;
  count: number;
};

// ----- Filter sidebar (explore page) ----- //

export const sportFilterOptions: FilterOption[] = [
  { slug: "padel", label: "Padel Tennis", count: 14 },
  { slug: "badminton", label: "Badminton", count: 22 },
  { slug: "futsal", label: "Futsal (5v5)", count: 18 },
  { slug: "tennis", label: "Tennis Court", count: 11 },
  { slug: "basketball", label: "Basketball 3x3 / Full", count: 8 },
  { slug: "volleyball", label: "Volleyball", count: 5 },
];

// Tidak pakai FilterOption karena strukturnya beda: ada "range" (jam), bukan "count"
export const timeSlotOptions = [
  { value: "morning", label: "Morning", range: "06:00 - 12:00" },
  { value: "afternoon", label: "Afternoon", range: "12:00 - 17:00" },
  { value: "evening", label: "Evening Prime", range: "17:00 - 23:00" },
];

// Cuma daftar teks biasa (string[]), karena di UI tidak ada angka atau data tambahan
export const flooringOptions = [
  "Taraflex / Vinyl",
  "Synthetic Turf",
  "Hard Court",
  "Wood Parquet",
  "Interlock Polymer",
];

// count diisi 0 karena di desain fasilitas tidak menampilkan angka,
// tapi tetap pakai FilterOption supaya satu tipe bisa dipakai ulang
export const amenityOptions: FilterOption[] = [
  { slug: "ac", label: "Air Conditioned / Indoor", count: 0 },
  { slug: "showers", label: "Hot Showers & Changing", count: 0 },
  { slug: "parking", label: "Free Dedicated Parking", count: 0 },
  { slug: "rental", label: "Racket / Ball Equipment Rental", count: 0 },
  { slug: "canteen", label: "Cafe & Sports Nutrition Bar", count: 0 },
];

// Batas bawah dan atas untuk slider harga
export const MIN_PRICE = 50000;
export const MAX_PRICE = 350000;

// ----- Search form dropdown options (hero / header) ----- //

export const sportOptions = [
  { value: "padel", label: "Padel (Panoramic Glass)" },
  { value: "futsal", label: "Futsal" },
  { value: "badminton", label: "Badminton" },
  { value: "tennis", label: "Tennis" },
  { value: "basketball", label: "Basketball" },
  { value: "volleyball", label: "Volleyball" },
];

export const cityOptions = [
  { value: "south-jakarta", label: "South Jakarta, DKI" },
  { value: "central-jakarta", label: "Central Jakarta, DKI" },
  { value: "bandung", label: "Bandung, Jawa Barat" },
];

export const timeOptions = [
  { value: "morning", label: "Morning (06:00 - 11:00)" },
  { value: "afternoon", label: "Afternoon (12:00 - 17:00)" },
  { value: "evening", label: "Evening (18:00 - 23:00)" },
];