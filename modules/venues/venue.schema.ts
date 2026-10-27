import { z } from "zod";

export const venueSlugSchema = z.string().trim().min(1).max(100);

export const createVenueSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "slug minimal 3 karakter")
    .max(100, "Slug maksimal 100 karakter")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung",
    ),
  name: z
    .string()
    .trim()
    .min(2, "Nama venue minimal 2 karakter")
    .max(120, "Nama venue maksimal 120 karakter"),

  description: z.string().trim().max(2000).nullable().optional(),

  address: z.string().trim().min(5, "Alamat minimal 5 karakter").max(255),

  city: z
    .string()
    .trim()
    .min(2, "Nama kota minimal 2 karakter")
    .max(100, "Nama kota maksimal 100 karakter"),
  phone: z.string().trim().max(30).nullable().optional(),

  email: z.email().nullable().optional(),
  timeZone: z.string().trim().min(1).max(100).default("Asia/Jakarta"),

  coverImage: z.string().trim().max(2048).nullable().optional(),
});

export type CreateVenueInput = z.infer<typeof createVenueSchema>;
