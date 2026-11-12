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
import {
  DEFAULT_PAYMENT_SETTINGS,
  PAYMENT_WINDOW_OPTIONS,
} from "@/lib/settings";

const paymentWindowOptions = PAYMENT_WINDOW_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}));

export function PaymentSection() {
  const payment = DEFAULT_PAYMENT_SETTINGS;

  return (
    <SettingsSection
      icon={CreditCard}
      title="Pembayaran"
      description="Batas waktu dan biaya tambahan pada pembayaran."
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
          <Select
            items={paymentWindowOptions}
            defaultValue={payment.paymentWindow}
          >
            <SelectTrigger id="payment-window" className="h-9 w-full bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentWindowOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription className="text-xs text-slate-500">
            Booking yang belum dibayar setelah batas ini tidak bisa dilanjutkan.
          </FieldDescription>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
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
                defaultValue={payment.taxPercent}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText className="text-xs font-semibold text-slate-400">
                  %
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription className="text-xs text-slate-500">
              Ditambahkan ke total pembayaran.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel
              htmlFor="down-payment"
              className="text-xs font-semibold text-slate-700"
            >
              Uang muka
            </FieldLabel>
            <InputGroup className="h-9 bg-white">
              <InputGroupInput
                id="down-payment"
                type="number"
                min={0}
                max={100}
                defaultValue={payment.downPaymentPercent}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText className="text-xs font-semibold text-slate-400">
                  %
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription className="text-xs text-slate-500">
              Persentase dari total booking.
            </FieldDescription>
          </Field>
        </div>

        <FieldDescription className="text-xs text-amber-700">
          Pajak dan uang muka belum dihitung ke total booking. Isian ini
          disiapkan untuk tahap berikutnya.
        </FieldDescription>
      </FieldGroup>
    </SettingsSection>
  );
}
