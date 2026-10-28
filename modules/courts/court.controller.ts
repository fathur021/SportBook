import { requireAdmin } from "../auth/auth.guard";
import {
  courtIdSchema,
  createCourtSchema,
  updateCourtSchema,
} from "./court.schema";
import {
  CourtNameConflictError,
  CourtNotFoundError,
  createCourtService,
  deactivateCourtService,
  listCourtsByVenueSlugService,
  updateCourtService,
} from "./court.service";
import { VenueNotFoundError } from "../venues/venue.service";
import { venueSlugSchema } from "../venues/venue.schema";

// 1. Ambil daftar court berdasarkan slug venue
export async function getCourtsByVenueController(
  rawSlug: string,
): Promise<Response> {
  const slugResult = venueSlugSchema.safeParse(rawSlug);
  if (!slugResult.success) {
    return Response.json({ error: "Slug venue tidak valid" }, { status: 400 });
  }

  try {
    const courts = await listCourtsByVenueSlugService(slugResult.data);
    return Response.json({ data: courts });
  } catch (error) {
    if (error instanceof VenueNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    console.error("Gagal mengambil daftar lapangan:", error);
    return Response.json(
      { error: "Gagal mengambil daftar lapangan" },
      { status: 500 },
    );
  }
}

// 2. Tambah court baru ke venue (Khusus Admin)
export async function createCourtController(
  request: Request,
  rawSlug: string,
): Promise<Response> {
  try {
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }

    const slugResult = venueSlugSchema.safeParse(rawSlug);
    if (!slugResult.success) {
      return Response.json({ error: "Slug venue tidak valid" }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Gagal parsing JSON body court:", error);
      return Response.json(
        { error: "Body harus berupa JSON yang valid" },
        { status: 400 },
      );
    }

    const parseResult = createCourtSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json(
        {
          error: "Data lapangan tidak valid",
          details: parseResult.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const court = await createCourtService(slugResult.data, parseResult.data);
    return Response.json({ data: court }, { status: 201 });
  } catch (error) {
    if (error instanceof VenueNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof CourtNameConflictError) {
      return Response.json({ error: error.message }, { status: 409 });
    }

    console.error("Gagal membuat lapangan:", error);
    return Response.json({ error: "Gagal membuat lapangan" }, { status: 500 });
  }
}

// 3. Update data lapangan (Khusus Admin)
export async function updateCourtController(
  request: Request,
  rawCourtId: string,
): Promise<Response> {
  try {
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }

    const idResult = courtIdSchema.safeParse(rawCourtId);
    if (!idResult.success) {
      return Response.json({ error: "ID lapangan tidak valid" }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Gagal parsing JSON body update court:", error);
      return Response.json(
        { error: "Body harus berupa JSON yang valid" },
        { status: 400 },
      );
    }

    const parseResult = updateCourtSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json(
        {
          error: "Data lapangan tidak valid",
          details: parseResult.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const court = await updateCourtService(idResult.data, parseResult.data);
    return Response.json({ data: court });
  } catch (error) {
    if (error instanceof CourtNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof CourtNameConflictError) {
      return Response.json({ error: error.message }, { status: 409 });
    }

    console.error("Gagal memperbarui lapangan:", error);
    return Response.json(
      { error: "Gagal memperbarui lapangan" },
      { status: 500 },
    );
  }
}

// 4. Nonaktifkan lapangan (Khusus Admin)
export async function deactivateCourtController(
  request: Request,
  rawCourtId: string,
): Promise<Response> {
  try {
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }

    const idResult = courtIdSchema.safeParse(rawCourtId);
    if (!idResult.success) {
      return Response.json({ error: "ID lapangan tidak valid" }, { status: 400 });
    }

    const court = await deactivateCourtService(idResult.data);
    return Response.json({ data: court });
  } catch (error) {
    if (error instanceof CourtNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    console.error("Gagal menonaktifkan lapangan:", error);
    return Response.json(
      { error: "Gagal menonaktifkan lapangan" },
      { status: 500 },
    );
  }
}
