import {
  createVenue,
  deactivateVenueBySlug,
  findPublicVenueBySlug,
  findPublicVenues,
  updateVenueBySlug,
  findAdminVenues,
} from "./venue.repository";
import type { CreateVenueInput, UpdateVenueInput } from "./venue.schema";
import { Prisma } from "@/lib/generated/prisma/client";

export function listPublicVenues() {
  return findPublicVenues();
}
export function getPublicVenueBySlug(slug: string) {
  return findPublicVenueBySlug(slug);
}

export function listAdminVenues(){
  return findAdminVenues();
}

export class VenueSlugConflictError extends Error {
  constructor() {
    super("Slug venue sudah digunakan");
    this.name = "VenueSlugConflictError";
  }
}

export async function createVenueService(input: CreateVenueInput) {
  try {
    return await createVenue(input);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new VenueSlugConflictError();
    }
    throw error;
  }
}

export class VenueNotFoundError extends Error {
  constructor() {
    super("Venue tidak ditemukan");
    this.name = "VenueNotFoundError";
  }
}

export async function updateVenueService(
  slug: string,
  input: UpdateVenueInput,
) {
  try {
    return await updateVenueBySlug(slug, input);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new VenueNotFoundError();
    }
    throw error;
  }
}

export async function deactivateVenueService(slug: string) {
  try {
    return await deactivateVenueBySlug(slug);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new VenueNotFoundError();
    }
    throw error;
  }
}
