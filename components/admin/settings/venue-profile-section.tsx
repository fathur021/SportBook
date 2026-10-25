import { Building2 } from "lucide-react";

import { SettingsSection } from "@/components/admin/settings/settings-section";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_VENUE_PROFILE,
  SPORT_OPTIONS,
  TIMEZONE_OPTIONS,
} from "@/lib/settings";

const sportOptions = SPORT_OPTIONS.map((sport) => ({
  value: sport,
  label: sport,
}));

const timezoneOptions = TIMEZONE_OPTIONS.map((timezone) => ({
  value: timezone,
  label: timezone,
}));

export function VenueProfileSection() {
  const profile = DEFAULT_VENUE_PROFILE;

  return (
    <SettingsSection
      icon={Building2}
      title="Profil Venue"
      description="Informasi dasar yang tampil di halaman publik."
    >
      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel
            htmlFor="venue-name"
            className="text-xs font-semibold text-slate-700"
          >
            Nama venue
          </FieldLabel>
          <Input
            id="venue-name"
            defaultValue={profile.name}
            className="h-9 bg-white"
          />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="venue-sport"
            className="text-xs font-semibold text-slate-700"
          >
            Cabang olahraga
          </FieldLabel>
          <Select items={sportOptions} defaultValue={profile.sport}>
            <SelectTrigger id="venue-sport" className="h-9 w-full bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sportOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel
            htmlFor="venue-phone"
            className="text-xs font-semibold text-slate-700"
          >
            Telepon / WhatsApp
          </FieldLabel>
          <Input
            id="venue-phone"
            type="tel"
            defaultValue={profile.phone}
            className="h-9 bg-white"
          />
        </Field>

        <Field>
          <FieldLabel
            htmlFor="venue-email"
            className="text-xs font-semibold text-slate-700"
          >
            Email
          </FieldLabel>
          <Input
            id="venue-email"
            type="email"
            defaultValue={profile.email}
            className="h-9 bg-white"
          />
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel
            htmlFor="venue-address"
            className="text-xs font-semibold text-slate-700"
          >
            Alamat
          </FieldLabel>
          <Input
            id="venue-address"
            defaultValue={profile.address}
            className="h-9 bg-white"
          />
        </Field>

        <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
          <Field>
            <FieldLabel
              htmlFor="venue-open-time"
              className="text-xs font-semibold text-slate-700"
            >
              Jam buka
            </FieldLabel>
            <Input
              id="venue-open-time"
              type="time"
              defaultValue={profile.openTime}
              className="h-9 bg-white"
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="venue-close-time"
              className="text-xs font-semibold text-slate-700"
            >
              Jam tutup
            </FieldLabel>
            <Input
              id="venue-close-time"
              type="time"
              defaultValue={profile.closeTime}
              className="h-9 bg-white"
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="venue-timezone"
              className="text-xs font-semibold text-slate-700"
            >
              Zona waktu
            </FieldLabel>
            <Select items={timezoneOptions} defaultValue={profile.timezone}>
              <SelectTrigger id="venue-timezone" className="h-9 w-full bg-white">
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
      </FieldGroup>
    </SettingsSection>
  );
}
