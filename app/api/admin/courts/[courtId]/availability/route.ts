import { getAvailabiltyController } from "@/modules/bookings/booking.controller";

export async function GET(
    request:Request,
    {params}:{params:Promise<{courtId:string}>}
):Promise<Response>{
    const {courtId} = await params;
    const {searchParams} = new URL(request.url)
    return getAvailabiltyController(courtId,searchParams)
}