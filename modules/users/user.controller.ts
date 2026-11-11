import { requireAdmin } from "../auth/auth.guard";
import {
  updateUserRoleSchema,
  userIdSchema,
  userListQuerySchema,
} from "./user.schema";
import {
  CannotChangeOwnRoleError,
  listUsersService,
  updateUserRoleService,
  UserNotFoundError,
} from "./user.service";

export async function listUsersController(request: Request): Promise<Response> {
  try {
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }
    const { searchParams } = new URL(request.url);
    const queryResult = userListQuerySchema.safeParse({
      search: searchParams.get("search") ?? undefined,
      role: searchParams.get("role") ?? undefined,
    });
    if (!queryResult.success) {
      return Response.json(
        { error: "Parameter daftar user tidak valid" },
        { status: 400 },
      );
    }
    const users = await listUsersService(queryResult.data);
    return Response.json({ data: users });
  } catch (error) {
    console.error("Gagal mengambil daftar user", error);
    return Response.json(
      { error: "Gagal mengambil daftar user" },
      { status: 500 },
    );
  }
}

export async function updateUserRoleController(
  request: Request,
  rawUserId: string,
): Promise<Response> {
  try {
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }
    const idResult = userIdSchema.safeParse(rawUserId);
    if (!idResult.success) {
      return Response.json({ error: "User ID tidak valid" }, { status: 400 });
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Gagal parsing JSON body user:", error);
      return Response.json(
        { error: "Body harus berupa JSON yang valid" },
        { status: 400 },
      );
    }

    const parseResult = updateUserRoleSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json({ error: "Role tidak valid" }, { status: 400 });
    }

    const user = await updateUserRoleService({
      userId: idResult.data,
      role: parseResult.data.role,
      actorUserId: authorization.user.id,
    });
    return Response.json({ data: user });
  } catch (error) {
    // User tidak ada -> HTTP 404
    if (error instanceof UserNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    // Mengubah role sendiri -> HTTP 400
    if (error instanceof CannotChangeOwnRoleError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    // Error lain -> catat lalu balas HTTP 500
    console.error("Gagal mengubah role user:", error);
    return Response.json(
      { error: "Gagal mengubah role user" },
      { status: 500 },
    );
  }
}
