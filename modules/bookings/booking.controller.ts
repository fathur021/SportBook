// Mengimpor guard "wajib login" dari modul auth
import { requireUser, requireAdmin } from "../auth/auth.guard";
// Mengimpor "lapangan tidak ditemukan" dari modul court
import { CourtNotFoundError } from "../courts/court.service";
// Mengimpor skema validasi dari modul booking
import {
  availabilityQuerySchema,
  bookingIdSchema,
  createBookingSchema,
  adminBookingQuerySchema,
  updateBookingStatusSchema,
} from "./booking.schema";
// Mengimpor semua service dan custom error — PASTIKAN cancelBookingService ikut terimport
import {
  BookingAccessDeniedError,
  BookingAlreadyFinalizedError,
  BookingNotFoundError,
  cancelBookingService,
  createBookingService,
  EquipmentStockError,
  EquipmentUnavailableError,
  getAvailabilityService,
  InvalidOperatingHourError,
  listMyBookingService,
  PastDateError,
  SlotUnavailableError,
  InvalidStatusTransitionError,
  listAllBookingService,
  updateBookingStatusService,
} from "./booking.service";

// 1. Cek ketersedian lapangan
export async function getAvailabiltyController(
  rawCourtId: string,
  searchParams: URLSearchParams,
): Promise<Response> {
  const queryResult = await availabilityQuerySchema.safeParse({
    date: searchParams.get("date"),
  });
  if (!queryResult.success) {
    return Response.json(
      { error: "Parameter date wajib dengan format YYY-MM-DD" },
      { status: 400 },
    );
  }
  try {
    const result = await getAvailabilityService(
      rawCourtId,
      queryResult.data.date,
    );
    return Response.json({ data: result });
  } catch (error) {
    // Lapangan/venue tidak ada atau non-aktif → HTTP 404
    if (error instanceof CourtNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    console.error("Gagal mengambil availability:", error);
    // Error lain tak terduga → HTTP 500
    return Response.json(
      { error: "Gagal mengambil ketersediaan slot" },
      { status: 500 },
    );
  }
}
//2 create booking
export async function createBookingController(
  request: Request,
): Promise<Response> {
  try {
    const authorization = await requireUser(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Gagal parsing JSON body booking : ", error);
      return Response.json(
        { error: "Body harus berupa JSON yang valid" },
        { status: 400 },
      );
    }
    const parseResult = createBookingSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json(
        {
          error: "Data booking tidak valid",
          details: parseResult.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const booking = await createBookingService(
      authorization.user.id,
      parseResult.data,
    );
    return Response.json({ data: booking }, { status: 201 });
  } catch (error) {
    // Lapangan tidak ditemukan/non-aktif → HTTP 404
    if (error instanceof CourtNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    // Slot sudah diambil → HTTP 409
    if (error instanceof SlotUnavailableError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    if (
      error instanceof EquipmentUnavailableError ||
      error instanceof EquipmentStockError
    ) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    // Jam di luar jam operasional → HTTP 400
    if (error instanceof InvalidOperatingHourError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    // Tanggal sudah lewat → HTTP 400
    if (error instanceof PastDateError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    // Log teknis
    console.error("Gagal membuat booking:", error);
    // Error lain tak terduga → HTTP 500
    return Response.json({ error: "Gagal membuat booking" }, { status: 500 });
  }
}

//3 daftar booking milik user
export async function listMybookingsConstroller(
  request: Request,
): Promise<Response> {
  try {
    const authorization = await requireUser(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }
    const booking = await listMyBookingService(authorization.user.id);
    return Response.json({ data: booking });
  } catch (error) {
    console.error("Gagal mengambil daftar booking:", error);
    return Response.json(
      { error: "Gagal mengambil daftar booking" },
      { status: 500 },
    );
  }
}

//4 batalkan booking
export async function cancelBookingController(
  request: Request,
  rawBookingId: string,
): Promise<Response> {
  try {
    const authorization = await requireUser(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }

    const idResult = bookingIdSchema.safeParse(rawBookingId);
    if (!idResult.success) {
      return Response.json(
        { error: "ID booking tidak valid" },
        { status: 400 },
      );
    }
    const booking = await cancelBookingService(
      authorization.user.id,
      idResult.data,
    );
    return Response.json({ data: booking });
  } catch (error) {
    // Booking tidak ada → HTTP 404
    if (error instanceof BookingNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    // Booking bukan milik user → HTTP 403
    if (error instanceof BookingAccessDeniedError) {
      return Response.json({ error: error.message }, { status: 403 });
    }
    // Booking sudah final → HTTP 409
    if (error instanceof BookingAlreadyFinalizedError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    console.error("Gagal membatalkan booking:", error);
    return Response.json(
      { error: "Gagal membatalkan booking" },
      { status: 500 },
    );
  }
}

// 5. Controller: daftar semua booking — khusus admin
export async function listAllBookingsController(
  request: Request, // session admin dibaca dari cookie di dalamnya
  searchParams: URLSearchParams, // query string (?status= & ?playDate=)
): Promise<Response> {
  try {
    // Autentikasi: hanya ADMIN yang boleh melihat semua booking
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }

    // Validasi filter query dengan Zod (boleh kosong = tanpa filter)
    const queryResult = adminBookingQuerySchema.safeParse({
      status: searchParams.get("status") ?? undefined, // undefined bila tidak dikirim
      playDate: searchParams.get("playDate") ?? undefined,
    });
    if (!queryResult.success) {
      return Response.json(
        { error: "Parameter filter tidak valid" },
        { status: 400 },
      );
    }

    // Ambil semua booking sesuai filter
    const bookings = await listAllBookingService(queryResult.data);
    // HTTP 200 + data
    return Response.json({ data: bookings });
  } catch (error) {
    // Log teknis untuk debugging
    console.error("Gagal mengambil daftar booking admin:", error);
    // Error tak terduga → HTTP 500
    return Response.json(
      { error: "Gagal mengambil daftar booking" },
      { status: 500 },
    );
  }
}

//6. Controller: ubah status booking — khusus admin
export async function updateBookingStatusController(
  request: Request,
  rawBookingId: string,
): Promise<Response> {
  try {
    const authorization = await requireAdmin(request);
    if (!authorization.ok) {
      return Response.json(
        { error: authorization.error },
        { status: authorization.status },
      );
    }
    const idResult = bookingIdSchema.safeParse(rawBookingId);
    if (!idResult.success) {
      return Response.json(
        { error: "ID booking tidak valid" },
        { status: 400 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Gagal parsing JSON body booking : ", error);
      return Response.json(
        { error: "Body harus berupa JSON yang valid" },
        { status: 400 },
      );
    }
    const parseResult = updateBookingStatusSchema.safeParse(body);
    if (!parseResult.success) {
      return Response.json({ error: "Status tidak valid" }, { status: 400 });
    }
    const booking = await updateBookingStatusService(
      idResult.data,
      parseResult.data.status,
    );
    return Response.json({ data: booking });
  } catch (error) {
    // Booking tidak ada → HTTP 404
    if (error instanceof BookingNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    // Booking sudah final (CANCELLED/COMPLETED) → HTTP 409
    if (error instanceof BookingAlreadyFinalizedError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    // Aturan perpindahan dilanggar → HTTP 400
    if (error instanceof InvalidStatusTransitionError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    // Log teknis
    console.error("Gagal mengubah status booking:", error);
    // Error tak terduga → HTTP 500
    return Response.json(
      { error: "Gagal mengubah status booking" },
      { status: 500 },
    );
  }
}
