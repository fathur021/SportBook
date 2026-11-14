import { CreditCard } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminSettings } from "@/lib/redux/admin-api";
import { PAYMENT_WINDOW_OPTIONS } from "@/lib/settings";

// Field pembayaran yang dipakai form ini.
type PaymentValues = Pick<
  AdminSettings,
  "paymentWindowMinutes" | "taxPercent"
>;

type PaymentSectionProps = {
  values: PaymentValues;
  onChange: (patch: Partial<PaymentValues>) => void;
};

// Mengubah isi input menjadi angka.
// Kalau input kosong, pakai nilai cadangan.
function toNumber(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function PaymentSection({ values, onChange }: PaymentSectionProps) {
  return (
    <SettingsSection
      icon={CreditCard}
      title="Pembayaran"
      description="Batas waktu dan pajak pada pembayaran."
    >
      <FieldGroup>
        <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-900">
          Pembayaran diproses lewat Midtrans dengan satu akun untuk semua venue.
          Metode aktif seperti QRIS, virtual account, dan kartu diatur langsung
          dari dashboard Midtrans.
        </div>

        <Field>
          <FieldLabel
            htmlFor="payment-window"
            className="text-xs font-semibold text-slate-700"
          >
            Batas waktu pembayaran
          </FieldLabel>

          {/* Nilai disimpan sebagai angka, tapi Select memakai teks. */}
          <Select
            items={PAYMENT_WINDOW_OPTIONS}
            value={String(values.paymentWindowMinutes)}
            onValueChange={(value) => {
              if (!value) return;
              onChange({ paymentWindowMinutes: Number(value) });
            }}
          >
            <SelectTrigger id="payment-window" className="h-9 w-full bg-white">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {PAYMENT_WINDOW_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FieldDescription className="text-xs text-slate-500">
            Booking yang belum dibayar setelah batas ini otomatis dibatalkan dan
            slotnya dilepas.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel
            htmlFor="tax"
            className="text-xs font-semibold text-slate-700"
          >
            Pajak / PPN
          </FieldLabel>

          <InputGroup className="h-9 bg-white">
            <InputGroupInput
              id="tax"
              type="number"
              min={0}
              max={100}
              value={String(values.taxPercent ?? 0)}
              onChange={(event) =>
                onChange({
                  taxPercent: toNumber(event.target.value, values.taxPercent ?? 0),
                })
              }
            />

            <InputGroupAddon align="inline-end">
              <InputGroupText className="text-xs font-semibold text-slate-400">
                %
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>

          <FieldDescription className="text-xs text-slate-500">
            Ditambahkan ke total booking saat pelanggan memesan. Contoh: total
            Rp200.000 dengan pajak 11% menjadi Rp222.000.
          </FieldDescription>
        </Field>

        <FieldDescription className="text-xs text-amber-700">
          Uang muka belum dipakai. Pembayaran saat ini selalu penuh.
        </FieldDescription>
      </FieldGroup>
    </SettingsSection>
  );
}
