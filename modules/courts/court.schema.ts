// Mengimpor library Zod untuk validasi skema dan tipe data
import { z } from "zod";

// Skema untuk validasi parameter ID lapangan (misal saat update atau soft delete)
export const courtIdSchema = z
  .string() // Wajib berupa tipe data string
  .trim() // Menghapus spasi kosong yang tidak disengaja di awal atau akhir string
  .min(1, "Court ID tidak boleh kosong"); // Minimal panjang 1 karakter agar tidak berupa string kosong

// Skema validasi untuk data saat membuat lapangan baru (Create / POST)
export const createCourtSchema = z.object({
  // Validasi nama lapangan
  name: z
    .string() // Wajib string
    .trim() // Hapus spasi di awal dan akhir
    .min(2, "Nama lapangan minimal 2 karakter") // Batas minimal panjang nama
    .max(100, "Nama lapangan maksimal 100 karakter"), // Batas maksimal panjang nama

  // Validasi jenis / cabang olahraga (futsal, badminton, basket, dll.)
  sport: z
    .string() // Wajib string
    .trim() // Hapus spasi di awal dan akhir
    .min(2, "Cabang olahraga minimal 2 karakter") // Minimal 2 karakter
    .max(50, "Cabang olahraga maksimal 50 karakter"), // Maksimal 50 karakter

  // Jenis permukaan lapangan (contoh: rumput sintetis, vinyl, semen)
  // Bersifat opsional dan boleh bernilai null
  surface: z.string().trim().max(100).nullable().optional(),

  // Menentukan apakah lapangan di dalam ruangan (indoor) atau luar ruangan (outdoor)
  // Default bernilai false jika tidak dikirimkan oleh klien
  isIndoor: z.boolean().default(false),

  // Validasi harga sewa lapangan per jam
  pricePerHour: z
    .number({
      error: "Harga per jam harus berupa angka", // Pesan error jika tipe bukan number
    })
    .int("Harga per jam harus bilangan bulat") // Tidak boleh bilangan desimal / koma
    .positive("Harga per jam harus lebih dari 0") // Nilai harga harus di atas 0
    .min(10000, "Harga sewa minimal Rp 10.000"), // Nilai batas minimal sewa
});

// Skema validasi untuk update lapangan (Update / PATCH)
export const updateCourtSchema = createCourtSchema
  .partial() // Menjadikan semua properti dari createCourtSchema menjadi opsional (boleh kirim salah satu saja)
  .refine(
    (data) => Object.keys(data).length > 0, // Memastikan objek tidak kosong {}
    "Minimal satu field harus diisi", // Pesan jika pengguna mengirimkan objek kosong tanpa perubahan
  );

// Inferensi tipe data TypeScript otomatis dari skema Zod untuk create
export type CreateCourtInput = z.infer<typeof createCourtSchema>;

// Inferensi tipe data TypeScript otomatis dari skema Zod untuk update
export type UpdateCourtInput = z.infer<typeof updateCourtSchema>;
