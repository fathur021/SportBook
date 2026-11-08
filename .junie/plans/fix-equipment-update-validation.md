---
sessionId: session-261108-153336-lnuu
---

# Masalah & Solusi

### Masalah

Error **"Data peralatan tidak valid"** muncul saat:
1. **Klik switch toggle** (aktif/non-aktif) — frontend mengirim `{ isActive: true/false }` via PATCH, tapi `updateEquipmentSchema` tidak mengenal field `isActive`.
2. **Edit equipment** — frontend mengirim semua field (name, category, price, stock) sekaligus, tapi `updateEquipmentSchema` adalah `partial()` sehingga jika user mengubah hanya nama, field lain tidak terupdate.

### Penyebab

Di `modules/equipment/equipment.schema.ts`:
- `updateEquipmentSchema` dibuat dari `createEquipmentSchema.partial()` yang hanya mengenal: `name`, `category`, `price`, `stock`.
- Field `isActive` **tidak ada** di schema, jadi saat switch toggle mengirim `{ isActive: false }`, validasi gagal.

### Solusi

**[~] EDIT** `modules/equipment/equipment.schema.ts` — Tambahkan `isActive` sebagai field opsional di `updateEquipmentSchema`:

```tsx
// [+] TAMBAHKAN setelah baris 33 (sebelum export updateEquipmentSchema)
export const updateEquipmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama peralatan minimal 2 karakter")
    .max(100, "Nama peralatan maksimal 100 karakter")
    .optional(),
  category: z.string().trim().max(50).nullable().optional(),
  price: z
    .number({ error: "Harga per jam harus berupa angka" })
    .int("Harga per jam harus bilangan bulat")
    .positive("Harga per jam harus lebih dari 0")
    .min(10000, "Harga sewa minimal Rp.10.000")
    .optional(),
  stock: z
    .number({ error: "Stok harus berupa angka" })
    .int()
    .min(0)
    .optional(),
  // [+] FIELD BARU: untuk toggle status aktif/non-aktif
  isActive: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "Minimal satu field harus diisi"
)
```

### Penjelasan

- `isActive: z.boolean().optional()` → memungkinkan PATCH request mengirim `{ isActive: true }` atau `{ isActive: false }` untuk toggle status.
- Field lain tetap opsional agar user bisa update sebagian data saja.
- `.refine()` memastikan minimal satu field diisi.
- Memperbaiki typo: "file" → "field" di pesan error.

# Delivery Steps

### ✓ Step 1: Tambahkan isActive di updateEquipmentSchema
Perbaiki schema update equipment agar menerima field isActive untuk toggle status aktif/non-aktif.