import { Clock3 } from "lucide-react";

import { SettingsSection } from "@/components/admin/settings/settings-section";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AdminSettings } from "@/lib/redux/admin-api";

// Field jam operasional yang dipakai form ini.
type OperatingHoursValues = Pick<AdminSettings, "openTime" | "closeTime">;

type OperatingHoursSectionProps = {
  values: OperatingHoursValues;
  onChange: (patch: Partial<OperatingHoursValues>) => void;
};

// Mengubah "08:30" menjadi 510 menit.
function toMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return 0;

  return hour * 60 + minute;
}

export function OperatingHoursSection({
  values,
  onChange,
}: OperatingHoursSectionProps) {
  // Panjang jam operasional dalam satuan jam.
  const durationHours =
    (toMinutes(values.closeTime) - toMinutes(values.openTime)) / 60;

  // Jam tutup harus setelah jam buka.
  const isInvalid = durationHours <= 0;

  return (
    <SettingsSection
      icon={Clock3}
      title="Jam Operasional"
      description="Jam buka dan tutup yang dipakai saat membuat slot booking."
    >
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel
              htmlFor="open-time"
              className="text-xs font-semibold text-slate-700"
            >
              Jam buka
            </FieldLabel>
            <Input
              id="open-time"
              type="time"
              value={values.openTime}
              onChange={(event) => onChange({ openTime: event.target.value })}
              className="h-9 bg-white"
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="close-time"
              className="text-xs font-semibold text-slate-700"
            >
              Jam tutup
            </FieldLabel>
            <Input
              id="close-time"
              type="time"
              value={values.closeTime}
              onChange={(event) => onChange({ closeTime: event.target.value })}
              className="h-9 bg-white"
            />
          </Field>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
          {isInvalid
            ? "Jam tutup harus lebih besar dari jam buka."
            : `Slot booking dibuat setiap 1 jam, dari ${values.openTime} sampai ${values.closeTime} (${durationHours} slot per lapangan).`}
        </div>

        <FieldDescription className="text-xs text-slate-500">
          Nilai ini berlaku untuk semua venue. Booking yang selesai melewati jam
          tutup akan ditolak.
        </FieldDescription>
      </FieldGroup>
    </SettingsSection>
  );
}
