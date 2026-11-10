// ============================================================================
// PANDUAN: FITUR EDIT, TOGGLE, DAN DELETE UNTUK VENUE
// ============================================================================
//
// PENJELASAN:
// Sama seperti equipment dan court, venue butuh 3 fitur di kolom Aksi:
// 1. Edit — dialog form untuk ubah data venue
// 2. Toggle — switch untuk aktif/non-aktif venue
// 3. Delete — tombol untuk hapus venue (soft delete)
//
// Perbedaan dengan equipment/court:
// - Venue menggunakan Redux RTK Query (sama seperti court)
// - Venue menggunakan slug sebagai identifier, bukan ID
// - Venue punya relasi dengan Court (onDelete: Cascade)
// - Delete venue = soft delete (isActive: false), bukan hard delete
//
// Backend yang sudah ada:
// - Repository: deactivateVenueBySlug() ✅
// - Service: deactivateVenueService() ✅
// - Controller: deactivateVenueController() ✅
// - API Route: DELETE /api/admin/venues/[slug] ✅
// - Redux: useDeactivateVenueMutation ✅
// - Redux: useUpdateVenueMutation ✅
//
// Yang perlu diperbaiki/ditambahkan:
// 1. venue.schema.ts — tambah isActive di updateVenueSchema
// 2. admin-api.ts — tambah isActive di AdminVenue + UpdateVenueBody
// 3. admin-api.ts — tambah mutation toggleVenue
// 4. Venue-row-actions.tsx — komponen baru (edit, toggle, delete)
// 5. venue-table.tsx — ganti tombol placeholder dengan VenueRowActions

// ============================================================================
// BAGIAN 1: SCHEMA VALIDASI — Tambah isActive
// ============================================================================
// File: modules/venues/venue.schema.ts
//
// PENJELASAN:
// Sama seperti equipment dan court, updateVenueSchema saat ini menggunakan
// .partial() yang hanya mengenal field di createVenueSchema. Karena createVenueSchema
// tidak punya isActive, maka .partial() juga tidak bisa menambahkannya.
//
// Solusi: Ganti jadi z.object() eksplisit dan tambah isActive sebagai field opsional.

// [~] EDIT — Ganti baris 48-54 (updateVenueSchema)

export const updateVenueSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama venue minimal 2 karakter")
    .max(120, "Nama venue maksimal 120 karakter")
    .optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  address: z.string().trim().min(5, "Alamat minimal 5 karakter").max(255).optional(),
  city: z
    .string()
    .trim()
    .min(2, "Nama kota minimal 2 karakter")
    .max(100, "Nama kota maksimal 100 karakter")
    .optional(),
  phone: z.string().trim().max(30).nullable().optional(),
  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .or(z.literal(""))
    .nullable()
    .optional()
    .transform((val) => (val ? val : null)),
  timeZone: z.string().trim().min(1).max(100).optional(),
  coverImage: z.string().trim().max(2048).nullable().optional(),
  facilities: z.array(z.string().trim()).optional(),
  // [+] FIELD BARU: untuk toggle status aktif/non-aktif
  isActive: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "Minimal satu field harus diisi",
);

// ============================================================================
// BAGIAN 2: REDUX — Tambah isActive di Interface
// ============================================================================
// File: lib/redux/admin-api.ts
//
// PENJELASAN:
// AdminVenue interface harus punya isActive agar komponen frontend bisa
// membaca status aktif/non-aktif dari data Redux.
// UpdateVenueBody juga harus punya isActive agar bisa kirim PATCH request
// untuk toggle status.

// [~] EDIT — Tambah isActive di AdminVenue (sekitar baris 54-66)

export interface AdminVenue {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  address: string;
  city: string;
  phone?: string | null;
  email?: string | null;
  coverImage?: string | null;
  facilities: string[];
  // [+] TAMBAHKAN:
  isActive?: boolean;
  courts: AdminCourt[];
}

// [~] EDIT — Tambah isActive di UpdateVenueBody (sekitar baris 90-99)

export interface UpdateVenueBody {
  name?: string;
  address?: string;
  city?: string;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  coverImage?: string | null;
  facilities?: string[];
  // [+] TAMBAHKAN:
  isActive?: boolean;
}

// ============================================================================
// BAGIAN 3: REDUX — Tambah mutation toggleVenue
// ============================================================================
// File: lib/redux/admin-api.ts
//
// PENJELASAN:
// Mutation ini mengirim PATCH request ke API dengan body { isActive: boolean }
// untuk mengubah status aktif/non-aktif venue. Sama seperti toggleCourt.
// Endpoint yang dipanggil: PATCH /api/admin/venues/[slug]
// Controller yang menangani: updateVenueController (sudah bisa terima isActive)

