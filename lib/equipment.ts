export type EquipmentItem = {
  id: string;
  name: string;
  description?: string;
  pricePerUnit: number;
  unit?: string;
};

export const venueEquipment: Record<string, EquipmentItem[]> = {
  "smash-padel-club-kemang": [
    {
      id: "wilson-pro-rental",
      name: "Rental Racket (Wilson Pro)",
      description: "Wilson Pro Staff padel racket, grip baru setiap sesi",
      pricePerUnit: 70000,
      unit: "per racket / session",
    },
    {
      id: "padel-ball",
      name: "Padel Ball",
      description: "Bola padel premium untuk satu sesi bermain",
      pricePerUnit: 25000,
      unit: "per ball",
    },
    {
      id: "ball-boy",
      name: "Court Assistant / Ball Boy",
      description: "Bantu pungut bola dan menjaga kelancaran permainan",
      pricePerUnit: 100000,
      unit: "per session",
    },
    {
      id: "bullpadel-3pack",
      name: "Can of Fresh Padel Balls",
      description: "BullPadel Premium Pro (3 pack)",
      pricePerUnit: 150000,
      unit: "per can",
    },
    {
      id: "towel-rental",
      name: "Handuk Bersih",
      description: "Handuk steril siap pakai, dikembalikan setelah sesi",
      pricePerUnit: 20000,
      unit: "per towel",
    },
  ],
  "gelora-padel-club": [
    {
      id: "padel-racket",
      name: "Rental Racket (Padel)",
      description: "Premier padel racket, ready at your court",
      pricePerUnit: 75000,
      unit: "per racket / session",
    },
    {
      id: "padel-ball",
      name: "Padel Ball",
      description: "One ball per player set",
      pricePerUnit: 25000,
      unit: "per ball",
    },
    {
      id: "ball-boy",
      name: "Court Assistant / Ball Boy",
      description: "Ball collection & court assistance",
      pricePerUnit: 100000,
      unit: "per session",
    },
    {
      id: "bullpadel-3pack",
      name: "Can of Fresh Padel Balls",
      description: "BullPadel Premium Pro (3 pack)",
      pricePerUnit: 150000,
      unit: "per can",
    },
  ],
};

export function getVenueEquipment(slug: string): EquipmentItem[] {
  return venueEquipment[slug] ?? [];
}