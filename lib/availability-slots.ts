import type { TimeSlotOption } from "./time-slots";

export type AvailabilitySlot = {
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

// [TAMBAH] Ubah ke bentuk yang dipakai SelectTimeSlot.
export function toTimeSlotOptions(
  slots: AvailabilitySlot[],
): TimeSlotOption[] {
  return slots.map((slot) => ({
    time: `${slot.startTime} - ${slot.endTime}`,
    booked: slot.isBooked,
  }));
}