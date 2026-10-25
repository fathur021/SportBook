import { formatRupiah } from "@/lib/format-rupiah";

type ReportSummaryCardsProps = {
  bookingValue: number;
  bookingCount: number;
  cancelledCount: number;
};

const cards = [
  {
    key: "value",
    label: "Nilai Booking Non-Batal",
    note: (props: ReportSummaryCardsProps) =>
      `${props.bookingCount} booking tidak dibatalkan`,
    value: (props: ReportSummaryCardsProps) => formatRupiah(props.bookingValue),
  },
  {
    key: "bookings",
    label: "Total Booking",
    note: () => "Sesuai filter yang dipilih",
    value: (props: ReportSummaryCardsProps) =>
      String(props.bookingCount + props.cancelledCount),
  },
  {
    key: "cancelled",
    label: "Booking Dibatalkan",
    note: () => "Tidak dihitung dalam nilai booking",
    value: (props: ReportSummaryCardsProps) => String(props.cancelledCount),
  },
];

export function ReportSummaryCards(props: ReportSummaryCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.key}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {card.value(props)}
          </p>
          <p className="mt-1 text-xs text-slate-500">{card.note(props)}</p>
        </article>
      ))}
    </section>
  );
}
