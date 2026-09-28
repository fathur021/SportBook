export type TagTone = "emerald" | "sky" | "indigo";

export type Slot = {
  time: string;
  price: number;
  booked?: boolean;
};

export type CourtSlots = {
  id: string;
  tag: string;
  tagTone: TagTone;
  name: string;
  description: string;
  courtLabel: string;
  defaultSlot: string; // jam yang terpilih di awal, jangan yang booked
  slots: Slot[];
};

export const trendingSlots: CourtSlots[] = [
  {
    id: "gelora-padel-court-02",
    tag: "Padel Court 02 (Indoor)",
    tagTone: "emerald",
    name: "Gelora Padel Hub - Kebayoran",
    description: "Super Panoramic 12mm Tempered Glass Court",
    courtLabel: "Court 02",
    defaultSlot: "19:00 - 20:00",
    slots: [
      { time: "19:00 - 20:00", price: 200000 },
      { time: "20:00 - 21:00", price: 200000 },
      { time: "21:00 - 22:00", price: 200000, booked: true },
    ],
  },
  {
    id: "champion-futsal-court-a",
    tag: "Futsal Court A (Vinyl)",
    tagTone: "sky",
    name: "Champion Arena - Kuningan",
    description: "Shock-absorbent Tarkett standard surface",
    courtLabel: "Court A",
    defaultSlot: "19:00 - 20:00",
    slots: [
      { time: "18:00 - 19:00", price: 150000, booked: true },
      { time: "19:00 - 20:00", price: 180000 },
      { time: "21:00 - 22:00", price: 160000 },
    ],
  },
  {
    id: "smashzone-badminton-court-05",
    tag: "Badminton Court 05",
    tagTone: "indigo",
    name: "SmashZone - BSD City",
    description: "Anti-glare shadowless lighting setup",
    courtLabel: "Court 05",
    defaultSlot: "20:00 - 21:00",
    slots: [
      { time: "18:00 - 19:00", price: 65000 },
      { time: "20:00 - 21:00", price: 75000 },
      { time: "21:00 - 22:00", price: 65000 },
    ],
  },
];