import { getRequestSession } from "@/lib/auth-session";
import { requireAdmin } from "./auth.guard";

export async function getMeController(request: Request): Promise<Response> {
  const session = await getRequestSession(request);

  if (!session) {
    return Response.json({ error: "Tidak Terautentikasi" }, { status: 401 });
  }

  const { id, name, email, role } = session.user;
  return Response.json({
    data: { id, name, email, role },
  });
}

export async function getAdminMeController(
  request: Request,
): Promise<Response> {
  const authorization = await requireAdmin(request);
  if (!authorization.ok) {
    return Response.json(
      { error: authorization.error },
      { status: authorization.status },
    );
  }
  const { id, name, email, role } = authorization.user;
  return Response.json({
    data: { id, name, email, role },
  });
}
