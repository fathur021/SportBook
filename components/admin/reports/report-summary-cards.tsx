import { formatRupiah } from "@/lib/format-rupiah";

type ReportSummaryCardsProps = {
  revenue: number;
  paidTransactionCount: number;
  cancelledBookingCount: number;
};
const cards = [
  {
    key: "revenue",
    label: "Pendapatan Lunas",
    note: (props: ReportSummaryCardsProps) =>
      `${props.paidTransactionCount} transaksi sudah dibayar`,
    value: (props: ReportSummaryCardsProps) => formatRupiah(props.revenue),
  },
  {
    key: "transactions",
    label: "Transaksi Lunas",
    note: () => "Sesuai filter yang dipilih",
    value: (props: ReportSummaryCardsProps) =>
      String(props.paidTransactionCount),
  },
  {
    key: "cancelled",
    label: "Booking Dibatalkan",
    note: () => "Dihitung dari tanggal main",
    value: (props: ReportSummaryCardsProps) =>
      String(props.cancelledBookingCount),
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
