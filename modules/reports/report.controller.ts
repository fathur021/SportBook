import { requireAdmin } from "../auth/auth.guard";
import { reportQuerySchema } from "./report.schema";
import { getReportService } from "./report.service";

export async function getReportController(request: Request): Promise<Response> {
  try {
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }
    const { searchParams } = new URL(request.url);
    const queryResult = reportQuerySchema.safeParse({
      venueSlug: searchParams.get("venueSlug") ?? undefined,
      period: searchParams.get("period") ?? undefined,
    });
    if (!queryResult.success) {
      return Response.json(
        { error: "Parameter laporan tidak valid" },
        { status: 400 },
      );
    }
    const report = await getReportService(queryResult.data);
    return Response.json({ data: report });
  } catch (error) {
    console.error("Gagal mengambil laporan keuangan:", error);
    return Response.json(
      { error: "Gagal mengambil laporan keuangan" },
      { status: 500 },
    );
  }
}
