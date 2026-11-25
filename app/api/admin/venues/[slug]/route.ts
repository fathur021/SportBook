import {
  deleteVenueController,
  updateVenueController,
} from "@/modules/venues/venue.controller";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  return updateVenueController(request, slug);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  return deleteVenueController(request, slug);
}
