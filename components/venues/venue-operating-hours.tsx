import type { OperatingSchedule } from "@/lib/venue-detail";
interface VenueOperatingHoursProps {
  badge?: string;
  schedules?: OperatingSchedule[];
}
export function VenueOperatingHours({ badge, schedules }: VenueOperatingHoursProps) {
  // Guard clause: Jika belum ada data jadwalnya, sembunyikan komponen
  if (!schedules || schedules.length === 0) return null;
  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
      {/* Header atas: Judul di kiri, Badge hijau di kanan */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Weekly Operating Hours
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Active 7 days a week with early bird and peak evening blocks.
          </p>
        </div>
        {/* Badge hijau di kanan atas persis gambar */}
        {badge && (
          <span className="inline-flex self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            {badge}
          </span>
        )}
      </div>
      {/* Grid 4 kolom untuk 4 blok hari */}
      <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {schedules.map((item) => (
          <div
            key={item.days}
            className={`rounded-xl border p-3.5 transition-colors ${
              item.isHighlighted
                ? "border-emerald-200 bg-[#eefaf4]" // Highlight hijau mint untuk hari Sabtu
                : "border-sky-100/70 bg-[#f4f8fe]"  // Latar biru es standar untuk hari lainnya
            }`}
          >
            {/* Hari */}
            <p className="text-sm font-semibold text-slate-900">
              {item.days}
            </p>
            {/* Jam buka (warna teks hijau tua) */}
            <p className="mt-1 text-sm font-bold text-emerald-800">
              {item.hours}
            </p>
            {/* Catatan / Keterangan sesi di bawahnya */}
            <p className="mt-1 text-xs text-slate-500">
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