// [+] TAMBAHKAN — Setelah mutation deactivateVenue (sekitar baris 157)

toggleVenue: build.mutation<
  AdminVenue,
  { slug: string; isActive: boolean }
>({
  query: ({ slug, isActive }) => ({
    url: `/api/admin/venues/${slug}`,
    method: "PATCH",
    body: { isActive },
  }),
  transformResponse: (res: { data: AdminVenue }) => res.data,
  invalidatesTags: ["AdminVenue"],
}),

// [+] TAMBAHKAN — Export hook (sekitar baris 241-254)

useToggleVenueMutation,

// ============================================================================
// BAGIAN 4: KOMPONEN BARU — Venue Row Actions
// ============================================================================
// File: components/admin/Venue-row-actions.tsx
//
// PENJELASAN:
// Komponen ini berisi 3 fitur dalam 1 fungsi dengan 1 return:
// 1. Dialog Edit — form untuk ubah data venue
// 2. Switch Toggle — switch untuk aktif/non-aktif
// 3. Tombol Delete — soft delete venue
//
// Struktur: 1 fungsi utama, 3 fungsi anak di dalamnya, 1 return.
// Menggunakan Redux mutation, bukan fetch() langsung.
// @base-ui/react tidak support asChild, jadi styling disalin manual.

// [+] FILE BARU — Buat file ini di folder components/admin/

"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";

import type { AdminVenue } from "@/lib/redux/admin-api";
import {
  useUpdateVenueMutation,
  useToggleVenueMutation,
  useDeactivateVenueMutation,
} from "@/lib/redux/admin-api";

// Tipe data venue yang diterima dari tabel
type VenueItem = {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  phone?: string | null;
  email?: string | null;
  coverImage?: string | null;
  description?: string | null;
  facilities?: string[];
  isActive?: boolean;
};

