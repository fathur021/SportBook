---
sessionId: session-261107-203806-memx
---

# Technical Design

### Current Implementation

- **`lib/availability.ts`** memanggil `getCourtAvailabilityRangeService(courtId, startDate, endDate)` dari `booking.service.ts`, tetapi fungsi tersebut **belum pernah diimplementasikan**.
- **`lib/booking-dates.ts`** mendefinisikan tipe data yang diharapkan:
  - `DayAvailability = { slots: number; maintenance?: boolean }`
  - `AvailabilityByDate = Record<string, DayAvailability>`
- `lib/availability.ts` mengharapkan `getCourtAvailabilityRangeService` mengembalikan array dengan format `{ date: string, slots: number }` per tanggal.
- **`booking.service.ts`** sudah memiliki `getAvailabilityService(courtId, playDate)` yang mengembalikan detail slot per jam untuk **satu tanggal**.

### Key Decisions

- `getCourtAvailabilityRangeService` akan memanggil `getAvailabilityService` untuk setiap tanggal dalam rentang, lalu menghitung jumlah slot tersedia (`slots` yang `isBooked === false`).
- Mengikuti pola eksisting: menggunakan helper yang sudah ada (`findCourtById`, `OPEN_HOUR`, `CLOSE_HOUR`) dan mengembalikan data yang sesuai dengan tipe `DayAvailability`.

### Proposed Changes

**`modules/bookings/booking.service.ts`** — Tambah fungsi baru:

```typescript
export async function getCourtAvailabilityRangeService(
  courtId: string,
  startDate: string,
  endDate: string,
) {
  // Validasi court sekali di awal
  const court = await findCourtById(prisma, courtId);
  if (!court || !court.isActive || !court.venue.isActive) {
    throw new CourtNotFoundError();
  }

  // Generate semua tanggal dalam rentang
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(toDateKeyLocal(d)); // format YYYY-MM-DD lokal
  }

  // Untuk setiap tanggal, hitung slot tersedia
  const results = [];
  for (const date of dates) {
    try {
      const availability = await getAvailabilityService(courtId, date);
      const availableSlots = availability.slots.filter(s => !s.isBooked).length;
      results.push({ date, slots: availableSlots });
    } catch {
      // Jika error (seharusnya tidak terjadi karena court sudah divalidasi), skip
      results.push({ date, slots: 0 });
    }
  }

  return results;
}
```

Dengan cara ini, fungsi baru memanfaatkan `getAvailabilityService` yang sudah ada dan teruji, sehingga tidak perlu duplikasi logika pengecekan booking.

# Delivery Steps

### ✓ Step 1: Implement getCourtAvailabilityRangeService in booking.service.ts
Tambah fungsi `getCourtAvailabilityRangeService` di `modules/bookings/booking.service.ts` yang menghitung jumlah slot tersedia per tanggal dalam rentang tertentu.

- Tambah helper `toDateKeyLocal()` untuk format tanggal lokal YYYY-MM-DD (mirip `todayDateString()` yang sudah ada).
- Validasi court sekali di awal via `findCourtById`.
- Generate semua tanggal antara `startDate` dan `endDate`.
- Untuk setiap tanggal, panggil `getAvailabilityService(courtId, date)` dan hitung slot tersedia.
- Kembalikan array `{ date, slots }` sesuai ekspektasi `lib/availability.ts`.
- Build error `Export getCourtAvailabilityRangeService doesn't exist` akan teratasi.