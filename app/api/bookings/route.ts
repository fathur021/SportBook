import { createBookingController, listMybookingsConstroller } from "@/modules/bookings/booking.controller";

export async function POST(request: Request): Promise<Response> {
    return createBookingController(request);
}
export async function GET(request: Request): Promise<Response> {
    return listMybookingsConstroller(request);
}