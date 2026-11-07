import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

// Batas waktu user menyelesaikan pembayaran sebelum slot dilepas kembali.
export const BOOKING_HOLD_MS = 10 * 60 * 1000;

// Objek reusable untuk menentukan kolom apa saja yang diambil dari tabel Booking
const bookingSelect = {
  id: true, // ID unik booking
  orderCode: true, // Kode pesanan yang ditampilkan ke user
  courtId: true, // ID lapangan
  playDate: true, // Hari main
  startTime: true, // Jam mulai
  endTime: true, // Jam selesai
  durationHour: true, // Lama sewa
  pricePerHour: true, // Harga per jam saat booking dibuat
  totalPrice: true, // Total harga
  status: true, // Status booking
  notes: true, // Catatan user
  createdAt: true, // Waktu dibuat
  // [TAMBAH] Info pembayaran, supaya status lunas ikut terkirim ke API
  payment: {
    select: {
      orderCode: true, // Kode transaksi Midtrans
      status: true, // PENDING / PAID / EXPIRE / CANCEL / DENY
      method: true, // Metode bayar dari Midtrans
      paidAt: true, // Waktu pembayaran berhasil
      amount: true, // Nominal yang dibayar, dipakai halaman tiket
    },
  },
  court: {
    // Relasi: data lapangan yang disewa
    select: {
      id: true, // ID lapangan
      name: true, // Nama lapangan
      sport: true, // Cabang olahraga
      venue: {
        // Relasi bertingkat: data venue pemilik lapangan
        select: {
          id: true, // ID venue
          name: true, // Nama venue
          slug: true, // Slug venue (untuk link)
          address: true, // Alamat venue untuk halaman tiket
          coverImage: true, // Foto venue untuk kartu MyBooking
        },
      },
    },
  },
};

//1 mencari satu lapangan berdasarkan ID (termasuk venue & status aktifnya)
export function findCourtById(
  tx: Prisma.TransactionClient | typeof prisma,
  courtId: string, // ID lapangann yang di cari
) {
  return tx.court.findUnique({
    where: { id: courtId }, // pencarian WHERE id = court
    select: {
      id: true,
      name: true,
      pricePerHour: true,
      isActive: true,
      venue: {
        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
        },
      },
    },
  });
}

//2 Mengambil semua booking aktif(pending | confirmed) milik satu lapangan di satu tanggal
export function findBookingConflictList(
  tx: Prisma.TransactionClient | typeof prisma,
  courtId: string,
  playDate: string,
) {
  return tx.booking.findMany({
    where: {
      courtId,
      playDate,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });
}

// 3. Memasukkan booking baru ke database (dipanggil di dalam transaksi)
export function insertBooking(
  tx: Prisma.TransactionClient, // Client transaksi
  data: {
    // Data booking yang sudah diproses oleh service
    orderCode: string;
    courtId: string;
    userId: string;
    playDate: string;
    startTime: string;
    endTime: string;
    durationHour: number;
    pricePerHour: number;
    totalPrice: number;
    notes?: string | null;
  },
) {
  return tx.booking.create({
    data: {
      ...data, // Sebarkan semua data yang sudah diproses
      status: "PENDING", // Booking baru selalu berstatus PENDING
    },
    select: bookingSelect, // Kembalikan data lengkap sesuai format bookingSelect
  });
}

//3b. Membatalkan booking PENDING yang sudah tidak mungkin dibayar.
// - booking tanpa pembayaran yang masa hold-nya sudah lewat
// - booking yang pembayarannya sudah dinyatakan gagal oleh Midtrans
// Booking dengan pembayaran PENDING sengaja dibiarkan agar tidak
// menabrak pembayaran yang masih diproses.
export function cancelExpiredBookings(
  tx: Prisma.TransactionClient | typeof prisma = prisma,
  now = new Date(),
) {
  const holdCutoff = new Date(now.getTime() - BOOKING_HOLD_MS);

  return tx.booking.updateMany({
    where: {
      status: "PENDING",
      OR: [
        { payment: { is: null }, createdAt: { lt: holdCutoff } },
        { payment: { status: { in: ["EXPIRE", "CANCEL", "DENY"] } } },
      ],
    },
    data: { status: "CANCELLED" },
  });
}

//4. Mengambil semua booking milik satu user (untuk halaman myBooking )
export function findBookingsByUserId(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: [
      { playDate: "desc" }, // Tanggal terbaru/terdepan di atas
      { startTime: "desc" }, // Bila tanggal sama, jam terakhir di atas
    ],
    select: bookingSelect,
  });
}

//5. Mencari satu booking berdasarkan Id
export function findBookingById(bookingId: string) {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      ...bookingSelect,
      userId: true,
    },
  });
}

//6. Mengubah status satu booking berdasarkan id
export function updateBookingStatusById(bookingId: string, status: string) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    select: bookingSelect,
  });
}

// 1a. Mencari satu lapangan berdasarkan ID (di LUAR transaksi — pemakaian normal seperti availability)
export function findCourtByIdOutsideTransaction(courtId: string) {
  return prisma.court.findUnique({
    where: { id: courtId }, // Pencarian WHERE id = courtId
    select: {
      id: true, // ID lapangan
      name: true, // Nama lapangan (ditampilkan ke user saat availability)
      pricePerHour: true, // Harga per jam (ditampilkan & dipakai hitung total)
      isActive: true, // Status aktif lapangan (soft delete)
      venue: {
        // Relasi ke venue untuk memastikan venue juga masih aktif
        select: {
          id: true, // ID venue
          name: true, // Nama venue
          slug: true, // Slug venue
          isActive: true, // Status aktif venue
        },
      },
    },
  });
}

//7 Wrapper pembuka transaksi agar service bisa berjalan beberapa query atomik
//semua operasi di dalamnya sukses semua tau gagal semua (tidak setengah2)
export function runInTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  return prisma.$transaction(fn); // menyerahkan fungsi ke transaksi prisma
}


// admin
//ambil semua booking dengan filter opsional 
export function findAllBookings(
  filter:{
    status?: string,
    playDate?: string
  }
){
  return prisma.booking.findMany({
    where:{
      ...(filter.status ? {status:filter.status} : {}),
      ...(filter.playDate ? {playDate:filter.playDate} : {})
    },
    orderBy: [
      {playDate:"desc"},
      {startTime:"asc"}
    ],
    select: {
      ...bookingSelect,
      user: {
        select:{
          id:true,
          name:true,
          email:true
        }
      }
    }
  })
}

export function findBookingsByCourtAndDateRange(
  tx : Prisma.TransactionClient | typeof prisma,
  courtId: string,
  startDate:string,
  endDate:string
){
  return tx.booking.findMany({
    where:{
      courtId,
      status: { in : ["PENDING","CONFIRMED"]},
      playDate: {gte: startDate, lte:endDate}
    },
    select: {
      playDate:true,
      startTime:true,
      endTime:true
    }
  })

}

// Mencari booking berdasarkan kode pesanan (untuk halaman tiket)
export function findBookingByOrderCode(orderCode: string) {
  return prisma.booking.findUnique({
    where: { orderCode },
    select: {
      ...bookingSelect,
      userId: true,
    },
  });
}

// Mencari booking berdasarkan ID pembayaran Midtrans
export async function findBookingByPaymentId(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: {
      booking: {
        select: {
          ...bookingSelect,
          userId: true,
        },
      },
    },
  });

  return payment?.booking ?? null;
}