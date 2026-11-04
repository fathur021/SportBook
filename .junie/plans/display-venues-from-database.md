---
sessionId: session-261104-115254-10ej
---

# Requirements

### Overview
Fitur venue sudah selesai (create dan display dari database). Sekarang perlu menambahkan fitur court: create court dan tampilkan court dari database di halaman detail venue (`/admin/venues/[slug]`).

### Tujuan
- Agar halaman detail venue menampilkan data court dari **database** via API, bukan data hardcoded.
- Agar form dialog create court terhubung ke API dan court baru muncul otomatis di tabel.
- Agar tabel court menampilkan data yang sesuai dengan field di database (name, sport, surface, isIndoor, pricePerHour).

### Scope
**In Scope:**
- Mengubah `app/admin/venues/[slug]/page.tsx` untuk mengambil data venue dari API Redux.
- Mengubah `CourtTable` menjadi Client Component dan menggunakan `useGetVenueCourtsQuery()`.
- Menghubungkan `CourtFormDialog` ke API via `useCreateCourtMutation`.
- Mapping field `AdminCourt` dari database ke kolom tabel court.

**Out of Scope:**
- Halaman publik venue (`/venues/[slug]`) — masih menggunakan `lib/venue-detail.ts`.
- Fitur edit dan delete court — sudah ada tombol di API tapi belum diimplementasi di UI.
- Field yang tidak ada di database (image, badge, specs, features, maxPlayers) — ditampilkan sebagai "-".

# Technical Design

### Current Implementation

**Halaman detail venue (`app/admin/venues/[slug]/page.tsx`):**
- Server Component yang mengambil data dari `getVenueDetail(slug)` di `lib/venue-detail.ts` (hardcoded).
- Merender `CourtFormDialog` dan `CourtTable` per cabang olahraga (disciplines).
- `CourtTable` menerima props `courts`, `images`, `defaultPricePerHour` dari data hardcoded.

**`CourtFormDialog` (`components/admin/court-form-dialog.tsx`):**
- Client Component, form belum terhubung ke API — hanya `console.log(data)`.
- Field form: label, pricePerHour, maxPlayers, badge, image, specs, features, isOperational.

**`CourtTable` (`components/admin/court-table.tsx`):**
- Server Component, menerima props dari data hardcoded.
- Menampilkan: Foto, Nama Court, Detail (badge/specs/features), Kapasitas, Harga/Jam, Status.

**Backend API Court (sudah lengkap):**
- `GET /api/admin/venues/[slug]/courts` → `getCourtsByVenueController`
- `POST /api/admin/venues/[slug]/courts` → `createCourtController`
- `PATCH /api/admin/venues/[slug]/courts/[courtId]` → `updateCourtController`
- `DELETE /api/admin/venues/[slug]/courts/[courtId]` → `deactivateCourtController`

**Schema Court (backend):**
- `name` (wajib), `sport` (wajib), `surface` (opsional), `isIndoor` (default false), `pricePerHour` (wajib, min 10000)

**Redux API (sudah ada di `lib/redux/admin-api.ts`):**
- `useGetVenueCourtsQuery(slug)` → GET courts
- `useCreateCourtMutation()` → POST court
- `useUpdateCourtMutation()` → PATCH court
- `useDeactivateCourtMutation()` → DELETE court
- Tag invalidation: `AdminCourt` per slug

### Key Decisions
- **Client Component untuk halaman detail venue**: Karena perlu menggunakan Redux hook, halaman perlu diubah menjadi Client Component atau menggunakan pendekatan hybrid.
- **Sederhanakan form court**: Field form disesuaikan dengan field database (name, sport, surface, isIndoor, pricePerHour). Field yang tidak ada di database (badge, image, specs, features, maxPlayers) dihapus dari form.
- **Tabel court tanpa grouping per cabang olahraga**: Database court memiliki field `sport` langsung, jadi tabel bisa menampilkan semua court tanpa perlu grouping. Badge sport ditampilkan per court.
- **Field yang tidak ada di database**: Foto, badge, specs, features, kapasitas (maxPlayers) ditampilkan sebagai "-" sampai field ditambahkan ke database.

### Proposed Changes

#### 1. `app/admin/venues/[slug]/page.tsx`
- Ubah menjadi Client Component (`"use client"`).
- Gunakan `useParams()` untuk mendapatkan slug dari URL.
- Gunakan `useGetVenueCourtsQuery(slug)` untuk mengambil data court dari API.
- Hapus import `getVenueDetail` dari `lib/venue-detail.ts`.
- Tambahkan loading dan error state.
- Render `CourtTable` dan `CourtFormDialog` tanpa props data hardcoded.
- Tampilkan nama venue dari query parameter atau dari API (opsional: fetch detail venue).

#### 2. `components/admin/court-table.tsx`
- Tambahkan `"use client"` di baris pertama.
- Hapus props `courts`, `images`, `defaultPricePerHour`.
- Gunakan `useGetVenueCourtsQuery(slug)` dari context atau props slug.
- Map field `AdminCourt` ke kolom tabel:
  - `name` → Nama Court
  - `sport` → ditampilkan sebagai badge di kolom Detail
  - `surface` → ditampilkan di kolom Detail
  - `isIndoor` → ditampilkan sebagai chip "Indoor"/"Outdoor" di kolom Detail
  - `pricePerHour` → Harga/Jam (formatRupiah)
  - `isActive` → Status (Aktif/Nonaktif)
