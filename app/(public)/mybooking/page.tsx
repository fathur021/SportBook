"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PlusCircle } from "lucide-react";
import { INITIAL_BOOKINGS, type BookingStatus } from "@/lib/mock-bookings";
import { BookingTabs } from "@/components/mybooking/booking-tabs";
import { BookingCard } from "@/components/mybooking/booking-card";
import { BookingTable } from "@/components/mybooking/booking-table";
import { EmptyBookingState } from "@/components/mybooking/empty-state";

export default function MyBookingPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus>("upcoming");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // Filter daftar booking berdasarkan tab yang dipilih
  const filteredBookings = INITIAL_BOOKINGS.filter(
    (item) => item.status === activeTab
  );

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
          href="/venues"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#03624c] hover:bg-[#02523f] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Sewa Lapangan Baru</span>
        </Link>
      </div>

      {/* 2. Filter Tabs & View Mode Switcher */}
      <BookingTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        counts={{
          upcoming: INITIAL_BOOKINGS.filter((b) => b.status === "upcoming").length,
          completed: INITIAL_BOOKINGS.filter((b) => b.status === "completed").length,
          cancelled: INITIAL_BOOKINGS.filter((b) => b.status === "cancelled").length,
        }}
      />

      {/* 3. Render Daftar Booking (Mode Kartu / Mode Tabel) */}
      {filteredBookings.length === 0 ? (
        <EmptyBookingState status={activeTab} />
      ) : viewMode === "card" ? (
        <div className="flex flex-col gap-4">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : (
        <BookingTable bookings={filteredBookings} />
      )}
    </Container>
  );
}
