import { z } from "zod";

export const courtIdSchema = z
  .string()
  .trim()
  .min(1, "Court ID tidak boleh kosong");

export const createCourtSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama lapangan minimal 2 karakter")
    .max(100, "Nama lapangan maksimal 100 karakter"),

  sport: z
    .string()
    .trim()
    .min(2, "Cabang olahraga minimal 2 karakter")
    .max(50, "Cabang olahraga maksimal 50 karakter"),

  surface: z.string().trim().max(100).nullable().optional(),

  isIndoor: z.boolean().default(false),

  pricePerHour: z
    .number({
      error: "Harga per jam harus berupa angka",
    })
    .int("Harga per jam harus bilangan bulat")
    .positive("Harga per jam harus lebih dari 0")
    .min(10000, "Harga sewa minimal Rp 10.000"),
});

export const updateCourtSchema = createCourtSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Minimal satu field harus diisi",
  );

export type CreateCourtInput = z.infer<typeof createCourtSchema>;
export type UpdateCourtInput = z.infer<typeof updateCourtSchema>;
