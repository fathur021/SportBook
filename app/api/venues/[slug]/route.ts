import { getVenueBySlugController } from "@/modules/venues/venue.controller";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return getVenueBySlugController(slug);
}
