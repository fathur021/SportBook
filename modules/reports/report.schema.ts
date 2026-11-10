import { z } from "zod";
export const reportQuerySchema = z.object({
  venueSlug: z
    .string()
    .trim()
    .min(1, "Slug venue tidak boleh kosong")
    .optional(),

  period: z.enum(["all", "30", "90"]).default("all"),
});

export type ReportQuery = z.infer<typeof reportQuerySchema>;