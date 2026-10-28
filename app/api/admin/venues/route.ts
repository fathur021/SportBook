import { createVenueController,getAdminVenuesController } from "@/modules/venues/venue.controller";

export async function POST(request: Request) {
  return createVenueController(request);
}
export async function GET(request: Request) {
  return getAdminVenuesController(request);
}