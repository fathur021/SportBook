import { getAdminMeController } from "@/modules/auth/auth.controller";

export function GET(request:Request){
    return getAdminMeController(request)
}