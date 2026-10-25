import { CreditCard } from "lucide-react";

import { SettingsSection } from "@/components/admin/settings/settings-section";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_PAYMENT_SETTINGS,
  PAYMENT_METHOD_OPTIONS,
} from "@/lib/settings";

export function PaymentSection() {
  const payment = DEFAULT_PAYMENT_SETTINGS;

  return (
    <SettingsSection
      icon={CreditCard}
      title="Pembayaran"
      description="Metode pembayaran dan rekening tujuan."
    >
      <FieldGroup>
        <Field>
          <FieldLabel className="text-xs font-semibold text-slate-700">
            Metode pembayaran aktif
          </FieldLabel>

          <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
            {PAYMENT_METHOD_OPTIONS.map((method) => (
              <Label
                key={method.id}
                htmlFor={method.id}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 font-normal"
              >
                <span>
                  <span className="block text-sm font-medium text-slate-900">
                    {method.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {method.description}
                  </span>
                </span>
                <Switch
                  id={method.id}
                  defaultChecked={method.enabled}
                  className="data-checked:bg-emerald-600"
                />
              </Label>
            ))}
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel
              htmlFor="bank-name"
              className="text-xs font-semibold text-slate-700"
            >
              Nama bank
            </FieldLabel>
            <Input
              id="bank-name"
              defaultValue={payment.bankName}
              className="h-9 bg-white"
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="account-number"
              className="text-xs font-semibold text-slate-700"
            >
              Nomor rekening
            </FieldLabel>
            <Input
              id="account-number"
              inputMode="numeric"
              defaultValue={payment.accountNumber}
              className="h-9 bg-white"
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="account-holder"
              className="text-xs font-semibold text-slate-700"
            >
              Atas nama
            </FieldLabel>
            <Input
              id="account-holder"
              defaultValue={payment.accountHolder}
              className="h-9 bg-white"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
      </FieldGroup>
    </SettingsSection>
  );
}
