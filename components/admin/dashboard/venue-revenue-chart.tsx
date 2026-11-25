// "use client" wajib karena memakai hook dan grafik di browser.
"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatRupiah } from "@/lib/format-rupiah";
// Hook yang sama, jadi tidak ada request tambahan.
import { useGetAdminDashboardQuery } from "@/lib/redux/admin-api";

const chartConfig = {
  revenue: {
    label: "Pendapatan",
    color: "oklch(0.596 0.145 163.225)",
  },
} satisfies ChartConfig;

// Label di ujung batang: 21.450.000 -> "21,5 jt".
function formatCompactLabel(value: number) {
  const millions = value / 1_000_000;

  return `${millions.toLocaleString("id-ID", {
    maximumFractionDigits: 1,
  })} jt`;
}

export function VenueRevenueChart() {
  // Ambil data asli dari endpoint dashboard.
  const { data, isLoading, isError } = useGetAdminDashboardQuery();

  // Selama memuat, tampilkan kotak abu-abu berdenyut.
  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-lg bg-slate-100" />;
  }

  if (isError || !data) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-rose-600">
        Gagal memuat pendapatan per venue.
      </div>
    );
  }

  // Batasi supaya grafik tetap terbaca di kolom sempit.
  const topVenues = data.venueRevenue.slice(0, 6);

  // Kalau belum ada pembayaran, tampilkan pesan, bukan grafik kosong.
  if (topVenues.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-slate-500">
        Belum ada pembayaran lunas dalam 30 hari terakhir.
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <BarChart
        // Sumber data sekarang dari API.
        data={topVenues}
        layout="vertical"
        margin={{ left: 0, right: 52, top: 4, bottom: 4 }}
      >
        <XAxis type="number" hide />
        <YAxis
          dataKey="venue"
          type="category"
          tickLine={false}
          axisLine={false}
          width={104}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) =>
            String(value).length > 18
              ? `${String(value).slice(0, 17)}…`
              : String(value)
          }
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value) => formatRupiah(Number(value))}
            />
          }
        />
        <Bar
          dataKey="revenue"
          fill="var(--color-revenue)"
          radius={[0, 6, 6, 0]}
          barSize={22}
        >
          <LabelList
            dataKey="revenue"
            position="right"
            offset={8}
            fontSize={12}
            className="fill-slate-500"
            formatter={(value) => formatCompactLabel(Number(value))}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
