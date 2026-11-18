import { changePasswordController } from "@/modules/auth/change-password.controller";

export async function POST(request: Request): Promise<Response> {
  return changePasswordController(request);
}
