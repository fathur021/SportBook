"use client";

// Bagian interaktif: tab status dan pilihan tampilan kartu/tabel.

import { useState } from "react";

import { BookingTabs } from "@/components/mybooking/booking-tabs";
import { BookingCard } from "@/components/mybooking/booking-card";
import { BookingTable } from "@/components/mybooking/booking-table";
import { EmptyBookingState } from "@/components/mybooking/empty-state";
import type { BookingStatus, MyBookingItem } from "@/lib/mybooking-mapper";

interface MyBookingViewProps {
  bookings: MyBookingItem[];
}

export function MyBookingView({ bookings }: MyBookingViewProps) {
  const [activeTab, setActiveTab] = useState<BookingStatus>("upcoming");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // Upcoming: jadwal terdekat di atas. Tab lain: yang terbaru di atas.
  const filteredBookings = bookings
    .filter((item) => item.status === activeTab)
    .sort((a, b) =>
      activeTab === "upcoming"
        ? a.sortKey.localeCompare(b.sortKey)
        : b.sortKey.localeCompare(a.sortKey),
    );

  const counts = {
    upcoming: bookings.filter((b) => b.status === "upcoming").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="flex flex-col gap-6">
      <BookingTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        counts={counts}
      />

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
    </div>
  );
}
