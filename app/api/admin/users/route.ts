import { listUsersController } from "@/modules/users/user.controller";

export async function GET(request:Request):Promise<Response>{
    return listUsersController(request);
}
