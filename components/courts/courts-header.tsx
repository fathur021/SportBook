"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";
import {
  sportFilterOptions,
  timeSlotOptions,
  cityOptions,
  flooringOptions,
  amenityOptions,
} from "@/lib/filters";
import { formatRupiah } from "@/lib/format-rupiah";

// ---------------------------------------------------------------------------
// Helper: ubah slug/value dari URL menjadi label yang readable
// ---------------------------------------------------------------------------

const sportLabel = (slug: string) =>
  sportFilterOptions.find((s) => s.slug === slug)?.label ?? slug;

const timeLabel = (value: string) =>
  timeSlotOptions.find((t) => t.value === value)?.label ?? value;

const cityLabel = (value: string) =>
  cityOptions.find((c) => c.value === value)?.label ?? value;

const amenityLabel = (slug: string) =>
  amenityOptions.find((a) => a.slug === slug)?.label ?? slug;

// ---------------------------------------------------------------------------
// Tipe untuk setiap active filter chip
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Tipe untuk setiap active filter chip (badge)
// ---------------------------------------------------------------------------

type ActiveChip = {
  key: string;         // ID unik untuk prop 'key' React
  label: string;       // Teks yang tampil di dalam badge (misal: "Padel", "Jakarta Selatan")
  paramKey: string;    // Nama parameter di URL yang diwakili (misal: "sport", "city", "min")
  paramValue?: string; // Nilai spesifik jika 1 param berisi banyak nilai (misal: "sport=padel,futsal")
};

// ---------------------------------------------------------------------------
// Baca URL search params → diubah menjadi array chip filter yang ditampilkan
// ---------------------------------------------------------------------------

