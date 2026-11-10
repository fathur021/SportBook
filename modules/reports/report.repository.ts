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
  playDateFrom,
}: {
  venueSlug?: string;
  playDateFrom: string | null;
}) {
  return {
    status: { not: "CANCELLED" },
    payment: {
      is: {
        status: "PAID",
      },
    },
    ...(playDateFrom ? { playDate: { gte: playDateFrom } } : {}),
    ...(venueSlug ? { court: { venue: { slug: venueSlug } } } : {}),
  } satisfies Prisma.BookingWhereInput;
}

export function findPaidBookingsForReport({
  venueSlug,
  playDateFrom,
}: {
  venueSlug?: string;
  playDateFrom: string | null;
}) {
  return prisma.booking.findMany({
    where: paidBookingWhere({ venueSlug, playDateFrom }),
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
  playDateFrom,
  take = 20,
}: {
  venueSlug?: string;
  playDateFrom: string | null;
  take?: number;
}) {
  return prisma.booking.findMany({
    where: paidBookingWhere({ venueSlug, playDateFrom }),
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
