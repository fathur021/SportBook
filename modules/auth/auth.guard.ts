import { getRequestSession } from "@/lib/auth-session";

export async function requireAdmin(request: Request) {
  const session = await getRequestSession(request);

  if (!session) {
    return {
      ok: false as const,
      status: 401 as const,
      error: "UNAUTHENTICATED",
    };
  }
  if (session.user.role !== "ADMIN") {
    return {
      ok: false as const,
      status: 403 as const,
      error: "FORBIDDEN",
    };
  }
  return {
    ok:true  as const,
    user:session.user
  }
}


