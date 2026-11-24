// lib/datetime.ts
// File ini berisi aturan waktu dan cara menampilkan tanggal serta jam.
// Cara baca: bagian ATURAN WAKTU dipakai untuk logika, bagian FORMAT TAMPILAN dipakai untuk teks di layar.
// Baris kosong sengaja tidak diberi komentar supaya tetap enak dibaca.

export const LOCALE = "id-ID"; // Bahasa Indonesia untuk nama hari dan bulan.
export const BUSINESS_TIME_ZONE = "Asia/Jakarta"; // Zona waktu bisnis yang dipakai, yaitu WIB.

const DAY_MINUTES = 24 * 60; // Jumlah menit dalam satu hari, dipakai untuk hitung lewat tengah malam.

// Pola teks tanggal "YYYY-MM-DD" dan jam "HH:MM".
const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/; // Pola tanggal, misalnya 2026-11-23.
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/; // Pola jam, misalnya 19:00 sampai 23:59.

export type DateStyle =
  | "dayMonth" // Contoh hasil: "23 Nov".
  | "monthDay" // Contoh hasil: "Nov 23".
  | "monthShort" // Contoh hasil: "Nov".
  | "short" // Contoh hasil: "23 Nov 2026".
  | "long" // Contoh hasil: "23 November 2026".
  | "weekdayShort" // Contoh hasil: "Min".
  | "weekdayLongShortMonth" // Contoh hasil: "Minggu, 23 Nov 2026".
  | "weekdayLongFullMonth"; // Contoh hasil: "Minggu, 23 November 2026".

export type DateTimeStyle =
  | "short" // Contoh hasil: "23 Nov 2026, 19.30".
  | "long" // Contoh hasil: "Minggu, 23 November 2026, 19.30".
  | "timeOnly"; // Contoh hasil: "19.30".

type WallParts = {
  // Kumpulan bagian jam dinding yang dibaca dari hasil format.
  year: number; // Tahun, misalnya 2026.
  month: number; // Bulan, misalnya 11.
  day: number; // Hari, misalnya 23.
  hour: number; // Jam, misalnya 19.
  minute: number; // Menit, misalnya 30.
  second: number; // Detik, biasanya 0.
}; // Tutup tipe WallParts.

// Daftar gaya tampilan untuk tanggal murni seperti "2026-11-23".
const DATE_STYLES: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  dayMonth: { day: "numeric", month: "short" }, // Tanggal dan bulan singkat.
  monthDay: { month: "short", day: "numeric" }, // Bulan singkat dan tanggal.
  monthShort: { month: "short" }, // Nama bulan singkat saja.
  short: { day: "numeric", month: "short", year: "numeric" }, // Gaya paling sering dipakai di tabel.
  long: { day: "numeric", month: "long", year: "numeric" }, // Nama bulan ditulis lengkap.
  weekdayShort: { weekday: "short" }, // Nama hari singkat saja.
  weekdayLongShortMonth: {
    // Nama hari lengkap dengan bulan singkat.
    weekday: "long", // Nama hari lengkap, misalnya "Minggu".
    day: "numeric", // Tanggal tanpa nol di depan.
    month: "short", // Nama bulan singkat, misalnya "Nov".
    year: "numeric", // Tahun empat digit.
  }, // Selesai gaya ini.
  weekdayLongFullMonth: {
    // Nama hari lengkap dengan bulan lengkap.
    weekday: "long", // Nama hari lengkap.
    day: "numeric", // Tanggal tanpa nol di depan.
    month: "long", // Nama bulan lengkap, misalnya "November".
    year: "numeric", // Tahun empat digit.
  }, // Selesai gaya ini.
}; // Tutup daftar gaya tanggal.

