// Halaman ini Server Component dan mengambil booking asli dari database.

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Container } from "@/components/layout/container";
import { MyBookingView } from "@/components/mybooking/mybooking-view";
import { auth } from "@/lib/auth";
import { listMyBookingService } from "@/modules/bookings/booking.service";
import { toMyBookingItems } from "@/lib/mybooking-mapper";

export default async function MyBookingPage() {
  // Wajib login. Kalau belum login, arahkan ke halaman login.
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/login?next=/mybooking");

  // Ambil booking asli milik user yang sedang login.
  const rows = await listMyBookingService(session.user.id);
  const bookings = toMyBookingItems(rows);

  return (
    <Container className="py-8 max-w-4xl flex flex-col gap-6">
      {/* 1. Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            User Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
            My Court Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau jadwal main dan tiket QR pass sewa lapangan Anda.
          </p>
        </div>

        <Link
          href="/explore"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#03624c] hover:bg-[#02523f] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Sewa Lapangan Baru</span>
        </Link>
      </div>

      {/* 2. Tab, mode tampilan, dan daftar booking */}
      <MyBookingView bookings={bookings} />
    </Container>
  );
}
