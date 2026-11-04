import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateVenueInput, UpdateVenueInput } from "./venue.schema";

const publicVenueSelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  address: true,
  city: true,
  phone: true,
  coverImage: true,
  facilities: true,
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
      image: true,
      maxPlayers: true,
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
  facilities: true,
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

export function updateVenueBySlug(slug: string, data: UpdateVenueInput) {
  return prisma.venue.update({
    where: { slug },
    data,
    select: createdVenueSelect,
  });
}

export function deactivateVenueBySlug(slug: string) {
  return prisma.venue.update({
    where: { slug },
    data: { isActive: false },
    select: createdVenueSelect,
  });
}

export function findAdminVenues() {
  return prisma.venue.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      ...createdVenueSelect,
      courts: {
        select: {
          id: true,
          name: true,
          sport: true,
          pricePerHour: true,
          image: true,
          maxPlayers: true,
          isActive: true,
        },
      },
    },
  });
}
