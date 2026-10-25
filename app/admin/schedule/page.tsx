import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Settings2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format-rupiah";
import { getVenueDetail } from "@/lib/venue-detail";

const dates = [
  { day: "JUM", date: "23", month: "Okt", active: true },
  { day: "SAB", date: "24", month: "Okt" },
  { day: "MIN", date: "25", month: "Okt" },
  { day: "SEN", date: "26", month: "Okt" },
  { day: "SEL", date: "27", month: "Okt" },
  { day: "RAB", date: "28", month: "Okt" },
  { day: "KAM", date: "29", month: "Okt" },
];

const times = ["06.00", "07.00", "08.00", "09.00", "10.00", "11.00", "12.00", "13.00"];

const slotStatuses = [
  ["available", "available", "booked", "available", "available", "available", "booked", "available"],
  ["available", "maintenance", "available", "available", "booked", "available", "available", "available"],
  ["booked", "available", "available", "available", "available", "booked", "available", "available"],
  ["available", "available", "available", "booked", "available", "available", "available", "maintenance"],
] as const;

type SlotStatus = (typeof slotStatuses)[number][number];

const statusText: Record<SlotStatus, string> = {
  available: "Tersedia",
  booked: "Dipesan",
  maintenance: "Ditutup",
};

const statusClass: Record<SlotStatus, string> = {
  available: "border-emerald-200 bg-emerald-50 text-emerald-800",
  booked: "border-slate-200 bg-slate-100 text-slate-500",
  maintenance: "border-amber-200 bg-amber-50 text-amber-700",
};

export default function AdminSchedulePage() {
  const venue = getVenueDetail("gelora-padel-club");
  const courts = venue?.disciplines.flatMap((discipline) =>
    discipline.courts.map((court) => ({
      ...court,
      disciplineLabel: discipline.label,
    })),
  ) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Jadwal &amp; Slot
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Atur jam operasional venue dan pantau slot setiap court.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
          <span className="size-2 rounded-full bg-emerald-500" />
          
          {venue?.name ?? "Pilih venue"}
          <ChevronDown className="ml-2 size-4 text-slate-400" />
        </div>
      </div>

      <Card className="p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <Clock3 className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Jam Operasional Venue</p>
              <p className="mt-1 text-sm text-slate-500">Senin–Minggu · 06.00–23.00</p>
              <p className="mt-1 text-xs text-slate-400">Slot dibuat per 1 jam dan berlaku untuk semua court.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              17 slot waktu
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              <Settings2 className="size-4" />
              Atur Jam Operasional
            </button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden shadow-sm">
        <div className="flex flex-col gap-4 border-b p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Ketersediaan Court</h2>
            <p className="mt-1 text-sm text-slate-500">
              Pilih tanggal untuk melihat status slot pada semua court di venue.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
            <CalendarDays className="size-4 text-emerald-700" />
            Oktober 2026
          </div>
        </div>

        <div className="flex items-center gap-2 border-b px-4 py-4 sm:px-6">
          <button type="button" aria-label="Tanggal sebelumnya" className="rounded-lg border p-2 text-slate-500">
            <ChevronLeft className="size-4" />
          </button>
          <div className="grid flex-1 grid-cols-4 gap-2 sm:grid-cols-7">
            {dates.map((date) => (
              <div
                key={date.date}
                className={`flex flex-col items-center rounded-xl border px-2 py-2 ${
                  date.active
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">{date.day}</span>
                <span className="text-lg font-bold leading-6">{date.date}</span>
                <span className="text-[10px]">{date.month}</span>
              </div>
            ))}
          </div>
          <button type="button" aria-label="Tanggal berikutnya" className="rounded-lg border p-2 text-slate-500">
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 px-5 py-3 sm:px-6">
          <p className="text-sm font-semibold text-slate-700">Jumat, 23 Oktober 2026</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
            <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-emerald-500" />Tersedia</span>
            <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-slate-400" />Dipesan</span>
            <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-amber-500" />Ditutup / Perbaikan</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-y bg-white text-xs text-slate-500">
                <th className="sticky left-0 z-10 min-w-64 bg-white px-5 py-3 font-semibold sm:px-6">Court</th>
                {times.map((time) => (
                  <th key={time} className="min-w-24 px-2 py-3 text-center font-semibold">{time}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courts.map((court, index) => {
                const statuses = slotStatuses[index % slotStatuses.length];
                const price = court.pricePerHour ?? venue?.pricePerHour ?? 0;

                return (
                  <tr key={court.id} className="border-b last:border-b-0">
                    <th className="sticky left-0 z-10 bg-white px-5 py-3 text-left sm:px-6">
                      <span className="block text-sm font-semibold text-slate-900">{court.label}</span>
                      <span className="mt-0.5 block text-xs font-normal text-slate-500">
                        {court.disciplineLabel} · {formatRupiah(price)}/jam
                      </span>
                    </th>
                    {statuses.map((status, timeIndex) => (
                      <td key={`${court.id}-${times[timeIndex]}`} className="px-1.5 py-2 text-center">
                        <span className={`inline-flex min-h-10 w-full flex-col items-center justify-center rounded-lg border px-1 py-1 text-[10px] font-semibold leading-4 ${statusClass[status]}`}>
                          <span>{statusText[status]}</span>
                          {status === "available" && (
                            <span className="font-medium opacity-75">{formatRupiah(price)}</span>
                          )}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-slate-500">Contoh tampilan saja · perubahan jadwal dan status slot belum tersimpan.</p>
          <button type="button" className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white">
            + Blokir Waktu
          </button>
        </div>
      </Card>
    </div>
  );
}