// Daftar gaya tampilan untuk tanggal yang sudah membawa jam.
const DATE_TIME_STYLES: Record<DateTimeStyle, Intl.DateTimeFormatOptions> = {
  short: {
    // Gaya tanggal dan jam yang paling sering dipakai.
    day: "numeric", // Tanggal tanpa nol di depan.
    month: "short", // Nama bulan singkat.
    year: "numeric", // Tahun empat digit.
    hour: "2-digit", // Jam dua digit.
    minute: "2-digit", // Menit dua digit.
    hourCycle: "h23", // Pakai jam 00-23, bukan 1-24.
  }, // Selesai gaya ini.
  long: {
    // Gaya lengkap dengan nama hari dan bulan panjang.
    weekday: "long", // Nama hari lengkap.
    day: "numeric", // Tanggal tanpa nol di depan.
    month: "long", // Nama bulan lengkap.
    year: "numeric", // Tahun empat digit.
    hour: "2-digit", // Jam dua digit.
    minute: "2-digit", // Menit dua digit.
    hourCycle: "h23", // Pakai jam 00-23.
  }, // Selesai gaya ini.
  timeOnly: {
    // Gaya jam saja, tanpa tanggal.
    hour: "2-digit", // Jam dua digit.
    minute: "2-digit", // Menit dua digit.
    hourCycle: "h23", // Pakai jam 00-23.
  }, // Selesai gaya ini.
}; // Tutup daftar gaya tanggal dan jam.

const dateFormatters = new Map<DateStyle, Intl.DateTimeFormat>(); // Simpanan pembuat format tanggal.
const dateTimeFormatters = new Map<DateTimeStyle, Intl.DateTimeFormat>(); // Simpanan pembuat format tanggal dan jam.
const dateKeyFormatters = new Map<string, Intl.DateTimeFormat>(); // Simpanan pembuat kunci tanggal per zona waktu.
const wallPartsFormatters = new Map<string, Intl.DateTimeFormat>(); // Simpanan pembaca bagian jam per zona waktu.

const numberFormatter = new Intl.NumberFormat(LOCALE, {
  // Pembuat angka bergaya Indonesia.
  maximumFractionDigits: 2, // Desimal maksimal dua angka.
}); // Tutup pembuat angka.

function getDateFormatter(style: DateStyle) {
  // Ambil pembuat format tanggal dari simpanan, atau buat kalau belum ada.
  let formatter = dateFormatters.get(style); // Coba ambil yang sudah pernah dibuat.

  if (!formatter) {
    // Kalau belum ada, buat sekarang.
    formatter = new Intl.DateTimeFormat(LOCALE, {
      // Buat dengan bahasa Indonesia.
      ...DATE_STYLES[style], // Salin pola yang diminta dari daftar.
      timeZone: "UTC", // Tanggal murni pakai UTC supaya tidak bergeser sehari.
    }); // Selesai membuat pembuat format.
    dateFormatters.set(style, formatter); // Simpan supaya tidak dibuat terus-menerus.
  } // Tutup pengecekan.

  return formatter; // Kirim pembuat format yang siap dipakai.
} // Tutup fungsi.

function getDateTimeFormatter(style: DateTimeStyle) {
  // Ambil pembuat format tanggal dan jam dari simpanan, atau buat kalau belum ada.
  let formatter = dateTimeFormatters.get(style); // Coba ambil yang sudah pernah dibuat.

  if (!formatter) {
    // Kalau belum ada, buat sekarang.
    formatter = new Intl.DateTimeFormat(LOCALE, {
      // Buat dengan bahasa Indonesia.
      ...DATE_TIME_STYLES[style], // Salin pola yang diminta dari daftar.
      timeZone: BUSINESS_TIME_ZONE, // Waktu dari database selalu ditampilkan di WIB.
    }); // Selesai membuat pembuat format.
    dateTimeFormatters.set(style, formatter); // Simpan untuk pemakaian berikutnya.
  } // Tutup pengecekan.

  return formatter; // Kirim pembuat format yang siap dipakai.
} // Tutup fungsi.

function getDateKeyFormatter(timeZone: string) {
  // Ambil pembuat kunci tanggal untuk satu zona waktu.
  let formatter = dateKeyFormatters.get(timeZone); // Coba ambil dari simpanan.

  if (!formatter) {
    // Kalau belum ada, buat sekarang.
    formatter = new Intl.DateTimeFormat("en-US", {
      // "en-US" tidak masalah karena yang diambil hanya bagian angkanya.
      timeZone, // Zona waktu yang diminta.
      year: "numeric", // Ambil tahun empat digit.
      month: "2-digit", // Ambil bulan dua digit.
      day: "2-digit", // Ambil hari dua digit.
    }); // Selesai membuat pembuat kunci.
    dateKeyFormatters.set(timeZone, formatter); // Simpan berdasarkan nama zona waktu.
  } // Tutup pengecekan.

  return formatter; // Kirim pembuat kunci yang siap dipakai.
} // Tutup fungsi.

