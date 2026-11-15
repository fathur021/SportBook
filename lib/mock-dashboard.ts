// Data contoh untuk tampilan dashboard admin.
// Nanti tinggal diganti dengan data dari API dashboard.

export type DashboardStat = {
  key: "revenue" | "paid" | "pending" | "today";
  label: string;
  value: number;
  note: string;
  trend?: {
    label: string;
    direction: "up" | "down";
  };
};

export const dashboardStats: DashboardStat[] = [
  {
    key: "revenue",
    label: "Pendapatan 30 Hari",
    value: 48_250_000,
    note: "Dari 214 transaksi lunas",
    trend: { label: "12,4% dari bulan lalu", direction: "up" },
  },
  {
    key: "paid",
    label: "Booking Lunas",
    value: 214,
    note: "Periode 30 hari terakhir",
    trend: { label: "8,1% dari bulan lalu", direction: "up" },
  },
  {
    key: "pending",
    label: "Menunggu Pembayaran",
    value: 7,
    note: "3 booking hampir kedaluwarsa",
    trend: { label: "Perlu ditindaklanjuti", direction: "down" },
  },
  {
    key: "today",
    label: "Booking Hari Ini",
    value: 18,
    note: "Dari 24 slot lapangan",
    trend: { label: "6 sesi sedang berjalan", direction: "up" },
  },
];

export type RevenuePoint = {
  date: string;
  revenue: number;
};

// Tren pendapatan harian dua minggu terakhir.
export const revenueTrend: RevenuePoint[] = [
  { date: "2 Nov", revenue: 1_850_000 },
  { date: "3 Nov", revenue: 2_400_000 },
  { date: "4 Nov", revenue: 2_100_000 },
  { date: "5 Nov", revenue: 3_250_000 },
  { date: "6 Nov", revenue: 2_900_000 },
  { date: "7 Nov", revenue: 4_100_000 },
  { date: "8 Nov", revenue: 4_850_000 },
  { date: "9 Nov", revenue: 3_600_000 },
  { date: "10 Nov", revenue: 3_150_000 },
  { date: "11 Nov", revenue: 3_700_000 },
  { date: "12 Nov", revenue: 4_250_000 },
  { date: "13 Nov", revenue: 3_950_000 },
  { date: "14 Nov", revenue: 5_200_000 },
  { date: "15 Nov", revenue: 4_400_000 },
];

export type VenueRevenue = {
  venue: string;
  revenue: number;
  transactions: number;
};

export const venueRevenue: VenueRevenue[] = [
  { venue: "Arena Kemang", revenue: 21_450_000, transactions: 96 },
  { venue: "Futsal Bintaro", revenue: 14_800_000, transactions: 72 },
  { venue: "GOR Tebet", revenue: 8_600_000, transactions: 38 },
  { venue: "Tenis Pondok Indah", revenue: 3_400_000, transactions: 8 },
];

export type ActionNeededItem = {
  id: string;
  orderCode: string;
  customer: string;
  venue: string;
  court: string;
  playDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  minutesLeft: number;
};

export const actionNeeded: ActionNeededItem[] = [
  {
    id: "act-1",
    orderCode: "SB-2611-0142",
    customer: "Rizky Pratama",
    venue: "Arena Kemang",
    court: "Lapangan 2",
    playDate: "Hari ini",
    startTime: "16:00",
    endTime: "17:00",
    totalPrice: 350_000,
    minutesLeft: 3,
  },
  {
    id: "act-2",
    orderCode: "SB-2611-0143",
    customer: "Nadia Putri",
    venue: "Futsal Bintaro",
    court: "Lapangan A",
    playDate: "Hari ini",
    startTime: "19:00",
    endTime: "21:00",
    totalPrice: 700_000,
    minutesLeft: 7,
  },
  {
    id: "act-3",
    orderCode: "SB-2611-0139",
    customer: "Bagas Saputra",
    venue: "GOR Tebet",
    court: "Badminton 1",
    playDate: "Besok",
    startTime: "08:00",
    endTime: "09:00",
    totalPrice: 150_000,
    minutesLeft: 9,
  },
];

export type CourtSchedule = {
  id: string;
  venue: string;
  court: string;
  bookedSlots: number;
  totalSlots: number;
};

export const todaySchedules: CourtSchedule[] = [
  { id: "sch-1", venue: "Arena Kemang", court: "Lapangan 1", bookedSlots: 6, totalSlots: 8 },
  { id: "sch-2", venue: "Arena Kemang", court: "Lapangan 2", bookedSlots: 8, totalSlots: 8 },
  { id: "sch-3", venue: "Futsal Bintaro", court: "Lapangan A", bookedSlots: 5, totalSlots: 6 },
  { id: "sch-4", venue: "GOR Tebet", court: "Badminton 1", bookedSlots: 3, totalSlots: 6 },
];

export type RecentBooking = {
  id: string;
  orderCode: string;
  customer: string;
  venue: string;
  court: string;
  playDate: string;
  time: string;
  amount: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
};

export const recentBookings: RecentBooking[] = [
  {
    id: "rb-1",
    orderCode: "SB-2611-0145",
    customer: "Dewi Lestari",
    venue: "Arena Kemang",
    court: "Lapangan 1",
    playDate: "15 Nov 2026",
    time: "18:00 - 19:00",
    amount: 350_000,
    status: "CONFIRMED",
  },
  {
    id: "rb-2",
    orderCode: "SB-2611-0144",
    customer: "Fajar Nugroho",
    venue: "Futsal Bintaro",
    court: "Lapangan B",
    playDate: "15 Nov 2026",
    time: "20:00 - 22:00",
    amount: 700_000,
    status: "PENDING",
  },
  {
    id: "rb-3",
    orderCode: "SB-2611-0141",
    customer: "Sinta Maharani",
    venue: "GOR Tebet",
    court: "Badminton 2",
    playDate: "15 Nov 2026",
    time: "09:00 - 10:00",
    amount: 150_000,
    status: "COMPLETED",
  },
  {
    id: "rb-4",
    orderCode: "SB-2611-0140",
    customer: "Yoga Aditya",
    venue: "Arena Kemang",
    court: "Lapangan 2",
    playDate: "14 Nov 2026",
    time: "19:00 - 21:00",
    amount: 700_000,
    status: "COMPLETED",
  },
  {
    id: "rb-5",
    orderCode: "SB-2611-0138",
    customer: "Melati Kusuma",
    venue: "Tenis Pondok Indah",
    court: "Court 1",
    playDate: "14 Nov 2026",
    time: "07:00 - 08:00",
    amount: 250_000,
    status: "CANCELLED",
  },
];

export type OperationalHighlight = {
  key: string;
  label: string;
  value: string;
  note: string;
  tone: "emerald" | "amber" | "slate";
};

export const operationalHighlights: OperationalHighlight[] = [
  {
    key: "venues",
    label: "Venue Aktif",
    value: "4 dari 5",
    note: "Satu venue sedang tidak aktif",
    tone: "emerald",
  },
  {
    key: "courts",
    label: "Lapangan Aktif",
    value: "12 dari 14",
    note: "2 lapangan dalam perawatan",
    tone: "emerald",
  },
  {
    key: "equipment",
    label: "Stok Peralatan Menipis",
    value: "2 item",
    note: "Raket badminton dan bola futsal",
    tone: "amber",
  },
  {
    key: "users",
    label: "User Baru Minggu Ini",
    value: "24 orang",
    note: "Naik 6 orang dari minggu lalu",
    tone: "slate",
  },
];
