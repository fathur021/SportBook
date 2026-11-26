"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format-rupiah";
import type { EquipmentItem } from "@/lib/equipment";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/admin/search-input";

type EquipmentPickerProps = {
  items: EquipmentItem[];
  quantities: Record<string, number>;
  onQuantitiesChange: (next: Record<string, number>) => void;
};

export function EquipmentPicker({
  items,
  quantities,
  onQuantitiesChange,
}: EquipmentPickerProps) {
  const qty = (id: string) => quantities[id] ?? 0;

  const [query, setQuery] = useState("");

  const filteredItems = items.filter((item) =>
    `${item.name} ${item.description ?? ""} ${item.unit ?? ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  const increment = (id: string) =>
    onQuantitiesChange({ ...quantities, [id]: (quantities[id] ?? 0) + 1 });

  const decrement = (id: string) =>
    onQuantitiesChange({
      ...quantities,
      [id]: Math.max(0, (quantities[id] ?? 0) - 1),
    });

  return (
    <Card className="p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
        Step 3
      </p>
      <h2 className="text-2xl font-bold tracking-tight">Add Equipment</h2>

      <div className="mt-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari peralatan..."
        />
      </div>

      {filteredItems.length === 0 ? (
        <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-muted-foreground">
          Equipment belum tersedia untuk venue ini, silakan hubungi venue.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {filteredItems.map((item) => {
            const count = qty(item.id);
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition",
                  count > 0
                    ? "border-emerald-200 bg-emerald-50/60"
                    : "border-slate-100 bg-white",
                )}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {item.name}
                  </p>
                  {item.description && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.description}
                    </p>
                  )}
                  {item.unit && (
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {item.unit}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <span className="text-sm font-bold text-emerald-700">
                    {formatRupiah(item.pricePerUnit)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="size-8"
                      disabled={count === 0}
                      onClick={() => decrement(item.id)}
                      aria-label={`Kurangi ${item.name}`}
                    >
                      <Minus className="size-3.5" />
                    </Button>

                    <span
                      className="flex h-8 min-w-8 items-center justify-center rounded-md bg-slate-50 px-2 text-sm font-semibold text-slate-800"
                      aria-live="polite"
                    >
                      {count}
                    </span>

                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="size-8"
                      onClick={() => increment(item.id)}
                      aria-label={`Tambah ${item.name}`}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
