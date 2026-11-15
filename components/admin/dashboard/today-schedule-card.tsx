import { todaySchedules } from "@/lib/mock-dashboard";

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
  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">Jadwal Hari Ini</h2>
        <p className="mt-1 text-xs text-slate-500">
          Slot lapangan yang sudah terisi dibanding total slot.
        </p>
      </header>

      <div className="flex-1 space-y-4 px-5 py-4">
        {todaySchedules.map((schedule) => {
          const percent = Math.round(
            (schedule.bookedSlots / schedule.totalSlots) * 100,
          );

          return (
            <div key={schedule.id}>
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
                  {schedule.bookedSlots}/{schedule.totalSlots} slot
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
    </section>
  );
}
