// Tipe role user. Di database, kolom User.role bertipe string,
// jadi daftar ini bisa ditambah nanti tanpa mengubah struktur tabel.
export type UserRole = "ADMIN" | "USER";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  joinedAt: string; // format "YYYY-MM-DD"
  bookingsCount: number;
  lastActiveAt: string | null; // format ISO, null berarti belum pernah aktif
};

// Data dummy untuk tampilan. Nanti diganti dengan hasil API.
export const INITIAL_USERS: MockUser[] = [
  {
    id: "u1",
    name: "Budi Santoso",
    email: "budi.santoso@example.com",
    role: "ADMIN",
    emailVerified: true,
    joinedAt: "2026-01-15",
    bookingsCount: 12,
    lastActiveAt: "2026-11-10T09:20:00+07:00",
  },
  {
    id: "u2",
    name: "Siti Rahma",
    email: "siti.rahma@example.com",
    role: "USER",
    emailVerified: true,
    joinedAt: "2026-02-03",
    bookingsCount: 5,
    lastActiveAt: "2026-11-09T16:45:00+07:00",
  },
  {
    id: "u3",
    name: "Andi Pratama",
    email: "andi.pratama@example.com",
    role: "USER",
    emailVerified: true,
    joinedAt: "2026-03-21",
    bookingsCount: 8,
    lastActiveAt: "2026-11-08T19:10:00+07:00",
  },
  {
    id: "u4",
    name: "Dewi Lestari",
    email: "dewi.lestari@example.com",
    role: "USER",
    emailVerified: true,
    joinedAt: "2026-04-11",
    bookingsCount: 3,
    lastActiveAt: "2026-11-07T13:30:00+07:00",
  },
  {
    id: "u5",
    name: "Rizky Hidayat",
    email: "rizky.hidayat@example.com",
    role: "USER",
    emailVerified: false,
    joinedAt: "2026-05-02",
    bookingsCount: 0,
    lastActiveAt: null,
  },
  {
    id: "u6",
    name: "Maya Putri",
    email: "maya.putri@example.com",
    role: "USER",
    emailVerified: true,
    joinedAt: "2026-06-18",
    bookingsCount: 6,
    lastActiveAt: "2026-11-06T10:05:00+07:00",
  },
  {
    id: "u7",
    name: "Fajar Nugroho",
    email: "fajar.nugroho@example.com",
    role: "USER",
    emailVerified: false,
    joinedAt: "2026-08-24",
    bookingsCount: 1,
    lastActiveAt: "2026-10-30T20:15:00+07:00",
  },
  {
    id: "u8",
    name: "Nabila Azzahra",
    email: "nabila.azzahra@example.com",
    role: "USER",
    emailVerified: true,
    joinedAt: "2026-09-09",
    bookingsCount: 4,
    lastActiveAt: "2026-11-10T08:40:00+07:00",
  },
];
