// "use client" wajib karena komponen ini memakai hook Redux.
"use client";

import {
  useGetAdminUsersQuery,
  useGetAdminVenuesQuery,
  type AdminUser,
} from "@/lib/redux/admin-api";
import { cn } from "@/lib/utils";

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const toneStyles = {
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  slate: "bg-slate-100 text-slate-600",
} as const;

// Rentang tujuh hari terakhir dan tujuh hari sebelumnya menurut WIB.
function getWibWeekRanges(now = new Date()) {
  const shifted = new Date(now.getTime() + WIB_OFFSET_MS);
  const todayKey = [
    shifted.getUTCFullYear(),
    String(shifted.getUTCMonth() + 1).padStart(2, "0"),
    String(shifted.getUTCDate()).padStart(2, "0"),
  ].join("-");
  const startToday = new Date(`${todayKey}T00:00:00+07:00`).getTime();

  return {
    currentStart: new Date(startToday - 6 * DAY_MS),
    currentEnd: new Date(startToday + DAY_MS),
    previousStart: new Date(startToday - 13 * DAY_MS),
    previousEnd: new Date(startToday - 6 * DAY_MS),
  };
}

// Hitung user yang bergabung di dalam rentang tanggal tertentu.
function countJoinedBetween(users: AdminUser[], start: Date, end: Date) {
  return users.filter((user) => {
    const joinedAt = new Date(user.joinedAt).getTime();
    return joinedAt >= start.getTime() && joinedAt < end.getTime();
  }).length;
}

export function OperationalHighlightsCard() {
  // Data venue sudah termasuk daftar lapangan di dalamnya.
  const { data: venues, isLoading: venuesLoading, isError: venuesError } =
    useGetAdminVenuesQuery();
  const { data: users, isLoading: usersLoading, isError: usersError } =
    useGetAdminUsersQuery();

  const isLoading = venuesLoading || usersLoading;
  const isError = venuesError || usersError || !venues || !users;

  // Selama memuat, tampilkan kotak abu-abu berdenyut.
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="h-5 w-44 animate-pulse rounded bg-slate-200" />
        <div className="mt-5 space-y-4">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-10 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  // Kalau gagal, beri pesan tanpa membuat halaman rusak.
  if (isError) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
        Gagal memuat sorotan operasional.
      </div>
    );
  }

  const activeVenues = venues.filter((venue) => venue.isActive).length;
  const inactiveVenues = venues.length - activeVenues;

  const allCourts = venues.flatMap((venue) => venue.courts ?? []);
  const activeCourts = allCourts.filter((court) => court.isActive).length;
  const inactiveCourts = allCourts.length - activeCourts;

  const ranges = getWibWeekRanges();
  const newUsers = countJoinedBetween(users, ranges.currentStart, ranges.currentEnd);
  const previousUsers = countJoinedBetween(
    users,
    ranges.previousStart,
    ranges.previousEnd,
  );
  const userChange = newUsers - previousUsers;

  const highlights = [
    {
      key: "venues",
      label: "Venue Aktif",
      value: `${activeVenues} dari ${venues.length}`,
      note:
        inactiveVenues > 0
          ? `${inactiveVenues} venue sedang tidak aktif`
          : "Semua venue aktif",
      tone: "emerald",
    },
    {
      key: "courts",
      label: "Lapangan Aktif",
      value: `${activeCourts} dari ${allCourts.length}`,
      note:
        inactiveCourts > 0
          ? `${inactiveCourts} lapangan dalam perawatan`
          : "Semua lapangan aktif",
      tone: "emerald",
    },
    {
      key: "users",
      label: "User Baru Minggu Ini",
      value: `${newUsers} orang`,
      note:
        userChange >= 0
          ? `Naik ${userChange} orang dari minggu lalu`
          : `Turun ${Math.abs(userChange)} orang dari minggu lalu`,
      tone: "slate",
    },
  ] as const;

  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">Sorotan Operasional</h2>
        <p className="mt-1 text-xs text-slate-500">
          Kondisi venue, lapangan, dan user.
        </p>
      </header>

      <ul className="flex-1 divide-y divide-slate-100">
        {highlights.map((item) => (
          <li
            key={item.key}
            className="flex items-center justify-between gap-3 px-5 py-3.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">{item.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{item.note}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-md px-2 py-1 text-xs font-semibold",
                toneStyles[item.tone],
              )}
            >
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
