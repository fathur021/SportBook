import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { getVenueDetail } from "@/lib/venue-detail";
import { getVenueEquipment } from "@/lib/equipment";
import { formatRupiah } from "@/lib/format-rupiah";
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
  ShieldCheck,
} from "lucide-react";

// Helper format tanggal Indonesia
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

// Helper membaca parameter
const firstParam = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : "";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const orderId = firstParam(sp.order_id) || `SPB-${Date.now().toString().slice(-6)}`;
  const venueSlug = firstParam(sp.venue) || "gelora-padel";
  const courtId = firstParam(sp.court) || "court-1";
  const date = firstParam(sp.date) || "2026-10-24";
  const time = firstParam(sp.time) || "19:00";
  const duration = parseFloat(firstParam(sp.duration)) || 1;
  const paymentMethod = firstParam(sp.method) || "qris";

  // Ambil detail data venue & lapangan
  const venue = getVenueDetail(venueSlug);
  const discipline = venue?.disciplines.find((d) =>
    d.courts.some((c) => c.id === courtId)
  );
  const court = discipline?.courts.find((c) => c.id === courtId);

  // Hitung total bayar akurat (lapangan + perlengkapan + fee)
  const equipmentParam = sp.equipment;
  const rawEquipment = Array.isArray(equipmentParam)
    ? equipmentParam
    : equipmentParam ? [equipmentParam] : [];

  const venueEquipmentList = getVenueEquipment(venueSlug);
  const equipmentTotal = rawEquipment.reduce((sum, entry) => {
    const [id, qtyStr] = entry.split(":");
    const found = venueEquipmentList.find((e) => e.id === id);
    return sum + (found?.pricePerUnit ?? 0) * (parseInt(qtyStr) || 1);
  }, 0);

  const pricePerHour = court?.pricePerHour ?? 220000;
  const platformFee = 5000;
  const totalPaid = pricePerHour * duration + equipmentTotal + platformFee;

  return (
    <Container className="flex flex-col items-center justify-center py-10 max-w-xl">
      {/* 1. Header Sukses */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xs animate-bounce">
          <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mt-2">
          Payment Confirmed
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Booking Berhasil!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
          Slot lapangan Anda telah terkunci. Tunjukkan Digital QR Pass di bawah ini kepada petugas venue saat tiba.
        </p>
      </div>

      {/* 2. Kartu Tiket Digital (Digital Court Pass) */}
      <Card className="mt-8 w-full overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-lg">
        {/* Header Tiket */}
        <div className="bg-emerald-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-200">
                Digital Court Pass
              </span>
              <h2 className="text-xl font-bold mt-0.5">{venue?.name ?? "Gelora Padel"}</h2>
            </div>
            <span className="rounded-full bg-emerald-700/80 px-3 py-1 text-xs font-bold text-white border border-emerald-500/50">
              PAID
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-100/90">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
            <span className="truncate">{venue?.address ?? "Jakarta Selatan, Indonesia"}</span>
          </div>
        </div>

        {/* Isi Tiket */}
        <div className="p-6 space-y-5">
          {/* Baris Lapangan & Olahraga */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Court & Sport
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {court?.label ?? "Court 1"}
              </p>
              <span className="text-xs text-emerald-700 font-medium">
                {discipline?.label ?? "Padel Tennis"}
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

          {/* Baris Jadwal */}
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

          {/* Area QR Code Check-in */}
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

          {/* Catatan Penting */}
          <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200/60">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              Harap tiba <strong>15 menit</strong> sebelum jadwal dimulai untuk konfirmasi dan persiapan raket/sepatu.
            </p>
          </div>
        </div>

        {/* Footer Tiket: Tombol Aksi */}
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

      {/* 3. Tombol Kembali ke Beranda / Cari Lapangan Lain */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full">
        <Link
          href="/venues"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 py-3.5 px-4 text-center text-sm font-bold text-white shadow-sm transition"
        >
          <span>Pesan Lapangan Lainnya</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Container>
  );
}
