import { cancelBookingController } from "@/modules/bookings/booking.controller";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
): Promise<Response> {
  const { bookingId } = await params;
  return cancelBookingController(request, bookingId);
}
