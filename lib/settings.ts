// ---------------------------------------------------------------------------
// Data awal halaman Pengaturan Admin.
//
// Semua nilai di sini masih statis. Nanti tinggal diganti hasil fetch dari
// database / API tanpa perlu mengubah komponen tampilannya.
// ---------------------------------------------------------------------------

// ----- Profil venue ----- //

export type VenueProfile = {
  name: string;
  sport: string;
  phone: string;
  email: string;
  address: string;
  openTime: string;
  closeTime: string;
  timezone: string;
};

export const SPORT_OPTIONS = [
  "Padel",
  "Futsal",
  "Badminton",
  "Basketball",
  "Tennis",
  "Volleyball",
  "Table Tennis",
  "Squash",
];

export const TIMEZONE_OPTIONS = [
  "WIB (GMT+7)",
  "WITA (GMT+8)",
  "WIT (GMT+9)",
];

export const DEFAULT_VENUE_PROFILE: VenueProfile = {
  name: "Smash Padel Club Kemang",
  sport: "Padel",
  phone: "+62 812 3456 7890",
  email: "hello@smashpadel.id",
  address:
    "Jl. Kemang Timur No. 48, Bangka, Mampang Prapatan, Jakarta Selatan",
  openTime: "06:30",
  closeTime: "23:30",
  timezone: "WIB (GMT+7)",
};

// ----- Aturan booking & harga ----- //

export type SessionDurationOption = {
  id: string;
  label: string;
  enabled: boolean;
};

export const SESSION_DURATION_OPTIONS: SessionDurationOption[] = [
  { id: "1-hour", label: "1 Jam", enabled: true },
  { id: "1-5-hour", label: "1,5 Jam", enabled: true },
  { id: "2-hour", label: "2 Jam", enabled: false },
];

export const PAYMENT_WINDOW_OPTIONS = [
  "15 menit",
  "30 menit",
  "45 menit",
  "60 menit",
];

export const CANCELLATION_POLICY_OPTIONS = [
  { value: "free-until-h1", label: "Gratis pembatalan sampai H-1" },
  { value: "half-refund", label: "Potong 50% jika batal di hari yang sama" },
  { value: "no-refund", label: "Tidak ada pengembalian dana" },
];

export type BookingRules = {
  peakPrice: number;
  offPeakPrice: number;
  facilityFee: number;
  paymentWindow: string;
  cancellationPolicy: string;
  allowSameDayBooking: boolean;
};

export const DEFAULT_BOOKING_RULES: BookingRules = {
  peakPrice: 260000,
  offPeakPrice: 180000,
  facilityFee: 0,
  paymentWindow: "30 menit",
  cancellationPolicy: "free-until-h1",
  allowSameDayBooking: true,
};

// ----- Pembayaran ----- //

export type PaymentMethod = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export const PAYMENT_METHOD_OPTIONS: PaymentMethod[] = [
  {
    id: "bank-transfer",
    label: "Transfer Bank",
    description: "BCA, Mandiri, BNI, dan BRI",
    enabled: true,
  },
  {
    id: "qris",
    label: "QRIS",
    description: "Semua aplikasi pembayaran dan e-wallet",
    enabled: true,
  },
  {
    id: "card",
    label: "Kartu Kredit / Debit",
    description: "Visa dan Mastercard",
    enabled: false,
  },
  {
    id: "pay-at-venue",
    label: "Bayar di Tempat",
    description: "Tunai di resepsionis venue",
    enabled: true,
  },
];

export type PaymentSettings = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  downPaymentPercent: number;
  taxPercent: number;
};

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  bankName: "Bank Central Asia (BCA)",
  accountNumber: "1234567890",
  accountHolder: "PT SportBook Nusantara",
  downPaymentPercent: 50,
  taxPercent: 11,
};
