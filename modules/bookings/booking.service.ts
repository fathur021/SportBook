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
} from "./booking.repository"; // import fungsi query dari repository
import type { CreateBookingInput } from "./booking.schema"; // mengimport

// ==Konstanta==

//jam buka
const OPEN_HOUR = 7;
//jam tutup
const CLOSE_HOUR = 23;

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
// Error HTTP 400: rentang jam main berada di luar jam operasional venue
export class InvalidOperatingHourError extends Error {
  constructor() {
    super("Jam main harus antara 07:00 sampai 23:00");
    this.name = "InvalidOperatingHourError";
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
//mengubah format jam (HH:00) exc: jam => 19 => (19:00)
function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}
//hitung jam selesai dari jam mulai + durasi exc: (19:00,2) = 21:00
function addHour(startTime: string, durationHour: number) {
  const [h, m] = startTime.split(":").map(Number); //pecah "19:00" jadi [19,0]
  const totalMinutes = h * 60 + m + durationHour * 60; // Hitung total dalam satuan menit: (jam × 60 + menit) + (durasi × 60)
  const endHour = Math.floor(totalMinutes / 60); // Kembalikan bagian jam dari total menit
  const endMinute = totalMinutes % 60; //ambil sisa menit
  return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
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
  const court = await findCourtById(prisma, courtId);
  if (!court || !court.isActive || !court.venue.isActive) {
    throw new CourtNotFoundError();
  }
  const existingBookings = await findBookingConflictList(
    prisma,
    courtId,
    playDate,
  );
  const slots = [];
  for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++) {
    const startTime = formatHour(hour);
    const endTime = formatHour(hour + 1);

    //cek slot ini bentrok dengan salah satu booking yang sudah ada atau tidak
    const isBooked = existingBookings.some((existing) =>
      isTimeOverlap(startTime, endTime, existing.startTime, existing.endTime),
    );
    slots.push({
      startTime,
      endTime,
      isBooked,
    });
  }
  return {
    court: {
      id: court.id,
      name: court.name,
      pricePerHour: court.pricePerHour,
    },
    date: playDate, // tanggal yang diperiksa
    slots, // daftar slot lengkap,
  };
}

//2. Buat Booking baru
export async function createBookingService(
  userId: string,
  input: CreateBookingInput,
) {
  const endTime = addHour(input.startTime, input.durationHour);

  if (
    input.startTime < formatHour(OPEN_HOUR) ||
    endTime > formatHour(CLOSE_HOUR)
  ) {
    throw new InvalidOperatingHourError();
  }

  if (input.playDate < todayDateString()) {
    throw new PastDateError();
  }

  return runInTransaction(async (tx) => {
    const court = await findCourtById(tx, input.courtId);

    if (!court || !court.isActive || !court.venue.isActive) {
      throw new CourtNotFoundError();
    }

    const conflicts = await findBookingConflictList(
      tx,
      input.courtId,
      input.playDate,
    );

    const hasOverlap = conflicts.some((existing) =>
      isTimeOverlap(
        input.startTime,
        endTime,
        existing.startTime,
        existing.endTime,
      ),
    );

    if (hasOverlap) {
      throw new SlotUnavailableError();
    }

    const equipmentData: {
      equipmentId: string;
      name: string;
      price: number;
      quantity: number;
      subtotal: number;
    }[] = [];

    const requestedEquipments = input.equipments ?? [];

    if (requestedEquipments.length > 0) {
      const quantityByEquipment = new Map<string, number>();

      for (const item of requestedEquipments) {
        quantityByEquipment.set(
          item.equipmentId,
          (quantityByEquipment.get(item.equipmentId) ?? 0) + item.quantity,
        );
      }

      const equipmentIds = [...quantityByEquipment.keys()];

      const equipmentRows = await findEquipmentsForBooking(
        tx,
        court.venue.id,
        equipmentIds,
      );

      if (equipmentRows.length !== equipmentIds.length) {
        throw new EquipmentUnavailableError();
      }

      for (const equipmentId of equipmentIds) {
        const equipment = equipmentRows.find((row) => row.id === equipmentId);
        const quantity = quantityByEquipment.get(equipmentId) ?? 0;

        if (!equipment || !equipment.isActive) {
          throw new EquipmentUnavailableError();
        }

        if (equipment.stock < quantity) {
          throw new EquipmentStockError(equipment.name);
        }

        equipmentData.push({
          equipmentId: equipment.id,
          name: equipment.name,
          price: equipment.price,
          quantity,
          subtotal: equipment.price * quantity,
        });
      }
    }

    const equipmentTotal = equipmentData.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    const totalPrice =
      court.pricePerHour * input.durationHour + equipmentTotal;

    return insertBooking(tx, {
      orderCode: generateOrderCode(),
      courtId: input.courtId,
      userId,
      playDate: input.playDate,
      startTime: input.startTime,
      endTime,
      durationHour: input.durationHour,
      pricePerHour: court.pricePerHour,
      totalPrice,
      notes: input.notes ?? null,
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

export class InvalidStatusTransitionError extends Error{
  constructor(){
    super("Perubahan status tidak sesuai aturan"),
    this.name = "invalidStatusTransitionError"
  }
}

// 5. Daftar semua booking (dengan filter opsional) — khusus admin
export async function listAllBookingService(
  filter: {
    status?: string;
    playDate?:string;
  }
){
  return findAllBookings(filter);
}

//6. Ubah status booking (khusus admin)
export async function updateBookingStatusService(
  BookingId:string,
  newStatus:string
){
  const booking = await findBookingById(BookingId);
  if(!booking){
    throw new BookingNotFoundError();
  }
  const allowed = ALLOWED_TRANSITIONS[booking.status]
  if(allowed.length === 0){
    throw new BookingAlreadyFinalizedError();
  }
  if(!allowed.includes(newStatus)){
     throw new InvalidStatusTransitionError();
  }
  return updateBookingStatusById(BookingId,newStatus);
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
      const availableSlots = availability.slots.filter((s) => !s.isBooked).length;
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
  identifier: { orderCode?: string; paymentId?: string, bookingId?:string },
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