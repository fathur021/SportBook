import { findOrCreateSettings, updateSettings } from "./settings.repository";
import type { UpdateSettingsInput } from "./settings.schema";

export class InvalidSettingsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidSettingsError";
  }
}
//Mengubah teks jam menjadi jumlah menit
function toMinutes(time: string) {
  // "07:30" dipecah menjadi ["07", "30"], lalu diubah ke angka [7, 30].
  const [hour, minute] = time.split(":").map(Number);
  //7 x 60 + 30 = 450 menit
  return hour * 60 + minute;
}

//ambil pengaturan yang sedang di pakai
export function getSettingsService() {
  return findOrCreateSettings();
}
// Menyimpan perubahan setelah di cek
export async function updateSettingsService(input: UpdateSettingsInput) {
  //ambil data lam dari database
  const current = await findOrCreateSettings();
  // Kalau input tidak mengirim durasi minimal, pakai nilai lama.
  // ?? artinya "kalau kiri kosong/null, pakai kanan".
  const minSessionHours = input.minSessionHours ?? current.minSessionHours;
  const maxSessionHours = input.maxSessionHours ?? current.maxSessionHours;

  // Gunakan nilai dari input jika ada dan bukan string kosong,否则 pakai nilai lama.
  // || menangkap undefined, null, dan string kosong ("").
  const openTime = input.openTime || current.openTime;
  const closeTIme = input.closeTime || current.closeTime;

  // Maksimal tidak boleh lebih kecil dari minimal.
  if (maxSessionHours < minSessionHours) {
    // Hentikan proses dan beri pesan.
    throw new InvalidSettingsError(
      "Durasi Maksimal tidak boleh lebih kecil dari durasi minimal",
    );
  }
  // Ubah jam buka ke menit.
  const openingMinutes = toMinutes(openTime);
  const closingMinutes = toMinutes(closeTIme);

  // Jam tutup harus setelah jam buka.
  // Sama dengan jam juga ditolak karena tidak ada waktu bermain.
  if (closingMinutes <= openingMinutes) {
    throw new InvalidSettingsError("Jam tutup harus lebih besar dan jam buka");
  }

  // Hitung panjang jam operasional.
  // Contoh: 23:00 - 07:00 = 960 menit, dibagi 60 = 16 jam.
  const operationalHours = (closingMinutes - openingMinutes) / 60;

  // Durasi sesi tidak boleh lebih panjang dari jam operasional.
  if (maxSessionHours > operationalHours) {
    throw new InvalidSettingsError(
      `Durasi maksimal tidak boleh melebihi jam operasional (${operationalHours} jam)`,
    );
  }
  return updateSettings(input);
}
