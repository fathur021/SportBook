import { getMeController } from "@/modules/auth/auth.controller";

export async function GET(request: Request) {
  return getMeController(request);
}
