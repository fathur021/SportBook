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

// Hitung jumlah peralatan untuk beberapa venue sekaligus.
export function findEquipmentCountsByVenueIds(venueIds: string[]) {
  if (venueIds.length === 0) return Promise.resolve([]);

  return prisma.equipment.findMany({
    where: { venueId: { in: venueIds } },
    select: { venueId: true },
  });
}

export function findActiveEquipmentsByVenueId(venueId: string) {
  return prisma.equipment.findMany({
    where: {
      venueId,
      isActive: true,
      stock: { gt: 0 },
    },
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

// Hard delete equipment — putuskan relasi BookingEquipment dulu, baru hapus equipment
export async function deleteEquipmentById(id: string) {
  // Langkah 1: Set equipmentId = NULL di semua BookingEquipment yang masih merujuk equipment ini
  await prisma.bookingEquipment.updateMany({
    where: { equipmentId: id },
    data: { equipmentId: null },
  });
  // Langkah 2: Hapus equipment itu sendiri
  await prisma.equipment.delete({
    where: { id },
  });
}