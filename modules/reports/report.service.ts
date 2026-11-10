import {
  countCancelledBookings,
  findPaidBookingsForReport,
  findRecentPaidBookingsForReport,
} from "./report.repository";

import type { ReportQuery } from "./report.schema";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getReportService(query: ReportQuery) {
  const playDateFrom =
    query.period === "all"
      ? null
      : toDateKey(new Date(Date.now() - Number(query.period) * DAY_IN_MS));

  const [paidBookings, recentPaidBookings, cancelledBookingCount] =
    await Promise.all([
      findPaidBookingsForReport({
        venueSlug: query.venueSlug,
        playDateFrom,
      }),
      findRecentPaidBookingsForReport({
        venueSlug: query.venueSlug,
        playDateFrom,
      }),
      countCancelledBookings({
        venueSlug: query.venueSlug,
        playDateFrom,
      }),
    ]);

  let revenue = 0;
  const venueMap = new Map<
    string,
    { venueName: string; total: number; transactionCount: number }
  >();

  for (const booking of paidBookings) {
    const amount = booking.payment?.amount ?? 0;
    revenue += amount;

    const venueSlug = booking.court.venue.slug;
    const current = venueMap.get(venueSlug) ?? {
      venueName: booking.court.venue.name,
      total: 0,
      transactionCount: 0,
    };
    current.total += amount;
    current.transactionCount += 1;
    venueMap.set(venueSlug, current);
  }

  const venues = [...venueMap.values()].sort((a, b) => b.total - a.total);

  const transactions = recentPaidBookings.map((booking) => ({
    id: booking.id,
    orderCode: booking.orderCode,
    playDate: booking.playDate,
    startTime: booking.startTime,
    endTime: booking.endTime,
    venueName: booking.court.venue.name,
    courtName: booking.court.name,
    amount: booking.payment?.amount ?? 0,
    method: booking.payment?.method ?? null,
    paidAt: booking.payment?.paidAt
      ? booking.payment.paidAt.toISOString()
      : null,
    bookingStatus: booking.status,
  }));

  return {
    revenue,
    paidTransactionCount: paidBookings.length,
    cancelledBookingCount,
    venues,
    transactions,
  };
}
