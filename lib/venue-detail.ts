export type GalleryImage = {
  src: string;
  tag?: string; // badge kecil di pojok kiri atas foto, misal "Center Court 1 â€¢ WPT Spec"
  title?: string; // judul di pojok kiri bawah foto
  caption?: string; // subjudul di bawah title
};

// =========================================================================
// Tipe Data untuk Fasilitas & Amenities (Kartu 9 Kotak)
// =========================================================================
export type VenueAmenity = {
  id: string; // ID unik untuk properti key di React (misal: "courts", "lounge")
  title: string; // Judul tebal kartu (misal: "3 Panoramic Courts")
  description: string; // Teks deskripsi di bawah judul (misal: "WPT spec Mondo turf...")
  // Union Type: Pilihan icon dibatasi hanya nama-nama yang sudah didukung di renderAmenityIcon
  icon:
    | "court"
    | "ac"
    | "shower"
    | "rental"
    | "shop"
    | "cafe"
    | "parking"
    | "futsal"
    | "video";
};

// =========================================================================
// Tipe Data untuk Jam Operasional Mingguan (Weekly Operating Hours)
// =========================================================================
export type OperatingSchedule = {
  days: string; // Contoh: "Mon - Thu", "Friday", "Saturday", "Sunday"
  hours: string; // Contoh: "06:00 - 23:00"
  note: string; // Contoh: "Peak: 17:00 - 22:00", "Tournament Days"
  isHighlighted?: boolean; // true jika kartu diberi warna khusus (misal warna hijau di hari Sabtu)
};

export type SportDiscipline = {
  slug: string;
  label: string;
  courts: {
    id: string;
    label: string;
    imageIndex?: number; // urutan foto di venue.images (default 0)
    image?: string; // opsional, kalau punya foto sendiri
    badge?: string; // "Featured Arena"
    specs?: string[]; // ["Panoramic Glass", "Supercourt Mondo Turf"]
    features?: string[]; // chip fasilitas
    maxPlayers?: number;
    pricePerHour?: number;
    isOperational?: boolean;
  }[];
};
export type TimeSlotPrice = { time: string; spotsLeft?: number };
export type VenueStat = { value: string; label: string };

export type VenueDetail = {
  slug: string;
  name: string;
  verifiedTag: string;
  breadcrumb: string[];
  address: string;
  rating: number;
  reviewCount: number;
  openingHoursToday: string;
  totalPhotos: number;
  images: GalleryImage[];
  description: string;
  specs: string[];
  stats: VenueStat[];
  facilities: string[]; // label siap tampil, misal "Hot Shower" atau "AC Lounge"
  pricePerHour: number; // angka mentah, format saat ditampilkan
  disciplines: SportDiscipline[];
  sessionDurations: string[];
  popularSlots: TimeSlotPrice[];
  facilityFeeNote: string;
  conciergeName: string;
  amenities?: VenueAmenity[];
  operatingHoursBadge?: string; // Badge pojok kanan atas, misal "Always Open On Public Holidays"
  operatingSchedules?: OperatingSchedule[]; // Array jadwal 4 blok hari
};
