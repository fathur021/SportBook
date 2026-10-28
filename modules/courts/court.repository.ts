import { prisma } from "@/lib/prisma";
import type { CreateCourtInput, UpdateCourtInput } from "./court.schema";

const courtSelect = {
  id: true,
  venueId: true,
  name: true,
  sport: true,
  surface: true,
  isIndoor: true,
  pricePerHour: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

// Cari ID venue berdasarkan slug
export function findVenueBySlug(slug: string) {
  return prisma.venue.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });
}

// Ambil semua lapangan di suatu venue
export function findCourtsByVenueId(venueId: string) {
  return prisma.court.findMany({
    where: { venueId },
    orderBy: { name: "asc" },
    select: courtSelect,
  });
}

// Tambah lapangan baru
export function createCourt(venueId: string, data: CreateCourtInput) {
  return prisma.court.create({
    data: {
      venueId,
      ...data,
    },
    select: courtSelect,
  });
}

// Update data lapangan
export function updateCourtById(id: string, data: UpdateCourtInput) {
  return prisma.court.update({
    where: { id },
    data,
    select: courtSelect,
  });
}

// Nonaktifkan lapangan (Soft delete)
export function deactivateCourtById(id: string) {
  return prisma.court.update({
    where: { id },
    data: { isActive: false },
    select: courtSelect,
  });
}
