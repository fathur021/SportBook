// Mengimpor namespace Prisma untuk menangani kode error bawaan Prisma Client
import { Prisma } from "@/lib/generated/prisma/client";
// Mengimpor fungsi-fungsi query database dari repository court
import {
  createCourt,
  deactivateCourtById,
  deleteCourtById,
  findCourtsByVenueId,
  findVenueBySlug,
  updateCourtById,
} from "./court.repository";
// Mengimpor tipe data TypeScript dari schema
import type { CreateCourtInput, UpdateCourtInput } from "./court.schema";
// Mengimpor custom error dari modul venues jika slug venue tidak ditemukan
import { VenueNotFoundError } from "../venues/venue.service";

// Definisi custom class error saat lapangan tidak ditemukan di database (HTTP 404)
export class CourtNotFoundError extends Error {
  constructor() {
    super("Lapangan tidak ditemukan"); // Pesan error default
    this.name = "CourtNotFoundError"; // Nama error untuk pengecekan instanceof
  }
}

// Definisi custom class error saat terjadi duplikasi nama lapangan di satu venue (HTTP 409)
export class CourtNameConflictError extends Error {
  constructor() {
    super("Nama lapangan sudah digunakan di venue ini"); // Pesan error duplikasi
    this.name = "CourtNameConflictError"; // Nama error untuk pengecekan instanceof
  }
}

// 1. Service: Mengambil semua daftar lapangan di suatu venue berdasarkan slug
export async function listCourtsByVenueSlugService(venueSlug: string) {
  // Mencari data venue terlebih dahulu untuk mendapatkan ID-nya
  const venue = await findVenueBySlug(venueSlug);
  // Jika venue dengan slug tersebut tidak ditemukan, lempar error
  if (!venue) {
    throw new VenueNotFoundError();
  }
  // Jika venue ditemukan, ambil seluruh daftar lapangan berdasarkan venueId
  return findCourtsByVenueId(venue.id);
}

// 2. Service: Menambahkan lapangan baru ke dalam suatu venue
export async function createCourtService(
  venueSlug: string, // Parameter slug venue tujuan
  input: CreateCourtInput, // Data lapangan yang sudah divalidasi oleh Zod
) {
  // Pastikan venue tujuan benar-benar ada di database
  const venue = await findVenueBySlug(venueSlug);
  // Jika venue tidak ada, gagalkan proses dengan melempar error
  if (!venue) {
    throw new VenueNotFoundError();
  }
  try {
    // Eksekusi fungsi createCourt di repository menggunakan venue.id dan input
    return await createCourt(venue.id, input);
  } catch (error) {
    // Tangani error dari Prisma ketika melanggar aturan unique (misal: @@unique([venueId, name]))
    // P2002 adalah kode Prisma untuk pelanggaran unique constraint
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new CourtNameConflictError();
    }
    // Jika bukan error P2002, lempar kembali error asli ke layer atasnya (controller)
    throw error;
  }
}

// 3. Service: Memperbarui data lapangan yang sudah ada
export async function updateCourtService(
  courtId: string, // ID lapangan yang akan diubah
  input: UpdateCourtInput, // Data perubahan
) {
  try {
    // Eksekusi update data di repository
    return await updateCourtById(courtId, input);
  } catch (error) {
    // P2025 adalah kode Prisma saat record yang ingin diupdate tidak ditemukan di database
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new CourtNotFoundError();
    }
    // P2002 adalah kode Prisma jika nama baru yang dimasukkan ternyata sudah dipakai di venue tersebut
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new CourtNameConflictError();
    }
    // Lempar error jika terjadi kesalahan lain yang tidak terduga
    throw error;
  }
}

// 4. Service: Menonaktifkan lapangan (Soft Delete)
export async function deactivateCourtService(courtId: string) {
  try {
    // Eksekusi pengubahan isActive menjadi false di repository
    return await deactivateCourtById(courtId);
  } catch (error) {
    // Jika record lapangan dengan ID tersebut tidak ditemukan di database
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new CourtNotFoundError();
    }
    // Lempar error jika ada masalah lain
    throw error;
  }
}

// 5. Service: Menghapus lapangan secara permanen (Hard Delete)
export async function deleteCourtService(courtId: string) {
  try {
    // Eksekusi penghapusan data court dari repository
    return await deleteCourtById(courtId);
  } catch (error) {
    // Jika record lapangan dengan ID tersebut tidak ditemukan di database
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new CourtNotFoundError();
    }
    // Lempar error jika ada masalah lain
    throw error;
  }
}
