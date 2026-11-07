import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format-rupiah";
import { auth } from "@/lib/auth";
import { getBookingReceiptService } from "@/modules/bookings/booking.service";

import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  ArrowRight,
  Share2,
  Download,
  AlertCircle,
  XCircle,
} from "lucide-react";

function formatDisplayDate(dateStr: string) {
  if (!dateStr) return "Hari Ini";
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const firstParam = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : "";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const orderCode = firstParam(sp.order_id);
  const paymentId = firstParam(sp.paymentId);

  // Tanpa kode booking/pembayaran, tidak ada tiket yang bisa dibuka.
  if (!orderCode && !paymentId) redirect("/mybooking");

  // Halaman ini membaca sesi dan data asli dari database.
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/login?next=/checkout/success");

  const booking = await getBookingReceiptService(
    orderCode ? { orderCode } : { paymentId },
    session.user.id,
    session.user.role === "ADMIN",
  );
  if (!booking) notFound();

  const venue = booking.court.venue;
  const orderId = booking.orderCode;
  const date = booking.playDate;
  const time = booking.startTime;
  const duration = booking.durationHour;
  const paymentStatus = booking.payment?.status ?? "PENDING";
  const paymentMethod = booking.payment?.method ?? "qris";
  const isPaid = paymentStatus === "PAID";
  const totalPaid = booking.payment?.amount ?? booking.totalPrice;

  return (
    <Container className="flex flex-col items-center justify-center py-10 max-w-xl">
      {/* 1. Header */}
      <div className="flex flex-col items-center text-center gap-2">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full shadow-xs ${
            isPaid
              ? "bg-emerald-100 text-emerald-600 animate-bounce"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {isPaid ? (
            <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
          ) : (
            <Clock className="h-10 w-10 stroke-[2.5]" />
          )}
        </div>

        <span
          className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border mt-2 ${
            isPaid
              ? "text-emerald-700 bg-emerald-50 border-emerald-200"
              : "text-amber-700 bg-amber-50 border-amber-200"
          }`}
        >
          {isPaid ? "Payment Confirmed" : "Waiting Payment"}
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {isPaid ? "Booking Berhasil!" : "Booking Dibuat"}
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
          {isPaid
            ? "Slot lapangan Anda telah terkunci. Tunjukkan Digital QR Pass di bawah ini kepada petugas venue saat tiba."
            : "Selesaikan pembayaran untuk mengunci slot lapangan Anda."}
        </p>
      </div>

      {/* 2. Kartu Tiket Digital */}
      <Card className="mt-8 w-full overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-lg">
        <div className="bg-emerald-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-200">
                Digital Court Pass
              </span>
              <h2 className="text-xl font-bold mt-0.5">{venue.name}</h2>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold text-white border ${
                isPaid
                  ? "bg-emerald-700/80 border-emerald-500/50"
                  : "bg-amber-600/80 border-amber-400/50"
              }`}
            >
              {isPaid ? "PAID" : paymentStatus}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-100/90">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
            <span className="truncate">{venue.address}</span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Court & Sport
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {booking.court.name}
              </p>
              <span className="text-xs text-emerald-700 font-medium">
                {booking.court.sport}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Order ID
              </span>
              <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                {orderId}
              </p>
              <span className="text-[11px] text-emerald-700 font-medium">
                {formatRupiah(totalPaid)} ({paymentMethod.toUpperCase()})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div className="flex items-start gap-2.5">
              <Calendar className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Date
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-0.5">
                  {formatDisplayDate(date)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Time Slot
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-0.5">
                  {time} ({duration} Jam)
                </p>
              </div>
            </div>
          </div>

          {isPaid ? (
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <QrCode className="h-28 w-28 text-slate-900" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 mt-2.5 tracking-wider">
                {orderId}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Scan barcode ini di meja resepsionis
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-50 border border-dashed border-amber-300">
              <XCircle className="h-10 w-10 text-amber-500" />
              <span className="text-sm font-bold text-amber-800 mt-2">
                Pembayaran belum selesai
              </span>
              <span className="text-xs text-amber-700 mt-1">
                Status: {paymentStatus}
              </span>
              <span className="text-xs font-mono font-bold text-slate-700 mt-2">
                {orderId}
              </span>
            </div>
          )}

          <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200/60">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              {isPaid ? (
                <>
                  Harap tiba <strong>15 menit</strong> sebelum jadwal dimulai
                  untuk konfirmasi dan persiapan raket/sepatu.
                </>
              ) : (
                <>
                  Selesaikan pembayaran sebelum batas waktu. Slot bisa dilepas
                  kembali kalau pembayaran kedaluwarsa.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share Pass
          </button>
        </div>
      </Card>

      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full">
        <Link
          href="/explore"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 py-3.5 px-4 text-center text-sm font-bold text-white shadow-sm transition"
        >
          <span>Pesan Lapangan Lainnya</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Container>
  );
}
