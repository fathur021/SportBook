import { prisma } from "@/lib/prisma";
import { CourtNotFoundError } from "../courts/court.service"; // import error dari court
import {
  findBookingById,
  findBookingConflictList,
  findBookingsByUserId,
  findCourtById,
  findEquipmentsForBooking,
  insertBooking,
  runInTransaction,
  updateBookingStatusById,
  findAllBookings,
  findBookingByOrderCode,
  findBookingByPaymentId,
  cancelExpiredBookings,
} from "./booking.repository"; // import fungsi query dari repository
import type { CreateBookingInput } from "./booking.schema"; // mengimport
import { getSettingsService } from "../settings/settings.service";

// ==Konstanta==

// Daftar status yang masih "menahan" slot (booking yang memblokir jadwal)
const ACTIVE_STATUSES = ["PENDING", "CONFIRMED"];

// == costom error ==

// Error HTTP 409: slot yang diminta sudah dipesan orang lain
export class SlotUnavailableError extends Error {
  constructor() {
    super("Slot waktu tersebut sudah di pesan, silahkan pilih jam lain");
    this.name = "SlotUnavailableError";
  }
}
// Error HTTP 409: equipment tidak ada, non-aktif, atau bukan milik venue ini
export class EquipmentUnavailableError extends Error {
  constructor() {
    super("Equipment tidak ditemukan atau sedang tidak tersedia");
    this.name = "EquipmentUnavailableError";
  }
}
// Error HTTP 409: stok equipment tidak mencukupi jumlah yang diminta
export class EquipmentStockError extends Error {
  constructor(name: string) {
    super(`Stok ${name} tidak mencukupi`);
    this.name = "EquipmentStockError";
  }
}
// Error saat jam main keluar dari jam operasional.
export class InvalidOperatingHourError extends Error {
  // Terima jam buka dan tutup supaya pesannya dinamis.
  constructor(openTime: string, closeTime: string) {
    // Contoh: "Jam main harus di antara 08:00 dan 22:00".
    super(`Jam main harus di antara ${openTime} dan ${closeTime}`);
    // Nama error.
    this.name = "InvalidOperatingHourError";
  }
}

// Error saat durasi di luar batas.
export class InvalidSessionDurationError extends Error {
  constructor(minHours: number, maxHours: number) {
    // Contoh: "Durasi sesi harus antara 2 sampai 4 jam".
    super(`Durasi sesi harus antara ${minHours} sampai ${maxHours} jam`);
    // Nama error.
    this.name = "InvalidSessionDurationError";
  }
}

// Error saat tanggal booking tidak diperbolehkan.
export class BookingDateNotAllowedError extends Error {
  constructor(message: string) {
    // Pesan dikirim dari pemanggil.
    super(message);
    // Nama error.
    this.name = "BookingDateNotAllowedError";
  }
}

// Error HTTP 400: user mencoba booking tanggal yang sudah lewat
export class PastDateError extends Error {
  constructor() {
    super("Tidak bisa membuat booking untuk tanggal yang sudah lewat");
    this.name = "PastDateError";
  }
}
// Error HTTP 404: booking dengan ID tersebut tidak ada di database
export class BookingNotFoundError extends Error {
  constructor() {
    super("Booking tidak ditemukan");
    this.name = "BookingNotFoundError";
  }
}

// Error HTTP 403: booking ada, tapi bukan milik user yang sedang login
export class BookingAccessDeniedError extends Error {
  constructor() {
    super("Anda tidak memiliki akses ke booking ini");
    this.name = "BookingAccessDeniedError";
  }
}
// Error HTTP 409: booking sudah final (dibatalkan/selesai) sehingga tidak bisa diubah lagi
export class BookingAlreadyFinalizedError extends Error {
  constructor() {
    super(
      "Booking yang sudah di batalkan atau selelesai tidak bisa di ubah lagi",
    );
    this.name = "BookingAlreadyFinalizedError";
  }
}

// === Helper ===
function toMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

