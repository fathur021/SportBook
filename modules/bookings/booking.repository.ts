import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

// Objek reusable untuk menentukan kolom apa saja yang diambil dari tabel Booking
const bookingSelect = {
  id: true,
  orderCode: true,
  courtId: true,
  playDate: true,
  startTime: true,
  endTime: true,
  durationHour: true,
  pricePerHour: true,
  totalPrice: true,
  taxPercent: true,
  taxAmount: true,
  status: true,
  notes: true,
  createdAt: true,
  payment: {
    select: {
      orderCode: true,
      status: true,
      method: true,
      paidAt: true,
      amount: true,
    },
  },
  equipments: {
    select: {
      id: true,
      equipmentId: true,
      name: true,
      price: true,
      quantity: true,
      subtotal: true,
    },
  },
  court: {
    select: {
      id: true,
      name: true,
      sport: true,
      surface: true,
      isIndoor: true,
      maxPlayers: true,
      pricePerHour: true,
      image: true,
      venue: {
        select: {
          id: true,
          name: true,
          slug: true,
          address: true,
          coverImage: true,
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

export function findEquipmentsForBooking(
  tx: Prisma.TransactionClient,
  venueId: string,
  equipmentIds: string[],
) {
  return tx.equipment.findMany({
    where: {
      venueId,
      id: { in: equipmentIds },
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      isActive: true,
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
  tx: Prisma.TransactionClient,
  data: {
    orderCode: string;
    courtId: string;
    userId: string;
    playDate: string;
    startTime: string;
    endTime: string;
    durationHour: number;
    pricePerHour: number;
    totalPrice: number;
    taxPercent: number;
    taxAmount: number;
    notes?: string | null;
    equipments: {
      equipmentId: string;
      name: string;
      price: number;
      quantity: number;
      subtotal: number;
    }[];
  },
) {
  const { equipments, ...bookingData } = data;

  return tx.booking.create({
    data: {
      ...bookingData,
      status: "PENDING",
      ...(equipments.length > 0
        ? { equipments: { create: equipments } }
        : {}),
    },
    select: bookingSelect,
  });
}

//3b. Membatalkan booking PENDING yang sudah tidak mungkin dibayar.
// - booking tanpa pembayaran yang masa hold-nya sudah lewat
// - booking yang pembayarannya sudah dinyatakan gagal oleh Midtrans
// Booking dengan pembayaran PENDING sengaja dibiarkan agar tidak
// menabrak pembayaran yang masih diproses.
export function cancelExpiredBookings(
  holdMs:number,
  tx: Prisma.TransactionClient | typeof prisma = prisma,
  now = new Date(),
) {
  const holdCutoff = new Date(now.getTime() - holdMs);

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