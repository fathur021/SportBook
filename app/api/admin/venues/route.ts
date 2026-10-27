import { createVenueController } from "@/modules/venues/venue.controller";

export async function POST(request: Request) {
  return createVenueController(request);
}