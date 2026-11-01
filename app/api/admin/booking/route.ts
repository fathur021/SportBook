import { listAllBookingsController } from "@/modules/bookings/booking.controller";

// GET: daftar semua booking, hanya admin
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url); // baca query string dari URL
  return listAllBookingsController(request, searchParams); // serahkan ke controller
}