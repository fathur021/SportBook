import { CalendarClock } from "lucide-react";

import { SettingsSection } from "@/components/admin/settings/settings-section";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  CANCELLATION_POLICY_OPTIONS,
  DEFAULT_BOOKING_RULES,
  SESSION_DURATION_OPTIONS,
} from "@/lib/settings";

export function BookingRulesSection() {
  const rules = DEFAULT_BOOKING_RULES;

  return (
    <SettingsSection
      icon={CalendarClock}
      title="Aturan Booking"
      description="Aturan dasar yang dipakai saat pelanggan memesan lapangan."
    >
      <FieldGroup>
        <Field>
          <FieldLabel className="text-xs font-semibold text-slate-700">
            Durasi sesi yang tersedia
          </FieldLabel>
          <div className="flex flex-wrap gap-2">
            {SESSION_DURATION_OPTIONS.map((duration) => (
              <Label
                key={duration.id}
                htmlFor={duration.id}
                className="cursor-pointer gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 transition-colors hover:border-emerald-300"
              >
                <Checkbox
                  id={duration.id}
                  defaultChecked={duration.enabled}
                  className="data-checked:border-emerald-600 data-checked:bg-emerald-600"
                />
                {duration.label}
              </Label>
            ))}
          </div>
          <FieldDescription className="text-xs text-slate-500">
            Pilih lebih dari satu jika pelanggan boleh memilih durasi.
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
                defaultValue={rules.maxAdvanceDays}
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
              defaultValue={rules.cancellationPolicy}
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
            defaultChecked={rules.allowSameDayBooking}
            className="data-checked:bg-emerald-600"
          />
        </Label>
      </FieldGroup>
    </SettingsSection>
  );
}
