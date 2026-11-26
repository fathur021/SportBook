// Sidebar filter venue di halaman Explore.
// State disinkronkan dengan searchParams URL dan ditulis ulang saat "Apply Filters" diklik.

"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Calendar, ChevronDown, SlidersHorizontal, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  amenityOptions,
  flooringOptions,
  MAX_PRICE,
  MIN_PRICE,
  sportFilterOptions,
  timeSlotOptions,
} from "@/lib/filters";
import { formatRupiah } from "@/lib/format-rupiah";
import { cn } from "@/lib/utils";

const parseList = (value: string | null) =>
  value?.split(",").filter(Boolean) ?? [];

type CourtFilterProps = {
  resultCount?: number;
};

export function CourtFilter({ resultCount }: CourtFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // Input tanggal native disembunyikan, dibuka lewat tombol "Pick"
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [instant, setInstant] = useState(params.get("instant") === "1");
  const [sports, setSports] = useState<string[]>(parseList(params.get("sport")));
  const [date, setDate] = useState(params.get("date") ?? "today");
  const [times, setTimes] = useState<string[]>(parseList(params.get("time")));
  const [price, setPrice] = useState<number[]>([
    Number(params.get("min") ?? MIN_PRICE),
    Number(params.get("max") ?? MAX_PRICE),
  ]);
  const [floors, setFloors] = useState<string[]>(
    parseList(params.get("floor")),
  );
  const [amenities, setAmenities] = useState<string[]>(
    parseList(params.get("amenity")),
  );
  const [showFilters, setShowFilters] = useState(false);

  const handlePriceChange = (value: number | readonly number[]) => {
    if (typeof value === "number") {
      setPrice([MIN_PRICE, value]);
      return;
    }
    setPrice([
      Number(value[0] ?? MIN_PRICE),
      Number(value[1] ?? value[0] ?? MAX_PRICE),
    ]);
  };

  const toggle = (
    list: string[],
    setList: (value: string[]) => void,
    value: string,
  ) =>
    setList(
      list.includes(value) ? list.filter((x) => x !== value) : [...list, value],
    );

  const isCustomDate = date !== "today" && date !== "tomorrow";

  const applyFilters = () => {
    const query = new URLSearchParams();

    // Pertahankan kata kunci pencarian agar tidak hilang saat filter lain diterapkan.
    const keyword = params.get("q");
    if (keyword) query.set("q", keyword);

    if (instant) query.set("instant", "1");
    if (sports.length) query.set("sport", sports.join(","));
    query.set("date", date);
    if (times.length) query.set("time", times.join(","));
    query.set("min", String(price[0]));
    query.set("max", String(price[1]));
    if (floors.length) query.set("floor", floors.join(","));
    if (amenities.length) query.set("amenity", amenities.join(","));

    router.push(`${pathname}?${query.toString()}`);
    setShowFilters(false);
  };

  return (
    <aside className="w-full rounded-2xl border bg-white p-4 sm:p-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
      <button
        type="button"
        onClick={() => setShowFilters((value) => !value)}
        aria-expanded={showFilters}
        className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-emerald-700" />
          Filter &amp; Sort
          {resultCount !== undefined && (
            <span className="font-normal text-muted-foreground">
              ({resultCount})
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            showFilters && "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "flex-col gap-6",
          showFilters ? "mt-4 flex" : "hidden",
          "lg:mt-0 lg:flex",
        )}
      >
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
        <Switch checked={instant} onCheckedChange={setInstant} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Sport Category</h3>
          <span className="text-xs text-muted-foreground">
            {sportFilterOptions.length} Available
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {sportFilterOptions.map((sport) => (
            <label
              key={sport.slug}
              className="flex cursor-pointer items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2">
                <Checkbox
                  checked={sports.includes(sport.slug)}
                  onCheckedChange={() => toggle(sports, setSports, sport.slug)}
                />
                {sport.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {sport.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Play Date</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={date === "today" ? "default" : "outline"}
            className={cn(
              "h-9 text-xs",
              date === "today" && "bg-emerald-700 hover:bg-emerald-800",
            )}
            onClick={() => setDate("today")}
          >
            Today
          </Button>

          <Button
            type="button"
            variant={date === "tomorrow" ? "default" : "outline"}
            className={cn(
              "h-9 text-xs",
              date === "tomorrow" && "bg-emerald-700 hover:bg-emerald-800",
            )}
            onClick={() => setDate("tomorrow")}
          >
            Tomorrow
          </Button>

          <Button
            type="button"
            variant={isCustomDate ? "default" : "outline"}
            className={cn(
              "h-9 text-xs",
              isCustomDate && "bg-emerald-700 hover:bg-emerald-800",
            )}
            onClick={() => dateInputRef.current?.showPicker()}
          >
            <Calendar />
            {isCustomDate ? date : "Pick"}
          </Button>

          <input
            ref={dateInputRef}
            type="date"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            value={isCustomDate ? date : ""}
            onChange={(e) => e.target.value && setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Preferred Time Slot</h3>
        <div className="flex flex-col gap-2">
          {timeSlotOptions.map((slot) => {
            const isSelected = times.includes(slot.value);
            return (
              <label
                key={slot.value}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm",
                  isSelected && "border-emerald-600 bg-emerald-50",
                )}
              >
                <span className="flex items-center gap-2">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggle(times, setTimes, slot.value)}
                  />
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

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Hourly Rate (IDR)</h3>
          <span className="text-xs text-muted-foreground">
            Max {formatRupiah(MAX_PRICE)}
          </span>
        </div>

        <Slider
          value={price}
          onValueChange={handlePriceChange}
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={10000}
          className="[&_[data-slot=slider-range]]:bg-emerald-700"
        />

        <div className="flex gap-3">
          <div className="flex-1 rounded-lg bg-slate-50 p-2">
            <p className="text-[10px] text-muted-foreground">MIN</p>
            <p className="text-sm font-semibold">{formatRupiah(price[0])}</p>
          </div>
          <div className="flex-1 rounded-lg bg-slate-50 p-2">
            <p className="text-[10px] text-muted-foreground">MAX</p>
            <p className="text-sm font-semibold">{formatRupiah(price[1])}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Court Flooring Surface</h3>
        <div className="flex flex-wrap gap-2">
          {flooringOptions.map((option) => {
            const isSelected = floors.includes(option);
            return (
              <button
                type="button"
                key={option}
                aria-pressed={isSelected}
                onClick={() => toggle(floors, setFloors, option)}
                className={cn(
                  "rounded-md border px-2.5 py-1.5 text-xs font-medium",
                  isSelected
                    ? "border-emerald-600 bg-emerald-100 text-emerald-800"
                    : "border-slate-200 bg-slate-50 text-slate-600",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Amenities &amp; Facilities</h3>
        <div className="flex flex-col gap-2.5">
          {amenityOptions.map((item) => (
            <label
              key={item.slug}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <Checkbox
                checked={amenities.includes(item.slug)}
                onCheckedChange={() =>
                  toggle(amenities, setAmenities, item.slug)
                }
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      <Button
        type="button"
        onClick={applyFilters}
        className="h-11 bg-emerald-700 hover:bg-emerald-800"
      >
        Apply Filters{resultCount !== undefined && ` (${resultCount})`}
      </Button>
      </div>
    </aside>
  );
}