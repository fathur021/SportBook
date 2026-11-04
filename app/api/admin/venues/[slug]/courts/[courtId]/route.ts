// Mengimpor handler fungsi controller untuk update dan deactivate courts
import {
  updateCourtController,
  deactivateCourtController,
} from "@/modules/courts/court.controller";

// Handler HTTP PATCH: Memperbarui data lapangan
// Endpoint: PATCH /api/admin/venues/[slug]/courts/[courtId]
export async function PATCH(
  request: Request, // Objek HTTP Request yang membawa payload JSON dari klien
  { params }: { params: Promise<{ slug: string; courtId: string }> }, // Next.js dynamic params
): Promise<Response> {
  const { courtId } = await params; // Ekstrak nilai courtId dari URL
  return updateCourtController(request, courtId); // Menyerahkan request dan courtId ke controller
}

// Handler HTTP DELETE: Menonaktifkan lapangan (Soft Delete)
// Endpoint: DELETE /api/admin/venues/[slug]/courts/[courtId]
export async function DELETE(
  request: Request, // Objek HTTP Request
  { params }: { params: Promise<{ slug: string; courtId: string }> }, // Next.js dynamic params
): Promise<Response> {
  const { courtId } = await params; // Ekstrak nilai courtId dari URL
  return deactivateCourtController(request, courtId); // Menyerahkan request dan courtId ke controller
}
