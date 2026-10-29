import {
  deactivateEquipmentController,
  updateEquipmentController,
} from "@/modules/equipment/equipment.controller";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ equipmentId: string }> },
): Promise<Response> {
  const { equipmentId } = await params;
  return updateEquipmentController(request, equipmentId);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ equipmentId: string }> },
): Promise<Response> {
  const { equipmentId } = await params;
  return deactivateEquipmentController(request, equipmentId);
}