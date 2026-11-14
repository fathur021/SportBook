import { CalendarClock } from "lucide-react";

import { SettingsSection } from "@/components/admin/settings/settings-section";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { AdminSettings } from "@/lib/redux/admin-api";
import { CANCELLATION_POLICY_OPTIONS } from "@/lib/settings";

// Field aturan booking yang dipakai form ini.
type BookingRulesValues = Pick<
  AdminSettings,
  | "minSessionHours"
  | "maxSessionHours"
  | "allowSameDayBooking"
  | "maxAdvanceDays"
  | "cancellationPolicy"
>;

type BookingRulesSectionProps = {
  values: BookingRulesValues;
  onChange: (patch: Partial<BookingRulesValues>) => void;
};

// Mengubah isi input menjadi angka.
// Kalau input kosong, pakai nilai cadangan.
function toNumber(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function BookingRulesSection({
  values,
  onChange,
}: BookingRulesSectionProps) {
  // Peringatan kalau batas durasi saling bertentangan.
  const isDurationInvalid = values.maxSessionHours < values.minSessionHours;

  return (
    <SettingsSection
      icon={CalendarClock}
      title="Aturan Booking"
      description="Aturan dasar yang dipakai saat pelanggan memesan lapangan."
    >
      <FieldGroup>
        <Field>
          <FieldLabel className="text-xs font-semibold text-slate-700">
            Durasi sesi
          </FieldLabel>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel
                htmlFor="min-session-hours"
                className="text-xs font-medium text-slate-600"
              >
                Minimal
              </FieldLabel>
              <InputGroup className="h-9 bg-white">
                <InputGroupInput
                  id="min-session-hours"
                  type="number"
                  min={1}
                  max={12}
                  value={values.minSessionHours}
                  onChange={(event) =>
                    onChange({
                      minSessionHours: toNumber(
                        event.target.value,
                        values.minSessionHours,
                      ),
                    })
                  }
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText className="text-xs font-semibold text-slate-400">
                    jam
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel
                htmlFor="max-session-hours"
                className="text-xs font-medium text-slate-600"
              >
                Maksimal
              </FieldLabel>
              <InputGroup className="h-9 bg-white">
                <InputGroupInput
                  id="max-session-hours"
                  type="number"
                  min={1}
                  max={12}
                  value={values.maxSessionHours}
                  onChange={(event) =>
                    onChange({
                      maxSessionHours: toNumber(
                        event.target.value,
                        values.maxSessionHours,
                      ),
                    })
                  }
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText className="text-xs font-semibold text-slate-400">
                    jam
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>

          <FieldDescription className="text-xs text-slate-500">
            {isDurationInvalid
              ? "Durasi maksimal tidak boleh lebih kecil dari durasi minimal."
              : `Pelanggan bisa memilih durasi ${values.minSessionHours} sampai ${values.maxSessionHours} jam.`}
          </FieldDescription>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel
              htmlFor="max-advance-days"
              className="text-xs font-semibold text-slate-700"
            >
              Batas booking ke depan
            </FieldLabel>
            <InputGroup className="h-9 bg-white">
              <InputGroupInput
                id="max-advance-days"
                type="number"
                min={1}
                max={365}
                value={values.maxAdvanceDays}
                onChange={(event) =>
                  onChange({
                    maxAdvanceDays: toNumber(
                      event.target.value,
                      values.maxAdvanceDays,
                    ),
                  })
                }
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText className="text-xs font-semibold text-slate-400">
                  hari
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription className="text-xs text-slate-500">
              Pelanggan tidak bisa memesan lebih jauh dari batas ini.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel
              htmlFor="cancellation-policy"
              className="text-xs font-semibold text-slate-700"
            >
              Kebijakan pembatalan
            </FieldLabel>
            <Select
              items={CANCELLATION_POLICY_OPTIONS}
              value={values.cancellationPolicy}
              onValueChange={(value) =>
                onChange({ cancellationPolicy: value ?? "" })
              }
            >
              <SelectTrigger
                id="cancellation-policy"
                className="h-9 w-full bg-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CANCELLATION_POLICY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription className="text-xs text-slate-500">
              Belum dipakai di proses pembatalan saat ini.
            </FieldDescription>
          </Field>
        </div>

        <Label
          htmlFor="same-day-booking"
          className="flex w-full items-start justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-normal"
        >
          <span>
            <span className="block text-sm font-medium text-slate-900">
              Izinkan booking di hari yang sama
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Pelanggan tetap bisa memesan slot yang masih kosong hari ini.
            </span>
          </span>
          <Switch
            id="same-day-booking"
            checked={values.allowSameDayBooking}
            onCheckedChange={(checked) =>
              onChange({ allowSameDayBooking: checked })
            }
            className="data-checked:bg-emerald-600"
          />
        </Label>
      </FieldGroup>
    </SettingsSection>
  );
}
