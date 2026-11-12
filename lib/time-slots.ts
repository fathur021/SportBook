export type TimeSlotOption = { time: string; booked?: boolean };

// Menambah jam pada string "HH:MM". Contoh: ("09:00", 2) => "11:00".
// Dipakai untuk menghitung jam selesai sesuai durasi sesi.
export function addHoursToTime(time: string, hours: number) {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;

  const totalMinutes = h * 60 + m + Math.round(hours * 60);
  const endHour = Math.floor(totalMinutes / 60) % 24;
  const endMinute = totalMinutes % 60;

  return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
}


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
