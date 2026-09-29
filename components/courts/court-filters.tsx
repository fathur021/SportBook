import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  amenityOptions,
  flooringOptions,
  MAX_PRICE,
  sportFilterOptions,
  timeSlotOptions,
} from "@/lib/filters";
import { formatRupiah } from "@/lib/format-rupiah";
import { Calendar, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
export function CourtFilter() {
  return (
    <aside className="flex w-full flex-col gap-6 rounded-2xl border bg-white p-5 lg:sticky lg:top-20">
      {/* Instal book inly */}
      <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3">
        <div className="flex items-start gap-2">
          <Zap className="mt-0.5 size-4 text-emerald-700" />
          <div>
            <p className="text-sm font-semibold">Instant Book Only</p>
            <p className="text-xs text-muted-foreground">
              Confirmed without host delay
            </p>
          </div>
        </div>
        <Switch defaultChecked />
      </div>

      {/* Sport catogory */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Sport Categoty</h3>
          <span className="text-xs text-muted-foreground">6 Available</span>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {sportFilterOptions.map((sport, i) => (
          <label
            key={sport.slug}
            className="flex cursor-pointer items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2">
              <Checkbox defaultChecked={i < 3} />
              {sport.label}
            </span>
            <span className="text-xs text-muted-foreground">{sport.count}</span>
          </label>
        ))}
      </div>

      {/* Play Date */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Play Date</h3>
        <div>
          <Button
            type="button"
            className="h-9 bg-emerald-700 text-xs hover:bg-emerald-800"
          >
            Today
          </Button>
          <Button type="button" variant="outline" className="h-9 text-xs">
            Tomorrow
          </Button>
          <Button type="button" variant="outline" className="h-9 text-xs">
            <Calendar />
            Pic
          </Button>
        </div>
      </div>

      {/* Preferred Time Slot */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Preferred Time Slot</h3>
        <div className="flex flex-col gap-2">
          {timeSlotOptions.map((slot) => {
            const isSelected = slot.value === "evening";
            return (
              <label
                key={slot.value}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm",
                  isSelected && "border-emerald-600 bg-emerald-50",
                )}
              >
                <span className="flex items-center gap-2">
                  <Checkbox defaultChecked={isSelected} />
                  {slot.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {slot.range}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Hourly Rate */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Hourly Rate (IDR)</h3>
          <span className="text-xs text-muted-foreground">
            Max {formatRupiah(MAX_PRICE)}
          </span>
        </div>

        <Slider
          defaultValue={[50000, 350000]}
          min={50000}
          max={350000}
          step={10000}
          className="[&_[data-slot=slider-range]]:bg-emerald-700"
        />

        <div className="flex gap-3">
          <div className="flex-1 rounded-lg bg-slate-50 p-2">
            <p className="text-[10px] text-muted-foreground">MIN</p>
            <p className="text-sm font-semibold">{formatRupiah(50000)}</p>
          </div>
          <div className="flex-1 rounded-lg bg-slate-50 p-2">
            <p className="text-[10px] text-muted-foreground">MAX</p>
            <p className="text-sm font-semibold">{formatRupiah(350000)}</p>
          </div>
        </div>
      </div>

      {/* Court Flooring Surface */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Court Flooring Surface</h3>
        <div className="flex flex-wrap gap-2">
          {flooringOptions.map((option) => {
            const isSelected = option === "Synthetic Turf";
            return (
              <span
                key={option}
                className={cn(
                  "rounded-md border px-2.5 py-1.5 text-xs font-medium",
                  isSelected
                    ? "border-emerald-600 bg-emerald-100 text-emerald-800"
                    : "border-slate-200 bg-slate-50 text-slate-600",
                )}
              >
                {option}
              </span>
            );
          })}
        </div>
      </div>

      {/* Amenities & Facilities */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Amenities &amp; Facilities</h3>
        <div className="flex flex-col gap-2.5">
          {amenityOptions.map((item, i) => (
            <label
              key={item.slug}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <Checkbox defaultChecked={i < 2} />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <Button className="h-11 bg-emerald-700 hover:bg-emerald-800">
        Apply Filters (42)
      </Button>
    </aside>
  );
}
