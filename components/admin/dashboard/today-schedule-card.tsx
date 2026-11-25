"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useGetAdminDashboardQuery } from "@/lib/redux/admin-api";

const MAX_VISIBLE = 8;

// Warna bar mengikuti tingkat keterisian lapangan.
function getBarClass(percent: number) {
  if (percent >= 90) return "bg-rose-500";
  if (percent >= 70) return "bg-emerald-500";
  return "bg-amber-400";
}

function getPercentLabel(percent: number) {
  if (percent >= 90) return "Hampir penuh";
  if (percent >= 70) return "Ramai";
  return "Masih longgar";
}

export function TodayScheduleCard() {
  const { data, isLoading, isError } = useGetAdminDashboardQuery();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
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

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
        Gagal memuat jadwal hari ini.
      </div>
    );
  }

  if (data.todaySchedules.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        Belum ada lapangan aktif.
      </div>
    );
  }

  const visibleSchedules = data.todaySchedules.slice(0, MAX_VISIBLE);
  const hiddenCount = data.todaySchedules.length - visibleSchedules.length;

  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-900">Jadwal Hari Ini</h2>
          <p className="mt-1 text-xs text-slate-500">
            Slot terisi dibanding total slot per lapangan.
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
          {data.todaySchedules.length} lapangan
        </span>
      </header>

      <div className="grid flex-1 gap-x-6 gap-y-5 px-5 py-4 md:grid-cols-2">
        {visibleSchedules.map((schedule) => {
          const percent = Math.min(
            100,
            Math.round((schedule.bookedSlots / schedule.totalSlots) * 100),
          );

          return (
            <div key={schedule.id} className="min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {schedule.court}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {schedule.venue}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-medium text-slate-600">
                  {schedule.bookedSlots}/{schedule.totalSlots}
                </span>
              </div>

              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${getBarClass(percent)}`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="mt-1 text-[11px] text-slate-500">
                {percent}% terisi · {getPercentLabel(percent)}
              </p>
            </div>
          );
        })}
      </div>

      {hiddenCount > 0 && (
        <div className="border-t border-slate-100 px-5 py-3">
          <Link
            href="/admin/schedule"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Lihat {hiddenCount} lapangan lainnya
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
}
