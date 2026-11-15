// Mengimpor controller yang sudah dibuat.
import { getDashboardSummaryController } from "@/modules/dashboard/dashboard.controller";

// Next.js memanggil fungsi bernama GET saat ada request GET ke URL file ini.
// Jadi alamat lengkapnya: /api/admin/dashboard
export async function GET(request: Request): Promise<Response> {
  // Semua pekerjaan diserahkan ke controller.
  // route hanya bertugas sebagai pintu masuk.
  return getDashboardSummaryController(request);
}