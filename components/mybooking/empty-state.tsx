import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Ticket, ArrowRight } from "lucide-react";
import type { BookingStatus } from "@/lib/mybooking-mapper";

interface EmptyStateProps {
  status: BookingStatus;
}

// Label tab versi bahasa Indonesia.
const STATUS_LABEL: Record<BookingStatus, string> = {
  upcoming: "akan datang",
  completed: "selesai",
  cancelled: "dibatalkan",
};

export function EmptyBookingState({ status }: EmptyStateProps) {
  return (
    <Card className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center justify-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
        <Ticket className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800">
        Tidak ada booking {STATUS_LABEL[status]}
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
        Anda belum memiliki jadwal lapangan di kategori ini. Cari lapangan dan
        mulai booking sekarang!
      </p>
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 rounded-xl bg-[#03624c] hover:bg-[#02523f] px-4 py-2.5 text-xs font-bold text-white transition shadow-sm"
      >
        <span>Jelajahi Lapangan</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}
