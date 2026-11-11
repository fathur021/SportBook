import { formatRupiah } from "@/lib/format-rupiah";

export type VenueBookingTotal = {
  venueName: string;
  total: number;
  transactionCount: number;
};

export function VenueBookingTotals({
  venues,
}: {
  venues: VenueBookingTotal[];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">
          Pendapatan per Venue
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Total pembayaran lunas untuk setiap venue.
        </p>
      </div>

      {venues.length > 0 ? (
        <ul className="divide-y divide-slate-100">
          {venues.map((venue) => (
            <li
              key={venue.venueName}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {venue.venueName}
                </p>
                <p className="text-xs text-slate-500">
                  {venue.transactionCount} transaksi lunas
                </p>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {formatRupiah(venue.total)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-5 py-8 text-center text-sm text-slate-500">
          Tidak ada pembayaran lunas untuk filter ini.
        </p>
      )}
    </section>
  );
}