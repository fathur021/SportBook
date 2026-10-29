// Mengimpor koneksi database Prisma Client singleton
import { prisma } from "@/lib/prisma";
// Mengimpor tipe TypeScript input yang sudah divalidasi oleh Zod schema
import type { CreateCourtInput, UpdateCourtInput } from "./court.schema";

// Objek reusable untuk menentukan kolom (fields) apa saja yang diambil dari tabel Court
const courtSelect = {
  id: true, // Mengambil ID unik lapangan
  venueId: true, // Mengambil ID venue pemilik lapangan (Foreign Key)
  name: true, // Mengambil nama lapangan
  sport: true, // Mengambil cabang olahraga
  surface: true, // Mengambil jenis lantai/permukaan
  isIndoor: true, // Mengambil status indoor/outdoor
  pricePerHour: true, // Mengambil tarif sewa per jam
  isActive: true, // Mengambil status aktif (true/false) untuk soft delete
  createdAt: true, // Mengambil timestamp saat data dibuat
  updatedAt: true, // Mengambil timestamp saat data terakhir diubah
};

// 1. Mencari data venue berdasarkan slug (digunakan untuk mendapatkan venueId)
export function findVenueBySlug(slug: string) {
  // Menjalankan query Prisma mencari satu record unik pada tabel Venue
  return prisma.venue.findUnique({
    where: { slug }, // Klausa pencarian WHERE slug = slug
    select: { id: true, name: true, slug: true }, // Hanya ambil id, name, dan slug saja demi efisiensi
  });
}

// 2. Mengambil semua data lapangan yang terdaftar di suatu venue
export function findCourtsByVenueId(venueId: string) {
  // Query Prisma findMany untuk mengambil daftar banyak record Court
  return prisma.court.findMany({
    where: { venueId }, // Filter berdasarkan venueId tertentu
    orderBy: { name: "asc" }, // Mengurutkan nama lapangan dari A ke Z (ascending)
    select: courtSelect, // Mengembalikan kolom-kolom yang sudah didefinisikan di courtSelect
  });
}

// 3. Menambahkan data lapangan baru ke dalam database (Create)
export function createCourt(venueId: string, data: CreateCourtInput) {
  // Query Prisma create untuk memasukkan data baru ke tabel Court
  return prisma.court.create({
    data: {
      venueId, // Mengisi kolom foreign key relasi ke venue
      ...data, // Memasukkan seluruh data dari request (name, sport, pricePerHour, dll.)
    },
    select: courtSelect, // Kembalikan data yang baru saja dibuat sesuai format courtSelect
  });
}

// 4. Memperbarui data lapangan berdasarkan ID lapangan (Update)
export function updateCourtById(id: string, data: UpdateCourtInput) {
  // Query Prisma update untuk mengubah baris data yang sudah ada
  return prisma.court.update({
    where: { id }, // Menargetkan baris berdasarkan ID unik lapangan
    data, // Data perubahan (hanya kolom yang dikirim yang akan diperbarui)
    select: courtSelect, // Mengembalikan data hasil pembaruan
  });
}

// 5. Menonaktifkan status lapangan / Soft Delete (Delete)
export function deactivateCourtById(id: string) {
  // Query Prisma update untuk mengubah isActive menjadi false tanpa menghapus baris dari database
  return prisma.court.update({
    where: { id }, // Menargetkan baris berdasarkan ID lapangan
    data: { isActive: false }, // Mengubah status aktif menjadi false
    select: courtSelect, // Mengembalikan record yang telah dinonaktifkan
  });
}