function getWallPartsFormatter(timeZone: string) {
  // Ambil pembaca bagian jam dinding untuk satu zona waktu.
  let formatter = wallPartsFormatters.get(timeZone); // Coba ambil dari simpanan.

  if (!formatter) {
    // Kalau belum ada, buat sekarang.
    formatter = new Intl.DateTimeFormat("en-US", {
      // Bahasa tidak terlalu penting karena yang diambil hanya angkanya.
      timeZone, // Zona waktu yang diminta.
      year: "numeric", // Ambil tahun.
      month: "2-digit", // Ambil bulan.
      day: "2-digit", // Ambil hari.
      hour: "2-digit", // Ambil jam.
      minute: "2-digit", // Ambil menit.
      second: "2-digit", // Ambil detik.
      hourCycle: "h23", // Jam memakai 00-23.
    }); // Selesai membuat pembaca bagian.
    wallPartsFormatters.set(timeZone, formatter); // Simpan berdasarkan nama zona waktu.
  } // Tutup pengecekan.

  return formatter; // Kirim pembaca bagian yang siap dipakai.
} // Tutup fungsi.

function getPart(parts: Intl.DateTimeFormatPart[], type: string) {
  // Ambil satu bagian, misalnya "year" atau "month".
  return parts.find((part) => part.type === type)?.value; // Cari yang cocok lalu ambil nilainya.
} // Tutup fungsi.

function getWallParts(date: Date, timeZone: string): WallParts {
  // Ubah sebuah Date menjadi bagian jam dinding di zona waktu tertentu.
  const parts = getWallPartsFormatter(timeZone).formatToParts(date); // Pisahkan hasil format menjadi bagian-bagian.

  const values: Record<string, number> = {}; // Wadah sementara untuk nilai angka.

  for (const part of parts) {
    // Telusuri setiap bagian hasil format.
    if (part.type === "literal") continue; // Lewati tanda baca seperti spasi atau koma.
    values[part.type] = Number(part.value); // Simpan bagian angka, misalnya year = 2026.
  } // Tutup perulangan.

  return {
    // Susun kembali bagian yang dibutuhkan.
    year: values.year, // Tahun hasil bacaan.
    month: values.month, // Bulan hasil bacaan.
    day: values.day, // Hari hasil bacaan.
    hour: values.hour, // Jam hasil bacaan.
    minute: values.minute, // Menit hasil bacaan.
    second: values.second, // Detik hasil bacaan.
  }; // Tutup hasil kembalian.
} // Tutup fungsi.

// ============================================================================
// ATURAN WAKTU
// Bagian ini dipakai untuk keputusan logika, bukan untuk ditampilkan langsung.
// ============================================================================

export function toDateKey(
  // Buat kunci tanggal "YYYY-MM-DD" menurut zona waktu tertentu.
  date: Date = new Date(), // Tanggal yang akan diubah; bawaan berarti hari ini.
  timeZone: string = BUSINESS_TIME_ZONE, // Zona waktu yang dipakai; bawaan WIB.
): string {
  // Hasil akhir berupa teks.
  if (Number.isNaN(date.getTime())) return ""; // Kalau tanggal rusak, kembalikan teks kosong.

  const parts = getDateKeyFormatter(timeZone).formatToParts(date); // Pisahkan jadi tahun, bulan, dan hari.
  const year = getPart(parts, "year"); // Ambil bagian tahun.
  const month = getPart(parts, "month"); // Ambil bagian bulan.
  const day = getPart(parts, "day"); // Ambil bagian hari.

  if (!year || !month || !day) return ""; // Kalau ada bagian yang hilang, kembalikan teks kosong.

  return `${year}-${month}-${day}`; // Gabungkan dengan tanda hubung.
} // Tutup fungsi.

