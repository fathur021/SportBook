import { requireAdmin } from "../auth/auth.guard";
import {
  equipmentIdSchema,
  createEquipmentSchema,
  updateEquipmentSchema,
} from "./equipment.schema";
import {
  EquipmentNameConflictError,
  EquipmentNotFoundError,
  createEquipmentService,
  deactivateEquipmentService,
  listEquipmentsByVenueSlugService,
  updateEquipmentService,
} from "./equipment.service";
import { VenueNotFoundError } from "../venues/venue.service";
import { venueSlugSchema } from "../venues/venue.schema";

// 1. Ambil daftar equipment berdasarkan slug venue
export async function getEquipmentsByVenueController(
  rawSlug: string,
): Promise<Response> {
  const slugResult = venueSlugSchema.safeParse(rawSlug);
  if (!slugResult.success) {
    return Response.json({ error: "Slug venue tidak valid" }, { status: 400 });
  }

  try {
    const equipments = await listEquipmentsByVenueSlugService(slugResult.data);
    return Response.json({ data: equipments });
  } catch (error) {
    if (error instanceof VenueNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    console.error("Gagal mengambil daftar peralatan:", error);
    return Response.json(
      { error: "Gagal mengambil daftar peralatan" },
      { status: 500 },
    );
  }
}

// 2. Tambah equipment baru ke venue (Khusus Admin)
export async function createEquipmentController(
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
      console.error("Gagal parsing JSON body equipment:", error);
      return Response.json(
        { error: "Body harus berupa JSON yang valid" },
        { status: 400 },
      );
    }

    const parseResult = createEquipmentSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json(
        {
          error: "Data peralatan tidak valid",
          details: parseResult.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const equipment = await createEquipmentService(
      slugResult.data,
      parseResult.data,
    );
    return Response.json({ data: equipment }, { status: 201 });
  } catch (error) {
    if (error instanceof VenueNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof EquipmentNameConflictError) {
      return Response.json({ error: error.message }, { status: 409 });
    }

    console.error("Gagal membuat peralatan:", error);
    return Response.json({ error: "Gagal membuat peralatan" }, { status: 500 });
  }
}

// 3. Update data equipment (Khusus Admin)
export async function updateEquipmentController(
  request: Request,
  rawEquipmentId: string,
): Promise<Response> {
  try {
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }

    const idResult = equipmentIdSchema.safeParse(rawEquipmentId);
    if (!idResult.success) {
      return Response.json(
        { error: "ID peralatan tidak valid" },
        { status: 400 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Gagal parsing JSON body update equipment:", error);
      return Response.json(
        { error: "Body harus berupa JSON yang valid" },
        { status: 400 },
      );
    }

    const parseResult = updateEquipmentSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json(
        {
          error: "Data peralatan tidak valid",
          details: parseResult.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const equipment = await updateEquipmentService(
      idResult.data,
      parseResult.data,
    );
    return Response.json({ data: equipment });
  } catch (error) {
    if (error instanceof EquipmentNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof EquipmentNameConflictError) {
      return Response.json({ error: error.message }, { status: 409 });
    }

    console.error("Gagal memperbarui peralatan:", error);
    return Response.json(
      { error: "Gagal memperbarui peralatan" },
      { status: 500 },
    );
  }
}

// 4. Nonaktifkan equipment (Khusus Admin)
export async function deactivateEquipmentController(
  request: Request,
  rawEquipmentId: string,
): Promise<Response> {
  try {
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }

    const idResult = equipmentIdSchema.safeParse(rawEquipmentId);
    if (!idResult.success) {
      return Response.json(
        { error: "ID peralatan tidak valid" },
        { status: 400 },
      );
    }

    const equipment = await deactivateEquipmentService(idResult.data);
    return Response.json({ data: equipment });
  } catch (error) {
    if (error instanceof EquipmentNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    console.error("Gagal menonaktifkan peralatan:", error);
    return Response.json(
      { error: "Gagal menonaktifkan peralatan" },
      { status: 500 },
    );
  }
}