// Mengubah menit menjadi jam.
function toTime(totalMinutes: number) {
  // Math.floor membulatkan ke bawah.
  // 450 / 60 = 7.
  const hour = Math.floor(totalMinutes / 60);

  // Sisa bagi menghasilkan menit.
  // 450 % 60 = 30.
  const minute = totalMinutes % 60;

  // padStart menambah nol di depan supaya selalu dua digit.
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

// Menghitung tanggal beberapa hari setelah hari ini.
function dateAfterDays(days: number) {
  // Ambil waktu sekarang.
  const now = new Date();

  // Buat tanggal baru dengan hari ditambah.
  // Ini otomatis pindah bulan kalau perlu.
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + days,
  );

  // Ambil tahun.
  const year = date.getFullYear();

  // Ambil bulan, tambah 1 karena bulan dimulai dari 0.
  const month = String(date.getMonth() + 1).padStart(2, "0");

  // Ambil tanggal.
  const day = String(date.getDate()).padStart(2, "0");

  // Gabungkan menjadi "YYYY-MM-DD".
  return `${year}-${month}-${day}`;
}

//Mengambil tanggal hari ini dalam format "YYYY-MM-DD" sesuai waktu lokal server
function todayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  // Rangkai semua menjadi "2026-10-30"
  return `${year}-${month}-${date}`;
}

//membuat kode pesan unik, contoh: "SPB-17613423423-K3FA"
function generateOrderCode() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `SPB-${timestamp}-${random}`;
}

//mencegah apakah 2 rentang waktu saling tumpang tindih (bentrok)
// Rentang baru bentrok jika: mulai-baru SEBELUM selesai-lama DAN selesai-baru SETELAH mulai-lama
function isTimeOverlap(
  newStart: string,
  newEnd: string,
  existingStart: string,
  existingEnd: string,
) {
  return newStart < existingEnd && newEnd > existingStart;
}

// === service ===

//1. cek slot
export async function getAvailabilityService(
  courtId: string,
  playDate: string,
) {
  // Cari lapangan di database.
  const court = await findCourtById(prisma, courtId);

  // Tolak kalau tidak ada atau non-aktif.
  // Lapangan dianggap tidak ada kalau venue-nya juga non-aktif.
  if (!court || !court.isActive || !court.venue.isActive) {
    throw new CourtNotFoundError();
  }

  // Ambil pengaturan global.
  const settings = await getSettingsService();

  // Ubah batas waktu pembayaran dari menit ke milidetik.
  // Contoh: 10 menit x 60 x 1000 = 600.000 milidetik.
  const holdMs = settings.paymentWindowMinutes * 60 * 1000;
  // Lepas slot dari booking yang hold-nya sudah habis.
  await cancelExpiredBookings(holdMs);

  // Jam buka dalam menit.
  const openingMinutes = toMinutes(settings.openTime);

  // Jam tutup dalam menit.
  const closingMinutes = toMinutes(settings.closeTime);

  // Ambil semua booking yang masih aktif pada tanggal itu.
  const existingBookings = await findBookingConflictList(
    prisma,
    courtId,
    playDate,
  );

  // Siapkan wadah slot.
  const slots = [];

  // Mulai dari jam buka.
  // Selama slot 1 jam masih muat sebelum jam tutup, teruskan.
  // Setiap putaran tambah 60 menit.
  for (
    let startMinutes = openingMinutes;
    startMinutes + 60 <= closingMinutes;
    startMinutes += 60
  ) {
    // Jam mulai slot.
    const startTime = toTime(startMinutes);

    // Jam selesai slot.
    const endTime = toTime(startMinutes + 60);

    // Cek apakah slot ini bentrok dengan booking lain.
    const isBooked = existingBookings.some((existing) =>
      // some = true kalau minimal satu booking bentrok.
      isTimeOverlap(startTime, endTime, existing.startTime, existing.endTime),
    );

    // Simpan slot.
    slots.push({ startTime, endTime, isBooked });
  }

  // Kembalikan data ke pemanggil.
  return {
    court: {
      id: court.id,
      name: court.name,
      pricePerHour: court.pricePerHour,
    },
    date: playDate,
    slots,
  };
}

