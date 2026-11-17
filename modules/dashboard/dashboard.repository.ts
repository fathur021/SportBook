import { prisma } from "@/lib/prisma";

// Menjumlahkan nominal pembayaran lunas dalam rentang waktu tertentu.
// start = awal hari, end = awal hari berikutnya.
export function sumPaidRevenueBetween(start: Date, end: Date) {
  // aggregate dipakai kalau kita butuh hitungan, bukan daftar baris.
  return prisma.payment.aggregate({
    where: {
      status: "PAID",
      // Filter berdasarkan waktu pembayaran, bukan waktu booking dibuat.
      paidAt: {
        // gte = greater than or equal, artinya mulai dari awal hari.
        gte: start,
        // lt = less than, artinya sampai sebelum awal hari berikutnya.
        lt: end,
      },
    },
    // _sum memerintahkan Prisma menjumlahkan kolom tertentu.
    _sum: {
      // amount adalah nominal pembayaran dalam rupiah.
      amount: true,
    },
  });
}

// Menjumlahkan seluruh pembayaran lunas, tanpa batas tanggal.
// Dipakai untuk kartu "Total Pendapatan".
export function sumAllPaidRevenue() {
  return prisma.payment.aggregate({
    where: {
      // Semua pembayaran yang berstatus lunas ikut dihitung.
      status: "PAID",
    },
    _sum: {
      // Jumlahkan nominalnya.
      amount: true,
    },
  });
}

// Menghitung berapa booking yang lunas pada rentang waktu tertentu.
export function countPaidBookingsBetween(start: Date, end: Date) {
  //count hanya mengembalikan angka jumlah baris
  return prisma.booking.count({
    where: {
      status: { not: "CANCELLED" },
      payment: {
        is: {
          status: "PAID",
          paidAt: {
            gte: start,
            lt: end,
          },
        },
      },
    },
  });
}
// Menghitung booking yang belum dibayar sama sekali.
export function countWaitingPayments() {
  return prisma.booking.count({
    where: {
      status: "PENDING",
    },
  });
}

export function countBookingsByPlayDate(playDate: string) {
  return prisma.booking.count({
    where: {
      playDate,
      status: { not: "CANCELLED" },
    },
  });
}
export function findPaidPaymentsSince(start: Date) {
  return prisma.payment.findMany({
    where: {
      // Hanya pembayaran yang benar-benar lunas.
      status: "PAID",
      // Ambil yang waktu lunasnya setelah awal periode.
      paidAt: {
        gte: start,
      },
    },
    select: {
      // Nominal yang nanti dijumlahkan.
      amount: true,
      // Waktu lunas, dipakai untuk menentukan masuk tanggal berapa.
      paidAt: true,
      // Relasi berantai sampai ke venue.
      booking: {
        select: {
          court: {
            select: {
              venue: {
                select: {
                  // Nama untuk label grafik.
                  name: true,
                  // Slug untuk kunci saat mengelompokkan.
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export function findCourtsWithTodayBookings(playDate: string) {
  return prisma.court.findMany({
    where: {
      //hanya lapangan yang masih akrif
      isActive: true,
      //venue Induknya juga harus aktif
      venue: {
        isActive: true,
      },
    },
    select: {
      id: true,
      name: true,
      venue: {
        select: {
          name: true,
        },
      },
      // Ambil booking hari ini saja pada lapangan ini.
      bookings: {
        where: {
          // playDate berupa teks "YYYY-MM-DD" sesuai tanggal WIB hari ini.
          playDate,
          // Booking yang dibatalkan tidak mengisi slot.
          status: { not: "CANCELLED" },
        },
        select: {
          durationHour: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}
