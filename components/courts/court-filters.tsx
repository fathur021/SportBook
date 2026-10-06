// ---------------------------------------------------------------------------
// Komponen Sidebar Filter Lapangan & Venue (CourtFilter)
//
// Komponen ini mengontrol seluruh parameter penyaringan lapangan di sisi kiri halaman:
// 1. Membaca query string URL saat pertama kali dimuat (sinkronisasi state dengan URL).
// 2. Mengelola input filter pengguna (Kategori Olahraga, Tanggal Main, Slot Jam,
//    Rentang Harga, Jenis Lantai, Fasilitas, dan Instant Book).
// 3. Mengirimkan parameter yang diperbarui ke URL saat tombol "Apply Filters" diklik.
// ---------------------------------------------------------------------------

"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { Calendar, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Batas Bawah Harga (Default Minimum Price)
// ---------------------------------------------------------------------------
const MIN_PRICE = 50000;

// ---------------------------------------------------------------------------
// Helper: Memecah string dipisah koma dari URL query param menjadi array
// Contoh: "futsal,badminton" -> ["futsal", "badminton"]
// Jika bernilai null atau kosong, mengembalikan array kosong []
// ---------------------------------------------------------------------------
const parseList = (value: string | null) =>
  value?.split(",").filter(Boolean) ?? [];

// ---------------------------------------------------------------------------
// Tipe Props untuk komponen CourtFilter
// ---------------------------------------------------------------------------
type CourtFilterProps = {
  resultCount?: number; // Total jumlah venue/lapangan yang sesuai kriteria pencarian
};

