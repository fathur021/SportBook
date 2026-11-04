---
sessionId: session-261103-212654-1060
---

# Overview & Scope

### Tujuan
Menghubungkan form dialog **Create Venue** dan **Create Court** yang sudah ada di frontend ke Redux RTK Query mutations yang sudah siap, sehingga data benar-benar terkirim ke backend dan tabel ter-update otomatis.

### Apa yang akan diubah
- **`venue-form-dialog.tsx`**: Ganti `console.log` dengan `useCreateVenueMutation`, kirim data ke API, refresh tabel otomatis.
- **`court-form-dialog.tsx`**: Ganti `console.log` dengan `useCreateCourtMutation`, kirim data ke API, refresh tabel otomatis.
- **`app/admin/venues/page.tsx`**: Ganti data dummy dengan `useGetAdminVenuesQuery` agar tabel menampilkan data real.
- **`app/admin/venues/[slug]/page.tsx`**: Ganti data dummy dengan `useGetVenueCourtsQuery` agar court table menampilkan data real.
- **Table components**: Update agar menerima tipe data dari API (`AdminVenue[]`, `AdminCourt[]`).

### Apa yang tidak termasuk
- Edit/Update form (UI belum ada).
- Delete/Deactivate (tombol ada tapi belum terhubung).
- Toast notification (akan gunakan error text sederhana di form).
- Field yang tidak ada di backend (seperti sportTag, specs, features di form saat ini akan di-skip saat mapping).

# Technical Design

### Current Implementation

**Form Dialogs** (sudah ada, belum connect ke API):
- `venue-form-dialog.tsx`: Field name, slug, sportTag, address, pricePerHour, image, specs. Saat ini hanya `console.log`.
- `court-form-dialog.tsx`: Field label, pricePerHour, maxPlayers, badge, image, specs, features, isOperational. Saat ini hanya `console.log`.

**Pages** (data dummy):
- `app/admin/venues/page.tsx`: Server component, `venueListings` dari `lib/listings`.
- `app/admin/venues/[slug]/page.tsx`: Server component, `getVenueDetail` dari `lib/venue-detail`.

**Redux** (sudah siap):
- `useCreateVenueMutation` — POST `/api/admin/venues`
- `useCreateCourtMutation` — POST `/api/admin/venues/{slug}/courts`
- `useGetAdminVenuesQuery` — GET `/api/admin/venues`
- `useGetVenueCourtsQuery` — GET `/api/admin/venues/{slug}/courts`

### Key Decisions

1. **Field mapping** — Form field tidak 1:1 dengan API. Perlu mapping:
   - Venue: `name`→`name`, `slug`→`slug`, `address`→`address`, `image`→`coverImage`. Field sportTag, pricePerHour, specs tidak ada di venue API → di-skip.
   - Court: `label`→`name`, `pricePerHour`→`pricePerHour`. Field `sport` (required di backend) perlu ditambahkan di form. `isOperational`→`isIndoor`.

2. **Pages jadi client component** — Saat ini server component dengan data dummy. Harus convert ke client component agar bisa pakai RTK Query hooks.

3. **CourtFormDialog perlu `slug` prop** — Mutation `createCourt` memerlukan slug venue. Parent page harus pass slug.

4. **Error handling** — Tampilkan error message dari API response sebagai text merah di bawah form.

### Proposed Changes

#### 1. `venue-form-dialog.tsx`
- Import `useCreateVenueMutation`.
- Di `handleSubmit`: parse FormData → `CreateVenueBody`, panggil mutation.
- Tambah state `error` untuk error message.
- Tutup dialog on success.

#### 2. `court-form-dialog.tsx`
- Tambah prop `slug: string`.
- Import `useCreateCourtMutation`.
- Tambah input field `sport` (required di backend).
- Di `handleSubmit`: parse FormData → `CreateCourtBody`, panggil mutation.
- Error handling sama seperti venue.

#### 3. `app/admin/venues/page.tsx`
- Convert ke client component ("use client").
- Pakai `useGetAdminVenuesQuery`.
- Loading state dan error state.
- Update `VenueTable` untuk `AdminVenue[]`.

#### 4. `app/admin/venues/[slug]/page.tsx`
- Convert ke client component.
- `useParams()` untuk slug.
- Pakai `useGetVenueCourtsQuery(slug)`.
- Update `CourtTable` untuk `AdminCourt[]`.

#### 5. Table components
- `VenueTable`: Props dari `VenueListing[]` ke `AdminVenue[]`, map field.
- `CourtTable`: Props dari discipline courts ke `AdminCourt[]`, map field.

# Delivery Steps

###   Step 1: Connect VenueFormDialog to createVenue mutation
VenueFormDialog mengirim data ke API dan menutup dialog setelah sukses.
- Import `useCreateVenueMutation` di `venue-form-dialog.tsx`.
- Transform FormData di `handleSubmit` menjadi `CreateVenueBody` (map: name, slug, address, coverImage dari image field, city opsional).
- Panggil mutation, tutup dialog on success, tampilkan error text on failure.
- Field yang tidak ada di API (sportTag, pricePerHour, specs) di-skip saat mapping.

###   Step 2: Connect CourtFormDialog to createCourt mutation
CourtFormDialog menerima slug prop dan mengirim data ke API.
- Tambah prop `slug: string` di CourtFormDialog.
- Import `useCreateCourtMutation` di `court-form-dialog.tsx`.
- Tambah input field `sport` (required oleh backend) di form.
- Transform FormData: label→name, pricePerHour→pricePerHour, isOperational→isIndoor.
- Panggil mutation dengan `{ slug, body }`, tutup dialog on success.
- Update caller di `app/admin/venues/[slug]/page.tsx` untuk pass slug prop.

###   Step 3: Convert admin venues page to use Redux query
Halaman admin venues menampilkan data real dari API, bukan dummy.
- Convert `app/admin/venues/page.tsx` ke client component.
- Import dan panggil `useGetAdminVenuesQuery`.
- Ganti `venueListings` dengan data dari query.
- Tambah loading state (skeleton atau spinner) dan error state.
- Update `VenueTable` untuk menerima `AdminVenue[]` dan map field (name, address, city, dll).

###   Step 4: Convert venue detail page to use Redux query
Halaman detail venue menampilkan courts real dari API.
- Convert `app/admin/venues/[slug]/page.tsx` ke client component.
- Gunakan `useParams()` dari `next/navigation` untuk dapat slug.
- Import dan panggil `useGetVenueCourtsQuery(slug)`.
- Ganti struktur disciplines/courts dengan flat list dari `AdminCourt[]`.
- Update `CourtTable` untuk menerima `AdminCourt[]` dan map field (name, sport, pricePerHour, isIndoor).