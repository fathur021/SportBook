// Mengimpor middleware/guard untuk memverifikasi bahwa pengakses adalah role ADMIN
import { requireAdmin } from "../auth/auth.guard";
// Mengimpor skema validasi Zod untuk ID dan data payload court
import {
  courtIdSchema,
  createCourtSchema,
  updateCourtSchema,
} from "./court.schema";
// Mengimpor fungsi-fungsi service dan custom error class
import {
  CourtNameConflictError,
  CourtNotFoundError,
  createCourtService,
  deactivateCourtService,
  listCourtsByVenueSlugService,
  updateCourtService,
} from "./court.service";
// Mengimpor error dan skema validasi slug venue
import { VenueNotFoundError } from "../venues/venue.service";
import { venueSlugSchema } from "../venues/venue.schema";

// 1. Controller: Mengambil daftar lapangan berdasarkan slug venue (Publik/Admin)
export async function getCourtsByVenueController(
  rawSlug: string, // Parameter slug venue dari URL
): Promise<Response> {
  // Validasi format slug venue menggunakan Zod
  const slugResult = venueSlugSchema.safeParse(rawSlug);
  // Jika slug tidak valid (kosong atau format salah), tolak dengan HTTP 400 Bad Request
  if (!slugResult.success) {
    return Response.json({ error: "Slug venue tidak valid" }, { status: 400 });
  }

  try {
    // Panggil service untuk mengambil daftar data lapangan
    const courts = await listCourtsByVenueSlugService(slugResult.data);
    // Kembalikan HTTP 200 OK dengan format response { data: [...] }
    return Response.json({ data: courts });
  } catch (error) {
    // Jika slug venue tidak ditemukan di database, kembalikan HTTP 404 Not Found
    if (error instanceof VenueNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    // Catat log error teknis di console terminal untuk debugging
    console.error("Gagal mengambil daftar lapangan:", error);
    // Kembalikan HTTP 500 Internal Server Error untuk error tak terduga
    return Response.json(
      { error: "Gagal mengambil daftar lapangan" },
      { status: 500 },
    );
  }
}

// 2. Controller: Menambahkan lapangan baru ke venue (Khusus Admin)
export async function createCourtController(
  request: Request, // Objek Request HTTP dari klien
  rawSlug: string, // Parameter slug venue dari URL
): Promise<Response> {
  try {
    // Periksa apakah user yang melakukan request sudah login dan berstatus ADMIN
    const authorization = await requireAdmin(request);
    // Jika bukan admin (atau token invalid/expired), tolak langsung (HTTP 401 atau 403)
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }

    // Validasi format slug venue dari URL
    const slugResult = venueSlugSchema.safeParse(rawSlug);
    if (!slugResult.success) {
      return Response.json({ error: "Slug venue tidak valid" }, { status: 400 });
    }

    // Baca dan parse isi body request ke dalam format JSON
    let body: unknown;
    try {
      body = await request.json(); // Mengurai string JSON menjadi JavaScript object
    } catch (error) {
      console.error("Gagal parsing JSON body court:", error);
      // Jika body bukan JSON yang valid, kembalikan HTTP 400
      return Response.json(
        { error: "Body harus berupa JSON yang valid" },
        { status: 400 },
      );
    }

    // Validasi struktur dan tipe data body menggunakan createCourtSchema (Zod)
    const parseResult = createCourtSchema.safeParse(body);
    // Jika data tidak lolos validasi (misal: harga kurang dari 10.000, nama kosong)
    if (!parseResult.success) {
      return Response.json(
        {
          error: "Data lapangan tidak valid",
          // Format rincian error Zod agar jelas bagi frontend
          details: parseResult.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }, // HTTP 400 Bad Request
      );
    }

    // Panggil service untuk menyimpan lapangan ke database
    const court = await createCourtService(slugResult.data, parseResult.data);
    // Kembalikan HTTP 201 Created dengan data lapangan yang berhasil dibuat
    return Response.json({ data: court }, { status: 201 });
  } catch (error) {
    // Tangani jika venue tidak ditemukan (HTTP 404)
    if (error instanceof VenueNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    // Tangani jika nama lapangan sudah ada di venue ini (HTTP 409 Conflict)
    if (error instanceof CourtNameConflictError) {
      return Response.json({ error: error.message }, { status: 409 });
    }

    // Tangani error server lainnya (HTTP 500)
    console.error("Gagal membuat lapangan:", error);
    return Response.json({ error: "Gagal membuat lapangan" }, { status: 500 });
  }
}

// 3. Controller: Memperbarui data lapangan (Khusus Admin)
export async function updateCourtController(
  request: Request, // Objek Request HTTP
  rawCourtId: string, // ID lapangan dari URL
): Promise<Response> {
  try {
    // Autentikasi: Hanya admin yang boleh mengedit lapangan
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }

    // Validasi parameter ID lapangan dengan Zod
    const idResult = courtIdSchema.safeParse(rawCourtId);
    if (!idResult.success) {
      return Response.json({ error: "ID lapangan tidak valid" }, { status: 400 });
    }

    // Parsing body request JSON
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Gagal parsing JSON body update court:", error);
      return Response.json(
        { error: "Body harus berupa JSON yang valid" },
        { status: 400 },
      );
    }

    // Validasi data perubahan menggunakan updateCourtSchema
    const parseResult = updateCourtSchema.safeParse(body);
    // Jika tidak valid atau payload kosong tanpa field
    if (!parseResult.success) {
      return Response.json(
        {
          error: "Data lapangan tidak valid",
          details: parseResult.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    // Eksekusi service update data lapangan
    const court = await updateCourtService(idResult.data, parseResult.data);
    // Kembalikan HTTP 200 OK dengan data lapangan terbaru
    return Response.json({ data: court });
  } catch (error) {
    // Tangani jika ID lapangan tidak ada di database (HTTP 404)
    if (error instanceof CourtNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    // Tangani jika perubahan nama menyebabkan bentrok unik nama lapangan (HTTP 409)
    if (error instanceof CourtNameConflictError) {
      return Response.json({ error: error.message }, { status: 409 });
    }

    // Catat log error teknis
    console.error("Gagal memperbarui lapangan:", error);
    return Response.json(
      { error: "Gagal memperbarui lapangan" },
      { status: 500 },
    );
  }
}

// 4. Controller: Menonaktifkan lapangan / Soft Delete (Khusus Admin)
export async function deactivateCourtController(
  request: Request, // Objek Request HTTP
  rawCourtId: string, // ID lapangan dari URL
): Promise<Response> {
  try {
    // Autentikasi: Hanya admin yang boleh menghapus/menonaktifkan lapangan
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }

    // Validasi parameter ID lapangan
    const idResult = courtIdSchema.safeParse(rawCourtId);
    if (!idResult.success) {
      return Response.json({ error: "ID lapangan tidak valid" }, { status: 400 });
    }

    // Eksekusi service untuk menonaktifkan lapangan (isActive = false)
    const court = await deactivateCourtService(idResult.data);
    // Kembalikan HTTP 200 OK beserta data lapangan yang telah dinonaktifkan
    return Response.json({ data: court });
  } catch (error) {
    // Tangani jika lapangan tidak ditemukan (HTTP 404)
    if (error instanceof CourtNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    // Tangani error server lainnya (HTTP 500)
    console.error("Gagal menonaktifkan lapangan:", error);
    return Response.json(
      { error: "Gagal menonaktifkan lapangan" },
      { status: 500 },
    );
  }
}
