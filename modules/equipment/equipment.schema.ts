import { z } from "zod"


export const equipmentIdSchema = z
    .string()
    .trim()
    .min(1)

export const createEquipmentSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Nama lapangan minimal 2 karakter")
        .max(100, "Nama lapangan maksimal 100 karakter"),
    category: z.string().trim().max(50).nullable().optional(),
    price: z
        .number({
            error: "Harga per jam harus barupa angka"
        })
        .int("Harga per jam harus bilangan bulat")
        .positive("Harga per jam harus lebih dari 0")
        .min(10000, "harga sewa minimal Rp.10.000"),

    stock: z
        .number({
            error: "Stok harus berupa angka"
        })
        .int()
        .positive()
        .min(0)

})

export const updateEquipmentSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Nama peralatan minimal 2 karakter")
        .max(100, "Nama peralatan maksimal 100 karakter")
        .optional(),
    category: z.string().trim().max(50).nullable().optional(),
    price: z
        .number({
            error: "Harga per jam harus berupa angka"
        })
        .int("Harga per jam harus bilangan bulat")
        .positive("Harga per jam harus lebih dari 0")
        .min(10000, "Harga sewa minimal Rp.10.000")
        .optional(),
    stock: z
        .number({
            error: "Stok harus berupa angka"
        })
        .int()
        .min(0)
        .optional(),
    // [+] FIELD BARU: untuk toggle status aktif/non-aktif
    isActive: z.boolean().optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    "Minimal satu field harus diisi"
)

export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>
export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>
