"use client";

import { useState } from "react";
import { CalendarClock, Clock3, CreditCard } from "lucide-react";

import { cn } from "@/lib/utils";
import { BookingRulesSection } from "@/components/admin/settings/sections/booking-rules-section";
import { OperatingHoursSection } from "@/components/admin/settings/sections/operating-hours-section";
import { PaymentSection } from "@/components/admin/settings/sections/payment-section";
import { SettingsSaveBar } from "@/components/admin/settings/settings-save-bar";

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
    description: "Jam buka, tutup, dan zona waktu",
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

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("booking");

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
        {activeTab === "booking" ? <BookingRulesSection /> : null}
        {activeTab === "operating-hours" ? <OperatingHoursSection /> : null}
        {activeTab === "payment" ? <PaymentSection /> : null}

        <SettingsSaveBar />
      </div>
    </div>
  );
}
