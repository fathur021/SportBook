export type FilterOption = {
  slug: string;
  label: string;
  count: number;
};

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