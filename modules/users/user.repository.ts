import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const userListSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  emailVerified: true,
  createdAt: true,
  _count: {
    select: { bookings: true },
  },
  sessions: {
    orderBy: { updatedAt: "desc" },
    take: 1,
    select: { updatedAt: true },
  },
} satisfies Prisma.UserSelect;

export function findUsers({ search, role }: { search?: string; role?: string }) {
  return prisma.user.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    select: userListSelect,
  });
}

export function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: userListSelect,
  });
}
export function updateUserRoleById(userId:string, role:string){
    return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: userListSelect,
  });
}