function buildChips(params: URLSearchParams): ActiveChip[] {
  const chips: ActiveChip[] = []; // Array penampung seluruh badge filter aktif

  // 1. Filter Instant Book
  if (params.get("instant") === "1") { // Cek jika URL memiliki "?instant=1"
    chips.push({
      key: "instant",        // Key unik
      label: "Instant Book",  // Label badge
      paramKey: "instant",    // Param yang akan dihapus jika badge diklik
    });
  }

  // 2. Filter Sport (bisa banyak pilihan, dipisah koma: "?sport=futsal,padel")
  const sports = params.get("sport")?.split(",").filter(Boolean) ?? []; // Pecah teks jadi array olahraga
  for (const s of sports) { // Iterasi setiap olahraga yang dipilih
    chips.push({
      key: `sport-${s}`,     // Key unik per item olahraga
      label: sportLabel(s),  // Ubah slug jadi nama yang rapi (misal: "padel" -> "Padel")
      paramKey: "sport",     // Nama query param di URL
      paramValue: s,         // Nilai spesifik yang akan dihapus dari daftar koma
    });
  }

  // 3. Filter Kota
  const city = params.get("city"); // Ambil nilai parameter "?city=..."
  if (city) { // Hanya tambahkan badge jika kota dipilih
    chips.push({
      key: "city",            // Key unik
      label: cityLabel(city), // Ubah slug kota ke nama resmi (misal: "south-jakarta" -> "Jakarta Selatan")
      paramKey: "city",       // Param yang akan dihapus jika badge diklik
    });
  }

  // 4. Filter Tanggal
  const date = params.get("date"); // Ambil nilai parameter "?date=..."
  if (date && date !== "today") { // Tampilkan hanya jika bukan nilai default ("today")
    chips.push({
      key: "date",                                    // Key unik
      label: date === "tomorrow" ? "Tomorrow" : date, // Ubah "tomorrow" jadi teks yang ramah
      paramKey: "date",                               // Param yang akan dihapus
    });
  }

  // 5. Filter Waktu Main (bisa banyak pilihan: "?time=morning,evening")
  const times = params.get("time")?.split(",").filter(Boolean) ?? []; // Pecah teks jadi array waktu
  for (const t of times) { // Iterasi setiap slot waktu
    chips.push({
      key: `time-${t}`,    // Key unik per slot waktu
      label: timeLabel(t), // Ubah value jadi label rentang jam (misal: "Morning (06:00 - 12:00)")
      paramKey: "time",    // Nama query param di URL
      paramValue: t,       // Nilai waktu spesifik yang akan dihapus
    });
  }

  // 6. Filter Rentang Harga
  const min = params.get("min"); // Ambil batas harga minimum dari URL
  const max = params.get("max"); // Ambil batas harga maksimum dari URL
  if (min || max) { // Tampilkan jika salah satu atau keduanya diatur
    const minVal = Number(min ?? 50000);   // Fallback ke 50.000 jika min kosong
    const maxVal = Number(max ?? 350000);  // Fallback ke 350.000 jika max kosong
    chips.push({
      key: "price",                                               // Key unik badge harga
      label: `${formatRupiah(minVal)} – ${formatRupiah(maxVal)}`, // Format angka jadi string Rupiah
      paramKey: "min",                                            // Indikator untuk menghapus 'min' & 'max'
    });
  }

  // 7. Filter Jenis Lantai (bisa banyak: "?floor=Vinyl,Parquet")
  const floors = params.get("floor")?.split(",").filter(Boolean) ?? []; // Pecah teks jadi array lantai
  for (const f of floors) { // Iterasi setiap tipe lantai
    chips.push({
      key: `floor-${f}`,                          // Key unik per lantai
      label: flooringOptions.includes(f) ? f : f, // Label jenis lantai
      paramKey: "floor",                          // Nama query param di URL
      paramValue: f,                              // Nilai lantai spesifik yang akan dihapus
    });
  }

  // 8. Filter Fasilitas (bisa banyak: "?amenity=shower,locker")
  const amenities = params.get("amenity")?.split(",").filter(Boolean) ?? []; // Pecah teks jadi array fasilitas
  for (const a of amenities) { // Iterasi setiap fasilitas
    chips.push({
      key: `amenity-${a}`,    // Key unik per fasilitas
      label: amenityLabel(a), // Ubah slug fasilitas ke label rapi (misal: "shower" -> "Shower")
      paramKey: "amenity",    // Nama query param di URL
      paramValue: a,          // Nilai fasilitas spesifik yang akan dihapus
    });
  }

  return chips; // Kembalikan array semua filter aktif untuk dirender ke UI
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CourtsHeader() {
  const router = useRouter();          // Hook Next.js untuk navigasi halaman secara dinamis
  const pathname = usePathname();      // Mengambil path URL saat ini (misal: "/explore")
  const searchParams = useSearchParams(); // Mengambil query string URL saat ini (misal: "?city=south-jakarta")

  const chips = buildChips(searchParams); // Bangun daftar chip badge berdasarkan searchParams saat ini
  const hasFilters = chips.length > 0;    // Cek apakah ada filter yang aktif (panjang array > 0)

  // -------------------------------------------------------------------------
  // Handler: Hapus SATU chip filter saat tombol (X) diklik
  // -------------------------------------------------------------------------
  const removeChip = (chip: ActiveChip) => {
    // Buat salinan query parameter saat ini agar bisa dimodifikasi
    const q = new URLSearchParams(searchParams.toString());

    if (chip.paramValue) {
      // Kondisi A: Filter comma-separated (seperti sport=futsal,padel)
      const current = q.get(chip.paramKey)?.split(",").filter(Boolean) ?? []; // Ambil semua nilai lama
      const updated = current.filter((v) => v !== chip.paramValue);           // Hapus hanya nilai yang diklik
      if (updated.length > 0) {
        q.set(chip.paramKey, updated.join(",")); // Jika masih ada sisa, simpan kembali yang tersisa
      } else {
        q.delete(chip.paramKey);                 // Jika sudah habis, hapus parameter dari URL
      }
    } else if (chip.paramKey === "min") {
      // Kondisi B: Filter harga → hapus 'min' dan 'max' sekaligus dari URL
      q.delete("min"); // Hapus parameter harga minimum
      q.delete("max"); // Hapus parameter harga maksimum
    } else {
      // Kondisi C: Filter bernilai tunggal biasa (city, date, instant) → langsung hapus kuncinya
      q.delete(chip.paramKey);
    }

    // Reset pagination ke halaman 1 agar pengguna tidak terjebak di halaman kosong
    q.delete("page");

    // Susun string query baru (misal: "sport=futsal")
    const qs = q.toString();
    // Update URL di browser tanpa me-refresh seluruh halaman
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  // -------------------------------------------------------------------------
  // Handler: Reset SEMUA filter sekaligus saat tombol "Reset all filters" diklik
  // -------------------------------------------------------------------------
  const resetAll = () => {
    // Kembali ke URL bersih tanpa query string apa pun (hanya pathname, misal: "/explore")
    router.push(pathname);
  };

  return (
    <section className="border-b">
      <Container className="py-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>

          <ChevronRight className="size-3" />

          <span className="text-foreground">
            Explore Sports Venues
          </span>
        </div>

        {/* Judul + Sort */}
        <div className="mt-4 flex items-start justify-between gap-4">

          {/* Judul dan deskripsi */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Courts &amp; Venues
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Browse verified venues ready for reservation
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Sort by:
            </span>

            <select className="h-9 rounded-md border bg-background px-3 text-xs font-medium outline-none">
              <option>Highest Rated (≥ 4.8)</option>
              <option>Lowest Price</option>
              <option>Highest Price</option>
              <option>Nearest</option>
            </select>
          </div>
        </div>

        {/* Active Filters — hanya dirender ke layar jika ada filter yang aktif */}
        {hasFilters && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {/* Label penanda */}
            <span className="mr-1 text-xs font-medium">
              ACTIVE:
            </span>

            {/* Loop render setiap badge filter */}
            {chips.map((chip) => (
              <Badge
                key={chip.key} // Key unik untuk performa rendering React
                variant="secondary"
                className="cursor-pointer gap-1 rounded-full bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100"
                onClick={() => removeChip(chip)} // Klik badge untuk menghapus filter ini
              >
                {chip.label} {/* Teks filter (contoh: "Padel", "Jakarta Selatan") */}
                <X className="size-3" /> {/* Ikon silang X */}
              </Badge>
            ))}

            {/* Tombol reset untuk menghapus semua filter */}
            <button
              type="button"
              onClick={resetAll} // Jalankan resetAll saat diklik
              className="ml-1 text-xs font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
            >
              Reset all filters
            </button>
          </div>
        )}

      </Container>
    </section>
  );
}