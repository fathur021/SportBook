import { CourtNotFoundError } from "../courts/court.service"; // import error dari court
import {
  findBookingById,
  findBookingConflictList,
  findBookingsByUserId,
  findCourtById,
  insertBooking,
  runInTransaction,
  updateBookingStatusById,
  findCourtByIdOutsideTransaction
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
// Error HTTP 400: rentang jam main berada di luar jam operasional venue
export class InvalidOperatingHourError extends Error {
  constructor() {
    super("Jam main harus antara 07:00 sampai 23:00");
    this.name = "InvalidOperatingHourError";
  }
}
// Error HTTP 400: user mencoba booking tanggal yang sudah lewat
export class PasteDateError extends Error {
  constructor() {
    super("Tidak bisa membuat booking untuk tanggal yang sudah lewat");
    this.name = "PasteDateError";
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
export async function getAvailabilityService(courtId:string, playDate:string) {
    
}
