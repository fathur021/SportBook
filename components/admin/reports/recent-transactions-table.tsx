"use client";

import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/admin/search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/format-rupiah";
import type { AdminReportTransaction } from "@/lib/redux/admin-api";

// Label status booking dalam bahasa Indonesia
const statusLabels: Record<string, string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

// Warna badge untuk setiap status booking
const statusStyles: Record<string, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  CONFIRMED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  COMPLETED: "border-blue-200 bg-blue-50 text-blue-700",
  CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
};

// Ubah "YYYY-MM-DD" menjadi format tanggal Indonesia
function formatDateKey(dateKey: string): string {
  // Tambahkan T00:00:00 agar tidak bergeser karena zona waktu UTC
  const date = new Date(`${dateKey}T00:00:00`);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Ubah tanggal ISO dari database menjadi tanggal dan jam lokal
function formatDateTime(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RecentTransactionsTable({
  transactions,
  query = "",
  onQueryChange,
}: {
  transactions: AdminReportTransaction[];
  query?: string;
  onQueryChange?: (value: string) => void;
}) {
  const filteredTransactions = transactions.filter((transaction) => {
    const teks = [
      transaction.orderCode,
      transaction.venueName,
      transaction.courtName,
      transaction.method ?? "",
      transaction.bookingStatus,
      transaction.playDate,
      transaction.paidAt ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return teks.includes(query.trim().toLowerCase());
  });

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Transaksi Terbaru</h2>
            <p className="mt-1 text-sm text-slate-500">
              Pembayaran lunas sesuai filter periode dan venue.
            </p>
          </div>
          {onQueryChange && (
            <SearchInput
              value={query}
              onChange={onQueryChange}
              placeholder="Cari kode, venue, atau metode..."
            />
          )}
        </div>
      </div>

      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="pl-5">Kode Order</TableHead>
            <TableHead>Tanggal Main</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Metode</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Dibayar</TableHead>
            <TableHead className="pr-5">Status Booking</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="pl-5 font-mono text-sm font-medium text-slate-900">
                  {transaction.orderCode}
                </TableCell>

                <TableCell className="text-slate-600">
                  <p>{formatDateKey(transaction.playDate)}</p>
                  <p className="text-xs text-slate-500">
                    {transaction.startTime} - {transaction.endTime}
                  </p>
                </TableCell>

                <TableCell className="text-slate-600">
                  <p>{transaction.venueName}</p>
                  <p className="text-xs text-slate-500">
                    {transaction.courtName}
                  </p>
                </TableCell>

                <TableCell className="text-slate-600">
                  {transaction.method ?? "-"}
                </TableCell>

                <TableCell className="font-semibold text-slate-900">
                  {formatRupiah(transaction.amount)}
                </TableCell>

                <TableCell className="text-slate-600">
                  {formatDateTime(transaction.paidAt)}
                </TableCell>

                <TableCell className="pr-5">
                  <Badge
                    variant="outline"
                    className={
                      statusStyles[transaction.bookingStatus] ??
                      "border-slate-200 bg-slate-50 text-slate-700"
                    }
                  >
                    {statusLabels[transaction.bookingStatus] ??
                      transaction.bookingStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                {transactions.length > 0
                  ? "Transaksi tidak ditemukan."
                  : "Tidak ada transaksi lunas untuk filter ini."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}