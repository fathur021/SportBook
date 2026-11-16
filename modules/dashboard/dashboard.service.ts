// Mengimpor kelima fungsi query dari file repository.
import {
  countBookingsByPlayDate,
  countPaidBookingsBetween,
  countWaitingPayments,
  sumAllPaidRevenue,
  sumPaidRevenueBetween,
} from "./dashboard.repository";

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function getWibDayRange(now = new Date()) {
  // Ambil waktu sekarang, lalu tambah 7 jam.
  // Dengan begitu, jam UTC-nya sekarang menunjukkan jam WIB.
  const shifted = new Date(now.getTime() + WIB_OFFSET_MS);
  // Date.UTC membentuk tanggal pukul 00:00 berdasarkan komponen UTC.
  // Karena tadi sudah digeser 7 jam, komponen UTC ini adalah tanggal WIB.
  // Setelah itu kurangi 7 jam lagi supaya kembali ke UTC asli.
  const startUtcMs =
    Date.UTC(
      // Tahun menurut WIB.
      shifted.getUTCFullYear(),
      // Bulan menurut WIB. getUTCMonth mulai dari 0, jadi November = 10.
      shifted.getUTCMonth(),
      // Tanggal menurut WIB.
      shifted.getUTCDate(),
    ) - WIB_OFFSET_MS;
  // Awal hari ini dalam bentuk Date.
  const start = new Date(startUtcMs);
  //  awal hari bsok, yaout hari ini di tambah 24 jam
  const end = new Date(startUtcMs + DAY_MS);
  // Susun tanggal hari ini menjadi teks "YYYY-MM-DD".
  const dateKey = [
    // Tahun, misalnya 2026.
    shifted.getUTCFullYear(),
    // Bulan ditambah 1 karena dimulai dari 0.
    // padStart(2, "0") menambah nol di depan supaya selalu dua digit.
    String(shifted.getUTCMonth() + 1).padStart(2, "0"),
    // Tanggal, juga dipaksa dua digit.
    String(shifted.getUTCDate()).padStart(2, "0"),
  ].join("-");
  return { start, end, dateKey };
}
export async function getDashboardSummaryService() {
  const { start, end, dateKey } = getWibDayRange();
  // Promise.all menjalankan semua query secara bersamaan,
  // jadi total waktunya mengikuti query paling lambat, bukan jumlah semuanya.
  const [
    revenueResult,
    totalRevenueResult,
    paidBookingsToday,
    waitingPayments,
    bookingsToday,
  ] = await Promise.all([
    // Query 1: total uang masuk hari ini.
    sumPaidRevenueBetween(start, end),
    // Query 2: total uang masuk sejak awal, tanpa batas tanggal.
    sumAllPaidRevenue(),
    countPaidBookingsBetween(start, end),
    countWaitingPayments(),
    countBookingsByPlayDate(dateKey),
  ]);

  return {
    date: dateKey,
    revenueToday: revenueResult._sum.amount ?? 0,
    totalRevenue: totalRevenueResult._sum.amount ?? 0,
    paidBookingsToday,
    waitingPayments,
    bookingsToday,
  };
}
