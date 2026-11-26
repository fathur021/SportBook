"use client";

import { useRef, useState } from "react";
import { ReservationDatePicker } from "@/components/booking/reservation-date-picker";
import { SelectTimeSlot } from "@/components/booking/select-time-slot";
import { EquipmentPicker } from "@/components/booking/equipment-picker";
import { BookingSummary } from "@/components/booking/booking-summary";
import type { AvailabilityByDate } from "@/lib/booking-dates";
import type { TimeSlotOption } from "@/lib/time-slots";
import type { EquipmentItem } from "@/lib/equipment";
import {
  toTimeSlotOptions,
  type AvailabilitySlot,
} from "@/lib/availability-slots";

type BookingFormProps = {
  availability: AvailabilityByDate;
  timeSlots: TimeSlotOption[];
  equipmentItems: EquipmentItem[];
  initialDate: string | null;
  pricePerHour: number;
  duration?: string;
  venueName: string;
  courtId: string;
  courtLabel: string;
};

type AvailabilityResponse = {
  data?: { slots?: AvailabilitySlot[] };
  error?: string;
};

export function BookingForm({
  availability,
  timeSlots,
  equipmentItems,
  pricePerHour,
  initialDate,
  duration,
  venueName,
  courtId,
  courtLabel,
}: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);

  // [TAMBAH] Durasi dipakai untuk menonaktifkan slot yang tidak muat.
  const durationHours = parseFloat(duration ?? "") || 1;

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [slots, setSlots] = useState<TimeSlotOption[]>(timeSlots);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState("");

  const [loadedDate, setLoadedDate] = useState<string | null>(
    initialDate ? initialDate : null,
  );

  const abortRef = useRef<AbortController | null>(null);

  // Muat slot asli untuk tanggal yang dipilih.
  // Dipanggil dari event klik tanggal, bukan dari useEffect.
  const loadSlots = (date: string) => {
    // Batalkan permintaan sebelumnya kalau user cepat ganti tanggal.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoadingSlots(true);
    setSlotError("");
    setSelectedTime(null);

    fetch(`/api/courts/${courtId}/availability?date=${date}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const json = (await response.json()) as AvailabilityResponse;
        if (!response.ok) {
          throw new Error(json.error ?? "Gagal mengambil slot");
        }
        return toTimeSlotOptions(json.data?.slots ?? []);
      })
      .then((nextSlots) => {
        if (controller.signal.aborted) return;
        setSlots(nextSlots);
        setLoadedDate(date);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setSlotError("Gagal memuat slot. Coba pilih tanggal lagi.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingSlots(false);
      });
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (date === loadedDate) return;
    loadSlots(date);
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="flex min-w-0 flex-col gap-6">
        <ReservationDatePicker
          availability={availability}
          value={selectedDate}
          onValueChange={handleDateChange}
        />
        <SelectTimeSlot
          slots={slots}
          pricePerHour={pricePerHour}
          value={selectedTime}
          onValueChange={setSelectedTime}
          durationHours={durationHours} // [TAMBAH]
          loading={loadingSlots}
          error={slotError}
          emptyMessage={
            selectedDate
              ? "Tidak ada slot untuk tanggal ini, coba pilih tanggal lain."
              : "Pilih tanggal dulu untuk melihat slot yang tersedia."
          }
        />
        <EquipmentPicker
          items={equipmentItems}
          quantities={quantities}
          onQuantitiesChange={setQuantities}
        />
      </div>

      <div className="min-w-0 lg:sticky lg:top-6">
        <BookingSummary
          venueName={venueName}
          courtId={courtId}
          courtLabel={courtLabel}
          pricePerHour={pricePerHour}
          duration={duration}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          equipmentItems={equipmentItems}
          quantities={quantities}
        />
      </div>
    </div>
  );
}
