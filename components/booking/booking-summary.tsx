import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format-rupiah";
import type { EquipmentItem } from "@/lib/equipment";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BookingSummaryProps = {
  venueName: string;
  venueSlug: string;
  courtId: string;
  courtLabel: string;
  pricePerHour: number;
  duration?: string;
  selectedDate: string | null;
  selectedTime: string | null;
  equipmentItems: EquipmentItem[];
  quantities: Record<string, number>;
};

const formatDateKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export function BookingSummary({
  venueName,
  venueSlug,
  courtId,
  courtLabel,
  pricePerHour,
  duration,
  selectedDate,
  selectedTime,
  equipmentItems,
  quantities,
}: BookingSummaryProps) {
  const durationHours = parseFloat(duration ?? "") || 1;
  const sessionPrice = Math.round(pricePerHour * durationHours);
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const selectedEquipment = equipmentItems
    .map((item) => ({ item, qty: quantities[item.id] ?? 0 }))
    .filter(({ qty }) => qty > 0);

  const equipmentTotal = selectedEquipment.reduce(
    (sum, { item, qty }) => sum + qty * item.pricePerUnit,
    0,
  );
  const total = sessionPrice + equipmentTotal;

  const handleCheckout = async () => {
    if (!selectedDate || !selectedTime) return;
    setCreating(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courtId,
          playDate: selectedDate,
          startTime: selectedTime,
          durationHour: durationHours,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Gagal membuat booking");
        setCreating(false);
        return;
      }
      const bookingId = json.data?.id || json.id;
      if (!bookingId) {
        alert("Gagal mendapatkan ID booking");
        setCreating(false);
        return;
      }

      const params = new URLSearchParams({
        venue: venueSlug,
        court: courtId,
        date: selectedDate,
        time: selectedTime,
        duration: duration ?? "1",
        bookingId,
      });
      selectedEquipment.forEach(({ item, qty }) => {
        params.append("equipment", `${item.id}:${qty}`);
      });
      router.push(`/checkout?${params.toString()}`);
    } catch (error) {
      alert("Terjadi kesalahan saat membuat booking");
      setCreating(false);
    }
  };

  return (
    <Card className="p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
        Booking Summary
      </p>

      <div className="mt-4 flex flex-col gap-2 text-sm">
        <Row label="Venue" value={venueName} />
        <Row label="Court" value={courtLabel} />
        <Row label="Rate" value={`${formatRupiah(pricePerHour)} / jam`} />
        <Row label="Duration" value={duration || "1 Hour"} />
        <Row
          label="Date"
          value={selectedDate ? formatDateKey(selectedDate) : "Belum dipilih"}
        />
        <Row label="Time" value={selectedTime ?? "Belum dipilih"} />
      </div>

      <div className="mt-4 space-y-1.5 border-t pt-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Court Session</span>
          <span className="font-medium">{formatRupiah(sessionPrice)}</span>
        </div>

        {selectedEquipment.length === 0 ? (
          <p className="pt-1 text-xs italic text-muted-foreground">
            Belum ada equipment dipilih
          </p>
        ) : (
          selectedEquipment.map(({ item, qty }) => (
            <div key={item.id} className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                {item.name} × {qty}
              </span>
              <span>{formatRupiah(qty * item.pricePerUnit)}</span>
            </div>
          ))
        )}

        <div className="flex justify-between border-t pt-1.5 text-base font-bold">
          <span>Total Payable</span>
          <span className="text-emerald-700">{formatRupiah(total)}</span>
        </div>
      </div>

      <Button
        type="button"
        disabled={!selectedDate || !selectedTime || creating}
        className="mt-4 h-11 w-full gap-1.5 bg-emerald-700 font-medium hover:bg-emerald-800"
        onClick={handleCheckout}
      >
        {creating ? "Memproses..." : "Continue to Checkout"}
      </Button>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="truncate font-medium text-slate-800">{value}</span>
    </div>
  );
}
