import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format-rupiah";
import type { EquipmentItem } from "@/lib/equipment";

type BookingSummaryProps = {
  venueName: string;
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

  const selectedEquipment = equipmentItems
    .map((item) => ({ item, qty: quantities[item.id] ?? 0 }))
    .filter(({ qty }) => qty > 0);

  const equipmentTotal = selectedEquipment.reduce(
    (sum, { item, qty }) => sum + qty * item.pricePerUnit,
    0
  );
  const total = sessionPrice + equipmentTotal;

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
        className="mt-4 h-11 w-full gap-1.5 bg-emerald-700 font-medium hover:bg-emerald-800"
      >
        Continue to Checkout
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