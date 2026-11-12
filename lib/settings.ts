// ---------------------------------------------------------------------------
// Data awal halaman Pengaturan Admin.
//
// Semua nilai di sini masih statis. Nanti tinggal diganti hasil fetch dari
// database / API tanpa perlu mengubah komponen tampilannya.
// ---------------------------------------------------------------------------

// ----- Aturan booking ----- //

export type SessionDurationOption = {
  id: string;
  label: string;
  hours: number;
  enabled: boolean;
};

export const SESSION_DURATION_OPTIONS: SessionDurationOption[] = [
  { id: "1-hour", label: "1 Jam", hours: 1, enabled: true },
  { id: "1-5-hour", label: "1,5 Jam", hours: 1.5, enabled: true },
  { id: "2-hour", label: "2 Jam", hours: 2, enabled: false },
];

export const CANCELLATION_POLICY_OPTIONS = [
  { value: "free-until-h1", label: "Gratis pembatalan sampai H-1" },
  { value: "half-refund", label: "Potong 50% jika batal di hari yang sama" },
  { value: "no-refund", label: "Tidak ada pengembalian dana" },
];

export type BookingRules = {
  allowSameDayBooking: boolean;
  maxAdvanceDays: number;
  cancellationPolicy: string;
};

export const DEFAULT_BOOKING_RULES: BookingRules = {
  allowSameDayBooking: true,
  maxAdvanceDays: 30,
  cancellationPolicy: "free-until-h1",
};

// ----- Jam operasional ----- //

export const TIMEZONE_OPTIONS = [
  "WIB (GMT+7)",
  "WITA (GMT+8)",
  "WIT (GMT+9)",
];

export type OperatingHours = {
  openTime: string;
  closeTime: string;
  timeZone: string;
};

export const DEFAULT_OPERATING_HOURS: OperatingHours = {
  openTime: "07:00",
  closeTime: "23:00",
  timeZone: "WIB (GMT+7)",
};

// ----- Pembayaran ----- //

export const PAYMENT_WINDOW_OPTIONS = [
  { value: "10", label: "10 menit" },
  { value: "15", label: "15 menit" },
  { value: "30", label: "30 menit" },
  { value: "45", label: "45 menit" },
  { value: "60", label: "60 menit" },
];

export type PaymentSettings = {
  paymentWindow: string;
  taxPercent: number;
  downPaymentPercent: number;
};

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  paymentWindow: "10",
  taxPercent: 11,
  downPaymentPercent: 50,
};
