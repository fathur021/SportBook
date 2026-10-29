// Mengimpor handler fungsi controller untuk update dan deactivate (soft delete)
import {
  deactivateCourtController,
  updateCourtController,
} from "@/modules/courts/court.controller";

// Handler HTTP PATCH: Memperbarui sebagian field data lapangan
// Endpoint: PATCH /api/admin/courts/[courtId]
export async function PATCH(
  request: Request, // Objek HTTP Request yang membawa data perubahan dalam JSON
  { params }: { params: Promise<{ courtId: string }> }, // Next.js dynamic params berupa Promise
): Promise<Response> {
  const { courtId } = await params; // Menunggu Promise params dan mengekstrak courtId dari URL
  return updateCourtController(request, courtId); // Meneruskan request dan courtId ke controller
}

// Handler HTTP DELETE: Menonaktifkan lapangan (Soft delete)
// Endpoint: DELETE /api/admin/courts/[courtId]
export async function DELETE(
  request: Request, // Objek HTTP Request untuk verifikasi otentikasi admin
  { params }: { params: Promise<{ courtId: string }> }, // Next.js dynamic params
): Promise<Response> {
  const { courtId } = await params; // Ekstrak courtId dari URL
  return deactivateCourtController(request, courtId); // Meneruskan ke controller
}
