import { updateUserRoleController } from "@/modules/users/user.controller";

export async function PATCH(
    request:Request,
    {params} : {params:Promise<{userId:string}>}
):Promise<Response>{
    const {userId} = await params;
    return updateUserRoleController(request,userId)
}