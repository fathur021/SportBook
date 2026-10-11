export const MAX_DAYS_AHEAD = 30;

export type DayAvailability = { slots: number; maintenance?: boolean };
export type AvailabilityByDate = Record<string, DayAvailability>;

// Format lokal "YYYY-MM-DD" (tidak pakai toISOString supaya tidak bergeser di Asia/Jakarta)
export const toDateKey = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};