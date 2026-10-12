"use client";

import { useState } from "react";
import { ReservationDatePicker } from "@/components/booking/reservation-date-picker";
import { SelectTimeSlot } from "@/components/booking/select-time-slot";
import { EquipmentPicker } from "@/components/booking/equipment-picker";
import { BookingSummary } from "@/components/booking/booking-summary";
import type { AvailabilityByDate } from "@/lib/booking-dates";
import type { TimeSlotOption } from "@/lib/time-slots";
import type { EquipmentItem } from "@/lib/equipment";

type BookingFormProps = {
  availability: AvailabilityByDate;
  timeSlots: TimeSlotOption[];
  equipmentItems: EquipmentItem[];
  pricePerHour: number;
  duration?: string;
  venueName: string;
  courtLabel: string;
};

export function BookingForm({
  availability,
  timeSlots,
  equipmentItems,
  pricePerHour,
  duration,
  venueName,
  courtLabel,
}: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-6">
        <ReservationDatePicker
          availability={availability}
          value={selectedDate}
          onValueChange={setSelectedDate}
        />
        <SelectTimeSlot
          slots={timeSlots}
          pricePerHour={pricePerHour}
          value={selectedTime}
          onValueChange={setSelectedTime}
        />
        <EquipmentPicker
          items={equipmentItems}
          quantities={quantities}
          onQuantitiesChange={setQuantities}
        />
      </div>

      <div className="lg:sticky lg:top-6">
        <BookingSummary
          venueName={venueName}
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