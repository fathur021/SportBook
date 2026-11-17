// "use client" wajib karena komponen ini memakai hook React.
"use client";

// Hook yang sama dengan kartu statistik dan grafik.
// RTK Query menggabungkan request, jadi API tetap dipanggil satu kali.
import { useGetAdminDashboardQuery } from "@/lib/redux/admin-api";

// Warna bar mengikuti tingkat keterisian lapangan.
function getBarClass(percent: number) {
  if (percent >= 90) return "bg-rose-500";
  if (percent >= 70) return "bg-emerald-500";
  return "bg-amber-400";
}

// Teks pendek di bawah bar.
function getPercentLabel(percent: number) {
  if (percent >= 90) return "Hampir penuh";
  if (percent >= 70) return "Ramai";
  return "Masih longgar";
}

export function TodayScheduleCard() {
  // Ambil data asli dari endpoint dashboard.
  const { data, isLoading, isError } = useGetAdminDashboardQuery();

  // Selama memuat, tampilkan kotak abu-abu berdenyut.
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

  // Kalau gagal, beri pesan tanpa membuat halaman rusak.
  if (isError || !data) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
        Gagal memuat jadwal hari ini.
      </div>
    );
  }

  // Kalau tidak ada lapangan aktif, beri tahu pengguna.
  if (data.todaySchedules.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        Belum ada lapangan aktif.
      </div>
    );
  }

  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">Jadwal Hari Ini</h2>
        <p className="mt-1 text-xs text-slate-500">
          Slot lapangan yang sudah terisi dibanding total slot.
        </p>
      </header>

      <div className="flex-1 space-y-4 px-5 py-4">
        {data.todaySchedules.map((schedule) => {
          // Batasi 100 supaya bar tidak melewati wadah saat booking lebih lama dari jam buka.
          const percent = Math.min(
            100,
            Math.round((schedule.bookedSlots / schedule.totalSlots) * 100),
          );

          return (
            // Id lapangan dipakai sebagai key yang unik dan stabil.
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
