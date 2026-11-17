// Mengimpor fungsi-fungsi query dari file repository.
import {
  countBookingsByPlayDate,
  countPaidBookingsBetween,
  countWaitingPayments,
  findPaidPaymentsSince,
  sumAllPaidRevenue,
  sumPaidRevenueBetween,
  findCourtsWithTodayBookings,
} from "./dashboard.repository";
import { getSettingsService } from "../settings/settings.service";

// WIB = UTC+7.
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// Periode masing-masing grafik.
// Tren memakai 14 hari, venue memakai 30 hari.
const TREND_DAYS = 14;
const VENUE_DAYS = 30;

function toMinutes(time:string){
  const [hour,minutes] = time.split(":").map(Number);
  return hour * 60 +  minutes;
}

// Mengubah satu Date menjadi teks tanggal WIB "YYYY-MM-DD".
function toWibDateKey(date: Date) {
  // Geser 7 jam supaya komponen UTC menunjukkan tanggal WIB.
  const shifted = new Date(date.getTime() + WIB_OFFSET_MS);

  return [
    shifted.getUTCFullYear(),
    // Bulan dimulai dari 0, jadi ditambah 1.
    String(shifted.getUTCMonth() + 1).padStart(2, "0"),
    String(shifted.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

// Mengubah "2026-11-03" menjadi awal hari itu dalam WIB.
function wibDateKeyToStart(dateKey: string) {
  // "+07:00" memberi tahu JavaScript bahwa jam itu adalah jam WIB.
  return new Date(`${dateKey}T00:00:00+07:00`);
}

// Menyusun daftar tanggal WIB dari beberapa hari lalu sampai hari ini.
// Contoh 3 hari: ["2026-11-15", "2026-11-16", "2026-11-17"].
function getWibDateKeys(days: number, now = new Date()) {
  const shifted = new Date(now.getTime() + WIB_OFFSET_MS);
  const keys: string[] = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    // Kurangi i supaya tanggalnya mundur, bukan selalu hari ini.
    // Date.UTC otomatis menyesuaikan kalau lewat batas bulan.
    const day = new Date(
      Date.UTC(
        shifted.getUTCFullYear(),
        shifted.getUTCMonth(),
        shifted.getUTCDate() - i,
      ),
    );

    keys.push(
      [
        day.getUTCFullYear(),
        String(day.getUTCMonth() + 1).padStart(2, "0"),
        String(day.getUTCDate()).padStart(2, "0"),
      ].join("-"),
    );
  }

  return keys;
}

// Menentukan awal dan akhir hari ini menurut WIB.
function getWibDayRange(now = new Date()) {
  // Tanggal hari ini menurut WIB.
  const dateKey = toWibDateKey(now);
  // Awal hari ini dalam UTC.
  const start = wibDateKeyToStart(dateKey);
  // Awal hari berikutnya.
  const end = new Date(start.getTime() + DAY_MS);

  return { start, end, dateKey };
}

export async function getDashboardSummaryService() {
  const { start, end, dateKey } = getWibDayRange();

  // Daftar tanggal untuk kedua grafik.
  const trendKeys = getWibDateKeys(TREND_DAYS);
  const venueKeys = getWibDateKeys(VENUE_DAYS);

  // Promise.all menjalankan semua query secara bersamaan,
  // jadi total waktunya mengikuti query paling lambat, bukan jumlah semuanya.
  const [
    revenueResult,
    totalRevenueResult,
    paidBookingsToday,
    waitingPayments,
    bookingsToday,
    paidPayments,
    // Hasil query lapangan dan booking hari ini.
    courts,
    // Hasil pengaturan jam buka dan jam tutup.
    settings,
  ] = await Promise.all([
    // Query 1: total uang masuk hari ini.
    sumPaidRevenueBetween(start, end),
    // Query 2: total uang masuk sejak awal, tanpa batas tanggal.
    sumAllPaidRevenue(),
    countPaidBookingsBetween(start, end),
    countWaitingPayments(),
    countBookingsByPlayDate(dateKey),
    // Ambil 30 hari karena itu periode terpanjang.
    // Data lebih tua dari 14 hari tetap dipakai grafik venue,
    // tapi nanti diabaikan oleh grafik tren.
    findPaidPaymentsSince(wibDateKeyToStart(venueKeys[0])),
    // Lapangan aktif beserta booking hari ini pada tanggal WIB.
    findCourtsWithTodayBookings(dateKey),
    // Jam buka dan jam tutup dari pengaturan global.
    getSettingsService(),
  ]);

  // ---------- Grafik tren harian ----------
  // Isi semua tanggal dengan 0 dulu supaya hari tanpa transaksi tetap muncul.
  const trendMap = new Map<string, number>();
  for (const key of trendKeys) {
    trendMap.set(key, 0);
  }

  for (const payment of paidPayments) {
    // Status PAID seharusnya selalu punya paidAt, tapi tetap dijaga.
    if (!payment.paidAt) continue;

    // Tentukan pembayaran ini masuk tanggal WIB yang mana.
    const key = toWibDateKey(payment.paidAt);

    // Lewati tanggal di luar 14 hari (data lama untuk grafik venue).
    if (!trendMap.has(key)) continue;

    trendMap.set(key, (trendMap.get(key) ?? 0) + payment.amount);
  }

  const revenueTrend = trendKeys.map((key) => ({
    date: key,
    revenue: trendMap.get(key) ?? 0,
  }));

  // ---------- Grafik pendapatan per venue ----------
  const venueMap = new Map<
    string,
    { venue: string; revenue: number; transactions: number }
  >();

  for (const payment of paidPayments) {
    const venue = payment.booking.court.venue;

    // Kalau venue belum ada di peta, mulai dari nol.
    const current = venueMap.get(venue.slug) ?? {
      venue: venue.name,
      revenue: 0,
      transactions: 0,
    };

    current.revenue += payment.amount;
    current.transactions += 1;
    venueMap.set(venue.slug, current);
  }

  // Urutkan dari pendapatan terbesar supaya batang teratas paling tinggi.
  const venueRevenue = [...venueMap.values()].sort(
    (a, b) => b.revenue - a.revenue,
  );

  // ---------- Jadwal hari ini ----------
  // Jam tutup dikurangi jam buka, lalu dibagi 60 menjadi jumlah slot 1 jam.
  const totalSlots = Math.max(
    // Minimal 1 supaya tidak terjadi pembagian dengan nol.
    1,
    Math.floor(
      (toMinutes(settings.closeTime) - toMinutes(settings.openTime)) / 60,
    ),
  );

  // Ubah setiap lapangan menjadi bentuk yang dipakai kartu.
  const todaySchedules = courts.map((court) => ({
    // Id asli lapangan dipakai sebagai key React.
    id: court.id,
    // Nama lapangan.
    court: court.name,
    // Nama venue induknya.
    venue: court.venue.name,
    // Jumlahkan durasi booking yang tidak dibatalkan.
    bookedSlots: court.bookings.reduce(
      (total, booking) => total + booking.durationHour,
      0,
    ),
    // Total slot berdasarkan pengaturan jam buka dan jam tutup.
    totalSlots,
  }));

  return {
    date: dateKey,
    revenueToday: revenueResult._sum.amount ?? 0,
    totalRevenue: totalRevenueResult._sum.amount ?? 0,
    paidBookingsToday,
    waitingPayments,
    bookingsToday,
    // Data untuk kedua grafik.
    revenueTrend,
    venueRevenue,
    // Data jadwal untuk kartu "Jadwal Hari Ini".
    todaySchedules,
  };
}
