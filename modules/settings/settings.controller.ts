import { requireAdmin } from "../auth/auth.guard";
import { UpdateSettingsInput, updateSettingsSchema } from "./settings.schema";
// Mengambil service dan error.
import {
  getSettingsService,
  InvalidSettingsError,
  updateSettingsService,
} from "./settings.service";

//menangani GET /api/admin/settings.
export async function getSettingsController(
  request: Request,
): Promise<Response> {
  // try = jalankan, catch = tangkap kalau ada error.
  try {
    // Cek apakah yang meminta benar-benar admin
    const authorization = await requireAdmin(request);
    // Kalau bukan admin, authorization.ok bernilai false.
    if (!authorization.ok) {
      // Kirim error 401 (belum login) atau 403 (bukan admin).
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }
    // Ambil data pengaturan.
    const settings = await getSettingsService();
    // Kirim sebagai JSON dengan pembungkus data.
    return Response.json({ data: settings });
  } catch (error) {
    // Catat error asli ke terminal untuk debugging.
    console.error("Gagal mengambil pengaturan", error);
    // Kirim pesan umum ke browser.
    return Response.json(
      { error: "Gagal mengambil pengaturan" },
      { status: 500 },
    );
  }
}

export async function updateSettingsController(
  request: Request,
): Promise<Response> {
  try {
    // Cek admin.
    const authorization = await requireAdmin(request);

    // Tolak kalau bukan admin.
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }

    // Siapkan wadah untuk body.
    let body: unknown;

    // Baca body JSON dari request.
    try {
      body = await request.json();
    } catch (error) {
      // Kalau body bukan JSON, catat lalu tolak.
      console.error("Gagal parsing JSON body settings:", error);
      return Response.json(
        { error: "Body harus berupa JSON yang valid" },
        { status: 400 },
      );
    }

    // Cocokkan body dengan aturan schema.
    const parseResult = updateSettingsSchema.safeParse(body);

    // Kalau tidak cocok, parseResult.success = false.
    if (!parseResult.success) {
      return Response.json(
        {
          // Pesan utama.
          error: "Data pengaturan tidak valid",
          // Daftar kesalahan per field.
          details: parseResult.error.issues.map((issue) => ({
            // Nama field yang salah.
            path: issue.path.join("."),
            // Pesan untuk field itu.
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    // Simpan data yang sudah valid.
    const settings = await updateSettingsService(parseResult.data);

    // Kirim data terbaru.
    return Response.json({ data: settings });
  } catch (error) {
    // Error dari service karena nilai saling bertentangan.
    if (error instanceof InvalidSettingsError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    // Error tak terduga.
    console.error("Gagal memperbarui pengaturan:", error);
    return Response.json(
      { error: "Gagal memperbarui pengaturan" },
      { status: 500 },
    );
  }
}
