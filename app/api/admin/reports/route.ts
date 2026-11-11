import { getReportController } from "@/modules/reports/report.controller";

// GET: laporan keuangan, hanya admin
export async function GET(request: Request): Promise<Response> {
  return getReportController(request);
}