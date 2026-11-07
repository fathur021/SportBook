import {
  MAX_DAYS_AHEAD,
  toDateKey,
  type AvailabilityByDate,
} from "@/lib/booking-dates";
import { getCourtAvailabilityRangeService } from "@/modules/bookings/booking.service";

export async function getCourtAvailability(
  courtId: string,
): Promise<AvailabilityByDate> {
  const today = new Date();
  const startDate = toDateKey(today);
  const endDate = toDateKey(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + MAX_DAYS_AHEAD,
    ),
  );

  const days = await getCourtAvailabilityRangeService(
    courtId,
    startDate,
    endDate,
  );
  const result: AvailabilityByDate = {};
  for (const day of days) {
    result[day.date] = { slots: day.slots };
  }
  return result;
}
