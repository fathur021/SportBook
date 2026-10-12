export type TimeSlotOption = { time: string; booked?: boolean };

// Band jam untuk halaman booking; tidak sama dengan opsi filter sidebar
export const TIME_SLOT_BANDS = [
  { id: "morning", label: "Morning", range: "06:00 - 12:00" },
  { id: "afternoon", label: "Afternoon", range: "12:00 - 17:00" },
  { id: "evening", label: "Evening Prime", range: "17:00 - 23:00" },
] as const;

export type TimeSlotBandId = (typeof TIME_SLOT_BANDS)[number]["id"];
export type TimeSlotBand = {
  id: TimeSlotBandId;
  label: string;
  range: string;
  slots: TimeSlotOption[];
};

// Band ditentukan dari jam mulai pada string "06:00 - 07:00"
const bandOf = (time: string): TimeSlotBandId | null => {
  const hours = parseInt(time.slice(0, 2), 10);
  if (Number.isNaN(hours)) return null;
  if (hours < 12) return "morning";
  if (hours < 17) return "afternoon";
  return "evening";
};

export function getTimeSlotBands(slots: TimeSlotOption[]): TimeSlotBand[] {
  return TIME_SLOT_BANDS.map((band) => ({
    ...band,
    slots: slots.filter((s) => bandOf(s.time) === band.id),
  })).filter((band) => band.slots.length > 0);
}

// Kunci harus sama persis dengan venueDetails[].slug
export const venueTimeSlots: Record<string, TimeSlotOption[]> = {
  // -------------------------------------------------------------
  // Gelora Padel & Sports Club — jam buka 06:00 - 23:00
  // -------------------------------------------------------------
  "gelora-padel-club": [
    { time: "06:00 - 07:00" },
    { time: "07:00 - 08:00" },
    { time: "08:00 - 09:00" },
    { time: "09:00 - 10:00" },
    { time: "10:00 - 11:00" },
    { time: "11:00 - 12:00" },
    { time: "12:00 - 13:00" },
    { time: "13:00 - 14:00" },
    { time: "14:00 - 15:00" },
    { time: "15:00 - 16:00" },
    { time: "16:00 - 17:00" },
    { time: "17:00 - 18:00" },
    { time: "18:00 - 19:00", booked: true },
    { time: "19:00 - 20:00", booked: true },
    { time: "20:00 - 21:00", booked: true },
    { time: "21:00 - 22:00" },
    { time: "22:00 - 23:00" },
  ],

  // -------------------------------------------------------------
  // Champion Futsal Arena — jam buka 07:00 - 24:00
  // -------------------------------------------------------------
  "champion-futsal-arena": [
    { time: "07:00 - 08:00" },
    { time: "08:00 - 09:00" },
    { time: "09:00 - 10:00" },
    { time: "10:00 - 11:00" },
    { time: "11:00 - 12:00" },
    { time: "12:00 - 13:00" },
    { time: "13:00 - 14:00" },
    { time: "14:00 - 15:00" },
    { time: "15:00 - 16:00" },
    { time: "16:00 - 17:00" },
    { time: "17:00 - 18:00" },
    { time: "18:00 - 19:00", booked: true },
    { time: "19:00 - 20:00", booked: true },
    { time: "20:00 - 21:00" },
    { time: "21:00 - 22:00" },
    { time: "22:00 - 23:00" },
    { time: "23:00 - 24:00" },
  ],

  // -------------------------------------------------------------
  // SmashZone Badminton Hub — jam buka 06:00 - 22:00
  // -------------------------------------------------------------
  "smashzone-badminton-hub": [
    { time: "06:00 - 07:00" },
    { time: "07:00 - 08:00" },
    { time: "08:00 - 09:00" },
    { time: "09:00 - 10:00" },
    { time: "10:00 - 11:00" },
    { time: "11:00 - 12:00" },
    { time: "12:00 - 13:00" },
    { time: "13:00 - 14:00" },
    { time: "14:00 - 15:00" },
    { time: "15:00 - 16:00" },
    { time: "16:00 - 17:00" },
    { time: "17:00 - 18:00" },
    { time: "18:00 - 19:00", booked: true },
    { time: "19:00 - 20:00" },
    { time: "20:00 - 21:00", booked: true },
    { time: "21:00 - 22:00" },
  ],

  // -------------------------------------------------------------
  // Apex Basketball Center — jam buka 08:00 - 23:00
  // -------------------------------------------------------------
  "apex-basketball-center": [
    { time: "08:00 - 09:00" },
    { time: "09:00 - 10:00" },
    { time: "10:00 - 11:00" },
    { time: "11:00 - 12:00" },
    { time: "12:00 - 13:00" },
    { time: "13:00 - 14:00" },
    { time: "14:00 - 15:00" },
    { time: "15:00 - 16:00" },
    { time: "16:00 - 17:00" },
    { time: "17:00 - 18:00" },
    { time: "18:00 - 19:00" },
    { time: "19:00 - 20:00", booked: true },
    { time: "20:00 - 21:00", booked: true },
    { time: "21:00 - 22:00" },
    { time: "22:00 - 23:00" },
  ],
};

// Getter dipakai oleh page venue, widget, dan halaman /book
export function getTimeSlots(slug: string): TimeSlotOption[] {
  return venueTimeSlots[slug] ?? [];
}