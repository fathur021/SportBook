import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const reportBookingSelect = {
  id: true,
  orderCode: true,
  playDate: true,
  startTime: true,
  endTime: true,
  status: true,
  payment: {
    select: {
      amount: true,
      method: true,
      paidAt: true,
    },
  },
  court: {
    select: {
      name: true,
      venue: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  },
};

function paidBookingWhere({
  venueSlug,
  paidAtFrom,
}: {
  venueSlug?: string;
  paidAtFrom: Date | null;
}) {
  return {
    status: { not: "CANCELLED" },
    payment: {
      is: {
        status: "PAID",
        // Filter periode memakai paidAt (tanggal pembayaran),
        // bukan playDate (tanggal main).
        ...(paidAtFrom ? { paidAt: { gte: paidAtFrom } } : {}),
      },
    },
    ...(venueSlug ? { court: { venue: { slug: venueSlug } } } : {}),
  } satisfies Prisma.BookingWhereInput;
}

export function findPaidBookingsForReport({
  venueSlug,
  paidAtFrom,
}: {
  venueSlug?: string;
  paidAtFrom: Date | null;
}) {
  return prisma.booking.findMany({
    where: paidBookingWhere({ venueSlug, paidAtFrom }),
    orderBy: {
      payment: {
        paidAt: "desc",
      },
    },
    select: reportBookingSelect,
  });
}

export function findRecentPaidBookingsForReport({
  venueSlug,
  paidAtFrom,
  take = 20,
}: {
  venueSlug?: string;
  paidAtFrom: Date | null;
  take?: number;
}) {
  return prisma.booking.findMany({
    where: paidBookingWhere({ venueSlug, paidAtFrom }),
    orderBy: {
      payment: {
        paidAt: "desc",
      },
    },
    take,
    select: reportBookingSelect,
  });
}

export function countCancelledBookings({
  venueSlug,
  playDateFrom,
}: {
  venueSlug?: string;
  playDateFrom: string | null;
}) {
  return prisma.booking.count({
    where: {
      status: "CANCELLED",
      ...(playDateFrom ? { playDate: { gte: playDateFrom } } : {}),
      ...(venueSlug ? { court: { venue: { slug: venueSlug } } } : {}),
    },
  });
}
