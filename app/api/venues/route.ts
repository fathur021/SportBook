import { getVenuesController } from "@/modules/venues/venue.controller";

export async function GET() {
  return getVenuesController();
}
