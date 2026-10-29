import { prisma } from "@/lib/prisma";
import type {
  CreateEquipmentInput,
  UpdateEquipmentInput,
} from "./equipment.schema";

const equipmentSelect = {
  id: true,
  venueId: true,
  name: true,
  category: true,
  price: true,
  stock: true,
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

// Ambil semua peralatan di suatu venue
export function findEquipmentsByVenueId(venueId: string) {
  return prisma.equipment.findMany({
    where: { venueId },
    orderBy: { name: "asc" },
    select: equipmentSelect,
  });
}

// Tambah peralatan baru
export function createEquipment(venueId: string, data: CreateEquipmentInput) {
  return prisma.equipment.create({
    data: {
      venueId,
      ...data,
    },
    select: equipmentSelect,
  });
}

// Update data peralatan
export function updateEquipmentById(id: string, data: UpdateEquipmentInput) {
  return prisma.equipment.update({
    where: { id },
    data,
    select: equipmentSelect,
  });
}

// Nonaktifkan peralatan (Soft delete)
export function deactivateEquipmentById(id: string) {
  return prisma.equipment.update({
    where: { id },
    data: { isActive: false },
    select: equipmentSelect,
  });
}