//2. Buat Booking baru
export async function createBookingService(
  // ID user yang sedang login, dikirim dari controller.
  userId: string,
  // Data booking yang sudah lolos validasi Zod.
  input: CreateBookingInput,
) {
  // Ambil pengaturan global sekali di awal.
  // Isinya jam operasional, batas durasi, dan aturan tanggal.
  const settings = await getSettingsService();

  // Cek apakah durasi terlalu pendek.
  // < artinya lebih kecil dari batas minimal.
  if (
    input.durationHour < settings.minSessionHours ||
    // || artinya "atau". Cukup salah satu terpenuhi, langsung ditolak.
    input.durationHour > settings.maxSessionHours
  ) {
    // Lempar error berisi batas yang berlaku sekarang.
    throw new InvalidSessionDurationError(
      settings.minSessionHours,
      settings.maxSessionHours,
    );
  }

  // Ubah jam mulai menjadi menit.
  // Contoh: "08:00" menjadi 480.
  const startMinutes = toMinutes(input.startTime);

  // Hitung jam selesai dalam menit.
  // durationHour x 60 mengubah jam menjadi menit.
  // Contoh: mulai 480 + 2 x 60 = 600.
  const endMinutes = startMinutes + input.durationHour * 60;

  // Jam buka dalam menit.
  const openingMinutes = toMinutes(settings.openTime);

  // Jam tutup dalam menit.
  const closingMinutes = toMinutes(settings.closeTime);

  // Mulai sebelum jam buka berarti ditolak.
  // Selesai setelah jam tutup juga ditolak.
  if (startMinutes < openingMinutes || endMinutes > closingMinutes) {
    // Pesan error memakai jam sebenarnya dari pengaturan.
    throw new InvalidOperatingHourError(settings.openTime, settings.closeTime);
  }

  // Ubah jam selesai kembali ke teks "HH:MM".
  // Contoh: 600 menjadi "10:00".
  // Nilai ini yang nanti disimpan ke database.
  const endTime = toTime(endMinutes);

  // Ambil tanggal hari ini dari server, format "YYYY-MM-DD".
  const today = todayDateString();

  // Tanggal yang sudah lewat selalu ditolak.
  // Perbandingan teks tanggal berformat YYYY-MM-DD sama hasilnya
  // dengan perbandingan tanggal biasa.
  if (input.playDate < today) {
    throw new PastDateError();
  }

  // Kalau admin mematikan booking hari yang sama,
  // dan tanggal yang dipilih adalah hari ini, tolak.
  if (!settings.allowSameDayBooking && input.playDate === today) {
    throw new BookingDateNotAllowedError(
      "Booking untuk hari ini sedang tidak dibuka",
    );
  }

  // Hitung tanggal paling jauh yang boleh dipesan.
  // Contoh: hari ini + 30 hari.
  const lastAllowedDate = dateAfterDays(settings.maxAdvanceDays);

  // Tolak kalau tanggal yang dipilih melewati batas itu.
  if (input.playDate > lastAllowedDate) {
    throw new BookingDateNotAllowedError(
      `Booking hanya bisa dilakukan maksimal ${settings.maxAdvanceDays} hari ke depan`,
    );
  }

  // Buka transaksi database.
  // Semua perintah di dalamnya dianggap satu kesatuan.
  // Kalau ada satu error, semua perubahan dibatalkan.
  return runInTransaction(async (tx) => {
    // tx adalah koneksi khusus transaksi, bukan prisma biasa.
    // Cari lapangan berdasarkan ID.
    const court = await findCourtById(tx, input.courtId);

    // Lapangan harus ada.
    // Lapangan juga harus aktif.
    // Venue pemilik lapangan juga harus aktif.
    if (!court || !court.isActive || !court.venue.isActive) {
      throw new CourtNotFoundError();
    }

    // Lepas slot yang hold-nya sudah habis sebelum cek bentrok.
    // tx dipakai supaya ikut transaksi yang sama.
    const holdMs = settings.paymentWindowMinutes * 60 * 1000;
    await cancelExpiredBookings(holdMs, tx);

    // Ambil semua booking aktif pada lapangan dan tanggal yang sama.
    const conflicts = await findBookingConflictList(
      tx,
      input.courtId,
      input.playDate,
    );

    // Cek apakah ada booking lain yang jamnya bertabrakan.
    // some = bernilai true kalau minimal satu bentrok.
    const hasOverlap = conflicts.some((existing) =>
      // isTimeOverlap membandingkan dua rentang jam.
      isTimeOverlap(
        input.startTime,
        endTime,
        existing.startTime,
        existing.endTime,
      ),
    );

    // Kalau bentrok, batalkan transaksi dan kirim error 409.
    if (hasOverlap) {
      throw new SlotUnavailableError();
    }

    // Siapkan wadah untuk equipment yang dipilih.
    // Tipe ini harus sama dengan yang diminta insertBooking.
    const equipmentData: {
      equipmentId: string;
      name: string;
      price: number;
      quantity: number;
      subtotal: number;
    }[] = [];

    // Kalau input tidak mengirim equipment, pakai array kosong.
    // ?? artinya "kalau kiri null/undefined, pakai kanan".
    const requestedEquipments = input.equipments ?? [];

    // Proses equipment hanya kalau ada yang dipilih.
    if (requestedEquipments.length > 0) {
      // Map dipakai untuk menggabungkan equipment yang sama.
      // Contoh: dua baris "bola" menjadi satu dengan jumlah 3.
      const quantityByEquipment = new Map<string, number>();

      // Telusuri setiap equipment yang diminta.
      for (const item of requestedEquipments) {
        // Ambil jumlah lama, kalau belum ada anggap 0.
        // Lalu tambah dengan jumlah yang diminta sekarang.
        quantityByEquipment.set(
          item.equipmentId,
          (quantityByEquipment.get(item.equipmentId) ?? 0) + item.quantity,
        );
      }

      // Ambil semua ID equipment yang unik.
      // keys() mengembalikan daftar kunci Map.
      // [...] mengubahnya menjadi array biasa.
      const equipmentIds = [...quantityByEquipment.keys()];

      // Ambil data equipment dari database.
      // Hanya equipment milik venue ini yang diambil.
      const equipmentRows = await findEquipmentsForBooking(
        tx,
        court.venue.id,
        equipmentIds,
      );

      // Jumlah data yang ditemukan harus sama dengan jumlah ID yang diminta.
      // Kalau beda, berarti ada equipment yang tidak ada atau bukan milik venue.
      if (equipmentRows.length !== equipmentIds.length) {
        throw new EquipmentUnavailableError();
      }

      // Telusuri setiap equipment yang diminta.
      for (const equipmentId of equipmentIds) {
        // Cari baris equipment yang cocok.
        const equipment = equipmentRows.find((row) => row.id === equipmentId);

        // Ambil jumlah yang diminta.
        const quantity = quantityByEquipment.get(equipmentId) ?? 0;

        // Tolak kalau equipment tidak ditemukan atau sedang non-aktif.
        if (!equipment || !equipment.isActive) {
          throw new EquipmentUnavailableError();
        }

        // Tolak kalau stok lebih sedikit dari jumlah yang diminta.
        if (equipment.stock < quantity) {
          throw new EquipmentStockError(equipment.name);
        }

        // Simpan data equipment untuk dimasukkan ke booking.
        equipmentData.push({
          // ID equipment asli.
          equipmentId: equipment.id,
          // Nama disalin supaya riwayat booking tetap benar
          // walaupun nama equipment berubah nanti.
          name: equipment.name,
          // Harga disalin dengan alasan yang sama.
          price: equipment.price,
          // Jumlah yang dipesan.
          quantity,
          // subtotal = harga x jumlah.
          subtotal: equipment.price * quantity,
        });
      }
    }

    // Jumlahkan semua subtotal equipment.
    // reduce menjalankan penjumlahan untuk setiap item.
    // Nilai awal 0.
    const equipmentTotal = equipmentData.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    // Subtotal = sewa lapangan + equipment.
    const courtTotal = court.pricePerHour * input.durationHour;
    const subtotal = courtTotal + equipmentTotal;

    // Pajak dihitung dari subtotal, lalu dibulatkan ke rupiah terdekat.
    // Contoh: 200.000 x 11 / 100 = 22.000.
    const taxAmount = Math.round((subtotal * settings.taxPercent) / 100);

    // Total yang ditagih sudah termasuk pajak.
    const totalPrice = subtotal + taxAmount;

    // Simpan booking ke database.
    // insertBooking mengembalikan data booking yang baru dibuat.
    return insertBooking(tx, {
      // Kode pesanan unik, contoh SPB-17613423423-K3FA.
      orderCode: generateOrderCode(),
      // ID lapangan.
      courtId: input.courtId,
      // Pemilik booking.
      userId,
      // Tanggal main.
      playDate: input.playDate,
      // Jam mulai.
      startTime: input.startTime,
      // Jam selesai hasil perhitungan di atas.
      endTime,
      // Durasi dalam jam.
      durationHour: input.durationHour,
      // Harga per jam saat booking dibuat.
      pricePerHour: court.pricePerHour,
      // Simpan tarif dan nominal pajak saat booking dibuat.
      taxPercent: settings.taxPercent,
      taxAmount,
      // Total yang harus dibayar, sudah termasuk pajak.
      totalPrice,
      // Catatan, kalau kosong simpan null.
      notes: input.notes ?? null,
      // Daftar equipment yang dipesan.
      equipments: equipmentData,
    });
  });
}
// 3. Daftar Boking milik user
export async function listMyBookingService(userId: string) {
  return findBookingsByUserId(userId);
}