- Kolom Foto: tampilkan placeholder "Foto belum ada" (field image belum ada di database).
- Kolom Kapasitas: tampilkan "-" (field maxPlayers belum ada di database).

#### 3. `components/admin/court-form-dialog.tsx`
- Hubungkan form ke `useCreateCourtMutation`.
- Sesuaikan field form dengan schema backend:
  - `name` → Nama court (wajib)
  - `sport` → Cabang olahraga (wajib)
  - `surface` → Jenis permukaan (opsional)
  - `isIndoor` → Indoor/Outdoor switch (default false)
  - `pricePerHour` → Harga per jam (wajib, min 10000)
- Hapus field yang tidak ada di database: badge, image, specs, features, maxPlayers.
- Ubah `handleSubmit` menjadi async, kirim data ke API.
- Tambahkan error handling dan display.
- Tambahkan loading state pada tombol simpan.
- Setelah berhasil, tutup dialog dan invalidate tag `AdminCourt` untuk refresh tabel.

#### 4. `lib/redux/admin-api.ts`
- Tidak perlu perubahan — API hooks untuk court sudah lengkap.

# Delivery Steps

### ✓ Step 1: Ubah VenueTable menjadi Client Component dan hubungkan ke API
Ubah `VenueTable` agar membaca data dari database via Redux API alih-alih menerima props hardcoded.
- Ubah `VenueTable` dari Server Component menjadi Client Component ("use client").
- Ganti props `venues: VenueListing[]` dengan hook `useGetAdminVenuesQuery()` dari `lib/redux/admin-api.ts`.
- Tambahkan status loading (spinner/skeleton) dan error state.
- Map tipe `AdminVenue` dari database ke kolom-kolom tabel yang ada (nama, alamat, kota, harga, dll).

### ✓ Step 2: Sederhanakan halaman admin dan verifikasi refresh otomatis
Sederhanakan halaman admin dan pastikan refresh otomatis setelah create.
- Hapus import `venueListings` dari `lib/listings.ts` di `app/admin/venues/page.tsx`.
- Karena `VenueTable` sekarang menggunakan Redux RTK Query dengan tag invalidation, tabel akan otomatis refresh setelah create venue (sudah diatur di `createVenue` mutation dengan `invalidatesTags: ["AdminVenue"]`).
- Pastikan `VenueFormDialog` tetap berfungsi dan dialog tertutup setelah sukses.
- Verifikasi bahwa venue baru muncul di tabel setelah disimpan.

### ✓ Step 3: Ubah halaman detail venue menjadi Client Component dan hubungkan ke API court
Ubah `app/admin/venues/[slug]/page.tsx` agar mengambil data court dari database via Redux API.
- Ubah halaman menjadi Client Component ("use client").
- Gunakan `useParams()` untuk mendapatkan slug dari URL.
- Gunakan `useGetVenueCourtsQuery(slug)` untuk mengambil data court.
- Hapus import `getVenueDetail` dari `lib/venue-detail.ts`.
- Tambahkan loading dan error state.
- Render `CourtTable` dan `CourtFormDialog` tanpa props data hardcoded.

### ✓ Step 4: Ubah CourtTable menjadi Client Component dan tampilkan data dari database
Ubah `CourtTable` agar membaca data court dari Redux API.
- Tambahkan "use client" dan gunakan `useGetVenueCourtsQuery(slug)`.
- Map field AdminCourt: name, sport, surface, isIndoor, pricePerHour, isActive.
- Kolom yang tidak ada di database (foto, kapasitas, badge, specs, features) ditampilkan sebagai "-".
- Tambahkan loading dan empty state.

### ✓ Step 5: Hubungkan CourtFormDialog ke API create court
Hubungkan form dialog create court ke API via Redux.
- Gunakan `useCreateCourtMutation` untuk mengirim data ke API.
- Sesuaikan field form dengan schema backend: name, sport, surface, isIndoor, pricePerHour.
- Hapus field yang tidak ada di database: badge, image, specs, features, maxPlayers.
- Tambahkan error handling, loading state, dan invalidate tag AdminCourt setelah berhasil.

### ✓ Step 6: Tambahkan field image ke Court dan jalankan migrasi database
Tambahkan field `image` (opsional) ke model Court agar court bisa memiliki gambar.
- Tambah `image String?` di `prisma/schema.prisma`.
- Tambah validasi `image` di `modules/courts/court.schema.ts`.
- Tambah `image: true` di `modules/courts/court.repository.ts` courtSelect.
- Tambah `image` di interfaces `AdminCourt`, `CreateCourtBody`, `UpdateCourtBody` di `lib/redux/admin-api.ts`.
- Tambah input URL gambar di `components/admin/court-form-dialog.tsx`.
- Tampilkan gambar court di `components/admin/court-table.tsx` dengan fallback placeholder.
- Jalankan `prisma migrate dev` dan `prisma generate` untuk sinkronkan database.