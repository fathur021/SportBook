"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatRupiah } from "@/lib/format-rupiah";
import { venueRevenue } from "@/lib/mock-dashboard";

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
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <BarChart
        data={venueRevenue}
        layout="vertical"
        margin={{ left: 0, right: 52, top: 4, bottom: 4 }}
      >
        <XAxis type="number" hide />
        <YAxis
          dataKey="venue"
          type="category"
          tickLine={false}
          axisLine={false}
          width={128}
          tick={{ fontSize: 12 }}
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
