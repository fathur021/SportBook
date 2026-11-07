// Mengubah data booking dari database menjadi bentuk yang dipakai
// halaman MyBooking (kartu dan tabel).

export type BookingStatus = "upcoming" | "completed" | "cancelled";

export type MyBookingItem = {
  id: string;
  orderId: string;
  venueName: string;
  venueSlug: string;
  venueImage: string;
  sportLabel: string;
  courtLabel: string;
  date: string;
  timeSlot: string;
  durationHours: number;
  totalPrice: number;
  status: BookingStatus;
  sortKey: string;
  bookingStatus: string;
  paymentStatus: string | null;
  paymentMethod: string;
};

type BookingRow = {
  id: string;
  orderCode: string;
  playDate: string;
  startTime: string;
  endTime: string;
  durationHour: number;
  totalPrice: number;
  status: string;
  payment: {
    status: string;
    method: string | null;
  } | null;
  court: {
    name: string;
    sport: string;
    venue: {
      name: string;
      slug: string;
      address: string;
      coverImage: string | null;
    };
  };
};

// Pembayaran dengan status ini dianggap gagal/kedaluwarsa.
const EXPIRED_PAYMENT_STATUSES = ["EXPIRE", "CANCEL", "DENY"];

function formatDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Cek apakah jam selesai booking sudah lewat.
function isPastEndTime(row: BookingRow) {
  const [y, m, d] = row.playDate.split("-").map(Number);
  const [h, min] = row.endTime.split(":").map(Number);
  return new Date(y, m - 1, d, h, min).getTime() <= Date.now();
}

function toTabStatus(row: BookingRow): BookingStatus {
  if (row.status === "COMPLETED") return "completed";
  if (row.status === "CANCELLED") return "cancelled";

  // Booking yang pembayarannya kedaluwarsa masuk tab Cancelled,
  // supaya tidak terlihat seperti booking yang masih aktif.
  if (
    row.status === "PENDING" &&
    row.payment &&
    EXPIRED_PAYMENT_STATUSES.includes(row.payment.status)
  ) {
    return "cancelled";
  }

  // Booking yang sudah dibayar/dikonfirmasi dan jam selesainya sudah lewat
  // dianggap selesai, tanpa perlu ditandai manual oleh admin.
  if (
    (row.status === "CONFIRMED" || row.payment?.status === "PAID") &&
    isPastEndTime(row)
  ) {
    return "completed";
  }

  return "upcoming";
}

export function toMyBookingItem(row: BookingRow): MyBookingItem {
  return {
    id: row.id,
    orderId: row.orderCode,
    venueName: row.court.venue.name,
    venueSlug: row.court.venue.slug,
    venueImage: row.court.venue.coverImage ?? "/hero.webp",
    sportLabel: row.court.sport,
    courtLabel: row.court.name,
    date: formatDateKey(row.playDate),
    timeSlot: `${row.startTime} - ${row.endTime}`,
    durationHours: row.durationHour,
    totalPrice: row.totalPrice,
    status: toTabStatus(row),
    sortKey: `${row.playDate}T${row.startTime}`,
    bookingStatus: row.status,
    paymentStatus: row.payment?.status ?? null,
    paymentMethod: row.payment?.method
      ? row.payment.method.toUpperCase()
      : "-",
  };
}

export function toMyBookingItems(rows: BookingRow[]) {
  return rows.map(toMyBookingItem);
}

export type BookingBadgeTone = "emerald" | "amber" | "red" | "slate";

export function getBookingBadge(item: MyBookingItem): {
  label: string;
  tone: BookingBadgeTone;
} {
  if (
    item.paymentStatus &&
    EXPIRED_PAYMENT_STATUSES.includes(item.paymentStatus)
  ) {
    return { label: "Expired", tone: "red" };
  }

  if (item.bookingStatus === "CANCELLED") {
    return { label: "Cancelled", tone: "red" };
  }

  if (item.status === "completed") {
    return { label: "Completed", tone: "slate" };
  }

  if (item.paymentStatus === "PAID") {
    return { label: "Paid", tone: "emerald" };
  }

  if (item.paymentStatus === "PENDING") {
    return { label: "Waiting Payment", tone: "amber" };
  }

  if (item.bookingStatus === "CONFIRMED") {
    return { label: "Confirmed", tone: "emerald" };
  }

  return { label: "Unpaid", tone: "slate" };
}
