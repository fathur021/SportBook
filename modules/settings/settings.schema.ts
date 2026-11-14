import { z } from "zod";
//pola jam
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

// Daftar nilai kebijakan pembatalan yang sah.
// "as const" membuat nilainya dianggap tetap, bukan string bebas.
export const CANCELLATION_POLICY_VALUES = [
  "free-until-h1", // gratis sampai H-1
  "half-refund", // potong 50 persen
  "no-refund", // tanpa pengembalian
] as const;

export const updateSettingsSchema = z
  .object({
    minSessionHours: z
      .number({ error: "Durasi minimal harus berupa angka" })
      .int("Durasi minimal harus bilangan bulat")
      .min(1, "Durasi minimal 1 jam")
      .max(12, "durasi maksimal 12 jam")
      .optional(),
    maxSessionHours: z
      .number({ error: "Durasi maksimal harus berupa angka" })
      .int("Durasi maksimal harus bilangn bulat")
      .min(1, "Durasi nimimal 1 jam")
      .max(12, "Durasi maksimal 12 jam")
      .optional(),

    // Jam buka.
    openTime: z
      // Harus teks.
      .string()
      // Spasi di awal dan akhir dibuang.
      .trim()
      // Harus cocok dengan pola HH:MM.
      .regex(timePattern, "Format jam buka harus HH:MM")
      // Boleh tidak dikirim.
      .optional(),

    closeTime: z
      // Harus teks.
      .string()
      // Spasi dibuang.
      .trim()
      // Harus cocok dengan pola HH:MM.
      .regex(timePattern, "Format jam tutup harus HH:MM")
      // Boleh tidak dikirim.
      .optional(),

    // Izin booking hari ini.
    allowSameDayBooking: z
      // Harus boolean true/false.
      .boolean()
      // Boleh tidak dikirim.
      .optional(),

    // Batas waktu pembayaran dalam menit.
    paymentWindowMinutes: z
      // Harus angka.
      .number({ error: "Batas waktu harus berupa angka" })
      // Harus bilangan bulat.
      .int("Batas waktu harus bilangan bulat")
      // Paling cepat 1 menit.
      .min(1, "Batas waktu minimal 1 menit")
      // Paling lama 24 jam.
      .max(1440, "Batas waktu maksimal 1440 menit")
      // Boleh tidak dikirim.
      .optional(),

    // Pajak dalam persen.
    taxPercent: z
      // Harus angka.
      .number({ error: "Pajak harus berupa angka" })
      // Harus bilangan bulat.
      .int("Pajak harus bilangan bulat")
      // Tidak boleh negatif.
      .min(0, "Pajak tidak boleh negatif")
      // Paling besar 100 persen.
      .max(100, "Pajak maksimal 100 persen")
      // Boleh tidak dikirim.
      .optional(),

    // Batas booking ke depan.
    maxAdvanceDays: z
      // Harus angka.
      .number({ error: "Batas booking harus berupa angka" })
      // Harus bilangan bulat.
      .int("Batas booking harus bilangan bulat")
      // Paling sedikit 1 hari.
      .min(1, "Batas booking minimal 1 hari")
      // Paling banyak 365 hari.
      .max(365, "Batas booking maksimal 365 hari")
      // Boleh tidak dikirim.
      .optional(),

    // Kebijakan pembatalan.
    cancellationPolicy: z
      // Nilainya harus salah satu dari daftar di atas.
      .enum(CANCELLATION_POLICY_VALUES)
      // Boleh tidak dikirim.
      .optional(),
  })
  .refine(
    // Object.keys mengambil daftar nama field.
    // length > 0 berarti minimal ada satu field.
    (data) => Object.keys(data).length > 0,
    // Pesan kalau body kosong.
    "Minimal satu field harus diisi",
  )
  .refine(
    // Lolos kalau salah satu tidak dikirim.
    // Kalau dua-duanya dikirim, maksimal harus >= minimal.
    (data) =>
      data.minSessionHours === undefined ||
      data.maxSessionHours === undefined ||
      data.maxSessionHours >= data.minSessionHours,
    {
      // Pesan kesalahan.
      message: "Durasi maksimal tidak boleh lebih kecil dari durasi minimal",
      // Kesalahan ditempelkan ke field maxSessionHours.
      path: ["maxSessionHours"],
    },
  );

// Mengambil tipe data dari schema, supaya tidak menulis ulang.
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
