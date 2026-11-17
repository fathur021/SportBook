// "use client" wajib karena memakai hook dan grafik di browser.
"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatRupiah } from "@/lib/format-rupiah";
// Hook yang sama dengan kartu statistik.
// RTK Query menggabungkan request, jadi API tetap dipanggil satu kali.
import { useGetAdminDashboardQuery } from "@/lib/redux/admin-api";

const chartConfig = {
  revenue: {
    label: "Pendapatan",
    color: "oklch(0.596 0.145 163.225)",
  },
} satisfies ChartConfig;

// Mengubah "2026-11-03" menjadi "3 Nov".
function formatDayLabel(dateKey: string) {
  // Pecah teks tanggal menjadi tiga angka.
  const [year, month, day] = dateKey.split("-").map(Number);

  // Bulan dikurangi 1 karena bulan di JavaScript mulai dari 0.
  return new Date(year, month - 1, day).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

// Ringkas angka sumbu Y.
// 4.500.000 -> "4,5 jt", 750.000 -> "750 rb".
function formatCompact(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} jt`;
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000).toLocaleString("id-ID")} rb`;
  }

  return value.toLocaleString("id-ID");
}

export function RevenueTrendChart() {
  // Ambil data asli dari endpoint dashboard.
  const { data, isLoading, isError } = useGetAdminDashboardQuery();

  // Selama memuat, tampilkan kotak abu-abu berdenyut.
  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-lg bg-slate-100" />;
  }

  // Kalau gagal, beri pesan tanpa membuat halaman rusak.
  if (isError || !data) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-rose-600">
        Gagal memuat tren pendapatan.
      </div>
    );
  }

  // Grafik butuh label pendek, sedangkan API mengirim tanggal lengkap.
  const chartData = data.revenueTrend.map((point) => ({
    ...point,
    label: formatDayLabel(point.date),
  }));

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <AreaChart data={chartData} margin={{ left: 0, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-revenue)"
              stopOpacity={0.28}
            />
            <stop
              offset="95%"
              stopColor="var(--color-revenue)"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          // Pakai label pendek, bukan tanggal mentah.
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={16}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={44}
          tickFormatter={(value) => formatCompact(Number(value))}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="line"
              formatter={(value) => formatRupiah(Number(value))}
            />
          }
        />
        <Area
          dataKey="revenue"
          type="monotone"
          fill="url(#fillRevenue)"
          stroke="var(--color-revenue)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
