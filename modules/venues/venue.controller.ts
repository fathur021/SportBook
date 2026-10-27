import {
  getPublicVenueBySlug,
  listPublicVenues,
  createVenueService,
  VenueSlugConflictError,
} from "./venue.service";
import { createVenueSchema, venueSlugSchema } from "./venue.schema";
import { requireAdmin } from "../auth/auth.guard";

export async function getVenuesController(): Promise<Response> {
  try {
    const venues = await listPublicVenues();

    return Response.json({ data: venues });
  } catch (error) {
    console.error("Gagal mengambil daftar venue:", error);

    return Response.json(
      { error: "Gagal mengambil daftar venue" },
      { status: 500 },
    );
  }
}

export async function getVenueBySlugController(
  rawSlug: string,
): Promise<Response> {
  const result = venueSlugSchema.safeParse(rawSlug);

  if (!result.success) {
    return Response.json({ error: "Slug venue tidak valid" }, { status: 400 });
  }

  try {
    const venue = await getPublicVenueBySlug(result.data);

    if (!venue) {
      return Response.json({ error: "Venue tidak ditemukan" }, { status: 404 });
    }

    return Response.json({ data: venue });
  } catch (error) {
    console.error("Gagal mengambil detail venue:", error);

    return Response.json(
      { error: "Gagal mengambil detail venue" },
      { status: 500 },
    );
  }
}

// FIX: ejaan Controller diperbaiki agar nama fungsi konsisten dengan route.
export async function createVenueController(
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
        { error: "Body harus Berupa Json yang Valid" },
        { status: 400 },
      );
    }
    const result = createVenueSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        {
          error: "Data Venue tidak valid",
          details: result.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const venue = await createVenueService(result.data);

    // FIX: kembalikan respons sukses; sebelumnya fungsi berakhir tanpa Response.
    return Response.json({ data: venue }, { status: 201 });
  } catch (error) {
    if (error instanceof VenueSlugConflictError) {
      // FIX: slug duplikat adalah konflik data (409), bukan resource tidak ditemukan (404).
      return Response.json({ error: error.message }, { status: 409 });
    }

    // FIX: log error object agar detail kegagalan tercatat di server.
    console.error("Gagal membuat venue:", error);

    return Response.json(
      { error: "Gagal membuat venue" },
      { status: 500 },
    );
  }
}
