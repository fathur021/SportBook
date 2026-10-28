import { Prisma } from "@/lib/generated/prisma/client";
import {
  createCourt,
  deactivateCourtById,
  findCourtsByVenueId,
  findVenueBySlug,
  updateCourtById,
} from "./court.repository";
import type { CreateCourtInput, UpdateCourtInput } from "./court.schema";
import { VenueNotFoundError } from "../venues/venue.service";

export class CourtNotFoundError extends Error {
  constructor() {
    super("Lapangan tidak ditemukan");
    this.name = "CourtNotFoundError";
  }
}

export class CourtNameConflictError extends Error {
  constructor() {
    super("Nama lapangan sudah digunakan di venue ini");
    this.name = "CourtNameConflictError";
  }
}

// 1. Ambil semua lapangan di venue
export async function listCourtsByVenueSlugService(venueSlug: string) {
  const venue = await findVenueBySlug(venueSlug);
  if (!venue) {
    throw new VenueNotFoundError();
  }
  return findCourtsByVenueId(venue.id);
}

// 2. Tambah lapangan baru ke venue
export async function createCourtService(
  venueSlug: string,
  input: CreateCourtInput,
) {
  const venue = await findVenueBySlug(venueSlug);
  if (!venue) {
    throw new VenueNotFoundError();
  }
  try {
    return await createCourt(venue.id, input);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new CourtNameConflictError();
    }
    throw error;
  }
}

// 3. Update data lapangan
export async function updateCourtService(
  courtId: string,
  input: UpdateCourtInput,
) {
  try {
    return await updateCourtById(courtId, input);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new CourtNotFoundError();
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new CourtNameConflictError();
    }
    throw error;
  }
}

// 4. Nonaktifkan lapangan
export async function deactivateCourtService(courtId: string) {
  try {
    return await deactivateCourtById(courtId);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new CourtNotFoundError();
    }
    throw error;
  }
}
