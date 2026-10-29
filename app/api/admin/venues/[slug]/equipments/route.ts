import { createEquipmentController, getEquipmentsByVenueController } from "@/modules/equipment/equipment.controller";

export async function GET(
    _request: Request,
    {params}: {params:Promise<{slug:string}>},
):Promise<Response>{
    const {slug} = await params
    return getEquipmentsByVenueController(slug);
}

export async function POST(
    request: Request,
    {params}: {params:Promise<{slug:string}>}
):Promise<Response>{
    const {slug} = await params;
    return createEquipmentController(request,slug)
}