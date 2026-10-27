import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { CreateVenueInput } from "./venue.schema";

const publicVenueSelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  address: true,
  city: true,
  coverImage: true,
  isVerified: true,
  courts: {
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      sport: true,
      surface: true,
      isIndoor: true,
      pricePerHour: true,
    },
  },
} satisfies Prisma.VenueSelect;

const createdVenueSelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  address: true,
  city: true,
  phone: true,
  email: true,
  timeZone: true,
  coverImage: true,
  isVerified: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.VenueSelect;

export function findPublicVenues() {
  return prisma.venue.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: publicVenueSelect,
  });
}

export function findPublicVenueBySlug(slug: string) {
  return prisma.venue.findFirst({
    where: { slug, isActive: true },
    select: publicVenueSelect,
  });
}

export function createVenue(data: CreateVenueInput) {
  return prisma.venue.create({
    data,
    select: createdVenueSelect,
  });
}
