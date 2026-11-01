import { updateBookingStatusController } from "@/modules/bookings/booking.controller";

// PATCH: ubah status booking, hanya admin
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
): Promise<Response> {
  const { bookingId } = await params; // tunggu Promise params lalu ambil bookingId
  return updateBookingStatusController(request, bookingId); // serahkan ke controller
}