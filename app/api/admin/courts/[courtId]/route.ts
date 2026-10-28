import {
  deactivateCourtController,
  updateCourtController,
} from "@/modules/courts/court.controller";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ courtId: string }> },
): Promise<Response> {
  const { courtId } = await params;
  return updateCourtController(request, courtId);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ courtId: string }> },
): Promise<Response> {
  const { courtId } = await params;
  return deactivateCourtController(request, courtId);
}
