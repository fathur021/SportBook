import { Clock3 } from "lucide-react";

import { SettingsSection } from "@/components/admin/settings/settings-section";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_OPERATING_HOURS,
  TIMEZONE_OPTIONS,
} from "@/lib/settings";

const timezoneOptions = TIMEZONE_OPTIONS.map((timezone) => ({
  value: timezone,
  label: timezone,
}));

export function OperatingHoursSection() {
  const hours = DEFAULT_OPERATING_HOURS;

  return (
    <SettingsSection
      icon={Clock3}
      title="Jam Operasional"
      description="Jam buka dan tutup yang dipakai saat membuat slot booking."
    >
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-3">
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
              defaultValue={hours.openTime}
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
              defaultValue={hours.closeTime}
              className="h-9 bg-white"
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="time-zone"
              className="text-xs font-semibold text-slate-700"
            >
              Zona waktu
            </FieldLabel>
            <Select items={timezoneOptions} defaultValue={hours.timeZone}>
              <SelectTrigger id="time-zone" className="h-9 w-full bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezoneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
          Slot booking dibuat otomatis setiap 1 jam, mulai dari jam buka sampai
          jam tutup. Slot di luar rentang ini tidak bisa dipesan.
        </div>

        <FieldDescription className="text-xs text-slate-500">
          Nilai ini berlaku untuk semua venue. Pengaturan per venue bisa
          ditambahkan nanti tanpa mengubah tampilan halaman ini.
        </FieldDescription>
      </FieldGroup>
    </SettingsSection>
  );
}
