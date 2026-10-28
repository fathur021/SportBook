import {
  createCourtController,
  getCourtsByVenueController,
} from "@/modules/courts/court.controller";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  return getCourtsByVenueController(slug);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  return createCourtController(request, slug);
}