//4. batalkan booking
export async function cancelBookingService(userId: string, bookingId: string) {
  const booking = await findBookingById(bookingId);
  if (!booking) {
    throw new BookingNotFoundError();
  }
  if (booking.userId !== userId) {
    throw new BookingAccessDeniedError();
  }
  if (!ACTIVE_STATUSES.includes(booking.status)) {
    throw new BookingAlreadyFinalizedError();
  }
  return updateBookingStatusById(bookingId, "CANCELLED");
}

//Bagian booking untuk admin
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"], // menunggu → dikonfirmasi / ditolak
  CONFIRMED: ["COMPLETED", "CANCELLED"], // dikonfirmasi → selesai / dibatalkan
  CANCELLED: [], // final, tidak bisa berubah lagi
  COMPLETED: [], // final, tidak bisa berubah lagi
};

export class InvalidStatusTransitionError extends Error {
  constructor() {
    (super("Perubahan status tidak sesuai aturan"),
      (this.name = "invalidStatusTransitionError"));
  }
}

// 5. Daftar semua booking (dengan filter opsional) — khusus admin
export async function listAllBookingService(filter: {
  status?: string;
  playDate?: string;
}) {
  return findAllBookings(filter);
}

//6. Ubah status booking (khusus admin)
export async function updateBookingStatusService(
  BookingId: string,
  newStatus: string,
) {
  const booking = await findBookingById(BookingId);
  if (!booking) {
    throw new BookingNotFoundError();
  }
  const allowed = ALLOWED_TRANSITIONS[booking.status];
  if (allowed.length === 0) {
    throw new BookingAlreadyFinalizedError();
  }
  if (!allowed.includes(newStatus)) {
    throw new InvalidStatusTransitionError();
  }
  return updateBookingStatusById(BookingId, newStatus);
}