// ---------------------------------------------------------------------------
// Komponen Utama CourtFilter
// ---------------------------------------------------------------------------
export function CourtFilter({ resultCount }: CourtFilterProps) {
  // Hook Next.js untuk membaca dan memperbarui query URL
  const router = useRouter();          // Untuk navigasi / update URL saat filter diterapkan
  const pathname = usePathname();      // Mengambil path URL saat ini (misal: "/explore")
  const params = useSearchParams();    // Membaca parameter query URL aktif

  // Referensi DOM ke elemen input tanggal native (type="date") yang tersembunyi
  // Dipicu saat tombol kalender "Pick" ditekan agar memunculkan date picker native browser
  const dateInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------------------
  // State Lokal: Inisialisasi awal nilai filter dibaca langsung dari URL browser
  // -------------------------------------------------------------------------

  // 1. Filter Instant Book: bernilai true jika query URL memiliki "?instant=1"
  const [instant, setInstant] = useState(params.get("instant") === "1");

  // 2. Filter Kategori Olahraga: array slug olahraga (misal: ["padel", "futsal"])
  const [sports, setSports] = useState<string[]>(
    parseList(params.get("sport")),
  );

  // 3. Filter Tanggal Main: default "today" jika tidak diset di URL, atau "tomorrow" / "YYYY-MM-DD"
  const [date, setDate] = useState(params.get("date") ?? "today");

  // 4. Filter Slot Waktu Main: array pilihan waktu (misal: ["morning", "evening"])
  const [times, setTimes] = useState<string[]>(parseList(params.get("time")));

  // 5. Filter Rentang Harga Sewa: array [min, max] dalam Rupiah
  const [price, setPrice] = useState<number[]>([
    Number(params.get("min") ?? MIN_PRICE),
    Number(params.get("max") ?? MAX_PRICE),
  ]);

  // 6. Filter Jenis Permukaan Lantai: array jenis lantai (misal: ["Vinyl", "Parquet"])
  const [floors, setFloors] = useState<string[]>(
    parseList(params.get("floor")),
  );

  // 7. Filter Fasilitas / Amenities: array slug fasilitas (misal: ["shower", "locker"])
  const [amenities, setAmenities] = useState<string[]>(
    parseList(params.get("amenity")),
  );

  // -------------------------------------------------------------------------
  // Handler: Update State Rentang Harga dari Komponen Slider
  // -------------------------------------------------------------------------
  const handlePriceChange = (value: number | readonly number[]) => {
    // Jika slider hanya mengembalikan 1 nilai angka
    if (typeof value === "number") {
      setPrice([MIN_PRICE, value]);
      return;
    }

    // Jika slider mengembalikan tuple rentang [min, max]
    setPrice([
      Number(value[0] ?? MIN_PRICE),
      Number(value[1] ?? value[0] ?? MAX_PRICE),
    ]);
  };

  // -------------------------------------------------------------------------
  // Helper: Toggle Nilai Multi-select (Checkbox / Button Tag)
  // Menambahkan item jika belum ada, atau menghapusnya jika sudah terpilih
  // -------------------------------------------------------------------------
  const toggle = (
    list: string[],
    setList: (value: string[]) => void,
    value: string,
  ) =>
    setList(
      list.includes(value) ? list.filter((x) => x !== value) : [...list, value],
    );

  // Cek apakah tanggal yang dipilih adalah tanggal spesifik dari kalender (bukan "today" / "tomorrow")
  const isCustomDate = date !== "today" && date !== "tomorrow";

  // -------------------------------------------------------------------------
  // Handler: Terapkan Filter & Tulis Seluruh State ke URL Browser
  // -------------------------------------------------------------------------
  const applyFilters = () => {
    // Buat objek URLSearchParams baru untuk menampung seluruh parameter filter yang aktif
    const q = new URLSearchParams();

    if (instant) q.set("instant", "1");
    if (sports.length) q.set("sport", sports.join(","));
    q.set("date", date);
    if (times.length) q.set("time", times.join(","));
    q.set("min", String(price[0]));
    q.set("max", String(price[1]));
    if (floors.length) q.set("floor", floors.join(","));
    if (amenities.length) q.set("amenity", amenities.join(","));

    // Navigasi ke URL baru dengan query params yang sudah diperbarui tanpa reload halaman
    router.push(`${pathname}?${q.toString()}`);
  };

  return (
    // Panel Sidebar Filter: Posisi sticky di layar desktop (lg) agar tetap terlihat saat scroll daftar venue
    <aside className="flex w-full flex-col gap-6 rounded-2xl border bg-white p-5 lg:sticky lg:top-20">
      
      {/* ------------------------------------------------------------------- */}
      {/* 1. Filter Instant Book Only (Switch Toggle)                         */}
      {/* ------------------------------------------------------------------- */}
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
        {/* Toggle switch untuk mengaktifkan / menonaktifkan instant booking */}
        <Switch checked={instant} onCheckedChange={setInstant} />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Filter Kategori Olahraga (Checkboxes)                             */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Sport Category</h3>
          <span className="text-xs text-muted-foreground">
            {sportFilterOptions.length} Available
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {/* Render daftar pilihan olahraga beserta badge jumlah lapangan yang tersedia */}
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

      {/* ------------------------------------------------------------------- */}
      {/* 3. Filter Tanggal Main (Hari Ini, Besok, atau Kalender)              */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Play Date</h3>
        <div className="flex gap-2">
          {/* Tombol cepat: Hari ini */}
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

          {/* Tombol cepat: Besok */}
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

          {/* Tombol pemilih tanggal kustom: memanggil showPicker() dari input tanggal */}
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

          {/* Input tanggal native browser yang disembunyikan (sr-only), dibuka via tombol Pick */}
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

      {/* ------------------------------------------------------------------- */}
      {/* 4. Filter Preferensi Slot Waktu Main (Time Slots)                    */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Preferred Time Slot</h3>
        <div className="flex flex-col gap-2">
          {/* Render kartu pilihan waktu (Morning, Afternoon, Evening) dengan rentang jam */}
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

      {/* ------------------------------------------------------------------- */}
      {/* 5. Filter Rentang Tarif Sewa per Jam (IDR Slider)                    */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Hourly Rate (IDR)</h3>
          <span className="text-xs text-muted-foreground">
            Max {formatRupiah(MAX_PRICE)}
          </span>
        </div>

        {/* Slider rentang harga min & max dengan kelipatan 10.000 */}
        <Slider
          value={price}
          onValueChange={handlePriceChange}
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={10000}
          className="[&_[data-slot=slider-range]]:bg-emerald-700"
        />

        {/* Tampilan badge nominal batas minimum dan maksimum terpilih */}
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

      {/* ------------------------------------------------------------------- */}
      {/* 6. Filter Jenis Permukaan Lapangan (Flooring Options Tag)            */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Court Flooring Surface</h3>
        <div className="flex flex-wrap gap-2">
          {/* Tombol pill/tag interaktif untuk memilih jenis permukaan lantai */}
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

      {/* ------------------------------------------------------------------- */}
      {/* 7. Filter Fasilitas & Sarana Venue (Amenities Checkboxes)            */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Amenities &amp; Facilities</h3>
        <div className="flex flex-col gap-2.5">
          {/* Render daftar checkbox fasilitas (Shower, Locker, Parking, dll) */}
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

      {/* ------------------------------------------------------------------- */}
      {/* 8. Tombol Terapkan Filter (Apply Filters Button)                      */}
      {/* ------------------------------------------------------------------- */}
      <Button
        type="button"
        onClick={applyFilters}
        className="h-11 bg-emerald-700 hover:bg-emerald-800"
      >
        Apply Filters{resultCount !== undefined && ` (${resultCount})`}
      </Button>
    </aside>
  );
}
