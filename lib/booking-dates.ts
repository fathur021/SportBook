export const MAX_DAYS_AHEAD = 30;

export type DayAvailability = { slots: number; maintenance?: boolean };
export type AvailabilityByDate = Record<string, DayAvailability>;

// Kunci tanggal sekarang memakai aturan WIB dari file helper yang sama.
// `getBusinessDateKey` juga disediakan untuk nama yang lebih jelas.
export { getBusinessDateKey, toDateKey } from "@/lib/datetime";