export function VenueRowActions({ item }: { item: VenueItem }) {
  // [+] State untuk dialog edit
  const [open, setOpen] = useState(false);
  // [+] State untuk switch toggle
  const [active, setActive] = useState(item.isActive ?? true);
  // [+] State loading
  const [loading, setLoading] = useState(false);

  // [+] Redux mutations
  const [updateVenue] = useUpdateVenueMutation();
  const [toggleVenue] = useToggleVenueMutation();
  const [deactivateVenue] = useDeactivateVenueMutation();

  // Fungsi submit form edit venue
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget; // ← tanpa kurung, ini properti
    const formData = new FormData(form);

    // Kumpulkan data dari form
    const data = {
      name: String(formData.get("name") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      coverImage: String(formData.get("coverImage") ?? "").trim() || null,
    };

    try {
      // Kirim PATCH request via Redux
      await updateVenue({
        slug: item.slug,
        body: data,
      }).unwrap();

      // Reset form dan tutup dialog
      form.reset();
      setOpen(false);
    } catch (err: any) {
      // Tampilkan error dari server
      const serverMsg = err?.data?.error || "Gagal memperbarui venue";
      alert(serverMsg);
    } finally {
      setLoading(false);
    }
  }

  // Fungsi toggle switch aktif/non-aktif
  async function handleToggle() {
    const newStatus = !active;
    setActive(newStatus); // ← optimistic UI: langsung ubah tampilan

    try {
      // Kirim PATCH request via Redux
      await toggleVenue({
        slug: item.slug,
        isActive: newStatus,
      }).unwrap();
    } catch (err: any) {
      // Rollback jika API gagal
      setActive(!newStatus);
      const serverMsg = err?.data?.error || "Gagal mengubah status venue";
      alert(serverMsg);
    }
  }

  // Fungsi delete venue (soft delete)
  async function handleDelete() {
    // Konfirmasi sebelum hapus
    if (!confirm(`Yakin ingin menonaktifkan "${item.name}"?`)) return;

    setLoading(true);
    try {
      // Kirim DELETE request via Redux
      await deactivateVenue(item.slug).unwrap();
    } catch (err: any) {
      const serverMsg = err?.data?.error || "Gagal menonaktifkan venue";
      alert(serverMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {/* ============================================ */}
      {/* 1. DIALOG EDIT VENUE                        */}
      {/* ============================================ */}
      <Dialog open={open} onOpenChange={setOpen}>
        {/* Trigger tombol Edit */}
        <DialogTrigger className="group/button inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-1.5 hover:bg-secondary/50 px-2.5 py-1.5">
          <Pencil data-icon="inline-start" size={14} />
          Edit
        </DialogTrigger>

        {/* Isi dialog */}
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Venue</DialogTitle>
            <DialogDescription>
              Perbarui detail venue olahraga.
            </DialogDescription>
          </DialogHeader>

          {/* Form edit dengan 7 field */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field: Nama venue */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-venue-name">Nama venue *</Label>
              <Input
                id="edit-venue-name"
                name="name"
                placeholder="Sport Arena Jakarta"
                defaultValue={item.name}
                required
              />
            </div>

            {/* Field: Alamat */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-venue-address">Alamat *</Label>
              <Input
                id="edit-venue-address"
                name="address"
                placeholder="Jl. Sudirman No. 123"
                defaultValue={item.address}
                required
              />
            </div>

            {/* Field: Kota */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-venue-city">Kota *</Label>
              <Input
                id="edit-venue-city"
                name="city"
                placeholder="Jakarta"
                defaultValue={item.city}
                required
              />
            </div>

            {/* Field: Telepon dan Email (2 kolom) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-venue-phone">Telepon</Label>
                <Input
                  id="edit-venue-phone"
                  name="phone"
                  placeholder="08123456789"
                  defaultValue={item.phone ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-venue-email">Email</Label>
                <Input
                  id="edit-venue-email"
                  name="email"
                  type="email"
                  placeholder="venue@email.com"
                  defaultValue={item.email ?? ""}
                />
              </div>
            </div>

            {/* Field: Deskripsi */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-venue-description">Deskripsi</Label>
              <Textarea
                id="edit-venue-description"
                name="description"
                placeholder="Deskripsi singkat venue..."
                defaultValue={item.description ?? ""}
                rows={3}
              />
            </div>

            {/* Field: Cover Image URL */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-venue-cover">URL Gambar Cover</Label>
              <Input
                id="edit-venue-cover"
                name="coverImage"
                placeholder="https://..."
                defaultValue={item.coverImage ?? ""}
              />
            </div>

            {/* Tombol di bawah dialog */}
            <DialogFooter>
              <DialogClose asChild={false}>
                <button type="button" className="group/button inline-flex shrink-0 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-1.5 border border-slate-200 hover:bg-slate-100 px-4 py-2">
                  Batal
                </button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {loading ? "Menyimpan..." : "Perbarui Venue"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* 2. SWITCH TOGGLE AKTIF/NON-AKTIF           */}
      {/* ============================================ */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">
          {active ? "Aktif" : "Non-aktif"}
        </span>
        <Switch
          size="sm"
          checked={active}
          onCheckedChange={handleToggle}
        />
      </div>

      {/* ============================================ */}
      {/* 3. TOMBOL DELETE (SOFT DELETE)              */}
      {/* ============================================ */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 data-icon="inline-start" size={14} />
        Hapus
      </Button>
    </div>
  );
}

// ============================================================================
// BAGIAN 5: EDIT VENUE TABLE — Ganti tombol placeholder
// ============================================================================
// File: components/admin/venue-table.tsx
//
// PENJELASAN:
// Ganti tombol Edit (link ke halaman lain) dan tombol Hapus (placeholder)
// dengan komponen VenueRowActions yang sudah dibuat.
// Tambah kolom Status untuk badge aktif/non-aktif.

// [+] TAMBAHKAN import di bagian atas

import { VenueRowActions } from "@/components/admin/Venue-row-actions";

// [~] EDIT — Ganti TableHeader (sekitar baris 56-63)

<TableHeader className="bg-slate-50">
  <TableRow>
    <TableHead className="w-[280px]">Venue & Lokasi</TableHead>
    <TableHead>Cabang Olahraga</TableHead>
    <TableHead>Spesifikasi</TableHead>
    <TableHead>Harga Sewa / Jam</TableHead>
    {/* [+] TAMBAHKAN kolom Status */}
    <TableHead className="w-[120px]">Status</TableHead>
    <TableHead className="text-right w-[260px]">Aksi</TableHead>
  </TableRow>
</TableHeader>

// [~] EDIT — Ganti setiap baris data (sekitar baris 118-158)

{/* [+] TAMBAHKAN cell Status sebelum Aksi */}
<TableCell>
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
      venue.isActive
        ? "bg-emerald-50 text-emerald-700"
        : "bg-red-50 text-red-700",
    )}
  >
    {venue.isActive ? "Aktif" : "Non-aktif"}
  </span>
</TableCell>

<TableCell className="text-right">
  <div className="flex items-center justify-end gap-1">
    {/* [+] Ganti tombol placeholder dengan VenueRowActions */}
    <VenueRowActions
      item={{
        id: venue.id,
        slug: venue.slug,
        name: venue.name,
        address: venue.address,
        city: venue.city,
        phone: venue.phone,
        email: venue.email,
        coverImage: venue.coverImage,
        description: venue.description,
        facilities: venue.facilities,
        isActive: venue.isActive,
      }}
    />
  </div>
</TableCell>

// ============================================================================
// BAGIAN 6: UPDATE colSpan DI EMPTY STATE
// ============================================================================
// File: components/admin/venue-table.tsx
//
// PENJELASAN:
// Karena sekarang ada 6 kolom (dari 5), colSpan di empty state harus
// disesuaikan. Tapi venue-table.tsx menggunakan div kosong, bukan tabel
// dengan colSpan, jadi tidak perlu diubah.

// ============================================================================
// ALUR KERJA
// ============================================================================
//
// Edit:
// 1. Klik tombol "Edit" → Dialog terbuka dengan form terisi data existing
// 2. User ubah data → klik "Perbarui Venue"
// 3. Form kirim PATCH via Redux mutation (updateVenue)
// 4. Redux invalidate tag → data tabel refresh otomatis
//
// Toggle:
// 1. Klik switch → langsung berubah (optimistic UI)
// 2. Kirim PATCH via Redux mutation (toggleVenue) dengan { isActive }
// 3. Redux invalidate tag → data tabel refresh otomatis
// 4. Jika API gagal → switch rollback ke posisi semula
//
// Delete:
// 1. Klik tombol "Hapus" → muncul konfirmasi
// 2. User klik OK → kirim DELETE via Redux mutation (deactivateVenue)
// 3. Redux invalidate tag → venue hilang dari tabel
// 4. Ini soft delete: venue.set isActive = false, bukan hapus dari database

// ============================================================================
// PERBEDAAN DENGAN EQUIPMENT & COURT
// ============================================================================
//
// | Aspek        | Equipment      | Court          | Venue          |
// |--------------|----------------|----------------|----------------|
// | Identifier   | ID             | ID + slug      | Slug           |
// | HTTP Request | fetch()        | Redux mutation | Redux mutation |
// | Data Refresh | router.refresh | invalidatesTags| invalidatesTags|
// | Delete       | Hard delete    | Hard delete    | Soft delete    |
// | Konfirmasi   | 2x             | 2x             | 1x             |
// | Relasi       | BookingEquipment| Booking       | Court (Cascade)|

// ============================================================================
// CATATAN PENTING
// ============================================================================
//
// 1. @base-ui/react tidak support asChild
//    - DialogTrigger dan DialogClose tidak bisa dibungkus <Button>
//    - Styling harus disalin manual ke className
//
// 2. Venue menggunakan slug, bukan ID
//    - Semua API endpoint menggunakan slug: /api/admin/venues/[slug]
//    - Redux mutation menerima slug, bukan id
//
// 3. Soft delete, bukan hard delete
//    - DELETE endpoint memanggil deactivateVenueController
//    - Hanya mengubah isActive: false, tidak menghapus dari database
//    - Court terkait TIDAK terhapus (tidak ada cascade untuk isActive)
//
// 4. Relasi dengan Court
//    - Venue punya relasi Court[] dengan onDelete: Cascade
//    - Tapi soft delete tidak memicu cascade, hanya set isActive: false
//    - Court masih ada di database meskipun venue non-aktif
//
// 5. Optimistic UI
//    - Switch toggle langsung berubah sebelum API respond
//    - Jika API gagal, switch rollback ke posisi semula
//    - Redux invalidatesTags memastikan data selalu fresh

// ============================================================================
// KUNCI PENANDA
// ============================================================================
// [+] = Kode yang ditambahkan (baru)
// [~] = Kode yang diedit (diubah)
// [-] = Kode yang dihapus
// ←   = Penjelasan singkat di sebelah kode

// ============================================================================
// RINGKASAN LANGKAH
// ============================================================================
//
// 1. Edit venue.schema.ts — ganti updateVenueSchema jadi z.object() + isActive
// 2. Edit admin-api.ts — tambah isActive di AdminVenue dan UpdateVenueBody
// 3. Edit admin-api.ts — tambah mutation toggleVenue + export hook
// 4. Buat Venue-row-actions.tsx — komponen baru (edit, toggle, delete)
// 5. Edit venue-table.tsx — import dan gunakan VenueRowActions
// 6. Edit venue-table.tsx — tambah kolom Status + badge dinamis
