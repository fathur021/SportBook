import {
  MAX_DAYS_AHEAD,
  toDateKey,
  type AvailabilityByDate,
} from "@/lib/booking-dates";

const SLOT_PATTERN = [4, 6, 7, 5, 2, 1, 3, 0]; // 0 = penuh

export async function getCourtAvailability(
  _courtId: string
): Promise<AvailabilityByDate> {
  // TODO: ganti dengan query database / fetch ke backend berdasarkan _courtId
  void _courtId;
  const now = new Date();
  const result: AvailabilityByDate = {};

  for (let i = 0; i <= MAX_DAYS_AHEAD; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    result[toDateKey(date)] = {
      slots: SLOT_PATTERN[i % SLOT_PATTERN.length],
      maintenance: i > 0 && i % 11 === 0,
    };
  }
  return result;
}