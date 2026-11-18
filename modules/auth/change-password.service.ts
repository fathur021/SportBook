import { auth } from "@/lib/auth"; // Mengambil instance Better Auth yang sudah dikonfigurasi.

// Tipe hasil yang dikembalikan service ke controller.
import type { ChangePasswordInput } from "./change-password.schema"; // Mengambil tipe hasil validasi dari file schema.

// Error khusus kalau password saat ini salah.
export class InvalidCurrentPasswordError extends Error { // Membuat kelas error sendiri.
  constructor() { // Fungsi yang jalan saat error dibuat.
    super("Password saat ini salah."); // Menentukan pesan error.
    this.name = "InvalidCurrentPasswordError"; // Menentukan nama error supaya mudah dikenali di controller.
  } // Akhir constructor.
} // Akhir kelas.

// Error khusus kalau akun tidak punya password credential, misalnya akun khusus Google.
export class CredentialPasswordMissingError extends Error { // Membuat kelas error kedua.
  constructor() { // Fungsi yang jalan saat error dibuat.
    super("Akun ini belum memiliki password. Gunakan pemulihan akun."); // Pesan yang ramah untuk user.
    this.name = "CredentialPasswordMissingError"; // Nama error untuk dikenali di controller.
  } // Akhir constructor.
} // Akhir kelas.

// Error umum untuk kegagalan lain dari Better Auth.
export class ChangePasswordFailedError extends Error { // Membuat kelas error ketiga.
  constructor(message: string) { // Menerima pesan dari Better Auth.
    super(message); // Menyimpan pesan tersebut ke Error bawaan.
    this.name = "ChangePasswordFailedError"; // Menandai nama error.
  } // Akhir constructor.
} // Akhir kelas.

// Bentuk data yang dikembalikan service ke controller.
type ChangePasswordResult = { // Mendefinisikan tipe hasil.
  user: { // Data user yang sudah diperbarui.
    id: string; // ID user.
    name: string; // Nama user.
    email: string; // Email user.
  }; // Akhir tipe user.
  headers: Headers; // Header respons dari Better Auth, penting untuk cookie sesi baru.
}; // Akhir tipe hasil.

// Fungsi utama yang memanggil endpoint better-auth.
export async function changePasswordService( // Menandai fungsi async.
  input: ChangePasswordInput, // Data yang sudah tervalidi dari controller.
  requestHeaders: Headers, // Header request asli, supaya Better Auth tahu siapa yang sedang login.
): Promise<ChangePasswordResult> { // Fungsi mengembalikan hasil bertipe ChangePasswordResult.

  // Memanggil endpoint /change-password milik Better Auth lewat auth.api.
  const response = await auth.api.changePassword({ // Menunggu hasil pemanggilan endpoint.
    body: { // Isi body yang dikirim ke Better Auth.
      currentPassword: input.currentPassword, // Password lama dari form.
      newPassword: input.newPassword, // Password baru dari form.
      revokeOtherSessions: true, // Logout perangkat lain, hanya sesi saat ini yang dipertahankan.
    }, // Akhir body.
    headers: requestHeaders, // Cookie sesi diteruskan supaya Better Auth mengenali user.
    asResponse: true, // Meminta hasil berupa Response lengkap, termasuk header Set-Cookie.
  }); // Akhir pemanggilan endpoint.

  // Mengubah body respons menjadi objek JavaScript.
  const payload = await response.json().catch(() => ({})); // Kalau parsing gagal, pakai objek kosong saja.

  // Kalau Better Auth mengembalikan status error.
  if (!response.ok) { // Cek status di luar rentang 200-299.
    const code = typeof payload.code === "string" ? payload.code : undefined; // Ambil kode error kalau ada.

    if (code === "INVALID_PASSWORD") { // Kalau kodenya password lama salah.
      throw new InvalidCurrentPasswordError(); // Lempar error khusus supaya controller bisa balas 400.
    } // Akhir cek password salah.

    if (code === "CREDENTIAL_ACCOUNT_NOT_FOUND") { // Kalau akun tidak punya password credential.
      throw new CredentialPasswordMissingError(); // Lempar error khusus akun tanpa password.
    } // Akhir cek akun tanpa password.

    const message = typeof payload.message === "string" ? payload.message : undefined; // Ambil pesan asli dari Better Auth.
    throw new ChangePasswordFailedError(message ?? "Gagal mengganti password."); // Lempar error umum dengan pesan fallback.
  } // Akhir blok error.

  // Kalau berhasil, kembalikan data user dan header cookie.
  return { // Mulai mengembalikan objek hasil.
    user: { // Data user yang diperlukan frontend.
      id: String(payload.user.id), // ID diubah ke string agar tipenya pasti.
      name: String(payload.user.name), // Nama diubah ke string.
      email: String(payload.user.email), // Email diubah ke string.
    }, // Akhir data user.
    headers: response.headers, // Header dari Better Auth dibawa pulang, terutama Set-Cookie.
  }; // Akhir objek hasil.
} // Akhir fungsi service.