import {
  createVenue,
  findPublicVenueBySlug,
  findPublicVenues,
} from "./venue.repository";
import type { CreateVenueInput } from "./venue.schema";
import { Prisma } from "@/lib/generated/prisma/client";


export function listPublicVenues() {
  return findPublicVenues();
}
export function getPublicVenueBySlug(slug: string) {
  return findPublicVenueBySlug(slug);
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
