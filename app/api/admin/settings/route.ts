import {
  getSettingsController,
  updateSettingsController,
} from "@/modules/settings/settings.controller";

export async function GET(request: Request) {
  return getSettingsController(request);
}
export async function PATCH(request: Request) {
  return updateSettingsController(request);
}
