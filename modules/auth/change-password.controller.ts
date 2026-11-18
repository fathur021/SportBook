import { requireAdmin } from "./auth.guard";
import { changePasswordSchema } from "./change-password.schema";
import {
  changePasswordService,
  ChangePasswordFailedError,
  CredentialPasswordMissingError,
  InvalidCurrentPasswordError,
} from "./change-password.service";

export async function changePasswordController(
  request: Request,
): Promise<Response> {
  try {
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Body harus berupa JSON yang valid" },
        { status: 400 },
      );
    }

    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          error: "Data password tidak valid",
          details: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const result = await changePasswordService(parsed.data, request.headers);

    const headers = new Headers(result.headers);
    headers.set("Cache-Control", "no-store");

    return Response.json(
      { data: result.user },
      { headers, status: 200 },
    );
  } catch (error) {
    if (error instanceof InvalidCurrentPasswordError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof CredentialPasswordMissingError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof ChangePasswordFailedError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    console.error("Gagal ganti password:", error);
    return Response.json(
      { error: "Gagal mengganti password" },
      { status: 500 },
    );
  }
}