export function getBusinessDateKey(
  // Nama lain yang lebih jelas untuk "hari ini menurut bisnis".
  now: Date = new Date(), // Waktu saat ini; bawaan hari ini.
  timeZone: string = BUSINESS_TIME_ZONE, // Zona waktu yang dipakai; bawaan WIB.
): string {
  // Hasil akhir berupa kunci tanggal.
  return toDateKey(now, timeZone); // Lanjutkan ke fungsi pembuat kunci tanggal.
} // Tutup fungsi.

export function parseDateKey(key: string): Date | null {
  // Ubah "YYYY-MM-DD" jadi Date UTC, atau null kalau tidak valid.
  const match = DATE_KEY_PATTERN.exec(key); // Cocokkan teks dengan pola tanggal.

  if (!match) return null; // Kalau tidak cocok, hentikan dengan null.

  const year = Number(match[1]); // Ambil tahun dari hasil pencocokan.
  const month = Number(match[2]); // Ambil bulan dari hasil pencocokan.
  const day = Number(match[3]); // Ambil hari dari hasil pencocokan.

  if (month < 1 || month > 12 || day < 1 || day > 31) return null; // Bulan dan hari harus masuk akal.

  const date = new Date(Date.UTC(year, month - 1, day)); // Buat tanggal UTC; bulan dikurangi 1 karena JavaScript mulai dari 0.

  if (
    // Cek apakah tanggal hasil buatan sama dengan input.
    date.getUTCFullYear() !== year || // Tahun harus sama.
    date.getUTCMonth() !== month - 1 || // Bulan harus sama.
    date.getUTCDate() !== day // Hari harus sama.
  ) {
    return null; // Kalau tidak sama, tanggal itu palsu, misalnya "2026-02-30".
  }

  return date; // Kirim tanggal yang sudah divalidasi.
} // Tutup fungsi.

export function timeToMinutes(time: string): number {
  // Ubah jam "HH:MM" menjadi jumlah menit.
  const match = TIME_PATTERN.exec(time); // Cocokkan pola jam dan ambil bagian jam serta menit.

  if (!match) return Number.NaN; // Kalau bukan jam valid, kembalikan NaN.

  return Number(match[1]) * 60 + Number(match[2]); // Jam dikali 60 lalu ditambah menit.
} // Tutup fungsi.

