import { z } from "zod";

// Regex sederhana untuk mengecek format tanggal "YYYY-MM-DD"
// \d{4} = 4 digit tahun, \d{2} = 2 digit bulan, \d{2} = 2 digit hari
const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

// Regex sederhana untuk mengecek format jam "HH:MM" (jam 00-23, menit selalu 00)
const timeFormatRegex = /^([01]\d|2[0-3]):00$/;

//skema validasi ID booking (dipakai di endpoint cancel)
export const bookingIdSchema = z
    .string()
    .trim()
    .min(1,"Booking ID tidak boleh kosong")
//Skema validasi query string untuk endpoint availability
//consoh : GET /api/courts/xxx/availability?date=2026-11-05
export const availabilityQuerySchema = z.object({
    date : z
        .string()
        .trim()
        .regex(dateFormatRegex,"Format tanggal harus YYY-MM-DD")
})

export const createBookingSchema = z.object({
    courtId : z
        .string()
        .trim()
        .min(1,"Court ID tidak boleh kosong"),
    //hari main
    playDate : z
        .string()
        .trim()
        .regex(dateFormatRegex,"Format tanggal harus YYYY-MM-DD"),
    startTime: z
        .string()
        .trim()
        .regex(timeFormatRegex),
    durationHour: z
        .number({error: "Durasi harus berupa angka"})
        .int()
        .min(1,"Durasi minimal 1 jam")
        .max(24,"maxsimal 24 jam"),
    
    notes : z.string().trim().max(255).optional().nullable()
})

// untuk admin, skema validasi query string untuk endpoint list booking
export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const;
export const adminBookingQuerySchema = z.object({
  // Filter berdasarkan status — boleh tidak dikirim (= tampilkan semua)
  status: z.enum(BOOKING_STATUSES).optional(),
  // Filter berdasarkan tanggal main — boleh tidak dikirim
  playDate: z
    .string() // wajib string bila dikirim
    .trim() // hapus spasi kosong
    .regex(dateFormatRegex, "Format tanggal harus YYYY-MM-DD") // harus pola "2026-11-05"
    .optional(), // opsional
});

// Skema validasi body perubahan status (PATCH /api/admin/bookings/[bookingId]/status)
export const updateBookingStatusSchema = z.object({
  // Status baru yang diinginkan admin — harus salah satu dari 4 status di atas
  status: z.enum(BOOKING_STATUSES, { error: "Status tidak valid" }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>