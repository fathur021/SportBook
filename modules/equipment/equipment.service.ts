import { Prisma } from "@/lib/generated/prisma/client";
import {
  createEquipment,
  deactivateEquipmentById,
  findEquipmentCountsByVenueIds,
  findEquipmentsByVenueId,
  findVenueBySlug,
  updateEquipmentById,
  findActiveEquipmentsByVenueId,
  deleteEquipmentById,
} from "./equipment.repository";
import type {
  CreateEquipmentInput,
  UpdateEquipmentInput,
} from "./equipment.schema";
import { VenueNotFoundError } from "../venues/venue.service";
import { requireAdmin } from "../auth/auth.guard";

export class EquipmentNotFoundError extends Error {
  constructor() {
    super("Peralatan tidak ditemukan");
    this.name = "EquipmentNotFoundError";
  }
}

export class EquipmentNameConflictError extends Error {
  constructor() {
    super("Nama peralatan sudah digunakan di venue ini");
    this.name = "EquipmentNameConflictError";
  }
}

// 1. Ambil semua peralatan di venue
export async function listEquipmentsByVenueSlugService(venueSlug: string) {
  const venue = await findVenueBySlug(venueSlug);
  if (!venue) {
    throw new VenueNotFoundError();
  }
  return findEquipmentsByVenueId(venue.id);
}

export async function listActiveEquipmentsByVenueSlugService(
  venueSlug: string,
) {
  const venue = await findVenueBySlug(venueSlug);

  if (!venue) {
    throw new VenueNotFoundError();
  }

  return findActiveEquipmentsByVenueId(venue.id);
}

// Hitung jumlah peralatan per venue untuk daftar admin.
export async function countEquipmentsByVenueIdsService(venueIds: string[]) {
  const rows = await findEquipmentCountsByVenueIds(venueIds);
  const counts = new Map<string, number>();

  for (const row of rows) {
    counts.set(row.venueId, (counts.get(row.venueId) ?? 0) + 1);
  }

  return counts;
}

// 2. Tambah peralatan baru ke venue
export async function createEquipmentService(
  venueSlug: string,
  input: CreateEquipmentInput,
) {
  const venue = await findVenueBySlug(venueSlug);
  if (!venue) {
    throw new VenueNotFoundError();
  }
  try {
    return await createEquipment(venue.id, input);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new EquipmentNameConflictError();
    }
    throw error;
  }
}

// 3. Update data peralatan
export async function updateEquipmentService(
  equipmentId: string,
  input: UpdateEquipmentInput,
) {
  try {
    return await updateEquipmentById(equipmentId, input);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new EquipmentNotFoundError();
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new EquipmentNameConflictError();
    }
    throw error;
  }
}

// 4. Nonaktifkan peralatan
export async function deactivateEquipmentService(equipmentId: string) {
  try {
    return await deactivateEquipmentById(equipmentId);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new EquipmentNotFoundError();
    }
    throw error;
  }
}

export async function deleteEquipmentService(equipmentId: string) {
  try {
    return await deleteEquipmentById(equipmentId);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new EquipmentNotFoundError();
    }
    throw error;
  }
}
