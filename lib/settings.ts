// ---------------------------------------------------------------------------
// Pilihan statis untuk halaman Pengaturan Admin.
//
// Nilai yang bisa diubah admin (durasi, jam operasional, aturan booking)
// sekarang datang dari API. File ini hanya menyisakan daftar pilihan yang
// belum punya field di database.
// ---------------------------------------------------------------------------

// ----- Aturan booking ----- //

export const CANCELLATION_POLICY_OPTIONS = [
  { value: "free-until-h1", label: "Gratis pembatalan sampai H-1" },
  { value: "half-refund", label: "Potong 50% jika batal di hari yang sama" },
  { value: "no-refund", label: "Tidak ada pengembalian dana" },
];

// ----- Pembayaran ----- //

export const PAYMENT_WINDOW_OPTIONS = [
  { value: "10", label: "10 menit" },
  { value: "15", label: "15 menit" },
  { value: "30", label: "30 menit" },
  { value: "45", label: "45 menit" },
  { value: "60", label: "60 menit" },
];
