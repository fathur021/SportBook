"use client";

import { LayoutGrid, TableProperties } from "lucide-react";
import type { BookingStatus } from "@/lib/mock-bookings";

interface BookingTabsProps {
  activeTab: BookingStatus;
  onTabChange: (tab: BookingStatus) => void;
  viewMode: "card" | "table";
  onViewModeChange: (mode: "card" | "table") => void;
  counts: {
    upcoming: number;
    completed: number;
    cancelled: number;
  };
}

export function BookingTabs({
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  counts,
}: BookingTabsProps) {
  const tabs: { key: BookingStatus; label: string; count: number }[] = [
    { key: "upcoming", label: "Upcoming", count: counts.upcoming },
    { key: "completed", label: "Completed", count: counts.completed },
    { key: "cancelled", label: "Cancelled", count: counts.cancelled },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-2">
      {/* 1. Filter Kategori Status */}
      <div className="flex items-center gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`pb-2 px-3 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "text-emerald-800 border-b-2 border-emerald-700"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Switcher Mode Tampilan: Kartu (Grid) vs Tabel */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
        <button
          type="button"
          onClick={() => onViewModeChange("card")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            viewMode === "card"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span>Cards</span>
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange("table")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            viewMode === "table"
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <TableProperties className="h-3.5 w-3.5" />
          <span>Table</span>
        </button>
      </div>
    </div>
  );
}