//7. Slot tersedia per tanggal dalam rentang (untuk calendar view)
function toDateKeyLocal(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const date = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

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
    dates.push(toDateKeyLocal(d));
  }

  // Untuk setiap tanggal, hitung slot tersedia
  const results = [];
  for (const date of dates) {
    try {
      const availability = await getAvailabilityService(courtId, date);
      const availableSlots = availability.slots.filter(
        (s) => !s.isBooked,
      ).length;
      results.push({ date, slots: availableSlots });
    } catch {
      // Jika error (seharusnya tidak terjadi karena court sudah divalidasi), skip
      results.push({ date, slots: 0 });
    }
  }

  return results;
}

//8. Ambil detail booking untuk halaman tiket/receipt (checkout/success)
export async function getBookingReceiptService(
  identifier: { orderCode?: string; paymentId?: string; bookingId?: string },
  userId: string,
  isAdmin: boolean,
) {
  let booking = null;

  if (identifier.bookingId) {
    booking = await findBookingById(identifier.bookingId);
  } else if (identifier.orderCode) {
    booking = await findBookingByOrderCode(identifier.orderCode);
  } else if (identifier.paymentId) {
    booking = await findBookingByPaymentId(identifier.paymentId);
  }
  if (!booking) {
    return null;
  }

  // Admin bisa melihat booking siapa saja
  if (!isAdmin && booking.userId !== userId) {
    return null;
  }

  return booking;
}