export function minutesToTime(totalMinutes: number): string {
  // Ubah jumlah menit kembali menjadi teks jam "HH:MM".
  if (!Number.isFinite(totalMinutes)) return ""; // Kalau input bukan angka, kembalikan teks kosong.

  const normalized =
    // Bulatkan angka, lalu bungkus kembali ke rentang 0 sampai 1439.
    ((Math.round(totalMinutes) % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
  const hour = Math.floor(normalized / 60); // Ambil bagian jam dari menit.
  const minute = normalized % 60; // Ambil sisa menitnya.

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`; // Tambahkan nol di depan kalau perlu.
} // Tutup fungsi.

export function toBookingEpoch(
  // Ubah jam dinding booking menjadi waktu absolut dalam milidetik.
  dateKey: string, // Tanggal main, misalnya "2026-11-23".
  time: string, // Jam booking, misalnya "19:00".
  timeZone: string = BUSINESS_TIME_ZONE, // Zona waktu yang dipakai; bawaan WIB.
): number {
  // Hasil akhir berupa angka milidetik.
  const date = parseDateKey(dateKey); // Ubah tanggal jadi Date UTC.
  const minutes = timeToMinutes(time); // Ubah jam jadi jumlah menit.

  if (!date || Number.isNaN(minutes)) return Number.NaN; // Kalau ada yang rusak, hentikan.

  const wallMs = Date.UTC(
    // Buat waktu perkiraan dari tanggal dan jam yang dimasukkan.
    date.getUTCFullYear(), // Tahun.
    date.getUTCMonth(), // Bulan, sudah dalam bentuk 0-11.
    date.getUTCDate(), // Hari.
    Math.floor(minutes / 60), // Jam hasil bagi menit.
    minutes % 60, // Sisa menit.
  ); // Tutup pembuatan waktu perkiraan.

  const wall = getWallParts(new Date(wallMs), timeZone); // Lihat waktu itu tampak berapa di zona bisnis.

  if (Object.values(wall).some(Number.isNaN)) return Number.NaN; // Kalau hasilnya tidak lengkap, hentikan.

  const seenAsUtc = Date.UTC(
    // Ubah jam tampak tadi menjadi UTC lagi supaya bisa dibandingkan.
    wall.year, // Tahun hasil tampakan.
    wall.month - 1, // Bulan dikurangi 1 karena JavaScript mulai dari 0.
    wall.day, // Hari hasil tampakan.
    wall.hour, // Jam hasil tampakan.
    wall.minute, // Menit hasil tampakan.
    wall.second, // Detik hasil tampakan.
  ); // Tutup perbandingan UTC.

  return wallMs - (seenAsUtc - wallMs); // Kurangi selisih zona waktu supaya dapat waktu absolut yang benar.
} // Tutup fungsi.

export function isTimeOverlap(
  // Cek apakah dua rentang jam saling bentrok.
  newStart: string, // Jam mulai rentang pertama.
  newEnd: string, // Jam selesai rentang pertama.
  existingStart: string, // Jam mulai rentang kedua.
  existingEnd: string, // Jam selesai rentang kedua.
): boolean {
  // Hasil akhir benar atau salah.
  const startA = timeToMinutes(newStart); // Mulai rentang pertama dalam menit.
  let endA = timeToMinutes(newEnd); // Selesai rentang pertama; bisa diubah kalau lewat tengah malam.
  let startB = timeToMinutes(existingStart); // Mulai rentang kedua dalam menit.
  let endB = timeToMinutes(existingEnd); // Selesai rentang kedua; bisa diubah juga.

  if ([startA, endA, startB, endB].some(Number.isNaN)) return false; // Kalau ada jam rusak, anggap tidak bentrok.
  if (endA === startA || endB === startB) return false; // Durasi nol tidak dianggap bentrok.

  if (endA <= startA) endA += DAY_MINUTES; // Selesai sebelum mulai berarti lewat tengah malam.
  if (endB <= startB) endB += DAY_MINUTES; // Lakukan hal yang sama untuk rentang kedua.

  if (endB <= startA) {
    // Kalau rentang kedua masih di sebelum rentang pertama, geser ke hari berikutnya.
    startB += DAY_MINUTES; // Geser jam mulai kedua.
    endB += DAY_MINUTES; // Geser jam selesai kedua.
  } // Tutup pengecekan.

  return startA < endB && endA > startB; // Bentrok kalau mulai pertama sebelum selesai kedua dan selesai pertama setelah mulai kedua.
} // Tutup fungsi.

// ============================================================================
// FORMAT TAMPILAN
// Bagian ini hanya membuat teks untuk dilihat pengguna, bukan untuk logika.
// ============================================================================

export function formatDateKey(
  // Tampilkan tanggal murni "YYYY-MM-DD" menjadi teks Indonesia.
  key: string | null | undefined, // Tanggal yang mau ditampilkan.
  style: DateStyle = "short", // Gaya tampilan, bawaan "23 Nov 2026".
  fallback = "-", // Teks cadangan kalau tanggal kosong atau rusak.
): string {
  // Hasil akhir berupa teks.
  if (!key) return fallback; // Kalau kosong, pakai teks cadangan.

  const date = parseDateKey(key); // Ubah teks tanggal jadi Date UTC.

  if (!date) return fallback; // Kalau gagal, pakai teks cadangan.

  return getDateFormatter(style).format(date); // Tampilkan memakai gaya yang diminta.
} // Tutup fungsi.

export function formatDate(
  // Tampilkan objek Date, misalnya tanggal dari kalender.
  date: Date | null | undefined, // Objek Date yang mau ditampilkan.
  style: DateStyle = "short", // Gaya tampilan.
  fallback = "-", // Teks cadangan.
): string {
  // Hasil akhir berupa teks.
  if (!date) return fallback; // Kalau kosong, pakai teks cadangan.

  const key = toDateKey(date); // Ubah Date menjadi kunci tanggal menurut WIB.

  return formatDateKey(key, style, fallback); // Lanjutkan ke fungsi format tanggal murni.
} // Tutup fungsi.

function toValidDate(value: Date | string | number): Date | null {
  // Ubah input apa pun menjadi Date, atau null kalau tidak valid.
  const date =
    // Siapkan hasil akhir.
    value instanceof Date ? new Date(value.getTime()) : new Date(value); // Salin Date atau buat Date baru dari teks/angka.

  return Number.isNaN(date.getTime()) ? null : date; // Kembalikan null kalau hasilnya bukan tanggal valid.
} // Tutup fungsi.

// Untuk waktu dari database. Jangan kirim dateKey murni ke fungsi ini.
export function formatDateTime(
  // Tampilkan tanggal yang sudah membawa jam.
  value: Date | string | number | null | undefined, // Bisa Date, ISO string, angka, atau kosong.
  style: DateTimeStyle = "short", // Gaya tampilan.
  fallback = "-", // Teks cadangan.
): string {
  // Hasil akhir berupa teks.
  if (value === null || value === undefined) return fallback; // Kalau kosong, pakai teks cadangan.
  if (typeof value === "string" && value.length === 0) return fallback; // Kalau string kosong, pakai teks cadangan.

  const date = toValidDate(value); // Coba ubah input menjadi Date yang valid.

  if (!date) return fallback; // Kalau gagal, pakai teks cadangan.

  return getDateTimeFormatter(style).format(date); // Tampilkan dalam WIB memakai gaya yang diminta.
} // Tutup fungsi.

export function formatTime(
  // Periksa dan rapikan jam "HH:MM".
  value: string | null | undefined, // Jam yang mau ditampilkan.
  fallback = "-", // Teks cadangan kalau jam tidak valid.
): string {
  // Hasil akhir berupa teks.
  if (!value || !TIME_PATTERN.test(value)) return fallback; // Kalau kosong atau bukan jam valid, pakai teks cadangan.

  return value; // Jam sudah valid, kirim apa adanya.
} // Tutup fungsi.

export function formatDuration(hours: number): string {
  // Ubah durasi jam menjadi teks, misalnya 2 menjadi "2 jam".
  if (!Number.isFinite(hours) || hours <= 0) return ""; // Kalau bukan angka atau tidak positif, kembalikan teks kosong.

  return `${numberFormatter.format(hours)} jam`; // Format angkanya, lalu tambahkan kata "jam".
} // Tutup fungsi.

export function formatTimeSlot(
  // Rapikan label rentang waktu booking.
  startTime: string | null | undefined, // Jam mulai, misalnya "19:00".
  endTime: string | null | undefined, // Jam selesai, misalnya "21:00".
  durationHours?: number, // Durasi opsional, misalnya 2.
  note?: string, // Catatan opsional, misalnya "Peak Slot".
  fallback = "Jam belum dipilih", // Teks cadangan kalau jam belum ada.
): string {
  // Hasil akhir berupa teks.
  const start = formatTime(startTime, ""); // Validasi jam mulai; kalau rusak jadi teks kosong.
  const end = formatTime(endTime, ""); // Validasi jam selesai; kalau rusak jadi teks kosong.

  if (!start || !end) return fallback; // Kalau salah satu jam tidak ada, pakai teks cadangan.

  const range = `${start} - ${end}`; // Gabungkan jam mulai dan jam selesai.

  const details: string[] = []; // Wadah untuk keterangan tambahan.

  if (durationHours !== undefined) {
    // Kalau durasi dikirim, tambahkan keterangan durasi.
    const duration = formatDuration(durationHours); // Ubah durasi jadi teks, misalnya "2 jam".

    if (duration) details.push(duration); // Kalau teksnya tidak kosong, masukkan ke daftar.
  } // Tutup pengecekan durasi.

  if (note) details.push(note); // Kalau ada catatan, masukkan juga ke daftar.

  return details.length > 0 ? `${range} (${details.join(", ")})` : range; // Gabungkan semua; kalau tidak ada keterangan, kirim rentang jam saja.
} // Tutup fungsi.
