"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // ← dropdown untuk ubah status
import type { AdminBooking } from "@/lib/redux/admin-api"; // ← tipe data booking
import { useUpdateBookingStatusMutation } from "@/lib/redux/admin-api"; // ← Redux mutation

export function BookingRowActions({ booking }: { booking: AdminBooking }) {
  const [updateStatus] = useUpdateBookingStatusMutation();

  // Fungsi saat user pilih status baru dari dropdown
  async function handleStatusChange(newStatus: string | null) {
    if (!newStatus) return; // ← abaikan jika null
    try {
      await updateStatus({
        bookingId: booking.id,
        status: newStatus,
      }).unwrap();
    } catch (err: any) {
      const serverMsg = err?.data?.error || "Gagal mengubah status booking";
      alert(serverMsg);
    }
  }

  // Label status dalam bahasa Indonesia
  function getStatusLabel(status: string): string {
    switch (status) {
      case "PENDING":
        return "Menunggu";
      case "CONFIRMED":
        return "Dikonfirmasi";
      case "COMPLETED":
        return "Selesai";
      case "CANCELLED":
        return "Dibatalkan";
      default:
        return status;
    }
  }

  return (
    <Select value={booking.status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-36 text-xs h-8">
        <SelectValue placeholder="Ubah status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">Menunggu</SelectItem>
        <SelectItem value="CONFIRMED">Dikonfirmasi</SelectItem>
        <SelectItem value="COMPLETED">Selesai</SelectItem>
        <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
      </SelectContent>
    </Select>
  );
}
