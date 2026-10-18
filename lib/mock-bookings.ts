// Tipe data item booking
export type BookingStatus = "upcoming" | "completed" | "cancelled";

export type BookingItem = {
  id: string;
  orderId: string;
  venueName: string;
  venueSlug: string;
  venueAddress: string;
  venueImage: string;
  sportLabel: string;
  courtLabel: string;
  date: string;
  timeSlot: string;
  durationHours: number;
  totalPrice: number;
  status: BookingStatus;
  paymentMethod: string;
};

// Data contoh untuk pengujian
export const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: "b1",
    orderId: "SPB-892104",
    venueName: "Gelora Padel Senayan",
    venueSlug: "gelora-padel",
    venueAddress: "Gelora Bung Karno, Senayan, Jakarta",
    venueImage: "/hero.webp",
    sportLabel: "Padel Tennis",
    courtLabel: "Court 1 (Panoramic Covered)",
    date: "Sabtu, 24 Okt 2026",
    timeSlot: "19:00 - 21:00",
    durationHours: 2,
    totalPrice: 445000,
    status: "upcoming",
    paymentMethod: "QRIS",
  },
  {
    id: "b2",
    orderId: "SPB-712890",
    venueName: "Kemang Tennis Club",
    venueSlug: "kemang-tennis-club",
    venueAddress: "Jl. Kemang Raya No. 45, Jakarta Selatan",
    venueImage: "/hero.webp",
    sportLabel: "Tennis",
    courtLabel: "Center Court Hard Surface",
    date: "Minggu, 12 Okt 2026",
    timeSlot: "08:00 - 10:00",
    durationHours: 2,
    totalPrice: 380000,
    status: "completed",
    paymentMethod: "BCA VA",
  },
];
