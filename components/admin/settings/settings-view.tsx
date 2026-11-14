"use client";

import { useState } from "react";
import { CalendarClock, Clock3, CreditCard } from "lucide-react";

import { cn } from "@/lib/utils";
import { BookingRulesSection } from "@/components/admin/settings/sections/booking-rules-section";
import { OperatingHoursSection } from "@/components/admin/settings/sections/operating-hours-section";
import { PaymentSection } from "@/components/admin/settings/sections/payment-section";
import { SettingsSaveBar } from "@/components/admin/settings/settings-save-bar";
import { Button } from "@/components/ui/button";
import {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
  type AdminSettings,
} from "@/lib/redux/admin-api";

const SETTINGS_TABS = [
  {
    id: "booking",
    label: "Aturan Booking",
    description: "Durasi sesi dan aturan pemesanan",
    icon: CalendarClock,
  },
  {
    id: "operating-hours",
    label: "Jam Operasional",
    description: "Jam buka dan jam tutup",
    icon: Clock3,
  },
  {
    id: "payment",
    label: "Pembayaran",
    description: "Batas waktu dan biaya pembayaran",
    icon: CreditCard,
  },
] as const;

type SettingsTabId = (typeof SETTINGS_TABS)[number]["id"];

// Field yang bisa diubah dari halaman ini.
type SettingsDraft = Pick<
  AdminSettings,
  | "minSessionHours"
  | "maxSessionHours"
  | "openTime"
  | "closeTime"
  | "allowSameDayBooking"
  | "maxAdvanceDays"
  | "cancellationPolicy"
  | "paymentWindowMinutes"
  | "taxPercent"
>;

// Nilai sementara sebelum data dari API datang.
const EMPTY_DRAFT: SettingsDraft = {
  minSessionHours: 1,
  maxSessionHours: 3,
  openTime: "07:00",
  closeTime: "23:00",
  allowSameDayBooking: true,
  maxAdvanceDays: 30,
  cancellationPolicy: "free-until-h1",
  paymentWindowMinutes: 10,
  taxPercent: 11,
};

// Mengubah data dari API menjadi bentuk yang dipakai form.
function toDraft(settings: AdminSettings): SettingsDraft {
  return {
    minSessionHours: settings.minSessionHours,
    maxSessionHours: settings.maxSessionHours,
    openTime: settings.openTime,
    closeTime: settings.closeTime,
    allowSameDayBooking: settings.allowSameDayBooking,
    maxAdvanceDays: settings.maxAdvanceDays,
    cancellationPolicy: settings.cancellationPolicy,
    paymentWindowMinutes: settings.paymentWindowMinutes,
    taxPercent: settings.taxPercent,
  };
}

// Mengambil pesan error dari respons RTK Query.
function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { error?: string; details?: Array<{ path: string; message: string }> } }).data;
    if (data?.error) {
      // Jika ada detail per field, gabungkan dengan pesan utama.
      if (data.details && data.details.length > 0) {
        const details = data.details
          .map((d) => d.path ? `${d.path}: ${d.message}` : d.message)
          .join("; ");
        return `${data.error} — ${details}`;
      }
      return data.error;
    }
  }

  return "Gagal menyimpan pengaturan.";
}

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("booking");

  // Data pengaturan dari server.
  const {
    data: settings,
    isLoading,
    isError,
    refetch,
  } = useGetAdminSettingsQuery();

  // Mutation untuk menyimpan.
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateAdminSettingsMutation();

  // Isi form yang sudah diubah. null berarti belum ada perubahan,
  // sehingga nilai diambil langsung dari data server.
  const [draft, setDraft] = useState<SettingsDraft | null>(null);

  // Pesan hasil simpan.
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Nilai terakhir yang tersimpan di server.
  const saved = settings ? toDraft(settings) : EMPTY_DRAFT;

  // Nilai yang ditampilkan di form.
  const values = draft ?? saved;

  // Form dianggap berubah kalau ada nilai draft yang beda dengan server.
  const isDirty = draft
    ? (Object.keys(draft) as (keyof SettingsDraft)[]).some(
        (key) => draft[key] !== saved[key],
      )
    : false;

  // Mengubah satu atau beberapa field sekaligus.
  const handleChange = (patch: Partial<SettingsDraft>) => {
    setDraft((previous) => ({ ...(previous ?? saved), ...patch }));
    setMessage(null);
  };

  // Kembalikan form ke nilai terakhir yang tersimpan.
  const handleReset = () => {
    setDraft(null);
    setMessage(null);
  };

  // Kirim perubahan ke API.
  const handleSave = async () => {
    setMessage(null);

    try {
      await updateSettings(values).unwrap();
      // Cache sudah diperbarui oleh mutation, jadi form kembali ke data server.
      setDraft(null);
      setMessage({ type: "success", text: "Pengaturan berhasil disimpan." });
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <nav aria-label="Bagian pengaturan" className="min-w-0">
        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex min-w-56 items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors lg:min-w-0",
                  isActive
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-transparent bg-white/60 hover:border-slate-200 hover:bg-white",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-500",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      isActive ? "text-emerald-900" : "text-slate-800",
                    )}
                  >
                    {tab.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {tab.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="min-w-0 space-y-4">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            Memuat pengaturan...
          </div>
        ) : null}

        {isError ? (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
            <p>Gagal mengambil pengaturan.</p>
            <Button
              type="button"
              variant="outline"
              className="h-9 px-4"
              onClick={() => refetch()}
            >
              Coba lagi
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError ? (
          <>
            {activeTab === "booking" ? (
              <BookingRulesSection values={values} onChange={handleChange} />
            ) : null}

            {activeTab === "operating-hours" ? (
              <OperatingHoursSection values={values} onChange={handleChange} />
            ) : null}

            {activeTab === "payment" ? (
              <PaymentSection values={values} onChange={handleChange} />
            ) : null}

            <SettingsSaveBar
              isDirty={isDirty}
              isSaving={isSaving}
              message={message}
              onReset={handleReset}
              onSave={handleSave}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
