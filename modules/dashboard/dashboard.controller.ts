import { requireAdmin } from "../auth/auth.guard";
import { getDashboardSummaryService } from "./dashboard.service";

export async function getDashboardSummaryController(
  request: Request,
): Promise<Response> {
  try {
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      // Kirim pesan error yang sudah disiapkan oleh requireAdmin.
      // Statusnya 401 kalau belum login, 403 kalau bukan admin.
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }
    // Jalankan pengambilan data.
    const summary = await getDashboardSummaryService();
    return Response.json({data:summary})
  } catch (error) {
    // Tampilkan error asli di terminal supaya mudah dilacak.
    console.error("Gagal mengambil ringkasan dashboard:", error);

    // Frontend cukup menerima pesan umum, bukan detail error database.
    return Response.json(
      { error: "Gagal mengambil ringkasan dashboard" },
      { status: 500 },
    );
  }
}
