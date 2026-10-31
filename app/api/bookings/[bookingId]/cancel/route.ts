import { cancelBookingController } from "@/modules/bookings/booking.controller";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
): Promise<Response> {
  // tunggu Promise params lalu ambil bookingId dari URL
  const { bookingId } = await params;
  // serahkan request dan bookingId ke controller pembatalan
  return cancelBookingController(request, bookingId);
}